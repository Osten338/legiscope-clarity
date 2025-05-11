
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ui/use-theme";

export function TopbarMenu() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItemClass = "text-sm font-medium hover:text-primary transition-colors";
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? "bg-background/95 backdrop-blur-md border-b" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">C</span>
          </div>
          <span className="text-lg">CompliAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="#features" className={navItemClass}>
            Features
          </Link>
          <Link to="#pricing" className={navItemClass}>
            Pricing
          </Link>
          <Link to="#testimonials" className={navItemClass}>
            Testimonials
          </Link>
          <Link to="/documentation" className={navItemClass}>
            Documentation
          </Link>
          <Link to="/auth" className={navItemClass}>
            Login
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
