
import { motion } from "framer-motion";
import { BusinessDescription } from "@/components/BusinessDescription";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Assessment = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <AnimatedBackground />
      <BusinessDescription />
    </motion.div>
  );
};

export default Assessment;
