
import { cn } from "@/lib/utils";

interface StatusCardProps {
  id: string;
  title: string;
  count: number;
  image: string;
  className?: string;
}

export const StatusCard = ({ title, count, image, className }: StatusCardProps) => {
  return (
    <div className="group relative h-full max-w-full overflow-hidden rounded-xl">
      <img
        src={image}
        alt={title}
        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
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
