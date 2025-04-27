
import { Card } from "@/components/ui/card";
import { StatusCard } from "./StatusCard";

const statusCards = [
  {
    id: "compliant",
    title: "Compliant",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-[#8BC34A] via-[#4CAF50] to-[#2E7D32]"
  },
  {
    id: "in_progress",
    title: "In Progress",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-[#FFC107] via-[#FFC107] to-[#FF9800]"
  },
  {
    id: "not_compliant",
    title: "Not Compliant",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-[#F44336] via-[#E53935] to-[#B71C1C]"
  },
  {
    id: "under_review",
    title: "Under Review",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&w=1080",
    gradient: "bg-gradient-to-b from-[#2196F3] via-[#1976D2] to-[#0D47A1]"
  }
];

interface StatusOverviewProps {
  savedRegulations: any[];
}

export const StatusOverview = ({ savedRegulations }: StatusOverviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statusCards.map((card) => {
        const count = savedRegulations?.filter(reg => reg.status === card.id).length || 0;
        return (
          <Card 
            key={card.id} 
            className={`h-[200px] overflow-hidden border animate-appear hover:shadow-lg transition-shadow duration-300 ${card.gradient}`}
          >
            <StatusCard {...card} count={count} />
          </Card>
        );
      })}
    </div>
  );
};
