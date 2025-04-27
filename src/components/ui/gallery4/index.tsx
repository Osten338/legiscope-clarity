"use client";

import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryItem } from "./GalleryItem";
import { GalleryPagination } from "./GalleryPagination";
import type { Gallery4Props, Gallery4Item } from "./types";

export type { Gallery4Props, Gallery4Item } from "./types";

export function Gallery4({
  title = "",
  description = "",
  items,
  titleClassName = "text-black",
  descriptionClassName = "text-gray-600",
}: Gallery4Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="w-full overflow-hidden">
      {(title || description) && (
        <GalleryHeader
          title={title}
          titleClassName={titleClassName}
          description={description}
          descriptionClassName={descriptionClassName}
          carouselApi={carouselApi}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
        />
      )}
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            containScroll: "trimSnaps",
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 sm:ml-4 md:ml-6 lg:ml-8 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </CarouselContent>
        </Carousel>
        <GalleryPagination
          items={items}
          currentSlide={currentSlide}
          onDotClick={(index) => carouselApi?.scrollTo(index)}
        />
      </div>
    </section>
  );
}
