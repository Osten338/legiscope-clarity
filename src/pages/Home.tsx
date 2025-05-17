
import React from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/blocks/hero-section-1";
import { Footer } from "@/components/blocks/footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4">
        <nav className="flex justify-end gap-6">
          <Link to="/" className="text-primary hover:underline">Home</Link>
          <Link to="/about" className="text-primary hover:underline">About</Link>
        </nav>
      </div>
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Home;
