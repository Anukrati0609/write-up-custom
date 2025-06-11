"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const IconButton = ({
  icon: Icon,
  children,
  className = "",
  iconPosition = "left",
  iconClassName = "w-5 h-5",
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <Button variant={variant} size={size} className={className} {...props}>
      {iconPosition === "left" && Icon && (
        <motion.span
          className="mr-2 inline-flex"
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Icon className={iconClassName} />
        </motion.span>
      )}
      {children}
      {iconPosition === "right" && Icon && (
        <motion.span
          className="ml-2 inline-flex"
          initial={{ x: 5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Icon className={iconClassName} />
        </motion.span>
      )}
    </Button>
  );
};

export default IconButton;
