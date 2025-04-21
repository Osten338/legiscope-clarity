
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const LandingNavbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-black/95 backdrop-blur-xl shadow-sm"> 
      <div className="flex h-16 items-center px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <Shield className="h-6 w-6 text-brand-blue" />
          <span className="text-xl">Compliance Buddy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-7 items-center">
          <Link to="#features" className="text-sm text-white/90 hover:text-brand-blue transition-colors">Features</Link>
          <Link to="#pricing" className="text-sm text-white/90 hover:text-brand-blue transition-colors">Pricing</Link>
          <Link to="/#testimonials" className="text-sm text-white/90 hover:text-brand-blue transition-colors">Testimonials</Link>
          <Link to="/documentation" className="text-sm text-white/90 hover:text-brand-blue transition-colors">Docs</Link>
          <Link to="/auth" className="text-sm text-white/90 hover:text-brand-blue transition-colors">Login</Link>
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90 shadow-md px-6 font-medium text-base rounded-full text-white">
            <Link to="/auth">Book a Demo</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default LandingNavbar;
