
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="min-h-screen">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;
