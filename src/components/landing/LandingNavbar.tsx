
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const LandingNavbar = () => {
  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-sage-600" />
          <span className="text-xl">Compliance Buddy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link to="/#features" className="text-sm text-slate-700 hover:text-sage-700">Features</Link>
          <Link to="/#pricing" className="text-sm text-slate-700 hover:text-sage-700">Pricing</Link>
          <Link to="/#testimonials" className="text-sm text-slate-700 hover:text-sage-700">Testimonials</Link>
          <Link to="/auth" className="text-sm text-slate-700 hover:text-sage-700">Login</Link>
          <Button asChild className="bg-sage-600 hover:bg-sage-700">
            <Link to="/auth">Get Started</Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default LandingNavbar;
