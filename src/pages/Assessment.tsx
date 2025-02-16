
import { motion } from "framer-motion";
import { BusinessDescription } from "@/components/BusinessDescription";

const Assessment = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white to-sage-50"
    >
      <BusinessDescription />
    </motion.div>
  );
};

export default Assessment;
