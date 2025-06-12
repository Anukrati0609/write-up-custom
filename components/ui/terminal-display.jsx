"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon } from "lucide-react";

const TerminalDisplay = ({
  className,
  text,
  prefix = ">",
  typingSpeed = 30,
  showCursor = true,
  animate = true,
  icon = true,
  delay = 0,
  onComplete,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      setCompleted(true);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    let timer;

    const startTyping = () => {
      timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
          startTyping();
        } else {
          setCompleted(true);
          onComplete?.();
        }
      }, typingSpeed);
    };

    const delayTimer = setTimeout(() => {
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(delayTimer);
    };
  }, [text, typingSpeed, animate, delay, onComplete]);

  return (
    <motion.div
      className={cn(
        "bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-4 font-mono text-sm text-white/90 shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2 opacity-70">
        {icon && <TerminalIcon className="w-4 h-4" />}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80"></div>
        </div>
      </div>
      <div className="pl-2">
        <span className="text-green-400">{prefix}</span>
        <span className="ml-2">{displayedText}</span>
        {showCursor && !completed && (
          <motion.span
            className="inline-block w-2 h-4 ml-0.5 bg-white/70"
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TerminalDisplay;
