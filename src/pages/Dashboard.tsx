import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { Gallery4, Gallery4Item } from "@/components/ui/gallery4";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";

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

const Dashboard = () => {
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
    staleTime: 10000,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const galleryItems: Gallery4Item[] = [
    {
      id: "compliance-overview",
      title: "Compliance Overview",
      description: "Get a comprehensive view of your organization's compliance status across all relevant regulations.",
      href: "/compliance-overview",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Identify, analyze, and evaluate potential compliance risks within your business operations.",
      href: "/risk-assessment",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
    },
    {
      id: "documentation-center",
      title: "Documentation Center",
      description: "Access and manage all your compliance documentation in one centralized location.",
      href: "/documentation",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
    },
    {
      id: "compliance-chat",
      title: "Compliance Assistant",
      description: "Get instant answers to your compliance questions with our AI-powered compliance assistant.",
      href: "/compliance-chat",
      image: "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjR8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
    },
    {
      id: "upcoming-reviews",
      title: "Upcoming Reviews",
      description: "Stay ahead of compliance deadlines with a clear view of upcoming regulatory reviews.",
      href: "/upcoming-reviews",
      image: "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <WelcomeSection />
        <Gallery4 
          title="Compliance Resources"
          description="Access key compliance tools and resources to help your business stay compliant with all relevant regulations."
          items={galleryItems}
          titleClassName="text-black"
          descriptionClassName="text-gray-600"
        />
        <ComplianceOverview />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
