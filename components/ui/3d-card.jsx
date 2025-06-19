"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ThreeDCard = ({
  children,
  className,
  containerClassName,
  glareEnabled = true,
  glareColor = "rgba(255, 255, 255, 0.2)",
  glareMaxOpacity = 0.5,
  rotationIntensity = 10,
  borderColor = "rgba(255, 255, 255, 0.1)",
  ...props
}) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Get mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation values based on mouse position
    // Convert to percentage
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on distance from center (in degrees)
    const rotateY = ((x - centerX) / centerX) * rotationIntensity;
    const rotateX = -((y - centerY) / centerY) * rotationIntensity;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({ x, y });
  };

  const handleMouseLeave = () => {
    // Reset card position when mouse leaves
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className={cn("perspective-1000", containerClassName)}>
      <motion.div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          border: `1px solid ${borderColor}`,
        }}
        {...props}
      >
        {glareEnabled && (
          <div
            className="absolute pointer-events-none inset-0 transition-opacity duration-200"
            style={{
              backgroundImage: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, ${glareColor} 0%, rgba(255,255,255,0) 60%)`,
              opacity: Math.min(
                (Math.sqrt(rotation.x * rotation.x + rotation.y * rotation.y) /
                  10) *
                  glareMaxOpacity,
                glareMaxOpacity
              ),
            }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
};

export default ThreeDCard;
