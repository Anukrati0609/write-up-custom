"use client";

import React from "react";
import { motion } from "framer-motion";

export const SectionHeading = ({
  title,
  subtitle,
  align = "center",
  titleClassName = "",
  subtitleClassName = "",
  containerClassName = "",
}) => {
  const alignClass = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  };

  return (
    <div className={`mb-8 ${alignClass[align]} ${containerClassName}`}>
      <motion.h2
        className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ${titleClassName}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className={`mt-2 text-gray-400 max-w-2xl mx-auto ${
            align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
          } ${subtitleClassName}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
