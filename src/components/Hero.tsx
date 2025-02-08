
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <span className="px-3 py-1 text-sm font-medium bg-sage-100 text-sage-700 rounded-full inline-block mb-4">
          Simplify Compliance
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Navigate Legislative Requirements with Confidence
        </h1>
        <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed">
          Discover which laws and regulations apply to your business and get clear, actionable compliance requirements.
        </p>
        <Button
          onClick={() => navigate("/assessment")}
          className="group bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg text-lg transition-all duration-200"
        >
          Start Assessment
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </section>
  );
};
