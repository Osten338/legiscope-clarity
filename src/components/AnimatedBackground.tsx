
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = "/lovable-uploads/32c21b28-36b5-4caa-a38c-f5f2c88b1f2b.png";

  useEffect(() => {
    console.log("Attempting to load image:", imageUrl);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1
      }}
      onError={(e) => {
        console.error("Error loading image:", e);
        setImageError(true);
      }}
    />
  );
};
