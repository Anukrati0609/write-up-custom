"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const EnhancedNavLink = ({
  href,
  icon: Icon,
  label,
  isActive = false,
  isMobile = false,
  onClick = () => {},
}) => {
  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent group ${
          isActive
            ? "text-foreground bg-accent/50"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
            isActive
              ? "bg-primary/20"
              : "bg-primary/10 group-hover:bg-primary/20"
          }`}
        >
          <Icon
            className={`h-4 w-4 transition-colors ${
              isActive
                ? "text-primary"
                : "text-primary/80 group-hover:text-primary"
            }`}
          />
        </div>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`px-3 py-2 relative group ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      } transition-colors`}
    >
      <div className="absolute inset-0 rounded-md opacity-0 bg-accent group-hover:opacity-100 transition-opacity" />{" "}
      <div className="relative z-10 flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-primary"
          } transition-colors`}
        />
        <span>{label}</span>
      </div>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primary via-violet-600 to-purple-600"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </Link>
  );
};

export default EnhancedNavLink;
