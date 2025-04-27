
import { cn } from "@/lib/utils";

interface StatusCardProps {
  id: string;
  title: string;
  count: number;
  image: string;
  gradient?: string;
  className?: string;
}

export const StatusCard = ({ title, count, image, gradient, className }: StatusCardProps) => {
  return (
    <div className="group relative h-full max-w-full overflow-hidden rounded-xl">
      <img
        src={image}
        alt={title}
        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
      <div className={cn(
        "absolute inset-0 mix-blend-multiply", 
        gradient || "bg-gradient-to-b from-[#8BC34A] via-[#4CAF50] to-[#2E7D32]"
      )} />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-4">
        <div className="mb-2 text-lg font-semibold text-white">
          {title}
        </div>
        <div className="text-3xl font-bold text-white mono">
          {count}
        </div>
      </div>
    </div>
  );
};
