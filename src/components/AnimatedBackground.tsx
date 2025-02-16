
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = "/lovable-uploads/a3b2d7b1-4803-467f-875e-34f5a9c8797a.png";

  useEffect(() => {
    // Create an image element to test loading
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log("Background image loaded successfully");
      setLoaded(true);
    };
    img.onerror = (e) => {
      console.error("Error loading background image:", e);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#f8f6f1]">
      <img
        src={imageUrl}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          zIndex: -1
        }}
      />
    </div>
  );
};
