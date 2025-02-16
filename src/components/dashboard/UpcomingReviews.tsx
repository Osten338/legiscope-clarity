
import { Calendar, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

interface SavedRegulation {
  id: string;
  next_review_date: string | null;
  regulations: {
    id: string;
    name: string;
  } | null;
}

interface UpcomingReviewsProps {
  savedRegulations: SavedRegulation[];
}

export const UpcomingReviews = ({ savedRegulations }: UpcomingReviewsProps) => {
  return (
    <Card className="mb-8 border-none shadow-sm bg-gradient-to-br from-[#E5DEFF] to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#403E43] font-serif">
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
                className="flex items-center justify-between p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-[#8A898C]" />
                  <div>
                    <h4 className="font-medium text-[#403E43]">{saved.regulations.name}</h4>
                    <p className="text-sm text-[#8A898C]">
                      Review due: {format(new Date(saved.next_review_date!), 'PPP')}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#8A898C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
