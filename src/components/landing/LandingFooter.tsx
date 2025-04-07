
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2 font-semibold mb-4">
              <Shield className="h-6 w-6 text-sage-400" />
              <span className="text-xl">LegisScope</span>
            </Link>
            <p className="text-slate-400 max-w-xs">
              Simplifying regulatory compliance for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium mb-4 text-sage-400">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Case Studies</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sage-400">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sage-400">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-slate-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} LegisScope. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
