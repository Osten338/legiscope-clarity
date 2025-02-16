
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#f8f6f1]"
    >
      <Hero />
      <Features />
    </motion.div>
  );
};

export default Index;
