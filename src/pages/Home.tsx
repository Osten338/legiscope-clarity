
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { KeyFeatures } from "@/components/landing/KeyFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <KeyFeatures />
      <LandingFooter />
    </div>
  );
};

export default Home;
