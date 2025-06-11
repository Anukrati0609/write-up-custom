"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Import reusable components
import TechBackground from "@/components/backgrounds/TechBackground";
import AnimatedCard from "@/components/ui/animated-card";
import SectionHeading from "@/components/ui/section-heading";
import IconButton from "@/components/ui/icon-button";
import AnimatedGradientBorder from "@/components/ui/animated-gradient-border";

// Import icons
import {
  FileIcon,
  ArrowRightIcon,
  MenuIcon,
  BadgeIcon,
  CheckCircleIcon,
} from "@/components/icons";

export default function About() {
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Team members data
  const teamMembers = [
    {
      name: "Anukrati Shrivastava",
      role: "Editorial Head",
      initial: "A",
      bgColor: "bg-blue-600/30",
      textColor: "text-blue-400",
      hoverBgColor: "group-hover:bg-blue-500/40",
      bgGlow: "bg-blue-500/20",
    },
    {
      name: "Tanisha Jain",
      role: "Editorial Head",
      initial: "T",
      bgColor: "bg-purple-600/30",
      textColor: "text-purple-400",
      hoverBgColor: "group-hover:bg-purple-500/40",
      bgGlow: "bg-purple-500/20",
    },
    // {
    //   name: "Neha Gupta",
    //   role: "Event Manager",
    //   initial: "N",
    //   bgColor: "bg-green-600/30",
    //   textColor: "text-green-400",
    //   hoverBgColor: "group-hover:bg-green-500/40",
    //   bgGlow: "bg-green-500/20",
    // },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-6 relative overflow-hidden">
      {/* Tech-inspired animated backgrounds */}
      <TechBackground particleCount={50} />

      {/* Grid lines background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Animated glow effects */}
      <motion.div
        className={`absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] rounded-full transition-transform`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animateBackground ? 0.6 : 0,
          scale: animateBackground ? 1 : 0.8,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className={`absolute bottom-1/3 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[100px] rounded-full transition-transform`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animateBackground ? 0.6 : 0,
          scale: animateBackground ? 1 : 0.8,
        }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className={`absolute top-3/4 left-1/4 w-1/3 h-1/3 bg-cyan-500/20 blur-[80px] rounded-full transition-transform`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animateBackground ? 0.4 : 0,
          scale: animateBackground ? 1 : 0.8,
        }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
      />

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="inline-block relative mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg"></div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3.5 flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/20">
              {" "}
              <FileIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            About Matrix JEC
          </motion.h1>

          <motion.p
            className="text-slate-300 text-lg max-w-2xl mx-auto backdrop-blur-sm bg-slate-800/20 px-4 py-2 rounded-lg inline-block shadow-lg border border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The Skill Enhancement Community of Jabalpur Engineering College
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700 p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 mb-6">
            Matrix JEC is dedicated to enhancing the technical and professional
            skills of students at Jabalpur Engineering College. We organize
            workshops, competitions, and events that help students develop
            essential skills needed in today&apos;s competitive world.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">
            About WriteItUp Competition
          </h2>
          <p className="text-slate-300 mb-6">
            The WriteItUp competition is our flagship content writing event
            designed to discover and promote writing talent within our college.
            This competition provides a platform for students to express their
            thoughts, showcase their writing skills, and receive feedback from
            experts.
          </p>

          <motion.div
            className="grid md:grid-cols-2 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50 backdrop-blur-sm shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 bg-blue-500/10 blur-xl rounded-full group-hover:scale-150 transition-all duration-700 ease-in-out"></div>
              <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-indigo-500/10 blur-xl rounded-full group-hover:scale-150 transition-all duration-700 ease-in-out"></div>

              <div className="flex items-center mb-3">
                <div className="h-8 w-8 mr-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  {" "}
                  <MenuIcon className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Competition Structure
                </h3>
              </div>

              <ul className="list-none text-slate-300 space-y-3 pl-2 relative z-10">
                {[
                  "Open to all students of Jabalpur Engineering College",
                  "Submissions accepted from June 15 to June 30, 2025",
                  "Evaluation by a panel of faculty and industry experts",
                  "Results announced by July 10, 2025",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {" "}
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50 backdrop-blur-sm shadow-lg relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -right-8 -top-8 w-16 h-16 bg-purple-500/10 blur-xl rounded-full group-hover:scale-150 transition-all duration-700 ease-in-out"></div>
              <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-pink-500/10 blur-xl rounded-full group-hover:scale-150 transition-all duration-700 ease-in-out"></div>

              <div className="flex items-center mb-3">
                <div className="h-8 w-8 mr-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {" "}
                  <BadgeIcon className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Prizes & Recognition
                </h3>
              </div>

              <ul className="list-none text-slate-300 space-y-3 pl-2 relative z-10">
                {[
                  "Cash prizes worth ₹10,000",
                  "Certificates for all participants",
                  "Special recognition for top 10 entries",
                  "Publication opportunities for selected entries",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    {" "}
                    <CheckCircleIcon className="h-5 w-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/80 p-8 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-600/10 to-teal-600/10 blur-xl rounded-full -ml-16 -mt-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl rounded-full -mr-12 -mb-12"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <div className="mr-3 h-8 w-1 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                Our Team
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`w-24 h-24 ${member.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center relative group`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`absolute inset-0 ${member.bgGlow} rounded-full blur-md ${member.hoverBgColor} transition-all duration-300`}
                  ></div>
                  <div className="relative z-10">
                    <span className={`text-3xl font-bold ${member.textColor}`}>
                      {member.initial}
                    </span>
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-slate-400">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link href="/register">
              {" "}
              <IconButton
                icon={ArrowRightIcon}
                iconPosition="right"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-500/30"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Register Now
              </IconButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
