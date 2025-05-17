
import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/blocks/footer";
import { TimelineDemo } from "@/components/ui/timeline-demo";

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4">
        <nav className="flex justify-end gap-6">
          <Link to="/" className="text-primary hover:underline">Home</Link>
          <Link to="/about" className="text-primary hover:underline">About</Link>
        </nav>
      </div>
      <div className="container mx-auto py-8">
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
