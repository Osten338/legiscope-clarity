
"use client";

import React from "react";
import { motion } from "framer-motion";

export const AuroraBackground = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className="w-[1000px] h-[1000px]"
        >
          {/* Aurora circles with higher opacity and saturation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500 opacity-30 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-indigo-500 opacity-20 blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500 opacity-20 blur-[120px]" />
        </motion.div>
      </div>
    </div>
  );
};
