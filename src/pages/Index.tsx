
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Hero />
      <Features />
    </div>
  );
};

export default Index;
