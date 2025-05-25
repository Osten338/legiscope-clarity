
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentExtractor } from "@/utils/documentExtractor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    file_path?: string;
  };
  highlights: PolicyHighlight[];
  selectedRegulation?: {
    name: string;
  };
  onHighlightSelect: (highlight: PolicyHighlight) => void;
  onDocumentUpdated?: () => void;
}

export const DocumentContentViewer = ({
  document: documentProp,
  highlights,
  selectedRegulation,
  onHighlightSelect,
  onDocumentUpdated
}: DocumentContentViewerProps) => {
  const [fontSize, setFontSize] = useState(14);
  const [selectedHighlight, setSelectedHighlight] = useState<PolicyHighlight | null>(null);
  const [showContentError, setShowContentError] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const { toast } = useToast();

  const documentContent = documentProp.description || "";
  
  // Check if content is corrupted or missing
  const isContentValid = useMemo(() => {
    if (!documentContent) return false;
    return DocumentExtractor.validateExtractedContent(documentContent);
  }, [documentContent]);

  useEffect(() => {
    setShowContentError(!isContentValid && documentContent.length > 0);
  }, [isContentValid, documentContent]);

  // Create highlighted content with position-based highlighting
  const highlightedContent = useMemo(() => {
    if (!isContentValid || !highlights || highlights.length === 0) {
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
  }, [documentContent, highlights, isContentValid]);

  const getHighlightStyle = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 border-l-2 border-green-400 hover:bg-green-200 text-green-900';
      case 'non_compliant':
        return 'bg-red-100 border-l-2 border-red-400 hover:bg-red-200 text-red-900';
      case 'needs_review':
        return 'bg-yellow-100 border-l-2 border-yellow-400 hover:bg-yellow-200 text-yellow-900';
      case 'not_applicable':
        return 'bg-gray-100 border-l-2 border-gray-400 hover:bg-gray-200 text-gray-900';
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

  const handleReprocess = async () => {
    if (!documentProp.file_path) {
      toast({
        title: "Error",
        description: "Cannot reprocess document - file path not available",
        variant: "destructive",
      });
      return;
    }

    setIsReprocessing(true);
    try {
      // Download the original file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('compliance_documents')
        .download(documentProp.file_path);

      if (downloadError) {
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }

      // Create a File object from the downloaded data
      const file = new File([fileData], documentProp.file_name, {
        type: fileData.type || 'application/octet-stream'
      });

      console.log('Reprocessing file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Extract text using the DocumentExtractor
      const extracted = await DocumentExtractor.extractText(file);

      if (!extracted.success || !extracted.text) {
        throw new Error(extracted.error || 'Failed to extract text from file');
      }

      // Validate the extracted content
      if (!DocumentExtractor.validateExtractedContent(extracted.text)) {
        throw new Error('Extracted content appears to be corrupted or in an unsupported format');
      }

      console.log('Successfully extracted text:', extracted.text.substring(0, 200) + '...');

      // Update the document in the database
      const { error: updateError } = await supabase
        .from('compliance_documents')
        .update({ description: extracted.text })
        .eq('id', documentProp.id);

      if (updateError) {
        throw new Error(`Failed to update document: ${updateError.message}`);
      }

      toast({
        title: "Success",
        description: "Document has been reprocessed with clean text content",
      });

      // Trigger refresh if callback provided
      if (onDocumentUpdated) {
        onDocumentUpdated();
      } else {
        // Fallback to page reload
        window.location.reload();
      }

    } catch (error: any) {
      console.error('Reprocessing error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reprocess document",
        variant: "destructive",
      });
    } finally {
      setIsReprocessing(false);
    }
  };

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Document Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">{documentProp.file_name}</h3>
            </div>
            {selectedRegulation && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                vs {selectedRegulation.name}
              </Badge>
            )}
          </div>
          
          {/* Document Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[50px] text-center">{fontSize}px</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadDocument}
              disabled={!isContentValid}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            {(showContentError || !isContentValid) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReprocess}
                disabled={isReprocessing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isReprocessing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Document Content */}
      <div className="flex-1 p-6">
        {!documentContent ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No document content available. The document may not have been processed yet or there was an error during upload.
              <div className="mt-2">
                <Button onClick={handleReprocess} disabled={isReprocessing} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isReprocessing ? 'animate-spin' : ''}`} />
                  {isReprocessing ? 'Processing...' : 'Process Document'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : showContentError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The document content appears to be corrupted or in an unsupported format. This usually happens when binary data from Word documents wasn't properly extracted as text.
              <div className="mt-2">
                <Button onClick={handleReprocess} disabled={isReprocessing} size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isReprocessing ? 'animate-spin' : ''}`} />
                  {isReprocessing ? 'Reprocessing...' : 'Reprocess Document'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div 
              className="prose prose-gray max-w-none leading-relaxed text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            >
              {highlightedContent.map((segment, index) => {
                if (segment.type === 'normal') {
                  return (
                    <span key={index} className="whitespace-pre-wrap break-words">
                      {segment.text}
                    </span>
                  );
                } else if (segment.highlight) {
                  return (
                    <mark
                      key={index}
                      className={`inline-block px-2 py-1 mx-0.5 my-0.5 rounded cursor-pointer transition-all duration-200 break-words ${getHighlightStyle(segment.highlight.compliance_status)} ${
                        selectedHighlight?.id === segment.highlight.id ? 'ring-2 ring-blue-400 shadow-sm' : ''
                      }`}
                      onClick={() => handleHighlightClick(segment.highlight!)}
                      title={`${segment.highlight.compliance_status.replace('_', ' ').toUpperCase()} - Click for details`}
                      data-highlight-id={segment.highlight.id}
                    >
                      {segment.text}
                    </mark>
                  );
                }
                return null;
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
