
import { useState, useEffect } from "react";
import { ExternalLink, Clock, FileText, AlertTriangle, RefreshCw, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { RegulationImpactAnalysis } from "./RegulationImpactAnalysis";
import { Badge } from "@/components/ui/badge";

interface LegislationItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  celex: string;
  hasAnalysis?: boolean;
}

export const LegislationFeed = () => {
  const [legislationItems, setLegislationItems] = useState<LegislationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LegislationItem | null>(null);
  const { toast } = useToast();

  const fetchLegislation = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsFallback(false);
      
      console.log("Fetching legislation feed...");
      const { data, error } = await supabase.functions.invoke("fetch-eurlex-rss");
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to fetch legislation feed");
      }
      
      if (data && data.entries) {
        // Check for existing analyses for these items
        const items = data.entries;
        const celexIds = items
          .filter((item: LegislationItem) => item.celex)
          .map((item: LegislationItem) => item.celex);

        if (celexIds.length > 0) {
          // Use the raw query method to bypass TypeScript table restrictions
          const { data: analyses } = await supabase.rpc('match_documents', {
            query_embedding: 'dummy', 
            match_threshold: 0.5, 
            match_count: 1
          }).maybeSingle();
          
          // Temporary workaround until type definitions are updated
          const { data: analysesData } = await supabase.from('regulatory_impact_analyses')
            .select('legislation_item_id')
            .in('legislation_item_id', celexIds) as unknown as { data: { legislation_item_id: string }[] };

          const analysisMap = new Set(analysesData?.map(a => a.legislation_item_id) || []);
          
          // Mark items that have an analysis
          const itemsWithAnalysisStatus = items.map((item: LegislationItem) => ({
            ...item,
            hasAnalysis: item.celex ? analysisMap.has(item.celex) : false
          }));
          
          setLegislationItems(itemsWithAnalysisStatus);
        } else {
          setLegislationItems(items);
        }

        // Check if we're using fallback data
        if (data.status === "fallback") {
          setIsFallback(true);
          toast({
            title: "Using cached legislation data",
            description: "We couldn't connect to EUR-Lex. Showing cached data instead.",
            variant: "default"
          });
        }
      } else {
        throw new Error("No legislation data received");
      }
    } catch (err: any) {
      console.error("Error fetching legislation feed:", err);
      setError(err.message || "Failed to load legislation feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegislation();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Truncate description to avoid overly long texts
  const truncateDescription = (text: string, maxLength = 150) => {
    if (!text) return "";
    
    // Strip HTML tags
    const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
    
    if (plainText.length <= maxLength) return plainText;
    return `${plainText.substring(0, maxLength)}...`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest EU Legislation</CardTitle>
          <CardDescription>Loading latest legislation from EUR-Lex...</CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={18} />
            <span>Error Loading Legislation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-slate-600">{error}</p>
          <Button 
            onClick={fetchLegislation} 
            variant="outline" 
            size="sm"
            className="mt-4"
          >
            <RefreshCw size={14} className="mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Latest EU Legislation</CardTitle>
            <CardDescription>
              {isFallback 
                ? "Temporarily using cached data due to connection issues" 
                : "Recent regulatory updates from EUR-Lex"}
            </CardDescription>
          </div>
          {isFallback && (
            <Button 
              onClick={fetchLegislation} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw size={14} className="mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {legislationItems.length === 0 ? (
          <p className="text-sm text-slate-600">No legislation found</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {legislationItems.map((item, index) => (
              <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-slate-900 mb-1 leading-tight">
                    {item.title}
                  </h3>
                  {item.hasAnalysis && (
                    <Badge variant="secondary" className="ml-2">
                      <BarChart size={12} className="mr-1" />
                      Analyzed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Clock size={12} />
                  <span>{formatDate(item.pubDate)}</span>
                  {item.celex && (
                    <>
                      <span>•</span>
                      <FileText size={12} />
                      <span>{item.celex}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {truncateDescription(item.description)}
                </p>
                <div className="flex gap-2 mt-2">
                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View on EUR-Lex
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs px-2 h-6"
                        onClick={() => setSelectedItem(item)}
                      >
                        <BarChart size={12} className="mr-1" />
                        {item.hasAnalysis ? "View Impact Analysis" : "Analyze Impact"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Regulatory Impact Analysis</DialogTitle>
                      </DialogHeader>
                      {selectedItem && (
                        <RegulationImpactAnalysis 
                          regulation={{
                            title: selectedItem.title,
                            description: selectedItem.description,
                            celex: selectedItem.celex
                          }}
                          onAnalysisComplete={fetchLegislation}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
