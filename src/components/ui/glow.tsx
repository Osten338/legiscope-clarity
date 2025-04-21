
"use client";

import { cn } from "@/lib/utils";

interface GlowProps {
  variant?: "bottom" | "top";
  className?: string;
}

export function Glow({ variant = "bottom", className }: GlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-0",
        variant === "bottom" ? "-bottom-20" : "-top-20",
        "h-40 select-none bg-gradient-to-t from-brand-blue/20 blur-2xl",
        className
      )}
    />
  );
}
