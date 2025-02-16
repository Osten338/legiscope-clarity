
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/ab336122-7791-4a54-a8a8-e841bedee4df.png')"
        }}
      />
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
            scale: [1, 1.2, 1],
            rotate: [i * 90, (i * 90) + 15, i * 90],
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 3,
            ease: "easeInOut",
          }}
        >
          <div className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] bg-gradient-to-br from-[#FDE1D3] via-[#FFDEE2] to-[#FEC6A1] opacity-30 blur-3xl" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[#f8f6f1]/70 backdrop-blur-sm" />
    </div>
  );
};
