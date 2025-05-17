
import React from "react";
import { Footer } from "@/components/blocks/footer";
import { TimelineDemo } from "@/components/ui/timeline-demo";
import SiteNavbar from "@/components/navigation/SiteNavbar";

const About = () => {
  return (
    <div className="min-h-screen">
      <SiteNavbar />
      <div className="pt-24 container mx-auto py-8">
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
