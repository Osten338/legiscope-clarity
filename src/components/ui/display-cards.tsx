
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
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-32 w-[22rem] select-none flex-col justify-between rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-4 transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] [&>*]:flex [&>*]:items-center [&>*]:gap-3",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-flex p-2 rounded-full bg-blue-100", iconClassName)}>
          {icon}
        </span>
        <h3 className={cn("text-xl font-medium text-gray-800", titleClassName)}>{title}</h3>
      </div>
      <p className="text-gray-600 text-lg">{description}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-2 transition-all duration-300",
    },
    {
      className: "[grid-area:stack] translate-x-8 translate-y-4 hover:translate-y-2 transition-all duration-300",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-8 hover:translate-y-6 transition-all duration-300",
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
