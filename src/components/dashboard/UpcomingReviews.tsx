
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
  const upcomingReviews = savedRegulations
    ?.filter(saved => saved.next_review_date && new Date(saved.next_review_date) > new Date())
    .sort((a, b) => new Date(a.next_review_date!).getTime() - new Date(b.next_review_date!).getTime())
    .slice(0, 3);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  ];

  return (
    <Card className="mb-8 border bg-card animate-appear delay-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" />
            <h2 className="text-2xl font-semibold text-foreground">Upcoming Reviews</h2>
          </div>
          <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
            {upcomingReviews.length} pending
          </Badge>
        </div>

        {upcomingReviews.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {upcomingReviews.map((review, index) => (
                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-[200px] w-full overflow-hidden rounded-xl group">
                    <img
                      src={backgroundImages[index % backgroundImages.length]}
                      alt={review.regulations?.name}
                      className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {review.regulations?.name}
                      </h3>
                      <p className="text-white/90 text-sm">
                        Due: {format(new Date(review.next_review_date!), 'PPP')}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming reviews</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
