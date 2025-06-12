"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GlassMorphism = ({
  children,
  className,
  blur = "md",
  opacity = 60,
  borderOpacity = 20,
  ...props
}) => {
  const getBlurValue = (blurSize) => {
    const blurValues = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
      "3xl": "backdrop-blur-3xl",
    };

    return blurValues[blurSize] || "backdrop-blur-md";
  };

  return (
    <motion.div
      className={cn(
        `bg-black/20 ${getBlurValue(
          blur
        )} border border-white/10 rounded-xl shadow-lg`,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassMorphism;
