
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
    <Card className="mb-8 border bg-card animate-appear delay-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-semibold text-foreground font-inter flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand" />
          Upcoming Reviews
        </CardTitle>
        <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
          {savedRegulations?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date()).length || 0} pending
        </Badge>
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
                className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground font-inter">{saved.regulations.name}</h4>
                    <p className="text-sm text-muted-foreground font-inter">
                      Due: {format(new Date(saved.next_review_date!), 'PPP')}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            ))}

          {savedRegulations?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date()).length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground font-inter">No upcoming reviews</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
