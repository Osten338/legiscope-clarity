
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = "/lovable-uploads/324a8be1-29b0-45ab-a478-98582c3c9c18.png";

  useEffect(() => {
    console.log("Attempting to load image:", imageUrl);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <img 
        src={imageUrl}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          console.error("Error loading image:", e);
          setImageError(true);
        }}
        onLoad={() => {
          console.log("Image loaded successfully");
        }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{
            opacity: 0.15,
            scale: 1,
            rotate: i * 90,
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
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
          <div className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] bg-gradient-to-br from-[#FDE1D3] via-[#FFDEE2] to-[#FEC6A1] opacity-20 blur-3xl" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[#f8f6f1]/30 backdrop-blur-[2px]" />
    </div>
  );
};
