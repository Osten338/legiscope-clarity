
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = "/lovable-uploads/32c21b28-36b5-4caa-a38c-f5f2c88b1f2b.png";

  useEffect(() => {
    console.log("Attempting to load image:", imageUrl);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f5efe7]">
      <img 
        src={imageUrl}
        alt="Wavy background pattern"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
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
            opacity: 0.03,
            scale: 1,
            rotate: i * 90,
          }}
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.1, 1],
            rotate: [i * 90, (i * 90) + 10, i * 90],
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 4,
            ease: "easeInOut",
          }}
        >
          <div className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] bg-gradient-to-br from-[#f8e8dd]/5 via-[#f5e1d5]/5 to-[#f2d9cd]/5 opacity-20 blur-3xl" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[#f5efe7]/10 backdrop-blur-[0.5px]" />
    </div>
  );
};
