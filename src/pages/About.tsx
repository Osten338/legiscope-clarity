
import React from "react";
import { Footer } from "@/components/blocks/footer";
import { TimelineDemo } from "@/components/ui/timeline-demo";
import SiteNavbar from "@/components/navigation/SiteNavbar";

const About = () => {
  return (
    <div className="min-h-screen">
      <SiteNavbar />
      <div className="pt-24 container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Our Compliance Journey</h1>
        <p className="text-lg mb-4">
          CompliAI was founded by legal and technology experts committed to simplifying regulatory compliance for businesses of all sizes. We understand the challenges organizations face when navigating complex regulatory landscapes.
        </p>
        <p className="text-lg mb-8">
          Our AI-powered platform transforms how businesses approach compliance - moving from reactive checkbox exercises to proactive, strategic management. Below is our journey of innovation in the compliance space.
        </p>
      </div>
      <TimelineDemo />
      <Footer />
    </div>
  );
};

export default About;
