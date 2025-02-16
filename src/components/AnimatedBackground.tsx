
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = "/lovable-uploads/32c21b28-36b5-4caa-a38c-f5f2c88b1f2b.png";

  useEffect(() => {
    console.log("Attempting to load image:", imageUrl);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 -z-10 bg-transparent"
    >
      <img 
        src={imageUrl}
        alt="Wavy background pattern"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        style={{ mixBlendMode: 'normal' }}
        onError={(e) => {
          console.error("Error loading image:", e);
          setImageError(true);
        }}
        onLoad={() => {
          console.log("Image loaded successfully");
        }}
      />
    </motion.div>
  );
};
