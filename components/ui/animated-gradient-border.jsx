"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedGradientBorder = ({
  children,
  className = "",
  borderWidth = 1,
  gradientColors = "from-blue-500 via-purple-500 to-pink-500",
  borderRadius = "rounded-xl",
  animationDuration = 6,
  containerClassName = "",
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <motion.div
        className={`absolute -inset-0.5 ${borderRadius} bg-gradient-to-r ${gradientColors} opacity-75 blur-sm group-hover:opacity-100 transition duration-1000`}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: animationDuration,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      <div className={`relative ${borderRadius} bg-black/90 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBorder;
