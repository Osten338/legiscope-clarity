
import { motion } from "framer-motion";
import { BusinessAssessmentForm } from "@/components/BusinessAssessmentForm";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Assessment = () => {
  return (
    <div className="relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen z-[1] py-8"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-serif mb-4">Business Assessment</h1>
              <p className="text-lg text-slate-600">
                Complete this assessment to help us understand your business and identify relevant compliance requirements.
              </p>
            </motion.div>
            
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-6">
              <BusinessAssessmentForm />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Assessment;
