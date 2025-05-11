
import React from "react";
import { Hero1 } from "@/components/ui/hero-with-text-and-two-button";
import { Waves } from "@/components/ui/waves-background";
import { useTheme } from "@/components/ui/use-theme";
import { TopbarMenu } from "@/components/landing/TopbarMenu";

const Home = () => {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Topbar Menu */}
      <TopbarMenu />
      
      {/* Waves background */}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor={resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.01}
          waveAmpX={35}
          waveAmpY={18}
          friction={0.92}
          tension={0.008}
          maxCursorMove={100}
          xGap={12}
          yGap={38}
        />
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 pt-16">
        <Hero1 />
      </div>
    </div>
  );
};

export default Home;
