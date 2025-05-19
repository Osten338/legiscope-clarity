
import React from "react";
import { ChecklistItem } from "@/components/compliance/ChecklistItem";

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
  checklist_items: ChecklistItemType[];
}

interface RegulationTabContentProps {
  regulation: RegulationType;
}

export const RegulationTabContent: React.FC<RegulationTabContentProps> = ({ regulation }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{regulation.name} Checklist</h2>
      <p className="text-slate-600 mb-6">{regulation.description}</p>
      
      {regulation.checklist_items && regulation.checklist_items.length > 0 ? (
        <div className="space-y-6">
          {regulation.checklist_items.map((item) => (
            <div key={item.id} className="space-y-4">
              <ChecklistItem 
                id={item.id} 
                description={item.description} 
                importance={item.importance}
                category={item.category}
                estimatedEffort={item.estimated_effort}
                regulationId={regulation.id}
                regulationName={regulation.name}
                regulationDescription={regulation.description}
                expertVerified={item.expert_verified}
                response={item.response}
                task={item.task}
                bestPractices={item.best_practices}
                department={item.department}
                subtasks={item.subtasks}
                isSubtask={item.is_subtask}
              />
              
              {/* Render subtasks directly from subtasks array */}
              {item.subtasks && item.subtasks.length > 0 && (
                <div className="space-y-3">
                  {item.subtasks.map(subtask => (
                    <ChecklistItem
                      key={subtask.id}
                      id={subtask.id}
                      description={subtask.description}
                      task={subtask.task}
                      bestPractices={subtask.best_practices}
                      department={subtask.department}
                      importance={subtask.importance}
                      category={subtask.category}
                      estimatedEffort={subtask.estimated_effort}
                      regulationId={regulation.id}
                      regulationName={regulation.name}
                      regulationDescription={regulation.description}
                      expertVerified={subtask.expert_verified}
                      response={subtask.response}
                      isSubtask={true}
                      showParentInfo={true}
                      parentDescription={item.task || item.description}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 italic">No checklist items found for this regulation.</p>
      )}
    </div>
  );
};
