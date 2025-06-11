"use client";

import React from "react";

export const CircuitLinesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="circuit"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20,20 L80,20 L80,80 L20,80 Z"
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="1"
            />
            <circle cx="20" cy="20" r="2" fill="rgba(59, 130, 246, 0.8)" />
            <circle cx="80" cy="20" r="2" fill="rgba(59, 130, 246, 0.8)" />
            <circle cx="20" cy="80" r="2" fill="rgba(59, 130, 246, 0.8)" />
            <circle cx="80" cy="80" r="2" fill="rgba(59, 130, 246, 0.8)" />
            <path
              d="M20,20 L50,50 M80,20 L50,50 M20,80 L50,50 M80,80 L50,50"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="3" fill="rgba(147, 51, 234, 0.8)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
};

export default CircuitLinesBackground;
