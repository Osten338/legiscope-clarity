import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";

export const LandingHero = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-sage-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <div className="text-sm font-medium text-sage-600 mb-4">
            Regulatory Compliance Made Simple
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
            Simplify Regulatory Compliance
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            Monitor, manage, and maintain compliance across industries and jurisdictions with our all-in-one platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-sage-600 hover:bg-sage-700">
              <Link to="/auth" className="flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Request Demo</a>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg border p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-sage-600">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-medium">Compliance Dashboard</h3>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded-full w-full"></div>
              <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
              <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="h-20 bg-slate-100 rounded-md"></div>
                <div className="h-20 bg-slate-100 rounded-md"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
