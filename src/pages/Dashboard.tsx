
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RegulationCard } from "@/components/RegulationCard";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Settings,
  BookOpen,
  Shield,
  AlertCircle,
  Calendar,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusIcons = {
  compliant: { icon: CheckCircle2, class: "text-green-500" },
  in_progress: { icon: Clock, class: "text-amber-500" },
  not_compliant: { icon: AlertTriangle, class: "text-red-500" },
  under_review: { icon: HelpCircle, class: "text-blue-500" },
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    compliant: "Compliant",
    in_progress: "In Progress",
    not_compliant: "Not Compliant",
    under_review: "Under Review",
  };
  return statusMap[status] || status;
};

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);

  const { data: savedRegulations, isLoading } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      const { data: savedRegs, error } = await supabase
        .from('saved_regulations')
        .select(`
          id,
          regulation_id,
          status,
          progress,
          next_review_date,
          completion_date,
          notes,
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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(statusIcons).map(([status, { icon: Icon, class: colorClass }]) => {
              const count = savedRegulations?.filter(reg => reg.status === status).length || 0;
              return (
                <Card key={status}>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", colorClass)} />
                      {getStatusText(status)}
                    </CardDescription>
                    <CardTitle>{count}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Upcoming Reviews */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedRegulations
                  ?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date())
                  .sort((a, b) => new Date(a.next_review_date!).getTime() - new Date(b.next_review_date!).getTime())
                  .slice(0, 3)
                  .map(saved => saved.regulations && (
                    <div
                      key={saved.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-sage-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">{saved.regulations.name}</h4>
                          <p className="text-sm text-slate-600">
                            Review due: {format(new Date(saved.next_review_date!), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-400" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Regulations List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Regulations</CardTitle>
              <CardDescription>
                Detailed view of all your compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedRegulations?.map((saved) => {
                  if (!saved.regulations) return null;
                  const StatusIcon = statusIcons[saved.status as keyof typeof statusIcons]?.icon || Clock;
                  const statusColor = statusIcons[saved.status as keyof typeof statusIcons]?.class || "text-slate-400";
                  
                  return (
                    <div key={saved.id} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <StatusIcon className={cn("w-5 h-5", statusColor)} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getStatusText(saved.status)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="h-2 flex-1 bg-slate-100 rounded-full">
                          <div
                            className="h-2 bg-sage-500 rounded-full transition-all duration-500"
                            style={{ width: `${saved.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">{saved.progress}%</span>
                      </div>
                      <RegulationCard
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
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

