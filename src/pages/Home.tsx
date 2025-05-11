
import React from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall } from "lucide-react";
import { Process, Work, Achievements } from "@/components/ui/cards-stack-demo";
import { Testimonials } from "@/components/ui/testimonials-demo";

const Home = () => {
  // Updated media content for the hero section with video
  const heroContent = {
    src: "https://cdn.jsdelivr.net/gh/joakimnenzen/vargas/aira_flying_cloth_lightroom_1-1.mp4",
    background: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop",
    title: "Compliance Made Simple",
    date: "Regulatory Intelligence",
    scrollToExpand: "Scroll to Explore"
  };
  return <div className="min-h-screen bg-background">
      <ScrollExpandMedia mediaType="video" mediaSrc={heroContent.src} bgImageSrc={heroContent.background} title={heroContent.title} date={heroContent.date} scrollToExpand={heroContent.scrollToExpand} />
      
      <div className="max-w-4xl mx-auto">
        
      </div>

      {/* Card Stack Components */}
      <Process />
      <Work />
      <Testimonials />
      <Achievements />
    </div>;
};
export default Home;
