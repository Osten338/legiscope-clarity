
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock, Info, ExternalLink } from "lucide-react";

interface PolicyHighlight {
  id: string;
  section_text: string;
  compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
  confidence_score: number;
  priority_level: number;
  gap_analysis: string;
  suggested_fixes: string;
  article_references: string[];
  section_start_position: number;
  section_end_position: number;
  ai_reasoning?: string;
  regulation_excerpt?: string;
}

interface AnalysisDetailsPanelProps {
  selectedHighlight: PolicyHighlight | null;
  allHighlights: PolicyHighlight[];
  onNavigateToHighlight: (highlight: PolicyHighlight) => void;
}

export const AnalysisDetailsPanel = ({
  selectedHighlight,
  allHighlights,
  onNavigateToHighlight
}: AnalysisDetailsPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'needs_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not_applicable':
        return <Info className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (level: number) => {
    if (level <= 2) return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    if (level === 3) return <Badge variant="secondary" className="text-xs">Medium</Badge>;
    return <Badge variant="outline" className="text-xs">Low</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive">Non-Compliant</Badge>;
      case 'needs_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Review</Badge>;
      case 'not_applicable':
        return <Badge variant="outline">Not Applicable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get summary statistics
  const criticalIssues = allHighlights.filter(h => h.compliance_status === 'non_compliant');
  const reviewItems = allHighlights.filter(h => h.compliance_status === 'needs_review');
  const compliantItems = allHighlights.filter(h => h.compliance_status === 'compliant');

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Analysis Details
        </CardTitle>
        
        {/* Summary Statistics */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis Progress</span>
            <span className="font-medium">
              {allHighlights.length} sections analyzed
            </span>
          </div>
          
          <div className="flex gap-3 text-xs">
            {criticalIssues.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-600">{criticalIssues.length} Critical</span>
              </div>
            )}
            {reviewItems.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-yellow-600">{reviewItems.length} Review</span>
              </div>
            )}
            {compliantItems.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-600">{compliantItems.length} Compliant</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px]">
          {selectedHighlight ? (
            /* Detailed view for selected highlight */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedHighlight.compliance_status)}
                  {getStatusBadge(selectedHighlight.compliance_status)}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(selectedHighlight.priority_level)}
                  <Badge variant="outline" className="text-xs">
                    {Math.round(selectedHighlight.confidence_score * 100)}% confidence
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Section Text</h4>
                <p className="text-sm bg-gray-50 p-3 rounded border text-gray-700 leading-relaxed">
                  {selectedHighlight.section_text}
                </p>
              </div>

              {selectedHighlight.gap_analysis && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Gap Analysis</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedHighlight.gap_analysis}
                  </p>
                </div>
              )}

              {selectedHighlight.suggested_fixes && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Suggested Actions</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedHighlight.suggested_fixes}
                  </p>
                </div>
              )}

              {selectedHighlight.ai_reasoning && (
                <div>
                  <h4 className="font-medium text-sm mb-2">AI Analysis</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedHighlight.ai_reasoning}
                  </p>
                </div>
              )}

              {selectedHighlight.article_references && selectedHighlight.article_references.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Related Regulations</h4>
                  <div className="flex gap-1 flex-wrap">
                    {selectedHighlight.article_references.map((ref, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedHighlight.compliance_status === 'non_compliant' && (
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Action Item
                </Button>
              )}
            </div>
          ) : (
            /* Overview when no highlight is selected */
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Click on highlighted sections in the document to view detailed analysis.
              </p>

              {/* Critical Issues */}
              {criticalIssues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-red-700">Critical Issues</h4>
                  <div className="space-y-2">
                    {criticalIssues.slice(0, 3).map((highlight) => (
                      <div
                        key={highlight.id}
                        className="p-2 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100"
                        onClick={() => onNavigateToHighlight(highlight)}
                      >
                        <p className="text-xs text-red-800 truncate">
                          {highlight.section_text.substring(0, 80)}...
                        </p>
                      </div>
                    ))}
                    {criticalIssues.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{criticalIssues.length - 3} more critical issues
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Review Items */}
              {reviewItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 text-yellow-700">Needs Review</h4>
                  <div className="space-y-2">
                    {reviewItems.slice(0, 2).map((highlight) => (
                      <div
                        key={highlight.id}
                        className="p-2 bg-yellow-50 border border-yellow-200 rounded cursor-pointer hover:bg-yellow-100"
                        onClick={() => onNavigateToHighlight(highlight)}
                      >
                        <p className="text-xs text-yellow-800 truncate">
                          {highlight.section_text.substring(0, 80)}...
                        </p>
                      </div>
                    ))}
                    {reviewItems.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{reviewItems.length - 2} more items for review
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
