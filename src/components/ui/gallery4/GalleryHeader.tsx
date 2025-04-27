
import React from 'react';
import type { CarouselApi } from "@/components/ui/carousel";
import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface GalleryHeaderProps {
  title: string;
  description: string;
  carouselApi?: CarouselApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function GalleryHeader({
  title,
  description,
  carouselApi,
  canScrollPrev,
  canScrollNext,
  titleClassName = "text-black",
  descriptionClassName = "text-gray-600"
}: GalleryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <h2 className={`text-2xl font-semibold ${titleClassName}`}>
          {title}
        </h2>
        <p className={`text-base ${descriptionClassName}`}>
          {description}
        </p>
      </div>
      <div className="flex space-x-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </div>
  );
}
