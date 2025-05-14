
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function StudioHero() {
  return (
    <div className="relative min-h-screen bg-neutral-100 dark:bg-neutral-950 mt-16 md:mt-0">
      <div className="relative">
        <div className="min-h-screen max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
            <div className="relative z-10 py-20 lg:py-0">
              <div className="space-y-8 max-w-xl">
                <div className="space-y-4">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
                    Create
                    <span className="text-[#FF4D4D]">
                      .
                    </span>
                    <br />
                    Design
                    <span className="text-[#FF4D4D]">
                      .
                    </span>
                    <br />
                    Build
                    <span className="text-[#FF4D4D]">
                      .
                    </span>
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md">
                    We craft digital experiences that
                    inspire, engage, and deliver exceptional
                    results for forward-thinking brands.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="h-14 px-8 bg-[#FF4D4D] hover:bg-[#FF6666] 
                    text-white dark:text-white text-base group relative 
                    overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      View Our Work
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#FF4D4D] to-[#FF8080] 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 px-8 border-2 border-neutral-300 dark:border-neutral-800 
                    hover:bg-neutral-100 dark:hover:bg-neutral-900 text-base group relative"
                  >
                    <span className="relative z-10 flex items-center">
                      Get in Touch
                      <ArrowRight
                        className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 
                        group-hover:translate-x-1 transition-all"
                      />
                    </span>
                  </Button>
                </div>

                <div className="pt-12">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 font-medium">
                    Trusted by world-class companies
                  </p>
                  <div className="grid grid-cols-3 gap-8">
                    {[
                      { name: "Company 1", logo: "▲" },
                      { name: "Company 2", logo: "■" },
                      { name: "Company 3", logo: "●" },
                    ].map((company, i) => (
                      <div
                        key={i}
                        className="group flex items-center space-x-3 transition-opacity 
                        hover:opacity-75"
                      >
                        <span className="text-2xl text-neutral-400 dark:text-neutral-600">
                          {company.logo}
                        </span>
                        <span
                          className="text-sm font-medium text-neutral-600 
                          dark:text-neutral-400"
                        >
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-screen flex items-center">
              <div className="relative w-full aspect-square max-w-xl mx-auto">
                <div className="relative w-full h-full">
                  <img
                    src="/placeholder.svg"
                    alt="AI Voice Interface Illustration"
                    className="object-contain w-full h-full transform transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#FF4D4D]/10 to-transparent 
                    dark:from-[#FF4D4D]/5 rounded-3xl filter blur-3xl opacity-50 -z-10"
                  />
                  <div
                    className="absolute -inset-4 bg-gradient-to-br from-neutral-100/50 to-transparent 
                    dark:from-neutral-900/50 rounded-3xl filter blur-2xl opacity-50 -z-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
