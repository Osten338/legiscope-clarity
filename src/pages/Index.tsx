
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-transparent"
    >
      <AnimatedBackground />
      <Hero />
      <Features />
    </motion.div>
  );
};

export default Index;
