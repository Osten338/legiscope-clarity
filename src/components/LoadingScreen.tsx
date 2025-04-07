
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sage-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
          className="mx-auto mb-8"
        >
          <Loader2 className="h-12 w-12 text-sage-600" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl md:text-4xl font-serif font-light mb-4 text-slate-800"
        >
          LegisScope Clarity
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-slate-600 text-lg mb-6"
        >
          Preparing your compliance journey...
        </motion.p>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          className="h-1 bg-sage-500 w-64 mx-auto rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
