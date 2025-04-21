
"use client";

import { cn } from "@/lib/utils";

interface MockupFrameProps {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function MockupFrame({ children, className, size = "medium" }: MockupFrameProps) {
  const sizeClasses = {
    small: "max-w-4xl",
    medium: "max-w-5xl",
    large: "max-w-6xl",
  };

  return (
    <div className={cn("relative mx-auto w-full rounded-2xl", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-white/10" />
      <div className="relative rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
        {children}
      </div>
    </div>
  );
}

interface MockupProps {
  children: React.ReactNode;
  type?: "window" | "responsive";
  className?: string;
}

export function Mockup({ children, type = "window", className }: MockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-gradient-to-b from-neutral-900/90 to-neutral-900/80 shadow-2xl",
        type === "window" && "border border-white/10",
        className
      )}
    >
      {type === "window" && (
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
