
import { Card } from "@/components/ui/card";
import { StatusCard } from "./StatusCard";

// Status card definitions with appropriate images and gradients
const statusCards = [
  {
    id: "compliant",
    title: "Compliant",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-green-400 via-green-500 to-green-600"
  },
  {
    id: "in_progress",
    title: "In Progress",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600"
  },
  {
    id: "not_compliant",
    title: "Not Compliant",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-red-400 via-red-500 to-red-600"
  },
  {
    id: "under_review",
    title: "Under Review",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600"
  }
];

interface StatusOverviewProps {
  savedRegulations: any[];
}

export const StatusOverview = ({ savedRegulations }: StatusOverviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statusCards.map((card) => {
        const count = savedRegulations?.filter(reg => reg.status === card.id).length || 0;
        return (
          <Card 
            key={card.id} 
            className="h-[150px] overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <StatusCard {...card} count={count} />
          </Card>
        );
      })}
    </div>
  );
};
