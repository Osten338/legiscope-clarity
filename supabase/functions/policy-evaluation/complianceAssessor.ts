
// Compliance Assessment Logic and Business Rules

export interface ComplianceMetrics {
  overall_score: number
  section_scores: {
    compliant: number
    non_compliant: number
    needs_review: number
    not_applicable: number
  }
  risk_factors: string[]
  priority_actions: string[]
  compliance_trend: 'improving' | 'declining' | 'stable'
}

export class ComplianceAssessor {
  calculateOverallScore(highlights: any[]): number {
    if (highlights.length === 0) return 0;

    const weights = {
      compliant: 1.0,
      needs_review: 0.5,
      not_applicable: 0.8, // Neutral - doesn't hurt compliance
      non_compliant: 0.0
    };

    let totalWeight = 0;
    let weightedScore = 0;

    highlights.forEach(highlight => {
      const weight = weights[highlight.compliance_status as keyof typeof weights] || 0;
      const confidence = highlight.confidence_score || 0.5;
      
      // Weight by confidence to give more importance to high-confidence assessments
      const adjustedWeight = weight * confidence;
      weightedScore += adjustedWeight;
      totalWeight += confidence;
    });

    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
  }

  assessRiskFactors(highlights: any[]): string[] {
    const riskFactors: string[] = [];
    const nonCompliantItems = highlights.filter(h => h.compliance_status === 'non_compliant');
    const highPriorityItems = highlights.filter(h => h.priority_level <= 2);

    if (nonCompliantItems.length > 0) {
      riskFactors.push(`${nonCompliantItems.length} non-compliant sections identified`);
    }

    if (highPriorityItems.length > 0) {
      riskFactors.push(`${highPriorityItems.length} high-priority issues requiring immediate attention`);
    }

    // Check for patterns in non-compliance
    const lowConfidenceItems = highlights.filter(h => h.confidence_score < 0.6);
    if (lowConfidenceItems.length > highlights.length * 0.3) {
      riskFactors.push('High uncertainty in compliance assessment - expert review recommended');
    }

    // Check for missing critical controls
    const criticalKeywords = ['access control', 'data encryption', 'audit trail', 'incident response'];
    const documentText = highlights.map(h => h.section_text).join(' ').toLowerCase();
    
    criticalKeywords.forEach(keyword => {
      if (!documentText.includes(keyword)) {
        riskFactors.push(`Potential gap: No clear mention of ${keyword} requirements`);
      }
    });

    return riskFactors;
  }

  generatePriorityActions(highlights: any[]): string[] {
    const actions: string[] = [];
    
    // Sort by priority level and confidence
    const sortedHighlights = highlights
      .filter(h => h.compliance_status === 'non_compliant' || h.compliance_status === 'needs_review')
      .sort((a, b) => {
        if (a.priority_level !== b.priority_level) {
          return a.priority_level - b.priority_level;
        }
        return b.confidence_score - a.confidence_score;
      });

    // Take top 5 most critical actions
    sortedHighlights.slice(0, 5).forEach((highlight, index) => {
      const priority = this.getPriorityLabel(highlight.priority_level);
      actions.push(`${priority}: ${highlight.suggested_fixes}`);
    });

    return actions;
  }

  private getPriorityLabel(level: number): string {
    const labels = {
      1: 'CRITICAL',
      2: 'HIGH',
      3: 'MEDIUM',
      4: 'LOW',
      5: 'INFO'
    };
    return labels[level as keyof typeof labels] || 'UNKNOWN';
  }

  generateComplianceSummary(metrics: ComplianceMetrics): string {
    const { overall_score, section_scores } = metrics;
    const total = Object.values(section_scores).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return 'No sections analyzed';

    const compliantPercentage = Math.round((section_scores.compliant / total) * 100);
    const nonCompliantPercentage = Math.round((section_scores.non_compliant / total) * 100);

    let summary = `Overall compliance score: ${overall_score}%. `;
    summary += `Analysis found ${section_scores.compliant} compliant sections (${compliantPercentage}%), `;
    summary += `${section_scores.non_compliant} non-compliant sections (${nonCompliantPercentage}%), `;
    summary += `and ${section_scores.needs_review} sections requiring manual review.`;

    if (overall_score >= 90) {
      summary += ' Document demonstrates strong compliance posture.';
    } else if (overall_score >= 70) {
      summary += ' Document shows good compliance with some areas for improvement.';
    } else if (overall_score >= 50) {
      summary += ' Document has moderate compliance gaps that should be addressed.';
    } else {
      summary += ' Document has significant compliance deficiencies requiring immediate attention.';
    }

    return summary;
  }

  generateDetailedRecommendations(highlights: any[]): string {
    const recommendations: string[] = [];
    
    // Group by priority level
    const priorityGroups = highlights.reduce((groups, highlight) => {
      const priority = highlight.priority_level;
      if (!groups[priority]) groups[priority] = [];
      groups[priority].push(highlight);
      return groups;
    }, {} as Record<number, any[]>);

    Object.entries(priorityGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([priority, items]) => {
        const nonCompliant = items.filter(item => item.compliance_status === 'non_compliant');
        if (nonCompliant.length > 0) {
          const priorityLabel = this.getPriorityLabel(parseInt(priority));
          recommendations.push(`${priorityLabel} PRIORITY (${nonCompliant.length} issues):`);
          
          nonCompliant.forEach(item => {
            recommendations.push(`- ${item.suggested_fixes}`);
          });
        }
      });

    return recommendations.length > 0 
      ? recommendations.join('\n') 
      : 'No specific recommendations - continue monitoring for regulatory updates.';
  }
}
