"use client";

import React from "react";
import { motion } from "framer-motion";

export const AnimatedCard = ({
  children,
  className = "",
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  whileHover = {
    y: -5,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  ...props
}) => {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
