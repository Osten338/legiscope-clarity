
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-neutral-700" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-neutral-700",
  titleClassName = "text-neutral-700",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all duration-700 shadow-sm hover:shadow-md [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="relative inline-block rounded-full bg-neutral-100 p-1">
          {icon}
        </span>
        <p className={cn("text-lg font-medium", titleClassName)}>{title}</p>
      </div>
      <p className="text-lg text-neutral-600 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{description}</p>
      <p className="text-neutral-500 text-sm">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      title: "Featured",
      description: "Discover amazing content",
      className: "[grid-area:stack] hover:-translate-y-10",
    },
    {
      title: "Popular",
      description: "Trending updates",
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1",
    },
    {
      title: "New",
      description: "Latest updates and features",
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
