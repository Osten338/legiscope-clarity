import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EmbeddingsUploader } from "@/components/admin/EmbeddingsUploader";
import { EmbeddingsDebugger } from "@/components/admin/EmbeddingsDebugger";

export default function AdminTools() {
  const [activeTab, setActiveTab] = useState<string>("embeddings");
  
  return (
    <DashboardLayout>
      <div className="container py-6 max-w-5xl">
        <h1 className="text-2xl font-semibold mb-6">Admin Tools</h1>
        
        <Alert className="mb-6 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Admin Access Only</AlertTitle>
          <AlertDescription>
            These tools are for administrative purposes and should be used with caution.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="embeddings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="embeddings">Embeddings Management</TabsTrigger>
            <TabsTrigger value="debug">Debug Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="embeddings">
            <Card>
              <CardHeader>
                <CardTitle>Embeddings Upload</CardTitle>
                <CardDescription>
                  Upload JSON files with embeddings data for the RAG model. The file should contain an array of objects with 'content' and 'embedding' fields.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmbeddingsUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debug">
            <EmbeddingsDebugger />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
