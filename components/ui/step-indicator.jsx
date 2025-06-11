"use client";

import React from "react";
import { motion } from "framer-motion";

export const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center mb-6 gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index < currentStep;
        const isCurrentStep = index === currentStep - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`h-0.5 w-4 ${
                  index < currentStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gray-600"
                }`}
              />
            )}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: isCurrentStep ? [1, 1.2, 1] : 1,
                backgroundColor: isActive
                  ? "rgba(124, 58, 237, 1)"
                  : "rgba(75, 85, 99, 0.5)",
              }}
              transition={{
                scale: {
                  duration: 1,
                  repeat: isCurrentStep ? Infinity : 0,
                  repeatType: "reverse",
                },
                backgroundColor: { duration: 0.3 },
              }}
              className={`rounded-full h-3 w-3 flex items-center justify-center`}
            >
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
