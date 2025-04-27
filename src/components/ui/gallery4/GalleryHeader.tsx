
import React from 'react';
import type { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <Button
          variant="outline"
          size="icon"
          disabled={!canScrollPrev}
          onClick={() => carouselApi?.scrollPrev()}
          className="h-8 w-8 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!canScrollNext}
          onClick={() => carouselApi?.scrollNext()}
          className="h-8 w-8 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
