import React from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/button";
import { MoveRight, PhoneCall } from "lucide-react";

const Home = () => {
  // Updated media content for the hero section with video
  const heroContent = {
    src: "https://gorrissenfederspiel.com/wp-content/uploads/2022/05/v2_3.mp4",
    background: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop",
    title: "Compliance Made Simple",
    date: "Regulatory Intelligence",
    scrollToExpand: "Scroll to Explore",
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={heroContent.src}
        bgImageSrc={heroContent.background}
        title={heroContent.title}
        date={heroContent.date}
        scrollToExpand={heroContent.scrollToExpand}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-8 py-10 items-center justify-center flex-col">
            <div>
              <Button variant="secondary" size="sm" className="gap-4">
                Read our launch article <MoveRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-4xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular">
                This is the start of something new
              </h1>
              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods. Our goal
                is to streamline SMB trade, making it easier and faster than ever.
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <Button size="lg" className="gap-4" variant="outline">
                Jump on a call <PhoneCall className="w-4 h-4" />
              </Button>
              <Button size="lg" className="gap-4">
                Sign up here <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
};

export default Home;
