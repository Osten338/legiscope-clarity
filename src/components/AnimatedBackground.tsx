
import { useEffect } from "react";

export const AnimatedBackground = () => {
  const imageUrl = "/lovable-uploads/a3b2d7b1-4803-467f-875e-34f5a9c8797a.png";

  useEffect(() => {
    console.log("Loading background image:", imageUrl);
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};
