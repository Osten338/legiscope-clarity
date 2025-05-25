
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download } from "lucide-react";

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

interface DocumentContentViewerProps {
  document: {
    id: string;
    file_name: string;
    description?: string;
  };
  highlights: PolicyHighlight[];
  selectedRegulation?: {
    name: string;
  };
  onHighlightSelect: (highlight: PolicyHighlight) => void;
}

export const DocumentContentViewer = ({
  document: documentProp,
  highlights,
  selectedRegulation,
  onHighlightSelect
}: DocumentContentViewerProps) => {
  const [fontSize, setFontSize] = useState(14);
  const [selectedHighlight, setSelectedHighlight] = useState<PolicyHighlight | null>(null);

  const documentContent = documentProp.description || "Document content not available";

  // Create highlighted content with position-based highlighting
  const highlightedContent = useMemo(() => {
    if (!highlights || highlights.length === 0) {
      return [{ text: documentContent, type: 'normal' as const }];
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.section_start_position - b.section_start_position);
    
    const segments: Array<{ text: string; type: 'normal' | 'highlight'; highlight?: PolicyHighlight }> = [];
    let lastPosition = 0;

    for (const highlight of sortedHighlights) {
      const startPos = Math.max(0, highlight.section_start_position);
      const endPos = Math.min(documentContent.length, highlight.section_end_position);

      // Add normal text before highlight
      if (startPos > lastPosition) {
        segments.push({
          text: documentContent.slice(lastPosition, startPos),
          type: 'normal'
        });
      }

      // Add highlighted text
      if (endPos > startPos) {
        segments.push({
          text: documentContent.slice(startPos, endPos),
          type: 'highlight',
          highlight
        });
        lastPosition = Math.max(lastPosition, endPos);
      }
    }

    // Add remaining normal text
    if (lastPosition < documentContent.length) {
      segments.push({
        text: documentContent.slice(lastPosition),
        type: 'normal'
      });
    }

    return segments;
  }, [documentContent, highlights]);

  const getHighlightStyle = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-200 border-l-4 border-green-500 hover:bg-green-300';
      case 'non_compliant':
        return 'bg-red-200 border-l-4 border-red-500 hover:bg-red-300';
      case 'needs_review':
        return 'bg-yellow-200 border-l-4 border-yellow-500 hover:bg-yellow-300';
      case 'not_applicable':
        return 'bg-gray-200 border-l-4 border-gray-500 hover:bg-gray-300';
      default:
        return 'bg-gray-100';
    }
  };

  const handleHighlightClick = (highlight: PolicyHighlight) => {
    setSelectedHighlight(highlight);
    onHighlightSelect(highlight);
  };

  const downloadDocument = () => {
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${documentProp.file_name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{documentProp.file_name}</span>
            {selectedRegulation && (
              <Badge variant="outline" className="text-xs">
                vs {selectedRegulation.name}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadDocument}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div 
            className="prose max-w-none leading-relaxed"
            style={{ fontSize: `${fontSize}px` }}
          >
            {highlightedContent.map((segment, index) => {
              if (segment.type === 'normal') {
                return (
                  <span key={index} className="whitespace-pre-wrap">
                    {segment.text}
                  </span>
                );
              } else if (segment.highlight) {
                return (
                  <span
                    key={index}
                    className={`inline-block p-2 m-1 rounded cursor-pointer transition-all ${getHighlightStyle(segment.highlight.compliance_status)} ${
                      selectedHighlight?.id === segment.highlight.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleHighlightClick(segment.highlight!)}
                    title={`${segment.highlight.compliance_status.replace('_', ' ').toUpperCase()} - Click for details`}
                  >
                    {segment.text}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
