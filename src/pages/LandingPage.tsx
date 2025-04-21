
import LandingNavbar from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LegislationUpdates } from "@/components/landing/LegislationUpdates";
import { LandingFooter } from "@/components/landing/LandingFooter";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeatureCards />
        <KeyFeatures />
        <LegislationUpdates />
        <PricingPlans />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
