
import { Shield } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-nav";

const LandingNavbar = () => {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Testimonials",
      link: "/#testimonials",
    },
    {
      name: "Docs",
      link: "/documentation",
    },
  ];

  return (
    <FloatingNav 
      navItems={navItems}
      className="bg-white/10 backdrop-blur-md border-white/10"
    />
  );
};

export default LandingNavbar;
