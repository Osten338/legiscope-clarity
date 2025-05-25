
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../shared/cors.ts"
import { ComplianceEvaluationEngine, EvaluationContext } from "./evaluationPrompts.ts"
import { ArticleReferenceMapper } from "./articleMapper.ts"
import { ComplianceAssessor } from "./complianceAssessor.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

interface PolicyEvaluationRequest {
  document_id: string
  regulation_id: string
  documentContent?: string
}

interface EvaluationChunk {
  text: string
  startPosition: number
  endPosition: number
  sectionType: 'paragraph' | 'section' | 'clause' | 'chapter'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { document_id, regulation_id, documentContent }: PolicyEvaluationRequest = await req.json()

    if (!document_id || !regulation_id) {
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
        .eq('id', document_id)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('regulations')
        .select('*')
        .eq('id', regulation_id)
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
        document_id: document_id,
        regulation_id: regulation_id,
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

    // Store the document content for display
    await supabase
      .from('compliance_documents')
      .update({ description: textContent })
      .eq('id', document_id)

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
    // Initialize AI engines
    const evaluationEngine = new ComplianceEvaluationEngine()
    const articleMapper = new ArticleReferenceMapper()
    const assessor = new ComplianceAssessor()

    // Chunk the document into analyzable sections with precise positioning
    const chunks = chunkDocumentWithPrecisePositions(documentContent)
    
    let compliantSections = 0
    let nonCompliantSections = 0
    let needsReviewSections = 0
    let notApplicableSections = 0
    const highlights: any[] = []

    // Process each chunk with enhanced AI evaluation
    for (const chunk of chunks) {
      try {
        const context: EvaluationContext = {
          regulation: {
            name: regulation.name,
            description: regulation.description,
            requirements: regulation.requirements,
            motivation: regulation.motivation
          },
          documentSection: {
            text: chunk.text,
            sectionType: chunk.sectionType,
            position: chunk.startPosition
          }
        }

        const evaluation = await evaluateChunkWithEnhancedAI(evaluationEngine, context)
        
        // Enhanced article reference mapping
        const enhancedReferences = articleMapper.enhanceReferences(
          evaluation.article_references, 
          regulation.requirements + ' ' + regulation.description
        )

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
          case 'not_applicable':
            notApplicableSections++
            break
        }

        // Create enhanced highlight record with precise positioning
        highlights.push({
          evaluation_id: evaluationId,
          section_text: chunk.text,
          section_start_position: chunk.startPosition,
          section_end_position: chunk.endPosition,
          section_type: chunk.sectionType,
          compliance_status: evaluation.compliance_status,
          confidence_score: evaluation.confidence_score,
          article_references: enhancedReferences.map(ref => ref.full_reference),
          gap_analysis: evaluation.gap_analysis,
          suggested_fixes: evaluation.suggested_fixes,
          ai_reasoning: evaluation.ai_reasoning,
          regulation_excerpt: evaluation.regulation_excerpt,
          priority_level: evaluation.priority_level
        })
      } catch (error) {
        console.error('Failed to evaluate chunk:', error)
        needsReviewSections++
        
        // Add fallback highlight
        highlights.push({
          evaluation_id: evaluationId,
          section_text: chunk.text,
          section_start_position: chunk.startPosition,
          section_end_position: chunk.endPosition,
          section_type: chunk.sectionType,
          compliance_status: 'needs_review',
          confidence_score: 0.1,
          article_references: [],
          gap_analysis: 'AI evaluation failed - manual review required',
          suggested_fixes: 'Unable to generate automatic recommendations',
          ai_reasoning: `Evaluation error: ${error.message}`,
          regulation_excerpt: '',
          priority_level: 3
        })
      }
    }

    // Insert all highlights in batches to avoid timeout
    if (highlights.length > 0) {
      console.log(`Inserting ${highlights.length} highlights`)
      const batchSize = 50
      for (let i = 0; i < highlights.length; i += batchSize) {
        const batch = highlights.slice(i, i + batchSize)
        const { error: insertError } = await supabase
          .from('policy_highlights')
          .insert(batch)
        
        if (insertError) {
          console.error('Error inserting highlight batch:', insertError)
        }
      }
    }

    // Calculate enhanced compliance metrics
    const complianceScore = assessor.calculateOverallScore(highlights)
    const riskFactors = assessor.assessRiskFactors(highlights)
    const priorityActions = assessor.generatePriorityActions(highlights)

    const metrics = {
      overall_score: complianceScore,
      section_scores: {
        compliant: compliantSections,
        non_compliant: nonCompliantSections,
        needs_review: needsReviewSections,
        not_applicable: notApplicableSections
      },
      risk_factors: riskFactors,
      priority_actions: priorityActions,
      compliance_trend: 'stable' as const
    }

    const summary = assessor.generateComplianceSummary(metrics)
    const recommendations = assessor.generateDetailedRecommendations(highlights)

    // Update evaluation with enhanced results
    await supabase
      .from('policy_evaluations')
      .update({
        status: 'completed',
        overall_compliance_score: complianceScore,
        total_sections_analyzed: chunks.length,
        compliant_sections: compliantSections,
        non_compliant_sections: nonCompliantSections,
        needs_review_sections: needsReviewSections,
        summary: summary,
        recommendations: recommendations,
        metadata: {
          risk_factors: riskFactors,
          priority_actions: priorityActions,
          evaluation_engine_version: '3.1'
        }
      })
      .eq('id', evaluationId)

    console.log(`Policy evaluation completed for ${evaluationId}`)

  } catch (error) {
    console.error('Background processing error:', error)
    // Update evaluation status to failed
    await supabase
      .from('policy_evaluations')
      .update({ status: 'failed' })
      .eq('id', evaluationId)
  }
}

function chunkDocumentWithPrecisePositions(content: string): EvaluationChunk[] {
  const chunks: EvaluationChunk[] = []
  
  // Enhanced chunking with precise character position tracking
  const paragraphs = content.split(/\n\s*\n/).filter(section => section.trim().length > 30)
  let currentPosition = 0
  
  for (const paragraph of paragraphs) {
    // Find the exact start position in the original content
    const startPosition = content.indexOf(paragraph.trim(), currentPosition)
    const endPosition = startPosition + paragraph.trim().length
    
    // Determine section type based on content patterns
    let sectionType: EvaluationChunk['sectionType'] = 'paragraph'
    
    if (/^\d+\.\s|\bChapter\s+\d+|\bSection\s+\d+/i.test(paragraph)) {
      sectionType = 'section'
    } else if (/^[A-Z][^.]*:|\b(ARTICLE|Article)\s+\d+/i.test(paragraph)) {
      sectionType = 'clause'
    } else if (/\bchapter\b/i.test(paragraph)) {
      sectionType = 'chapter'
    }
    
    chunks.push({
      text: paragraph.trim(),
      startPosition: Math.max(0, startPosition),
      endPosition: Math.min(content.length, endPosition),
      sectionType
    })
    
    currentPosition = endPosition
  }
  
  return chunks
}

async function evaluateChunkWithEnhancedAI(engine: ComplianceEvaluationEngine, context: EvaluationContext) {
  const prompt = engine.generateEvaluationPrompt(context)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  try {
    const parsedResponse = JSON.parse(content)
    const validatedResponse = engine.validateResponse(parsedResponse)
    
    if (validatedResponse) {
      return validatedResponse
    } else {
      return engine.generateFallbackEvaluation('Invalid AI response format')
    }
  } catch (error) {
    console.error('Failed to parse AI response:', content)
    return engine.generateFallbackEvaluation(`JSON parsing failed: ${error.message}`)
  }
}
