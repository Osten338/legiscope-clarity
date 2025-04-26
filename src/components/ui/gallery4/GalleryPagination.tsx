
interface GalleryPaginationProps {
  items: any[];
  currentSlide: number;
  onDotClick: (index: number) => void;
}

export const GalleryPagination = ({
  items,
  currentSlide,
  onDotClick,
}: GalleryPaginationProps) => {
  return (
    <div className="mt-8 flex justify-center gap-2">
      {items.map((_, index) => (
        <button
          key={index}
          className={`h-2 w-2 rounded-full transition-colors ${
            currentSlide === index ? "bg-primary" : "bg-primary/20"
          }`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};
