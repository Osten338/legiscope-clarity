
// AI Evaluation Prompts and Response Schemas

export interface ComplianceEvaluation {
  compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable'
  confidence_score: number
  article_references: string[]
  gap_analysis: string
  suggested_fixes: string
  ai_reasoning: string
  regulation_excerpt: string
  priority_level: number
}

export interface EvaluationContext {
  regulation: {
    name: string
    description: string
    requirements: string
    motivation: string
  }
  documentSection: {
    text: string
    sectionType: string
    position: number
  }
}

export class ComplianceEvaluationEngine {
  private readonly systemPrompt = `You are a legal compliance expert specializing in regulatory analysis. Your role is to evaluate document sections against specific regulations with precision and accuracy.

EVALUATION CRITERIA:
- COMPLIANT: Section fully meets regulatory requirements
- NON_COMPLIANT: Section violates or fails to meet requirements  
- NEEDS_REVIEW: Unclear compliance status, requires human review
- NOT_APPLICABLE: Section doesn't relate to the regulation

RESPONSE FORMAT: Always respond with valid JSON matching the schema exactly.

CONFIDENCE SCORING:
- 0.9-1.0: Extremely confident in assessment
- 0.7-0.9: High confidence, clear evidence
- 0.5-0.7: Moderate confidence, some ambiguity
- 0.3-0.5: Low confidence, requires review
- 0.0-0.3: Very uncertain, human expertise needed

PRIORITY LEVELS:
- 1: Critical - Immediate action required
- 2: High - Address within 30 days
- 3: Medium - Address within 90 days
- 4: Low - Address when convenient
- 5: Informational - No action required`;

  generateEvaluationPrompt(context: EvaluationContext): string {
    return `${this.systemPrompt}

REGULATION TO EVALUATE AGAINST:
Name: ${context.regulation.name}
Description: ${context.regulation.description}
Requirements: ${context.regulation.requirements}
Motivation: ${context.regulation.motivation}

DOCUMENT SECTION TO ANALYZE:
Type: ${context.documentSection.sectionType}
Content: "${context.documentSection.text}"

ANALYSIS INSTRUCTIONS:
1. Identify which specific parts of the regulation apply to this section
2. Determine if the section meets, violates, or is unclear regarding requirements
3. Extract relevant regulation excerpts that directly apply
4. Provide specific, actionable recommendations for any gaps
5. Assess the business impact and priority level

Respond with a JSON object matching this exact schema:
{
  "compliance_status": "compliant" | "non_compliant" | "needs_review" | "not_applicable",
  "confidence_score": 0.0-1.0,
  "article_references": ["specific regulation articles/sections"],
  "gap_analysis": "detailed analysis of compliance gaps or confirmation of compliance",
  "suggested_fixes": "specific, actionable recommendations to achieve compliance",
  "ai_reasoning": "step-by-step explanation of your assessment logic",
  "regulation_excerpt": "exact text from regulation that applies to this section",
  "priority_level": 1-5
}`;
  }

  validateResponse(response: any): ComplianceEvaluation | null {
    try {
      // Validate required fields
      const required = ['compliance_status', 'confidence_score', 'article_references', 
                       'gap_analysis', 'suggested_fixes', 'ai_reasoning', 
                       'regulation_excerpt', 'priority_level'];
      
      for (const field of required) {
        if (!(field in response)) {
          console.error(`Missing required field: ${field}`);
          return null;
        }
      }

      // Validate compliance_status enum
      const validStatuses = ['compliant', 'non_compliant', 'needs_review', 'not_applicable'];
      if (!validStatuses.includes(response.compliance_status)) {
        console.error(`Invalid compliance_status: ${response.compliance_status}`);
        return null;
      }

      // Validate confidence_score range
      if (response.confidence_score < 0 || response.confidence_score > 1) {
        console.error(`Invalid confidence_score: ${response.confidence_score}`);
        return null;
      }

      // Validate priority_level range
      if (response.priority_level < 1 || response.priority_level > 5) {
        console.error(`Invalid priority_level: ${response.priority_level}`);
        return null;
      }

      // Validate article_references is array
      if (!Array.isArray(response.article_references)) {
        console.error(`article_references must be an array`);
        return null;
      }

      return response as ComplianceEvaluation;
    } catch (error) {
      console.error('Response validation error:', error);
      return null;
    }
  }

  generateFallbackEvaluation(reason: string): ComplianceEvaluation {
    return {
      compliance_status: 'needs_review',
      confidence_score: 0.1,
      article_references: [],
      gap_analysis: `Unable to automatically analyze this section: ${reason}`,
      suggested_fixes: 'Manual legal review required to determine compliance status',
      ai_reasoning: `AI evaluation failed: ${reason}. Human expertise needed for accurate assessment.`,
      regulation_excerpt: '',
      priority_level: 3
    };
  }
}
