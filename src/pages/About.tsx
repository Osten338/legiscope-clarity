
import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/blocks/footer";
import { TimelineDemo } from "@/components/ui/timeline-demo";
import LandingNavbar from "@/components/landing/LandingNavbar";

const About = () => {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <div className="container mx-auto py-8 pt-24">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg mb-8">
          Welcome to our journey. Below is a timeline of our key milestones and achievements.
        </p>
      </div>
      <TimelineDemo />
      <Footer />
    </div>
  );
};

export default About;
