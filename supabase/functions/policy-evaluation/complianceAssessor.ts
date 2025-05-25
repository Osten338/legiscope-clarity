
// Enhanced Compliance Assessment and Scoring System

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
  compliance_trend: 'improving' | 'stable' | 'declining'
}

export class ComplianceAssessor {
  calculateOverallScore(highlights: any[]): number {
    if (!highlights || highlights.length === 0) {
      return 0
    }

    let totalWeight = 0
    let weightedScore = 0

    for (const highlight of highlights) {
      // Weight based on priority level (higher priority = more impact on score)
      const weight = this.getPriorityWeight(highlight.priority_level)
      const score = this.getStatusScore(highlight.compliance_status)
      
      totalWeight += weight
      weightedScore += (score * weight)
    }

    if (totalWeight === 0) {
      return 0
    }

    const finalScore = Math.round((weightedScore / totalWeight) * 100)
    return Math.max(0, Math.min(100, finalScore))
  }

  private getPriorityWeight(priorityLevel: number): number {
    switch (priorityLevel) {
      case 1: return 5.0  // Critical
      case 2: return 3.0  // High
      case 3: return 2.0  // Medium
      case 4: return 1.0  // Low
      case 5: return 0.5  // Informational
      default: return 2.0
    }
  }

  private getStatusScore(status: string): number {
    switch (status) {
      case 'compliant': return 1.0
      case 'needs_review': return 0.5
      case 'not_applicable': return 0.8  // Neutral impact
      case 'non_compliant': return 0.0
      default: return 0.5
    }
  }

  assessRiskFactors(highlights: any[]): string[] {
    const riskFactors: string[] = []

    // Analyze non-compliant sections
    const nonCompliantHighlights = highlights.filter(h => h.compliance_status === 'non_compliant')
    const criticalNonCompliant = nonCompliantHighlights.filter(h => h.priority_level <= 2)

    if (criticalNonCompliant.length > 0) {
      riskFactors.push(`${criticalNonCompliant.length} critical compliance gaps identified`)
    }

    if (nonCompliantHighlights.length > highlights.length * 0.3) {
      riskFactors.push('High percentage of non-compliant sections')
    }

    // Check for low confidence scores
    const lowConfidenceHighlights = highlights.filter(h => h.confidence_score < 0.6)
    if (lowConfidenceHighlights.length > highlights.length * 0.2) {
      riskFactors.push('Multiple sections require manual expert review')
    }

    // Check for missing documentation patterns
    const needsReviewHighlights = highlights.filter(h => h.compliance_status === 'needs_review')
    if (needsReviewHighlights.length > 5) {
      riskFactors.push('Significant documentation gaps detected')
    }

    return riskFactors
  }

  generatePriorityActions(highlights: any[]): string[] {
    const actions: string[] = []

    // Sort by priority and compliance status
    const criticalIssues = highlights
      .filter(h => h.compliance_status === 'non_compliant' && h.priority_level <= 2)
      .sort((a, b) => a.priority_level - b.priority_level)

    if (criticalIssues.length > 0) {
      actions.push(`Address ${criticalIssues.length} critical compliance violations immediately`)
    }

    // High priority recommendations
    const highPriorityRecommendations = highlights
      .filter(h => h.priority_level <= 2 && h.suggested_fixes)
      .slice(0, 3)

    for (const highlight of highPriorityRecommendations) {
      if (highlight.suggested_fixes && highlight.suggested_fixes.length > 10) {
        actions.push(highlight.suggested_fixes.substring(0, 100) + '...')
      }
    }

    // Review requirements
    const reviewItems = highlights.filter(h => h.compliance_status === 'needs_review')
    if (reviewItems.length > 0) {
      actions.push(`Conduct manual review of ${reviewItems.length} unclear sections`)
    }

    return actions.slice(0, 5) // Limit to top 5 actions
  }

  generateComplianceSummary(metrics: ComplianceMetrics): string {
    const { overall_score, section_scores } = metrics
    const totalSections = Object.values(section_scores).reduce((sum, count) => sum + count, 0)

    let summary = `Analysis of ${totalSections} document sections reveals an overall compliance score of ${overall_score}%. `

    if (overall_score >= 80) {
      summary += 'The document demonstrates strong compliance with regulatory requirements. '
    } else if (overall_score >= 60) {
      summary += 'The document shows moderate compliance but requires attention to several areas. '
    } else {
      summary += 'The document has significant compliance gaps that need immediate attention. '
    }

    summary += `Breakdown: ${section_scores.compliant} compliant sections, ${section_scores.non_compliant} non-compliant sections, `
    summary += `${section_scores.needs_review} sections requiring review, and ${section_scores.not_applicable} non-applicable sections.`

    if (metrics.risk_factors.length > 0) {
      summary += ` Key risk factors include: ${metrics.risk_factors.slice(0, 2).join(', ')}.`
    }

    return summary
  }

  generateDetailedRecommendations(highlights: any[]): string {
    const recommendations: string[] = []

    // Group recommendations by priority
    const criticalIssues = highlights.filter(h => h.compliance_status === 'non_compliant' && h.priority_level <= 2)
    const moderateIssues = highlights.filter(h => h.compliance_status === 'non_compliant' && h.priority_level > 2)
    const reviewItems = highlights.filter(h => h.compliance_status === 'needs_review')

    if (criticalIssues.length > 0) {
      recommendations.push('IMMEDIATE ACTIONS REQUIRED:')
      criticalIssues.slice(0, 3).forEach((highlight, index) => {
        if (highlight.suggested_fixes) {
          recommendations.push(`${index + 1}. ${highlight.suggested_fixes}`)
        }
      })
      recommendations.push('')
    }

    if (moderateIssues.length > 0) {
      recommendations.push('MODERATE PRIORITY IMPROVEMENTS:')
      moderateIssues.slice(0, 3).forEach((highlight, index) => {
        if (highlight.suggested_fixes) {
          recommendations.push(`${index + 1}. ${highlight.suggested_fixes}`)
        }
      })
      recommendations.push('')
    }

    if (reviewItems.length > 0) {
      recommendations.push('ITEMS FOR MANUAL REVIEW:')
      recommendations.push(`${reviewItems.length} sections require expert legal review to determine compliance status.`)
      recommendations.push('')
    }

    recommendations.push('NEXT STEPS:')
    recommendations.push('1. Prioritize critical compliance gaps for immediate resolution')
    recommendations.push('2. Establish timeline for moderate priority improvements')
    recommendations.push('3. Schedule legal review for unclear sections')
    recommendations.push('4. Implement monitoring system for ongoing compliance')

    return recommendations.join('\n')
  }
}
