
import { motion, useScroll, useTransform } from "framer-motion";

export const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  
  // Create slower-than-scroll movement effects
  const y1 = useTransform(scrollY, [0, 3000], [0, -600]); // Moves up slower
  const y2 = useTransform(scrollY, [0, 3000], [0, -900]); // Moves up even slower
  const x1 = useTransform(scrollY, [0, 2000], [0, 300]); // Moves right
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Top-left circle */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-20 -left-20 w-[40rem] h-[40rem] rounded-full border border-white/5 blur-xl"
      />
      
      {/* Bottom-right circle */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-brand-blue/[0.03] blur-lg"
      />
      
      {/* Middle shape */}
      <motion.div
        style={{ x: x1 }}
        className="absolute top-1/2 -left-20 w-[35rem] h-[35rem] rounded-full bg-indigo-600/[0.02] blur-xl"
      />
    </div>
  );
};
