
'use client';
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
 
export function SplineHero() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-none">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-brand-blue text-sm font-medium border border-white/10">
            Your Compliance Operations, Simplified
          </span>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Clarity for your compliance operations
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Effortlessly manage regulatory requirements with an intuitive platform designed to simplify complex compliance tasks.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
