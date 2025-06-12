"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const StatCounter = ({
  value,
  duration = 2,
  className,
  prefix = "",
  suffix = "",
  animateToValue = true,
  textSize = "text-4xl",
  color = "text-white",
  decimal = 0,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Convert the target value to a number
  const targetValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.-]/g, ""))
      : value;

  // Format the value
  const formatValue = (val) => {
    return val.toFixed(decimal);
  };

  useEffect(() => {
    if (!animateToValue || hasAnimated) {
      setDisplayValue(targetValue);
      return;
    }

    let startTime = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setDisplayValue(progress * targetValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setHasAnimated(true);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [targetValue, duration, animateToValue, hasAnimated]);

  return (
    <div className={cn("font-bold", textSize, color, className)} {...props}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {prefix}
        {formatValue(displayValue)}
        {suffix}
      </motion.span>
    </div>
  );
};

export default StatCounter;
