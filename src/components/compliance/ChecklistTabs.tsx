
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChecklistOverviewTab } from "./ChecklistOverviewTab";
import { RegulationTabContent } from "./RegulationTabContent";

interface ChecklistItemType {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimated_effort?: string;
  expert_verified?: boolean;
  task?: string;
  best_practices?: string;
  department?: string;
  parent_id?: string | null;
  is_subtask: boolean;
  response?: {
    status: 'completed' | 'will_do' | 'will_not_do';
    justification?: string;
  };
  subtasks?: ChecklistItemType[];
}

interface RegulationType {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItemType[];
}

interface ChecklistTabsProps {
  regulations: RegulationType[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ChecklistTabs: React.FC<ChecklistTabsProps> = ({
  regulations,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
      defaultValue="overview" 
    >
      <TabsList className="mb-4">
        <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
        {regulations?.map((regulation) => (
          <TabsTrigger 
            key={regulation.id} 
            value={regulation.id}
            data-testid={`tab-regulation-${regulation.id}`}
          >
            {regulation.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-4">
        <TabsContent value="overview">
          <ChecklistOverviewTab 
            regulations={regulations} 
            onRegulationSelect={onTabChange} 
          />
        </TabsContent>
        {regulations?.map((regulation) => (
          <TabsContent key={regulation.id} value={regulation.id}>
            <RegulationTabContent regulation={regulation} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
