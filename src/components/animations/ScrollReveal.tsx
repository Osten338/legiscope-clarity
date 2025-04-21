
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  direction = "up",
  delay = 0,
  className = "" 
}: ScrollRevealProps) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case "up": return { y: 40 };
      case "down": return { y: -40 };
      case "left": return { x: 40 };
      case "right": return { x: -40 };
      default: return { y: 0 };
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...getDirectionOffset(),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ 
        once: true, 
        amount: 0.2,  // Trigger when at least 20% of the element is in view
        margin: "-100px 0px" // Offset when animation triggers
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing function
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
