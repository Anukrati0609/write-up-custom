"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FloatingElement = ({
  children,
  className,
  duration = 3,
  distance = 15,
  delay = 0,
  ...props
}) => {
  const floatAnimation = {
    y: [`-${distance / 2}px`, `${distance / 2}px`],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: duration,
        ease: "easeInOut",
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      className={cn("", className)}
      animate={floatAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
