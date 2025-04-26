
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarouselApi } from "@/components/ui/carousel";

interface GalleryNavigationProps {
  carouselApi: CarouselApi | null;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export const GalleryNavigation = ({
  carouselApi,
  canScrollPrev,
  canScrollNext,
}: GalleryNavigationProps) => {
  return (
    <div className="hidden shrink-0 gap-2 md:flex">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          carouselApi?.scrollPrev();
        }}
        disabled={!canScrollPrev}
        className="disabled:pointer-events-auto"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          carouselApi?.scrollNext();
        }}
        disabled={!canScrollNext}
        className="disabled:pointer-events-auto"
      >
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
};
