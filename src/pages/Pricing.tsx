
import React from "react";
import { Pricing } from "@/components/ui/pricing-cards";
import { Footer } from "@/components/blocks/footer";
import LandingNavbar from "@/components/landing/LandingNavbar";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
