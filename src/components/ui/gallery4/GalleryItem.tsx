
import { ArrowRight } from "lucide-react";
import { CarouselItem } from "@/components/ui/carousel";
import type { Gallery4Item } from "./types";

interface GalleryItemProps {
  item: Gallery4Item;
}

export const GalleryItem = ({ item }: GalleryItemProps) => {
  return (
    <CarouselItem className="md:basis-1/2 lg:basis-1/3 px-4">
      <a href={item.href} className="group rounded-xl">
        <div className="group relative h-full min-h-[27rem] overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
          <img
            src={item.image}
            alt={item.title}
            className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.7))] mix-blend-multiply" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
            <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4 text-white">
              {item.title}
            </div>
            <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9 text-white">
              {item.description}
            </div>
            <div className="flex items-center text-sm text-white">
              Read more{" "}
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </CarouselItem>
  );
};
