
import { Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
    <Card className="mb-8 border-neutral-200 shadow-sm bg-card/80 backdrop-blur-md animate-appear delay-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand" />
          Upcoming Reviews
        </CardTitle>
        <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
          {savedRegulations?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date()).length || 0} pending
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedRegulations
            ?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date())
            .sort((a, b) => new Date(a.next_review_date!).getTime() - new Date(b.next_review_date!).getTime())
            .slice(0, 3)
            .map(saved => saved.regulations && (
              <div
                key={saved.id}
                className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{saved.regulations.name}</h4>
                    <p className="text-sm text-neutral-500">
                      Due: {format(new Date(saved.next_review_date!), 'PPP')}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            ))}

          {savedRegulations?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date()).length === 0 && (
            <div className="text-center py-6">
              <p className="text-neutral-500">No upcoming reviews</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
