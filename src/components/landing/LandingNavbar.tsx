
import { Shield } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-nav";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

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

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      if (scrollYProgress.get() > 0.05) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {!isScrolled && (
          <motion.nav
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-6"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <Link to="/" className="text-2xl font-bold text-white">
                  Logo
                </Link>
                <div className="hidden md:flex space-x-8">
                  {navItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/auth"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors backdrop-blur-sm"
              >
                Login
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      
      <FloatingNav 
        navItems={navItems}
        className={`bg-white/10 backdrop-blur-md border-white/10 ${!isScrolled ? 'pointer-events-none opacity-0' : ''}`}
      />
    </>
  );
};

export default LandingNavbar;
