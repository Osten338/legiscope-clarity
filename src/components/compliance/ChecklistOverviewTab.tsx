
import React from "react";
import { Button } from "@/components/ui/button";

interface RegulationType {
  id: string;
  name: string;
  description: string;
  checklist_items: any[];
}

interface ChecklistOverviewTabProps {
  regulations: RegulationType[];
  onRegulationSelect: (id: string) => void;
}

export const ChecklistOverviewTab: React.FC<ChecklistOverviewTabProps> = ({ 
  regulations, 
  onRegulationSelect 
}) => {
  if (!regulations || regulations.length === 0) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-100 rounded-lg mt-4">
        <h3 className="text-lg font-medium text-amber-800 mb-2">No regulations found</h3>
        <p className="text-amber-700 mb-4">
          It looks like you don't have any regulations in your system yet. 
          Try performing a business analysis first to get personalized regulations.
        </p>
        <Button asChild>
          <a href="/assessment">Perform Business Analysis</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <div className="space-y-4">
        <p>Select a regulation from the tabs above to view its checklist.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {regulations.map((reg) => {
            // Calculate expert-verified percentage
            const totalItems = reg.checklist_items?.length || 0;
            const expertVerified = reg.checklist_items?.filter(item => item.expert_verified)?.length || 0;
            const expertVerifiedPercentage = totalItems > 0 ? Math.round((expertVerified / totalItems) * 100) : 0;
            
            // Calculate subtasks count
            const subtasksCount = reg.checklist_items?.reduce((count, item) => 
              count + (Array.isArray(item.subtasks) ? item.subtasks.length : 0), 0) || 0;
            
            return (
              <div 
                key={reg.id} 
                className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer"
                onClick={() => onRegulationSelect(reg.id)}
              >
                <h3 className="font-medium text-lg">{reg.name}</h3>
                <p className="text-slate-600 mt-2 text-sm line-clamp-3">{reg.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sage-600 text-sm">
                    {totalItems + subtasksCount} checklist items
                  </span>
                  {expertVerified > 0 && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {expertVerifiedPercentage}% Expert-verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
