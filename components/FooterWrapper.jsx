"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export const FooterLink = ({ href, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        href={href}
        className="text-foreground/80 hover:text-foreground transition-colors text-sm relative group"
      >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </motion.div>
  );
};

export const FooterSection = ({ title, children }) => {
  return (
    <div className="mb-6 md:mb-0">
      {title && (
        <h4 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
          {title}
        </h4>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export const FooterWrapper = ({ children }) => {
  return (
    <footer className="py-12 px-4 border-t relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-small-white -z-10 opacity-10" />
      <div className="absolute -top-12 left-1/4 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-12 right-1/4 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
      <motion.div
        className="container mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </footer>
  );
};

export default FooterWrapper;
