
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { GradientText } from "@/components/ui/gradient-text";
import { WavyBackground } from "@/components/ui/wavy-background";
import { SplineHero } from "@/components/landing/SplineHero";

export const LandingHero = () => {
  return (
    <WavyBackground 
      className="w-full" 
      containerClassName="relative w-full min-h-[85vh]" 
      colors={["#38bdf8", "#818cf8", "#c084fc", "#22d3ee"]} 
      waveWidth={100} 
      backgroundFill="black" 
      blur={10} 
      speed="slow" 
      waveOpacity={0.5}
    >
      <section className="relative w-full pt-32 pb-20 px-4 md:px-8 lg:px-0 flex items-center min-h-[85vh]">
        <div className="max-w-7xl mx-auto z-10 relative w-full">
          <SplineHero />
          
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/auth" className="relative inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:bg-slate-800">
                <span>Start Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="#features" className="px-8 py-3 rounded-md border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors duration-200">
                See Features
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </WavyBackground>
  );
};
