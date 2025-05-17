
import React from "react";
import { Pricing } from "@/components/ui/pricing-cards";
import { Footer } from "@/components/blocks/footer";
import SiteNavbar from "@/components/navigation/SiteNavbar";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="pt-24 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-3">Simple, Transparent Pricing</h1>
        <p className="text-lg text-center mb-8 max-w-2xl mx-auto">
          Choose the plan that best fits your compliance needs. From startups to enterprise organizations, we have solutions that scale with your business.
        </p>
      </div>
      <div className="pb-12">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
