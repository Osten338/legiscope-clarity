
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface PolicyDocumentViewerProps {
  document: {
    id: string;
    file_name: string;
    content?: string;
  };
  highlights: PolicyHighlight[];
  selectedRegulation?: {
    name: string;
  };
}

export const PolicyDocumentViewer = ({
  document,
  highlights,
  selectedRegulation
}: PolicyDocumentViewerProps) => {
  const [selectedHighlight, setSelectedHighlight] = useState<PolicyHighlight | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'non_compliant':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'needs_review':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'not_applicable':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4" />;
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4" />;
      case 'needs_review':
        return <Clock className="h-4 w-4" />;
      case 'not_applicable':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (level: number) => {
    if (level <= 2) return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    if (level === 3) return <Badge variant="secondary" className="text-xs">Medium</Badge>;
    return <Badge variant="outline" className="text-xs">Low</Badge>;
  };

  const filteredHighlights = highlights.filter(h => 
    filterStatus === 'all' || h.compliance_status === filterStatus
  );

  const criticalCount = highlights.filter(h => h.compliance_status === 'non_compliant').length;
  const reviewCount = highlights.filter(h => h.compliance_status === 'needs_review').length;
  const compliantCount = highlights.filter(h => h.compliance_status === 'compliant').length;

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Document Content */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{document.file_name}</span>
              {selectedRegulation && (
                <Badge variant="outline" className="text-xs">
                  vs {selectedRegulation.name}
                </Badge>
              )}
            </CardTitle>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All ({highlights.length})
              </Button>
              <Button
                variant={filterStatus === 'non_compliant' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('non_compliant')}
              >
                Critical ({criticalCount})
              </Button>
              <Button
                variant={filterStatus === 'needs_review' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('needs_review')}
              >
                Review ({reviewCount})
              </Button>
              <Button
                variant={filterStatus === 'compliant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('compliant')}
                className={filterStatus === 'compliant' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Compliant ({compliantCount})
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      getStatusColor(highlight.compliance_status),
                      selectedHighlight?.id === highlight.id && "ring-2 ring-blue-500"
                    )}
                    onClick={() => setSelectedHighlight(highlight)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(highlight.compliance_status)}
                        <span className="font-medium capitalize">
                          {highlight.compliance_status.replace('_', ' ')}
                        </span>
                        {getPriorityBadge(highlight.priority_level)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(highlight.confidence_score * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3 leading-relaxed">
                      {highlight.section_text}
                    </p>
                    
                    {highlight.article_references.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {highlight.article_references.map((ref, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredHighlights.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No sections found for the selected filter.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Review Sidebar */}
      <div className="w-80">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Compliance Review
            </CardTitle>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Review status</span>
                <span className="font-medium">
                  {compliantCount} completed
                </span>
              </div>
              
              <div className="flex gap-2">
                {criticalCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-xs text-red-600">Critical {criticalCount}</span>
                  </div>
                )}
                {reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-yellow-600">Review {reviewCount}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {/* Critical Issues */}
                {highlights.filter(h => h.compliance_status === 'non_compliant').map((highlight) => (
                  <Collapsible 
                    key={highlight.id}
                    open={expandedSections.has(highlight.id)}
                    onOpenChange={() => toggleSection(highlight.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-red-700 text-sm">
                            Critical Issue
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Gap Analysis</h4>
                          <p className="text-xs text-gray-600">{highlight.gap_analysis}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-1">Suggested Fix</h4>
                          <p className="text-xs text-gray-600">{highlight.suggested_fixes}</p>
                        </div>
                        
                        {highlight.article_references.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-1">References</h4>
                            <div className="flex gap-1 flex-wrap">
                              {highlight.article_references.map((ref, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {ref}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                          Iterate
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
                
                {/* Review Items */}
                {highlights.filter(h => h.compliance_status === 'needs_review').map((highlight) => (
                  <Collapsible 
                    key={highlight.id}
                    open={expandedSections.has(highlight.id)}
                    onOpenChange={() => toggleSection(highlight.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-yellow-700 text-sm">
                            Needs Review
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Review</Badge>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Analysis</h4>
                          <p className="text-xs text-gray-600">{highlight.gap_analysis}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-1">Recommendation</h4>
                          <p className="text-xs text-gray-600">{highlight.suggested_fixes}</p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
