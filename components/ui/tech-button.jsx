"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TechButton = ({
  className,
  children,
  variant = "primary",
  size = "default",
  leftIcon,
  rightIcon,
  glowing = false,
  disabled = false,
  ...props
}) => {
  // Define size classes
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    default: "py-2.5 px-5",
    lg: "py-3 px-6 text-lg",
  };

  // Define variant classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-transparent",
    secondary: "bg-transparent border-white/20 hover:bg-white/10 text-white",
    outline: "bg-transparent border-white/20 hover:border-white/40 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-white border-transparent",
    cyber: "bg-black border-purple-500 text-purple-400 hover:text-purple-300",
    matrix: "bg-black border-green-500 text-green-400 hover:text-green-300",
  };

  // Classes for glowing effect
  const glowingClass = glowing
    ? "shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
    : "";

  return (
    <motion.button
      className={cn(
        "relative transition duration-200 font-medium border rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        glowingClass,
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1">{rightIcon}</span>}
    </motion.button>
  );
};

export default TechButton;
