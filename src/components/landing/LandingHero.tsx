
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const LandingHero = () => {
  return (
    <section className="relative w-full pt-24 pb-16 px-4 md:px-8 lg:px-0 flex items-center min-h-[70vh]">
      {/* Subtle gradient bg and abstract shape overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 
          bg-gradient-to-br from-sage-50 to-white 
          pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="absolute -top-16 -left-20 w-72 h-72 rounded-full blur-3xl opacity-70 bg-purple-100"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-2xl opacity-60 bg-green-100"
      />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 z-10 relative">
        <div className="lg:w-1/2">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/80 text-sage-600 font-medium shadow">
            Modern Compliance, Delivered
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-slate-900 leading-tight mb-6 drop-shadow-sm">
            Smarter Compliance<br className="hidden md:block" /> For Modern Teams
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed">
            Effortlessly manage, monitor, and simplify your regulatory tasks with an all-in-one, beautifully simple compliance platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-sage-600 hover:bg-sage-700 px-8 text-base rounded-full shadow-md font-semibold">
              <Link to="/auth" className="flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-base bg-white/80 border-sage-200 shadow">
              <a href="#features">See Features</a>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          {/* Modern, soft dashboard card (decorative) */}
          <div className="relative bg-gradient-to-br from-white to-sage-100 border border-sage-100 shadow-xl rounded-3xl px-8 py-10 w-full max-w-md">
            <div className="text-sage-500 flex items-center gap-2 mb-3">
              <span className="font-medium">Compliance Snapshot</span>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-sage-200/60 rounded-full w-3/4"></div>
              <div className="h-4 bg-sage-100/90 rounded-full w-5/6"></div>
              <div className="h-4 bg-sage-200/80 rounded-full w-2/3"></div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="h-20 bg-sage-100 rounded-xl shadow"></div>
                <div className="h-20 bg-white border border-sage-100 rounded-xl shadow"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="h-3 w-3 bg-amber-400 rounded-full"></div>
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
