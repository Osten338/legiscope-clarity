
import { motion } from "framer-motion";
import { BusinessDescription } from "@/components/BusinessDescription";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Assessment = () => {
  return (
    <div className="relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen z-[1]"
      >
        <BusinessDescription />
      </motion.div>
    </div>
  );
};

export default Assessment;
