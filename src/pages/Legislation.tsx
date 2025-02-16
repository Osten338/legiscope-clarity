
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, FileText, AlertTriangle, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Legislation = () => {
  const { id } = useParams();

  const { data: regulation, isLoading } = useQuery({
    queryKey: ['regulation', id],
    queryFn: async () => {
      if (!id || id === ':id') {
        throw new Error("Invalid legislation ID");
      }

      const { data, error } = await supabase
        .from('regulations')
        .select(`
          id,
          name,
          description,
          motivation,
          requirements,
          sanctions,
          checklist_items!checklist_items_regulation_id_fkey (
            id,
            description
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Legislation not found");
      return data;
    },
    enabled: Boolean(id) && id !== ':id', // Only run query when we have a valid ID
  });

  if (!id || id === ':id') {
    return (
      <div className="flex h-screen">
        <div className="text-red-600 m-auto">Invalid legislation ID</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="text-sage-600 m-auto">Loading legislation details...</div>
      </div>
    );
  }

  if (!regulation) {
    return (
      <div className="flex h-screen">
        <div className="text-red-600 m-auto">Legislation not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{regulation.name}</h1>
        <p className="text-slate-600">{regulation.description}</p>
      </div>

      <div className="grid gap-6">
        {/* Purpose and Motivation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sage-600" />
              Purpose and Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">{regulation.motivation}</p>
          </CardContent>
        </Card>

        {/* Main Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sage-600" />
              Main Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">{regulation.requirements}</p>
          </CardContent>
        </Card>

        {/* Sanctions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-sage-600" />
              Sanctions
            </CardTitle>
            <CardDescription>
              Non-compliance consequences and penalties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">{regulation.sanctions}</p>
          </CardContent>
        </Card>

        {/* Compliance Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-sage-600" />
              Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {regulation.checklist_items?.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full border-2 border-sage-600" />
                  <span className="text-slate-600">{item.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Legislation;
