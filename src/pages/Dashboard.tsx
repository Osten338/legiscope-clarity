
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RegulationCard } from "@/components/RegulationCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Settings,
  BookOpen,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);

  const { data: savedRegulations, isLoading } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      const { data: savedRegs, error } = await supabase
        .from('saved_regulations')
        .select(`
          regulation_id,
          regulations (
            id,
            name,
            description,
            motivation,
            requirements,
            checklist_items!checklist_items_regulation_id_fkey (
              id,
              description
            )
          )
        `);

      if (error) throw error;
      return savedRegs;
    }
  });

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FileText, label: "Legislation" },
    { icon: CheckSquare, label: "Compliance Checklist" },
    { icon: Shield, label: "Risk Assessment" },
    { icon: BookOpen, label: "Documentation" },
    { icon: AlertCircle, label: "Alerts" },
    { icon: Settings, label: "Settings" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="text-sage-600 m-auto">Loading saved regulations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-800">Compliance Hub</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-1 p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? "bg-sage-100 text-sage-900"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Card */}
          <Card className="mb-8 bg-gradient-to-r from-sage-50 to-slate-50 border-none">
            <CardContent className="flex items-center gap-6 pt-6">
              <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center">
                <Shield className="w-8 h-8 text-sage-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  Welcome to Your Compliance Dashboard
                </h2>
                <p className="text-slate-600">
                  Stay on top of your regulatory requirements and compliance status.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Legislation Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Legislation Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRegulations?.slice(0, 3).map((saved) => (
                    saved.regulations && (
                      <div
                        key={saved.regulations.id}
                        className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <h3 className="font-medium text-slate-900 mb-1">
                          {saved.regulations.name}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {saved.regulations.description}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedRegulations?.slice(0, 3).map((saved) => (
                    saved.regulations && (
                      <div
                        key={saved.regulations.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50"
                      >
                        <span className="font-medium text-slate-900">
                          {saved.regulations.name}
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-sage-100 text-sage-800">
                          In Progress
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Regulations List */}
          <Card>
            <CardHeader>
              <CardTitle>All Regulations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedRegulations?.map((saved) => (
                  saved.regulations && (
                    <RegulationCard
                      key={saved.regulations.id}
                      regulation={{
                        ...saved.regulations,
                        checklist_items: saved.regulations.checklist_items || []
                      }}
                      isOpen={openRegulation === saved.regulations.id}
                      onOpenChange={() =>
                        setOpenRegulation(
                          openRegulation === saved.regulations.id ? null : saved.regulations.id
                        )
                      }
                      isSaved={true}
                    />
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
