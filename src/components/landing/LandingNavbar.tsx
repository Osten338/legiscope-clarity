
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const LandingNavbar = () => {
  return (
    <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex h-14 items-center px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Shield className="h-6 w-6 text-sage-600" />
          <span className="text-xl">Compliance Buddy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-7 items-center">
          <a href="#features" className="text-sm text-slate-700 hover:text-sage-700 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-slate-700 hover:text-sage-700 transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm text-slate-700 hover:text-sage-700 transition-colors">Testimonials</a>
          <Link to="/auth" className="text-sm text-slate-700 hover:text-sage-700 transition-colors">Login</Link>
          <Button asChild className="bg-sage-600 hover:bg-sage-700 shadow-md px-6 font-semibold text-base rounded-full">
            <Link to="/auth">Get Started</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default LandingNavbar;
