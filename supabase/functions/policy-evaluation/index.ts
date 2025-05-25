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

  console.log('=== POLICY EVALUATION FUNCTION STARTED ===')
  console.log('Request method:', req.method)
  console.log('Request URL:', req.url)

  try {
    const requestBody = await req.json()
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2))

    const { document_id, regulation_id, documentContent }: PolicyEvaluationRequest = requestBody

    console.log('Parsed parameters:', {
      document_id,
      regulation_id,
      hasDocumentContent: !!documentContent,
      documentContentLength: documentContent?.length
    })

    if (!document_id || !regulation_id) {
      console.error('Missing required parameters:', { document_id, regulation_id })
      return new Response(
        JSON.stringify({ error: 'Document ID and Regulation ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.error('No authorization header')
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    console.log('Supabase config:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    })

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user ID from JWT
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    
    console.log('Auth result:', {
      hasUser: !!user,
      userId: user?.id,
      userError: userError?.message
    })
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User authenticated successfully:', user.id)

    // Fetch document and regulation details
    console.log('Fetching document and regulation...')
    
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

    console.log('Document query result:', {
      hasData: !!documentResult.data,
      error: documentResult.error?.message
    })

    console.log('Regulation query result:', {
      hasData: !!regulationResult.data,
      error: regulationResult.error?.message
    })

    if (documentResult.error) {
      console.error('Document fetch error:', documentResult.error)
      return new Response(
        JSON.stringify({ error: 'Document not found or access denied: ' + documentResult.error.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (regulationResult.error) {
      console.error('Regulation fetch error:', regulationResult.error)
      return new Response(
        JSON.stringify({ error: 'Regulation not found: ' + regulationResult.error.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const document = documentResult.data
    const regulation = regulationResult.data

    console.log('Document details:', {
      id: document.id,
      fileName: document.file_name,
      hasDescription: !!document.description,
      descriptionLength: document.description?.length
    })

    console.log('Regulation details:', {
      id: regulation.id,
      name: regulation.name
    })

    // Create policy evaluation record
    console.log('Creating evaluation record...')
    
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

    console.log('Evaluation creation result:', {
      hasData: !!evaluation,
      evaluationId: evaluation?.id,
      error: evalError?.message
    })

    if (evalError) {
      console.error('Failed to create evaluation record:', evalError)
      return new Response(
        JSON.stringify({ error: 'Failed to create evaluation record: ' + evalError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Created evaluation record:', evaluation.id)

    // Get document content - prioritize provided content, then stored description
    let textContent = documentContent || document.description

    console.log('Content analysis:', {
      hasProvidedContent: !!documentContent,
      hasStoredDescription: !!document.description,
      finalContentLength: textContent?.length,
      contentPreview: textContent?.substring(0, 100)
    })

    // Validate content
    if (!textContent || textContent.trim().length === 0) {
      console.error('No document content available')
      
      const updateResult = await supabase
        .from('policy_evaluations')
        .update({ 
          status: 'failed',
          summary: 'No document content available for analysis'
        })
        .eq('id', evaluation.id)

      console.log('Update evaluation with error result:', updateResult.error?.message)

      return new Response(
        JSON.stringify({ 
          success: false, 
          evaluationId: evaluation.id,
          error: 'No document content available for analysis'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate content quality
    if (!isContentValid(textContent)) {
      console.error('Content validation failed')
      
      const updateResult = await supabase
        .from('policy_evaluations')
        .update({ 
          status: 'failed',
          summary: 'Document content appears to be corrupted or in an unsupported format'
        })
        .eq('id', evaluation.id)

      console.log('Update evaluation with validation error result:', updateResult.error?.message)

      return new Response(
        JSON.stringify({ 
          success: false, 
          evaluationId: evaluation.id,
          error: 'Document content appears to be corrupted'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Content validation passed. Document content length:', textContent.length)

    // If document content wasn't stored, update it
    if (!document.description && textContent) {
      console.log('Updating document with extracted content...')
      
      const updateDocResult = await supabase
        .from('compliance_documents')
        .update({ description: textContent })
        .eq('id', document_id)

      console.log('Document update result:', updateDocResult.error?.message)
    }

    // Process document in background but catch any errors
    console.log('Starting background processing...')
    
    try {
      await processDocumentInBackground(supabase, evaluation.id, textContent, regulation)
      console.log('Background processing completed successfully')
    } catch (backgroundError) {
      console.error('Background processing failed:', backgroundError)
      
      // Update evaluation with error
      await supabase
        .from('policy_evaluations')
        .update({ 
          status: 'failed',
          summary: `Processing failed: ${backgroundError.message}`
        })
        .eq('id', evaluation.id)
    }

    console.log('=== RETURNING SUCCESS RESPONSE ===')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluationId: evaluation.id,
        status: 'processing' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('=== POLICY EVALUATION ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function isContentValid(content: string): boolean {
  console.log('Validating content:', {
    length: content.length,
    trimmedLength: content.trim().length
  })

  // Check if content looks like binary/corrupted data
  const binaryPattern = /[\x00-\x08\x0E-\x1F\x7F-\xFF]/g
  const binaryCharCount = (content.match(binaryPattern) || []).length
  const totalChars = content.length
  
  const binaryRatio = totalChars > 0 ? (binaryCharCount / totalChars) : 0
  console.log('Content validation:', {
    binaryCharCount,
    totalChars,
    binaryRatio
  })
  
  // If more than 20% of characters are binary, consider it corrupted
  if (binaryRatio > 0.2) {
    console.log('Content rejected: too many binary characters')
    return false
  }
  
  // Check for minimum content length
  if (content.trim().length < 50) {
    console.log('Content rejected: too short')
    return false
  }
  
  console.log('Content validation passed')
  return true
}

async function processDocumentInBackground(supabase: any, evaluationId: string, documentContent: string, regulation: any) {
  console.log('=== BACKGROUND PROCESSING STARTED ===')
  console.log('Evaluation ID:', evaluationId)
  console.log('Document content length:', documentContent.length)
  console.log('Regulation:', regulation.name)
  
  try {
    // Initialize AI engines
    console.log('Initializing AI engines...')
    const evaluationEngine = new ComplianceEvaluationEngine()
    const articleMapper = new ArticleReferenceMapper()
    const assessor = new ComplianceAssessor()

    // Chunk the document into analyzable sections
    console.log('Chunking document...')
    const chunks = chunkDocumentWithPrecisePositions(documentContent)
    console.log('Created chunks:', chunks.length)
    
    if (chunks.length === 0) {
      throw new Error('No valid text chunks could be created from document content')
    }
    
    let compliantSections = 0
    let nonCompliantSections = 0
    let needsReviewSections = 0
    let notApplicableSections = 0
    const highlights: any[] = []

    // Process each chunk with enhanced AI evaluation
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      console.log(`Processing chunk ${i + 1}/${chunks.length}:`, {
        length: chunk.text.length,
        startPos: chunk.startPosition,
        endPos: chunk.endPosition,
        preview: chunk.text.substring(0, 100) + '...'
      })
      
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

        console.log(`Evaluating chunk ${i + 1} with AI...`)
        const evaluation = await evaluateChunkWithEnhancedAI(evaluationEngine, context)
        console.log(`Chunk ${i + 1} evaluation result:`, {
          status: evaluation.compliance_status,
          confidence: evaluation.confidence_score,
          priority: evaluation.priority_level
        })
        
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

        // Create enhanced highlight record
        const highlight = {
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
        }
        
        highlights.push(highlight)
        console.log('Created highlight for chunk', i + 1)
        
      } catch (error) {
        console.error(`Failed to evaluate chunk ${i + 1}:`, error)
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

    console.log('Processing summary:', {
      totalHighlights: highlights.length,
      compliantSections,
      nonCompliantSections,
      needsReviewSections,
      notApplicableSections
    })

    // Insert all highlights in batches
    if (highlights.length > 0) {
      console.log(`Inserting ${highlights.length} highlights into database`)
      const batchSize = 5 // Smaller batch size for better reliability
      let insertedCount = 0
      
      for (let i = 0; i < highlights.length; i += batchSize) {
        const batch = highlights.slice(i, i + batchSize)
        console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} with ${batch.length} highlights`)
        
        const { error: insertError, data: insertedData } = await supabase
          .from('policy_highlights')
          .insert(batch)
          .select('id')
        
        if (insertError) {
          console.error('Error inserting highlight batch:', insertError)
          throw insertError
        } else {
          insertedCount += insertedData?.length || 0
          console.log(`Successfully inserted batch, total inserted: ${insertedCount}`)
        }
      }
      
      console.log(`Successfully inserted all ${insertedCount} highlights`)
    }

    // Calculate enhanced compliance metrics
    console.log('Calculating compliance metrics...')
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

    console.log('Final metrics:', {
      complianceScore,
      totalSections: chunks.length,
      riskFactorsCount: riskFactors.length,
      priorityActionsCount: priorityActions.length
    })

    // Update evaluation with enhanced results
    console.log('Updating evaluation record with results...')
    const { error: updateError } = await supabase
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
          evaluation_engine_version: '3.4',
          highlights_created: highlights.length,
          processing_completed_at: new Date().toISOString()
        }
      })
      .eq('id', evaluationId)

    if (updateError) {
      console.error('Error updating evaluation:', updateError)
      throw updateError
    }

    console.log(`=== BACKGROUND PROCESSING COMPLETED SUCCESSFULLY ===`)
    console.log(`Evaluation ${evaluationId} completed with score: ${complianceScore}%`)

  } catch (error) {
    console.error('=== BACKGROUND PROCESSING ERROR ===')
    console.error('Error in background processing:', error)
    
    const updateResult = await supabase
      .from('policy_evaluations')
      .update({ 
        status: 'failed',
        summary: `Processing failed: ${error.message}`,
        metadata: {
          error: error.message,
          error_timestamp: new Date().toISOString(),
          error_stack: error.stack
        }
      })
      .eq('id', evaluationId)

    console.log('Error update result:', updateResult.error?.message)
    throw error // Re-throw to ensure error is properly handled
  }
}

function chunkDocumentWithPrecisePositions(content: string): EvaluationChunk[] {
  const chunks: EvaluationChunk[] = []
  
  // Enhanced chunking with precise character position tracking
  // Split by double newlines first to get paragraphs
  const sections = content.split(/\n\s*\n/).filter(section => section.trim().length > 20)
  let currentPosition = 0
  
  for (const section of sections) {
    const trimmedSection = section.trim()
    if (trimmedSection.length < 20) continue
    
    // Find the exact start position in the original content
    const startPosition = content.indexOf(trimmedSection, currentPosition)
    if (startPosition === -1) {
      // Fallback: use current position if exact match not found
      currentPosition += trimmedSection.length + 2 // account for newlines
      continue
    }
    
    const endPosition = startPosition + trimmedSection.length
    
    // Determine section type based on content patterns
    let sectionType: EvaluationChunk['sectionType'] = 'paragraph'
    
    if (/^\d+\.\s|\bChapter\s+\d+|\bSection\s+\d+/i.test(trimmedSection)) {
      sectionType = 'section'
    } else if (/^[A-Z][^.]*:|\b(ARTICLE|Article)\s+\d+/i.test(trimmedSection)) {
      sectionType = 'clause'
    } else if (/\bchapter\b/i.test(trimmedSection)) {
      sectionType = 'chapter'
    }
    
    chunks.push({
      text: trimmedSection,
      startPosition: Math.max(0, startPosition),
      endPosition: Math.min(content.length, endPosition),
      sectionType
    })
    
    currentPosition = endPosition
  }
  
  // If no chunks were created (e.g., no double newlines), fall back to simple paragraph splitting
  if (chunks.length === 0) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 50)
    let position = 0
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (trimmed.length > 50) {
        const start = content.indexOf(trimmed, position)
        const end = start + trimmed.length
        
        chunks.push({
          text: trimmed,
          startPosition: Math.max(0, start),
          endPosition: Math.min(content.length, end),
          sectionType: 'paragraph'
        })
        
        position = end
      }
    }
  }
  
  console.log(`Created ${chunks.length} chunks from document of ${content.length} characters`)
  return chunks
}

async function evaluateChunkWithEnhancedAI(engine: ComplianceEvaluationEngine, context: EvaluationContext) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = engine.generateEvaluationPrompt(context)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI API error:', response.status, errorText)
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content received from OpenAI')
  }

  try {
    const parsedResponse = JSON.parse(content)
    const validatedResponse = engine.validateResponse(parsedResponse)
    
    if (validatedResponse) {
      return validatedResponse
    } else {
      console.error('Invalid AI response format:', parsedResponse)
      return engine.generateFallbackEvaluation('Invalid AI response format')
    }
  } catch (error) {
    console.error('Failed to parse AI response:', content)
    return engine.generateFallbackEvaluation(`JSON parsing failed: ${error.message}`)
  }
}
