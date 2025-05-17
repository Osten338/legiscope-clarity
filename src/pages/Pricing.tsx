
import React from "react";
import { Pricing } from "@/components/ui/pricing-cards";
import { Footer } from "@/components/blocks/footer";
import SiteNavbar from "@/components/navigation/SiteNavbar";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
