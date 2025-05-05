
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

type RegulationDetails = {
  id: string;
  name: string;
  description: string;
};

type SavedRegulation = {
  id: string;
  status: string;
  progress: number;
  regulations: RegulationDetails;
};

export const ComplianceTasks = ({ savedRegulations }: { savedRegulations: SavedRegulation[] }) => {
  const [activeTab, setActiveTab] = useState("all");
  const backgroundImages = {
    all: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    completed: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    pending: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  };

  // Debug tab changes
  useEffect(() => {
    console.log("ComplianceTasks: Active tab state:", activeTab);
  }, [activeTab]);

  // Use useCallback to stabilize the handler function reference
  const handleTabChange = useCallback((value: string) => {
    console.log("ComplianceTasks: Tab change handler called with value:", value);
    // Prevent any default behavior
    setActiveTab(value);
  }, []);

  // Log component render
  console.log("ComplianceTasks rendering with activeTab:", activeTab);

  // Filter regulations based on active tab
  const filteredRegulations = useCallback(() => {
    console.log("Filtering regulations for tab:", activeTab);
    switch (activeTab) {
      case "completed":
        return savedRegulations.filter(reg => reg.status === 'compliant');
      case "pending":
        return savedRegulations.filter(reg => reg.status !== 'compliant');
      case "all":
      default:
        return savedRegulations;
    }
  }, [activeTab, savedRegulations]);

  const TaskList = ({ items }: { items: SavedRegulation[] }) => {
    console.log("TaskList rendering with", items.length, "items");
    
    return (
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.length > 0 ? (
            items.map((task) => (
              <CarouselItem key={task.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative h-[200px] w-full overflow-hidden rounded-xl group">
                  <img
                    src={backgroundImages.all}
                    alt={task.regulations?.name}
                    className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 mix-blend-multiply" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {task.regulations?.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/90 text-sm">
                        Progress: {task.progress}%
                      </p>
                      <span className="text-white/90 text-sm capitalize">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="md:basis-full">
              <div className="h-[200px] w-full flex items-center justify-center bg-slate-50 rounded-xl">
                <p className="text-slate-500">No items to display</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    );
  };

  // Calculate filtered items for each tab once per render to avoid recalculation
  const allItems = savedRegulations;
  const completedItems = savedRegulations.filter(reg => reg.status === 'compliant');
  const pendingItems = savedRegulations.filter(reg => reg.status !== 'compliant');

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-brand" />
          <h2 className="text-2xl font-semibold text-foreground">Compliance Tasks</h2>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all" data-testid="tab-all">
              <Clock className="mr-2 h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Pending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TaskList items={allItems} />
          </TabsContent>

          <TabsContent value="completed">
            <TaskList items={completedItems} />
          </TabsContent>

          <TabsContent value="pending">
            <TaskList items={pendingItems} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
