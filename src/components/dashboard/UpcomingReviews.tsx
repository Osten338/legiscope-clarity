
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-sage-600" />
                  <div>
                    <h4 className="font-medium text-slate-900">{saved.regulations.name}</h4>
                    <p className="text-sm text-slate-600">
                      Review due: {format(new Date(saved.next_review_date!), 'PPP')}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
