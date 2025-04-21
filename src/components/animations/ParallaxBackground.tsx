
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress into different movement speeds for each shape
  const topLeftY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const topLeftX = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const bottomRightY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bottomRightX = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Top left shape */}
      <motion.div
        style={{
          y: topLeftY,
          x: topLeftX,
        }}
        className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-brand-blue opacity-[0.03] blur-[100px]"
        aria-hidden="true"
      />

      {/* Bottom right shape */}
      <motion.div
        style={{
          y: bottomRightY,
          x: bottomRightX,
        }}
        className="absolute -bottom-64 -right-32 w-[50rem] h-[50rem] rounded-full bg-indigo-600 opacity-[0.04] blur-[120px]"
        aria-hidden="true"
      />
    </div>
  );
};
