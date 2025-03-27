
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/dashboard/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CalendarDays, ClipboardList, FileText, ChevronRight, Search, ClipboardCheck, BarChart, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Define types for the data structure
type ChecklistItem = {
  id: string;
  description: string;
};

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItem[];
};

type SavedRegulation = {
  id: string;
  regulation_id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  completion_date: string | null;
  notes: string | null;
  regulations: Regulation;
};

const categoryData = {
  "Data Privacy": {
    progress: 67,
    count: 3,
    regulations: ["GDPR", "CCPA", "LGPD"],
    status: "Compliant",
    background: "data-privacy-bg"
  },
  "Financial": {
    progress: 100,
    count: 1,
    description: "(fia conduct)",
    regulations: ["SOX", "PCI DSS", "IFRS"],
    status: "Compliant",
    background: "financial-bg"
  },
  "Healthcare": {
    progress: 50,
    count: 4,
    regulations: ["HIPAA", "HITECH"],
    status: "Compliant",
    background: "healthcare-bg"
  },
  "Industry Specific": {
    progress: 67,
    count: 6,
    description: "recent tasks",
    regulations: ["ISO 27001", "FOIA CFR 21"],
    status: "Compliant",
    background: "industry-bg"
  }
};

const recentUpdates = [
  {
    title: "GDPR Article 2? Amendment",
    description: "Changes to representative requirements",
    impact: "Medium Impact",
    category: "Data Privacy",
    date: "1 day ago"
  },
  {
    title: "Financial Reporting Standard Update",
    description: "New disclosure rules due to timelines",
    impact: "Low Impact",
    category: "Financial",
    date: "1 hour ago"
  },
  {
    title: "Healthcare Data Protection Act",
    description: "New requirements for handling",
    impact: "High Impact",
    category: "Healthcare",
    date: "1 week ago"
  },
  {
    title: "Employment Law Amendment",
    description: "Affects hiring practices",
    impact: "Medium Impact",
    category: "Industry Specific",
    date: "2 weeks ago"
  }
];

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      try {
        console.log("Fetching saved regulations...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        const {
          data: savedRegs,
          error
        } = await supabase.from('saved_regulations').select(`
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
          `)
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Data loading error",
            description: "Could not load your saved regulations. Please try again.",
            variant: "destructive"
          });
          throw error;
        }
        
        console.log("Saved regulations data:", savedRegs);
        
        // Transform the data to match our types
        const typedRegulations = savedRegs?.map(reg => ({
          id: reg.id,
          regulation_id: reg.regulation_id,
          status: reg.status,
          progress: reg.progress,
          next_review_date: reg.next_review_date,
          completion_date: reg.completion_date,
          notes: reg.notes,
          regulations: reg.regulations
        })) as SavedRegulation[];
        
        return typedRegulations || [];
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
    staleTime: 10000, // Refetch after 10 seconds
  });

  // Refetch on initial load to ensure we have the latest data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Calculate totals
  const totalRegulations = savedRegulations?.length || 0;
  const pendingTasks = savedRegulations?.filter(reg => reg.status === 'in_progress').length || 0;
  const complianceScore = totalRegulations > 0 
    ? Math.round((savedRegulations?.filter(reg => reg.status === 'compliant').length || 0) / totalRegulations * 100) 
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-playfair text-slate-900 mb-2">Attention Required</h1>
            <p className="text-lg text-slate-700 font-playfair">
              {complianceScore}% compliant score - review your tasks
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button variant="outline" className="border-slate-300 text-slate-700">
              Export Report
            </Button>
            <Button asChild className="bg-orange-400 hover:bg-orange-500 font-medium">
              <Link to="/assessment">Run Assessment</Link>
            </Button>
          </div>
        </div>

        {error ? (
          <div className="p-6 bg-red-50 border border-red-100 rounded-lg mb-8">
            <h3 className="text-lg font-medium text-red-800 mb-2">Could not load your data</h3>
            <p className="text-red-700 mb-4">
              We're having trouble connecting to our database. This might be due to network issues or temporary service disruption.
            </p>
            <Button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="nature-card">
                <div className="nature-card-content bg-green-50/80">
                  <div className="mb-4">
                    <h3 className="text-lg font-playfair text-slate-800">Audit Scheduling</h3>
                  </div>
                  <div>
                    <p className="text-5xl font-playfair text-slate-900 mb-2">87%</p>
                    <p className="text-sm text-slate-600">Ad rooms last month</p>
                  </div>
                </div>
              </div>

              <div className="nature-card">
                <div className="nature-card-content bg-amber-50/80">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-slate-700" />
                      <h3 className="text-lg font-playfair text-slate-800">Task Center</h3>
                    </div>
                  </div>
                  <div>
                    <p className="text-5xl font-playfair text-slate-900 mb-2">{totalRegulations || 142}</p>
                    <p className="text-sm text-slate-600">Active regulations</p>
                    <p className="text-xs text-slate-500 mt-1">Audit/Transitions</p>
                  </div>
                </div>
              </div>

              <div className="nature-card">
                <div className="nature-card-content bg-emerald-50/80">
                  <div className="mb-4">
                    <h3 className="text-lg font-playfair text-slate-800">Document Vault</h3>
                  </div>
                  <div>
                    <p className="text-5xl font-playfair text-slate-900 mb-2">{pendingTasks || 8}</p>
                    <p className="text-sm text-slate-600">Pending tasks</p>
                    <p className="text-xs text-slate-500 mt-1">4 high priority</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="mb-10">
              <TabsList className="border-b border-slate-200 w-full justify-start rounded-none bg-transparent mb-6">
                <TabsTrigger 
                  value="overview" 
                  className="font-playfair text-lg data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 rounded-none bg-transparent text-slate-600 px-6 py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="regulations" 
                  className="font-playfair text-lg data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 rounded-none bg-transparent text-slate-600 px-6 py-3"
                >
                  Regulations
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="font-playfair text-lg data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 rounded-none bg-transparent text-slate-600 px-6 py-3"
                >
                  Tasks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(categoryData).map(([category, data]) => (
                    <Card key={category} className={`category-card ${data.background} border-0 shadow-sm`}>
                      <div className="category-card-content">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-playfair text-slate-900">{category}</h3>
                            <div className="bg-white/80 px-3 py-1 rounded-full font-medium">
                              {data.progress}%
                            </div>
                          </div>
                          <p className="text-slate-800 mb-4">
                            {data.count} {data.description ? data.description : 'regulations'}
                          </p>
                          <div className="space-y-1 mb-6">
                            {data.regulations.map((reg, index) => (
                              <div key={index} className="flex justify-between">
                                <p className="text-slate-700">• {reg}</p>
                                <p className="text-slate-700 font-medium">{reg}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-slate-700 font-medium">
                            {data.status}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regulations" className="mt-0">
                <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                  <h3 className="text-xl font-playfair mb-4">All Regulations</h3>
                  {isLoading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedRegulations && savedRegulations.length > 0 ? (
                        savedRegulations.map(reg => (
                          <div key={reg.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <Link to={`/legislation/${reg.regulation_id}`} className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-slate-900">{reg.regulations.name}</h4>
                                <p className="text-sm text-slate-600 mt-1">{reg.status}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-slate-600">No regulations found. Run an assessment to get started.</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-0">
                <div className="bg-white rounded-xl p-6 border border-slate-200/50">
                  <h3 className="text-xl font-playfair mb-4">Tasks</h3>
                  <div className="space-y-3">
                    <p className="text-center py-6 text-slate-600">No tasks assigned. Create a new task to get started.</p>
                    <div className="flex justify-center">
                      <Button className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create New Task
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Recent Updates Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-playfair text-slate-900 mb-6">Recent Regulatory Updates</h2>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-slate-200/50 hover:border-slate-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          update.category === "Data Privacy" ? "bg-amber-400" :
                          update.category === "Financial" ? "bg-amber-500" :
                          update.category === "Healthcare" ? "bg-blue-400" :
                          "bg-blue-500"
                        }`}></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900">{update.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{update.description}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-500">{update.impact}</span>
                            <span className="text-xs text-slate-500">{update.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-playfair text-slate-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start p-3 font-medium text-base">
                    <Search className="h-5 w-5 mr-3" />
                    Search Regulations
                  </Button>
                  <Button variant="outline" className="w-full justify-start p-3 font-medium text-base">
                    <ClipboardCheck className="h-5 w-5 mr-3" />
                    Run Compliance Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start p-3 font-medium text-base">
                    <FileText className="h-5 w-5 mr-3" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start p-3 font-medium text-base">
                    <PlusCircle className="h-5 w-5 mr-3" />
                    Create Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start p-3 font-medium text-base">
                    <BarChart className="h-5 w-5 mr-3" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
