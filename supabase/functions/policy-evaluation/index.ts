
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../shared/cors.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

interface PolicyEvaluationRequest {
  documentId: string
  regulationId: string
  documentContent?: string
}

interface EvaluationChunk {
  text: string
  startPosition: number
  endPosition: number
  sectionType: 'paragraph' | 'section' | 'clause' | 'chapter'
}

interface ComplianceEvaluation {
  compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable'
  confidence_score: number
  article_references: string[]
  gap_analysis: string
  suggested_fixes: string
  ai_reasoning: string
  regulation_excerpt: string
  priority_level: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId, regulationId, documentContent }: PolicyEvaluationRequest = await req.json()

    if (!documentId || !regulationId) {
      return new Response(
        JSON.stringify({ error: 'Document ID and Regulation ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user ID from JWT
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch document and regulation details
    const [documentResult, regulationResult] = await Promise.all([
      supabase
        .from('compliance_documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('regulations')
        .select('*')
        .eq('id', regulationId)
        .single()
    ])

    if (documentResult.error || regulationResult.error) {
      return new Response(
        JSON.stringify({ error: 'Document or regulation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const document = documentResult.data
    const regulation = regulationResult.data

    // Create policy evaluation record
    const { data: evaluation, error: evalError } = await supabase
      .from('policy_evaluations')
      .insert({
        user_id: user.id,
        document_id: documentId,
        regulation_id: regulationId,
        status: 'processing'
      })
      .select()
      .single()

    if (evalError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create evaluation record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If document content is not provided, extract it from storage
    let textContent = documentContent
    if (!textContent) {
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('compliance_documents')
          .download(document.file_path)

        if (downloadError) throw downloadError

        // Simple text extraction (for basic implementation)
        textContent = await fileData.text()
      } catch (error) {
        console.error('Failed to extract document content:', error)
        textContent = `Failed to extract content from ${document.file_name}`
      }
    }

    // Process document in background
    processDocumentInBackground(supabase, evaluation.id, textContent, regulation)

    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluationId: evaluation.id,
        status: 'processing' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Policy evaluation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function processDocumentInBackground(supabase: any, evaluationId: string, documentContent: string, regulation: any) {
  try {
    // Chunk the document into analyzable sections
    const chunks = chunkDocument(documentContent)
    
    let compliantSections = 0
    let nonCompliantSections = 0
    let needsReviewSections = 0
    const highlights: any[] = []

    // Process each chunk
    for (const chunk of chunks) {
      try {
        const evaluation = await evaluateChunkCompliance(chunk, regulation)
        
        // Count compliance status
        switch (evaluation.compliance_status) {
          case 'compliant':
            compliantSections++
            break
          case 'non_compliant':
            nonCompliantSections++
            break
          case 'needs_review':
            needsReviewSections++
            break
        }

        // Create highlight record
        highlights.push({
          evaluation_id: evaluationId,
          section_text: chunk.text,
          section_start_position: chunk.startPosition,
          section_end_position: chunk.endPosition,
          section_type: chunk.sectionType,
          ...evaluation
        })
      } catch (error) {
        console.error('Failed to evaluate chunk:', error)
        needsReviewSections++
      }
    }

    // Insert all highlights
    if (highlights.length > 0) {
      await supabase
        .from('policy_highlights')
        .insert(highlights)
    }

    // Calculate overall compliance score
    const totalSections = chunks.length
    const complianceScore = totalSections > 0 
      ? Math.round((compliantSections / totalSections) * 100) 
      : 0

    // Update evaluation with results
    await supabase
      .from('policy_evaluations')
      .update({
        status: 'completed',
        overall_compliance_score: complianceScore,
        total_sections_analyzed: totalSections,
        compliant_sections: compliantSections,
        non_compliant_sections: nonCompliantSections,
        needs_review_sections: needsReviewSections,
        summary: generateSummary(complianceScore, compliantSections, nonCompliantSections, needsReviewSections),
        recommendations: generateRecommendations(highlights.filter(h => h.compliance_status === 'non_compliant'))
      })
      .eq('id', evaluationId)

  } catch (error) {
    console.error('Background processing error:', error)
    // Update evaluation status to failed
    await supabase
      .from('policy_evaluations')
      .update({ status: 'failed' })
      .eq('id', evaluationId)
  }
}

function chunkDocument(content: string): EvaluationChunk[] {
  const chunks: EvaluationChunk[] = []
  
  // Simple paragraph-based chunking
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  let currentPosition = 0
  
  for (const paragraph of paragraphs) {
    const startPosition = content.indexOf(paragraph, currentPosition)
    const endPosition = startPosition + paragraph.length
    
    chunks.push({
      text: paragraph.trim(),
      startPosition,
      endPosition,
      sectionType: 'paragraph'
    })
    
    currentPosition = endPosition
  }
  
  return chunks
}

async function evaluateChunkCompliance(chunk: EvaluationChunk, regulation: any): Promise<ComplianceEvaluation> {
  const prompt = `
You are a legal compliance expert. Analyze the following document section against the specified regulation and provide a detailed compliance evaluation.

REGULATION:
Name: ${regulation.name}
Description: ${regulation.description}
Requirements: ${regulation.requirements}

DOCUMENT SECTION TO ANALYZE:
${chunk.text}

Please evaluate this section's compliance with the regulation and respond with a JSON object containing:

{
  "compliance_status": "compliant" | "non_compliant" | "needs_review" | "not_applicable",
  "confidence_score": 0.0-1.0,
  "article_references": ["specific regulation articles/sections that apply"],
  "gap_analysis": "detailed analysis of any compliance gaps",
  "suggested_fixes": "specific recommendations to achieve compliance",
  "ai_reasoning": "explanation of your compliance assessment",
  "regulation_excerpt": "the specific part of the regulation that applies to this section",
  "priority_level": 1-5 (1=critical, 5=minor)
}

Focus on:
1. Direct compliance requirements
2. Implicit compliance implications
3. Risk assessment
4. Actionable recommendations
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  try {
    return JSON.parse(content)
  } catch (error) {
    console.error('Failed to parse AI response:', content)
    // Return default evaluation if parsing fails
    return {
      compliance_status: 'needs_review',
      confidence_score: 0.5,
      article_references: [],
      gap_analysis: 'Unable to automatically analyze this section',
      suggested_fixes: 'Manual review required',
      ai_reasoning: 'AI evaluation failed to parse',
      regulation_excerpt: '',
      priority_level: 3
    }
  }
}

function generateSummary(score: number, compliant: number, nonCompliant: number, needsReview: number): string {
  return `Overall compliance score: ${score}%. Analysis found ${compliant} compliant sections, ${nonCompliant} non-compliant sections, and ${needsReview} sections requiring review.`
}

function generateRecommendations(nonCompliantHighlights: any[]): string {
  if (nonCompliantHighlights.length === 0) {
    return 'Document appears to be largely compliant. Continue monitoring for regulatory updates.'
  }
  
  const priorityIssues = nonCompliantHighlights
    .filter(h => h.priority_level <= 2)
    .map(h => h.suggested_fixes)
    .slice(0, 3)
  
  return `Priority recommendations: ${priorityIssues.join('; ')}`
}
