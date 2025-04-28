
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../shared/cors.ts';

// Types for the request and response
interface RegulationData {
  title: string;
  content: string;
  description?: string;
  celex?: string;
}

interface AnalysisResult {
  title: string;
  impactedPolicies: Array<{ name: string; impact: string; riskLevel: string }>;
  departmentsForReview: string[];
  riskScore: number;
  riskJustification: string;
  analysisSummary: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Parse the request body
    const { regulation } = await req.json();
    
    // Validate input
    if (!regulation || !regulation.title || !regulation.content) {
      return new Response(
        JSON.stringify({ error: 'Missing regulation data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get current user (for attribution)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
    }
    
    // Perform the impact analysis
    const analysis = await analyzeRegulationImpact(regulation);
    
    // Store the analysis result in the database
    const { data, error } = await supabaseClient
      .from('regulatory_impact_analyses')
      .insert({
        title: regulation.title,
        legislation_item_id: regulation.celex || null,
        regulation_id: regulation.id || null,
        impacted_policies: analysis.impactedPolicies,
        departments_for_review: analysis.departmentsForReview,
        risk_score: analysis.riskScore,
        risk_justification: analysis.riskJustification,
        analysis_summary: analysis.analysisSummary,
        user_id: user?.id || null,
        status: 'completed'
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error storing analysis:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to store analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        id: data.id,
        analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-regulation-impact function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// This function simulates an AI analysis but could be extended with actual AI capabilities
async function analyzeRegulationImpact(regulation: RegulationData): Promise<AnalysisResult> {
  // For now, we'll use a simplified rule-based approach
  // In a real implementation, this would use LLMs or other AI techniques
  
  const content = regulation.content.toLowerCase();
  const title = regulation.title.toLowerCase();
  const description = regulation.description?.toLowerCase() || '';
  
  // Simple keyword-based analysis
  const impactedPolicies: Array<{ name: string; impact: string; riskLevel: string }> = [];
  const departments = new Set<string>();
  
  // Data protection related
  if (content.includes('personal data') || content.includes('data protection') || 
      title.includes('gdpr') || content.includes('gdpr')) {
    impactedPolicies.push({ 
      name: 'Data Protection Policy', 
      impact: 'May require updates to data handling procedures', 
      riskLevel: 'high'
    });
    departments.add('Legal');
    departments.add('IT');
    departments.add('Data Protection');
  }
  
  // Financial related
  if (content.includes('financial') || content.includes('banking') || 
      content.includes('payment') || content.includes('transaction')) {
    impactedPolicies.push({ 
      name: 'Financial Compliance Policy', 
      impact: 'May affect financial reporting or transaction handling', 
      riskLevel: 'medium'
    });
    departments.add('Finance');
    departments.add('Compliance');
  }
  
  // Security related
  if (content.includes('security') || content.includes('cybersecurity') || 
      content.includes('breach') || content.includes('incident')) {
    impactedPolicies.push({ 
      name: 'Information Security Policy', 
      impact: 'May require security control updates', 
      riskLevel: 'high'
    });
    departments.add('IT');
    departments.add('Security');
  }
  
  // Human resources related
  if (content.includes('employee') || content.includes('worker') || 
      content.includes('staff') || content.includes('labor') || content.includes('labour')) {
    impactedPolicies.push({ 
      name: 'HR Policy', 
      impact: 'May require updates to employment practices', 
      riskLevel: 'medium'
    });
    departments.add('HR');
    departments.add('Legal');
  }
  
  // Environmental related
  if (content.includes('environment') || content.includes('sustainability') || 
      content.includes('carbon') || content.includes('emission')) {
    impactedPolicies.push({ 
      name: 'Environmental Policy', 
      impact: 'May require updates to environmental practices', 
      riskLevel: 'medium'
    });
    departments.add('Operations');
    departments.add('Sustainability');
  }
  
  // Add a default policy if none matched
  if (impactedPolicies.length === 0) {
    impactedPolicies.push({ 
      name: 'General Compliance Policy', 
      impact: 'May require general compliance review', 
      riskLevel: 'low'
    });
    departments.add('Compliance');
  }
  
  // Calculate risk score (1-10) based on impact severity and keyword presence
  let riskScore = 5; // Default medium risk
  
  // Increase risk for certain keywords
  const highRiskKeywords = ['penalty', 'fine', 'sanction', 'mandatory', 'prohibited', 'breach', 'violation'];
  for (const keyword of highRiskKeywords) {
    if (content.includes(keyword)) {
      riskScore += 1;
    }
  }
  
  // Cap the risk score between 1-10
  riskScore = Math.min(Math.max(riskScore, 1), 10);
  
  // Generate a risk justification
  let riskJustification = `This regulation has been assessed with a risk score of ${riskScore}/10. `;
  
  if (riskScore >= 8) {
    riskJustification += 'This high risk score is based on the presence of significant compliance requirements with potential penalties for non-compliance.';
  } else if (riskScore >= 5) {
    riskJustification += 'This medium risk score indicates moderate compliance requirements that should be addressed in a timely manner.';
  } else {
    riskJustification += 'This lower risk score suggests less urgent compliance requirements, but the regulation should still be reviewed.';
  }
  
  // Create a summary
  const analysisSummary = `This regulation may impact ${impactedPolicies.length} policy area(s) and should be reviewed by ${departments.size} department(s). The overall compliance risk is rated ${riskScore}/10.`;
  
  return {
    title: regulation.title,
    impactedPolicies,
    departmentsForReview: Array.from(departments),
    riskScore,
    riskJustification,
    analysisSummary
  };
}
