
"use client";

import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryItem } from "./GalleryItem";
import { GalleryPagination } from "./GalleryPagination";
import type { Gallery4Props } from "./types";

export { type Gallery4Item } from "./types";

export function Gallery4({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  items,
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
    <section className="py-32 w-full overflow-hidden">
      <div className="container mx-auto">
        <GalleryHeader
          title={title}
          description={description}
          carouselApi={carouselApi}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
        />
      </div>
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
