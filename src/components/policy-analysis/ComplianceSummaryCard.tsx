import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, Info, FileText } from "lucide-react";
interface ComplianceSummaryProps {
  evaluation: {
    id: string;
    overall_compliance_score: number;
    total_sections_analyzed: number;
    compliant_sections: number;
    non_compliant_sections: number;
    needs_review_sections: number;
    status: string;
    summary?: string;
    recommendations?: string;
  };
  regulation: {
    name: string;
  };
}
export const ComplianceSummaryCard = ({
  evaluation,
  regulation
}: ComplianceSummaryProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  return <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sage-600" />
            Compliance Analysis
          </CardTitle>
          {getStatusBadge(evaluation.status)}
        </div>
        <div className="text-sm text-gray-600">
          Analysis against {regulation.name}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        

        {/* Section Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Compliant</span>
              </div>
              <span className="font-medium text-green-600">
                {evaluation.compliant_sections}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Non-compliant</span>
              </div>
              <span className="font-medium text-red-600">
                {evaluation.non_compliant_sections}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Needs Review</span>
              </div>
              <span className="font-medium text-yellow-600">
                {evaluation.needs_review_sections}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Total Analyzed</span>
              </div>
              <span className="font-medium text-gray-600">
                {evaluation.total_sections_analyzed}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        {evaluation.summary && <div>
            <h4 className="font-medium mb-2">Summary</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {evaluation.summary}
            </p>
          </div>}

        {/* Recommendations */}
        {evaluation.recommendations && <div>
            <h4 className="font-medium mb-2">Key Recommendations</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {evaluation.recommendations}
            </p>
          </div>}
      </CardContent>
    </Card>;
};