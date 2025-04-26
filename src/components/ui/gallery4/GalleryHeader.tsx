
import { GalleryNavigation } from "./GalleryNavigation";
import { CarouselApi } from "@/components/ui/carousel";

interface GalleryHeaderProps {
  title?: string;
  description?: string;
  carouselApi: CarouselApi | null;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export const GalleryHeader = ({
  title,
  description,
  carouselApi,
  canScrollPrev,
  canScrollNext,
}: GalleryHeaderProps) => {
  return (
    <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl text-white">
          {title}
        </h2>
        <p className="max-w-lg text-white">{description}</p>
      </div>
      <GalleryNavigation 
        carouselApi={carouselApi}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
      />
    </div>
  );
};
