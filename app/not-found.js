"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TechBackground from "@/components/backgrounds/TechBackground";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <TechBackground particleCount={80} />
      </div>

      {/* Glass container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 glass-card rounded-xl p-8 max-w-lg w-full text-center border border-white/10 shadow-xl"
      >
        {/* Glowing Elements */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-30 blur-xl rounded-xl"></div>
        <div className="relative">
          {/* Error Code */}
          <motion.div
            animate={{
              textShadow: [
                "0 0 5px var(--primary)",
                "0 0 20px var(--accent)",
                "0 0 5px var(--primary)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-geist-mono text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4"
          >
            404
          </motion.div>

          {/* Error Message */}
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            Page Not Found
          </h1>

          <div className="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-border to-transparent mb-6"></div>

          <p className="text-muted-foreground mb-8">
            The matrix pathway you&apos;re looking for seems to have been
            disconnected or never existed in this reality.
          </p>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="relative overflow-hidden rounded-md px-6 py-3 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              <span className="relative z-10">Go Back</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </button>

            <Link
              href="/"
              className="relative overflow-hidden rounded-md px-6 py-3 bg-gradient-to-r from-primary/80 to-primary/50 backdrop-blur-md border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              <span className="relative z-10">Return Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Decorative circuit lines */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 text-primary/60 font-geist-mono text-sm">
        [ MATRIX CONNECTION ERROR: 0x00000404 ]
      </div>
    </div>
  );
}
