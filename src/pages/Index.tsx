
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="relative">
      <AnimatedBackground />
      <div className="relative min-h-screen z-[1]">
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;
