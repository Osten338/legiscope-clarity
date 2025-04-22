
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { GradientText } from "@/components/ui/gradient-text";
import { WavyBackground } from "@/components/ui/wavy-background";
import DisplayCards from "@/components/ui/display-cards";
import { Check, FileText, Users } from "lucide-react";

export const LandingHero = () => {
  return <WavyBackground className="w-full" containerClassName="relative w-full min-h-[85vh]" colors={["#38bdf8", "#818cf8", "#c084fc", "#22d3ee"]} waveWidth={100} backgroundFill="black" blur={10} speed="slow" waveOpacity={0.5}>
      <section className="relative w-full pt-32 pb-20 px-4 md:px-8 lg:px-0 flex items-center min-h-[85vh]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10 relative">
          {/* Subtle abstract shape overlays */}
          <div aria-hidden="true" className="absolute -top-16 -left-20 w-72 h-72 rounded-full blur-3xl opacity-30 bg-brand-blue" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 bg-indigo-900" />
          <div className="lg:w-1/2 text-white">
            <ScrollReveal>
              <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-brand-blue text-sm font-medium border border-white/10">
                Your Compliance Operations, Simplified
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold leading-tight mb-6">
                <GradientText className="font-inter text-zinc-50 font-bold tracking-tighter">
                  Clarity for your compliance operations
                </GradientText>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl max-w-xl mb-8 leading-relaxed text-white/80 font-inter">
                Effortlessly manage regulatory requirements with an intuitive platform designed to simplify complex compliance tasks.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
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

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }} className="lg:w-1/2">
            <div className="w-full">
              <DisplayCards />
            </div>
          </motion.div>
        </div>
      </section>
    </WavyBackground>;
};
