
import { useState } from "react";
import { 
  Search,
  FileText, 
  Upload,
  Brain,
  PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "dark";
}

function ActionCard({ title, description, icon, color }: ActionCardProps) {
  return (
    <Card className={cn(
      "p-6 h-full transition-all hover:scale-[1.02] cursor-pointer",
      color === "blue" 
        ? "bg-blue-600 text-white hover:bg-blue-700" 
        : "bg-gray-800 text-white hover:bg-gray-900"
    )}>
      <div className="flex flex-col h-full">
        <div className="mb-4 p-2 bg-white/10 rounded-lg w-fit">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";

export function DashboardHome() {
  const [activeContractTab, setActiveContractTab] = useState("all");
  const [activeTaskTab, setActiveTaskTab] = useState("todo");
  
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back Olof</h1>
        <p className="text-muted-foreground mt-1">Here are a few items for your review</p>
        <Badge className="mt-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900">
          20 upcoming notice dates
        </Badge>
      </div>
      
      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          title="Review contract with AI"
          description="Upload a contract to analyze it with our AI assistant"
          icon={<Brain className="h-6 w-6 text-white" />}
          color="blue"
        />
        <ActionCard
          title="Create a document"
          description="Draft a new contract or legal document"
          icon={<FileText className="h-6 w-6 text-white" />}
          color="dark"
        />
        <ActionCard
          title="Upload documents"
          description="Add existing documents to your repository"
          icon={<Upload className="h-6 w-6 text-white" />}
          color="dark"
        />
        <ActionCard
          title="Send for eSignature"
          description="Request signatures for your documents"
          icon={<PenTool className="h-6 w-6 text-white" />}
          color="dark"
        />
      </div>
      
      {/* Contracts workflow section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Contract workflow</h2>
            <p className="text-muted-foreground text-sm">Manage your contract lifecycle</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="h-10 w-full sm:w-[240px] pl-9 pr-3 rounded-md border border-input bg-transparent text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <select className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="my">My documents</option>
                <option value="team">Team documents</option>
                <option value="all">All documents</option>
              </select>
              
              <select className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>All time</option>
              </select>
            </div>
          </div>
        </div>
        
        <Tabs value={activeContractTab} onValueChange={setActiveContractTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="signature">Signature</TabsTrigger>
            <TabsTrigger value="finalized">Finalized</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          {/* Empty state */}
          <TabsContent value={activeContractTab} className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                You don't have any contracts in this category yet. Create your first contract to get started.
              </p>
              <Button>Create document</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Tasks section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Tasks</h2>
            <p className="text-muted-foreground text-sm">Manage your to-do items</p>
          </div>
          
          <Button variant="outline" size="sm">Show all</Button>
        </div>
        
        <Tabs value={activeTaskTab} onValueChange={setActiveTaskTab}>
          <TabsList>
            <TabsTrigger value="todo">To-do</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTaskTab} className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {activeTaskTab === "todo" ? "No pending tasks" : "Well done!"}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {activeTaskTab === "todo" 
                  ? "You don't have any pending tasks at the moment." 
                  : "You've completed all your tasks. Time to celebrate!"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
