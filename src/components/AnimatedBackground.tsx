
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{
            opacity: 0.3,
            scale: 1,
            rotate: i * 90,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
            rotate: [i * 90, (i * 90) + 5, i * 90],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 2,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-[#FDE1D3] via-[#FFDEE2] to-[#FEC6A1] opacity-30 blur-3xl transform -translate-y-1/2" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[#f8f6f1]/70 backdrop-blur-sm" />
    </div>
  );
};
