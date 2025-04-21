
import LandingNavbar from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LegislationUpdates } from "@/components/landing/LegislationUpdates";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { AuroraBackground } from "@/components/landing/AuroraBackground";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10">
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
    </div>
  );
};

export default LandingPage;
