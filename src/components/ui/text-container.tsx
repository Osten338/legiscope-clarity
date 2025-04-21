
import { cn } from "@/lib/utils";
import React from "react";

interface TextContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  hover?: boolean;
}

export function TextContainer({
  children,
  className,
  as: Component = "div",
  hover = false,
}: TextContainerProps) {
  return (
    <Component
      className={cn(
        "bg-slate-50 rounded-2xl p-6 md:p-8 shadow-sm",
        hover && "hover:shadow-md hover:scale-[1.01] transition-all duration-300",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("uppercase text-xs font-medium tracking-wider text-neutral-500 mb-2 block", className)}>
      {children}
    </span>
  );
}

export function ContentDivider({ className }: { className?: string }) {
  return <hr className={cn("border-b border-slate-200 my-6", className)} />;
}
