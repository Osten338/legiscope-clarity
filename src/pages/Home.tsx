
import React from "react";
import { HeroSection } from "@/components/blocks/hero-section-1";
import { Footer } from "@/components/blocks/footer";
import SiteNavbar from "@/components/navigation/SiteNavbar";

const Home = () => {
  return (
    <div className="min-h-screen">
      <SiteNavbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Home;
