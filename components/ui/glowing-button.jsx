"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const GlowingButton = ({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.4)", // Purple-ish glow by default
  hoverScale = 1.03,
  whileTapScale = 0.98,
  ...props
}) => {
  const buttonRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || !isMounted) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-md px-6 py-3 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-md border border-white/10",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: whileTapScale }}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          opacity,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.button>
  );
};

export default GlowingButton;
