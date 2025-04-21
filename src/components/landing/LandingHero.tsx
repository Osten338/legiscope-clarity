
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const LandingHero = () => {
  return (
    <section className="relative w-full pt-32 pb-20 px-4 md:px-8 lg:px-0 flex items-center min-h-[85vh] bg-black/60 backdrop-blur-sm z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="lg:w-1/2 text-white">
          <ScrollReveal>
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-brand-blue text-sm font-medium border border-white/10">
              Your Compliance Operations, Simplified
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-ibm-plex-sans font-bold leading-tight mb-6">
              Clarity for your compliance operations
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl max-w-xl mb-8 leading-relaxed text-white/80">
              Effortlessly manage regulatory requirements with an intuitive platform designed to simplify complex compliance tasks.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 px-8 py-6 text-base rounded-md shadow-md font-semibold text-white">
                <Link to="/auth" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent border border-white/20 text-white hover:bg-white/10">
                <Link to="#features">See Features</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:w-1/2 flex justify-center"
        >
          <div className="relative bg-gradient-to-br from-black/70 to-black/40 border border-white/10 shadow-xl rounded-xl px-6 py-8 w-full max-w-md">
            <div className="text-white/90 flex items-center gap-2 mb-3">
              <span className="font-medium">Compliance Dashboard</span>
            </div>
            <div className="space-y-4">
              <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
              <div className="h-3 bg-white/10 rounded-full w-5/6"></div>
              <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="h-20 bg-brand-blue/20 rounded-lg"></div>
                <div className="h-20 bg-white/5 border border-white/10 rounded-lg"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="h-3 w-3 bg-amber-400 rounded-full"></div>
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
