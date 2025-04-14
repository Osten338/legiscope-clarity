
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database, Search, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EmbeddingsDebugger() {
  const [loading, setLoading] = useState(false);
  const [embeddingsCount, setEmbeddingsCount] = useState<number>(0);
  const [embeddingsSample, setEmbeddingsSample] = useState<any[]>([]);
  const [testQuery, setTestQuery] = useState("What is the purpose of the AI regulation?");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [manualMatches, setManualMatches] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expansionStates, setExpansionStates] = useState<Record<string, boolean>>({});
  const [similarityThreshold, setSimilarityThreshold] = useState(0.3); // Lower default to 0.3 (30%)
  const [resultsTab, setResultsTab] = useState("matches");

  useEffect(() => {
    loadEmbeddingsData();
  }, []);

  const loadEmbeddingsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Count total embeddings using raw SQL count query
      const { count, error: countError } = await supabase
        .from('document_embeddings')
        .select('*', { count: 'exact', head: true }) as any;
      
      if (countError) throw countError;
      setEmbeddingsCount(count || 0);
      
      // Get a sample of embeddings (first 5)
      const { data: sampleData, error: sampleError } = await supabase
        .from('document_embeddings')
        .select('id, content, created_at, metadata') as any;
      
      if (sampleError) throw sampleError;
      setEmbeddingsSample(sampleData || []);
    } catch (err: any) {
      console.error("Error loading embeddings data:", err);
      setError(err.message || "Failed to load embeddings data");
      toast({
        title: "Error loading embeddings",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testVectorSearch = async () => {
    try {
      setSearchLoading(true);
      setTestResults([]);
      setManualMatches([]);
      setTestSuccess(null);
      setError(null);
      
      // Call the edge function to test vector search
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke(
        "test-vector-search",
        {
          body: {
            query: testQuery,
            threshold: similarityThreshold
          },
        }
      );
      
      if (embeddingError) throw embeddingError;
      
      if (embeddingData.error) {
        throw new Error(embeddingData.error);
      }
      
      setTestSuccess(embeddingData.success);
      setTestResults(embeddingData.matches || []);
      setManualMatches(embeddingData.manualMatches || []);
      
      const totalMatches = (embeddingData.matches?.length || 0) + (embeddingData.manualMatches?.length || 0);
      
      // Show appropriate toast message
      if (embeddingData.success && totalMatches > 0) {
        toast({
          title: "Vector search successful",
          description: `Found ${embeddingData.matches?.length || 0} matches via RPC and ${embeddingData.manualMatches?.length || 0} via manual calculation from ${embeddingsCount} total embeddings.`,
          variant: "default",
        });
      } else if (embeddingData.success && totalMatches === 0) {
        toast({
          title: "No matches found",
          description: "The search was successful but no matches were found. Try a different query, lowering the similarity threshold, or check your embeddings.",
          variant: "default",
        });
      } else {
        toast({
          title: "Search failed",
          description: embeddingData.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error testing vector search:", err);
      setError(err.message || "Failed to test vector search");
      setTestSuccess(false);
      toast({
        title: "Error testing vector search",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleExpansion = (id: string) => {
    setExpansionStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMatchResults = (results: any[], title: string) => {
    return results.length > 0 ? (
      <div className="space-y-3">
        <div className="text-sm">
          Found {results.length} {title}:
        </div>
        <ScrollArea className="h-64 border rounded bg-white">
          <div className="p-1">
            {results.map((result, idx) => (
              <div key={`${title}-${result.id}-${idx}`} className="border rounded mb-2">
                <div className="bg-slate-50 p-2 border-b flex justify-between items-center">
                  <span className="font-medium">{title} #{idx + 1}</span>
                  <Badge variant="outline">
                    Similarity: {(result.similarity * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="p-2">
                  <div className="whitespace-pre-wrap text-sm">
                    {result.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    ) : (
      <div className="text-sm py-4 text-center text-slate-500">
        No {title.toLowerCase()} found
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Embeddings Diagnostics
          </CardTitle>
          <CardDescription>
            Debug and test your embeddings for vector search functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Embeddings Overview</h3>
                {error ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="bg-sage-50 p-4 rounded-lg">
                      <div className="text-3xl font-semibold text-sage-700">{embeddingsCount}</div>
                      <div className="text-sm text-sage-600">Total embeddings in database</div>
                    </div>
                    
                    {embeddingsSample.length > 0 ? (
                      <div className="border rounded-lg">
                        <div className="bg-slate-50 p-3 border-b">
                          <h4 className="font-medium">Sample Embeddings</h4>
                        </div>
                        <ScrollArea className="h-64">
                          <div className="p-2">
                            {embeddingsSample.map((embedding) => (
                              <Collapsible
                                key={embedding.id}
                                open={expansionStates[embedding.id]}
                                onOpenChange={() => toggleExpansion(embedding.id)}
                                className="border rounded mb-2"
                              >
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between p-3 h-auto text-left"
                                  >
                                    <div className="truncate font-normal">
                                      {embedding.content.substring(0, 50)}...
                                    </div>
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-3 pb-3">
                                  <div className="text-sm space-y-2">
                                    <div className="bg-slate-50 p-2 rounded">
                                      <p className="whitespace-pre-wrap">{embedding.content}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-slate-500">ID: {embedding.id}</span>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        No embeddings found in the database
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t">
                <h3 className="text-lg font-medium pt-3">Test Vector Search</h3>
                
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-600">
                    Try lowering the similarity threshold to find more results. A threshold around 0.25-0.35 often works well for semantic searches.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Test Query</label>
                  <Textarea 
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Enter a test query to search for relevant documents"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-700">
                      Similarity Threshold: {(similarityThreshold * 100).toFixed()}%
                    </label>
                    <span className="text-xs text-slate-500">
                      <span className="font-medium">Recommended:</span> 25-35% for semantic search
                    </span>
                  </div>
                  <Slider
                    value={[similarityThreshold]}
                    onValueChange={(values) => setSimilarityThreshold(values[0])}
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    className="py-4"
                  />
                </div>
                
                <Button
                  onClick={testVectorSearch}
                  disabled={searchLoading || !testQuery.trim()}
                  className="gap-2"
                >
                  {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Test Vector Search
                </Button>

                {testSuccess !== null && (
                  <div className={`mt-4 p-4 rounded-lg ${testSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="font-medium mb-2">
                      {testSuccess ? 'Search Successful' : 'Search Failed'}
                    </div>
                    
                    {(testResults.length > 0 || manualMatches.length > 0) ? (
                      <div className="space-y-3">
                        <Tabs 
                          value={resultsTab} 
                          onValueChange={setResultsTab}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-2 mb-2">
                            <TabsTrigger value="matches">
                              RPC Results ({testResults.length})
                            </TabsTrigger>
                            <TabsTrigger value="manual">
                              Manual Calculation ({manualMatches.length})
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="matches" className="mt-0">
                            {renderMatchResults(testResults, "RPC Match")}
                          </TabsContent>
                          <TabsContent value="manual" className="mt-0">
                            {renderMatchResults(manualMatches, "Manual Match")}
                          </TabsContent>
                        </Tabs>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {testSuccess ? 
                          "No matches found. Try a different query, lowering the similarity threshold (try 0.25), or check your embeddings." : 
                          error || "An unknown error occurred."
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={loadEmbeddingsData} disabled={loading}>
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
