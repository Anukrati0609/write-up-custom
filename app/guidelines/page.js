"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Import reusable components
import TechBackground from "@/components/backgrounds/TechBackground";
import SectionHeading from "@/components/ui/section-heading";
import AnimatedCard from "@/components/ui/animated-card";
import IconButton from "@/components/ui/icon-button";
import AnimatedGradientBorder from "@/components/ui/animated-gradient-border";

// Import icons
import { FileIcon, ArrowRightIcon, CheckCircleIcon } from "@/components/icons";

export default function Guidelines() {
  const [animateBackground, setAnimateBackground] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  // Animation variants for staggered animations
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-6 relative overflow-hidden">
      {/* Tech-inspired animated backgrounds */}
      <TechBackground particleCount={40} />

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

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading
            title="Competition Guidelines"
            subtitle="Rules and guidelines for the Matrix JEC WriteItUp competition"
            containerClassName="relative"
          >
            <motion.div
              className="inline-block relative mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg"></div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3.5 flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/20">
                <FileIcon className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </SectionHeading>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedGradientBorder
            borderRadius="rounded-2xl"
            gradientColors="from-blue-600 via-indigo-500 to-purple-600"
            containerClassName="mb-10"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl">
              <motion.div variants={itemVariants}>
                <div className="flex items-center mb-5">
                  <div className="mr-3 h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Eligibility
                  </h2>
                </div>

                <ul className="ml-2 text-slate-300 space-y-3 mb-8">
                  {[
                    "Open to all students currently enrolled at Jabalpur Engineering College",
                    "Participants must submit original content that has not been published elsewhere",
                    "Students from all branches and years are eligible to participate",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      variants={itemVariants}
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </AnimatedGradientBorder>
        </motion.div>{" "}
        <motion.div variants={itemVariants} className="mb-8">
          <AnimatedCard
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 shadow-lg"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-5">
              <div className="mr-3 h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Submission Requirements
              </h2>
            </div>

            <ul className="text-slate-300 space-y-3">
              {[
                "Word limit: 1000-1500 words",
                "Content must be original and plagiarism-free",
                "Topic: Technology and Innovation OR Social Impact of Engineering",
                "Format: Text submissions through the online portal only",
                "Deadline: June 30, 2025 at 11:59 PM IST",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </AnimatedCard>
        </motion.div>{" "}
        <motion.div variants={itemVariants} className="mb-8">
          <AnimatedCard
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 shadow-lg"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-6">
              <div className="mr-3 h-8 w-1 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                Judging Criteria
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Content",
                  percentage: 40,
                  color: "from-blue-600 to-blue-400",
                  bgColor: "bg-blue-600/20",
                  borderColor: "border-blue-600/30",
                  items: [
                    "Originality and creativity of ideas",
                    "Relevance to the chosen topic",
                    "Depth of research and understanding",
                    "Logical flow of arguments",
                  ],
                },
                {
                  title: "Language",
                  percentage: 30,
                  color: "from-indigo-600 to-indigo-400",
                  bgColor: "bg-indigo-600/20",
                  borderColor: "border-indigo-600/30",
                  items: [
                    "Grammar and vocabulary usage",
                    "Style and clarity of expression",
                    "Sentence structure and readability",
                  ],
                },
                {
                  title: "Structure",
                  percentage: 20,
                  color: "from-cyan-600 to-cyan-400",
                  bgColor: "bg-cyan-600/20",
                  borderColor: "border-cyan-600/30",
                  items: [
                    "Organization of content",
                    "Introduction and conclusion",
                    "Paragraph structure and transitions",
                  ],
                },
                {
                  title: "Presentation",
                  percentage: 10,
                  color: "from-teal-600 to-teal-400",
                  bgColor: "bg-teal-600/20",
                  borderColor: "border-teal-600/30",
                  items: [
                    "Overall impact and engagement",
                    "Formatting and visual appeal",
                    "Title and subtitles",
                  ],
                },
              ].map((category, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl border ${category.borderColor} ${category.bgColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * idx, duration: 0.5 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {category.title}
                    </h3>
                    <span
                      className={`text-lg font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                    >
                      {category.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-700/50 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{
                        delay: 0.2 + 0.1 * idx,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  </div>

                  <ul className="text-slate-300 space-y-2">
                    {category.items.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.3 + 0.05 * index,
                          duration: 0.4,
                        }}
                      >
                        <CheckCircleIcon
                          className={`h-4 w-4 mr-2 mt-1 flex-shrink-0 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>{" "}
        <motion.div variants={itemVariants} className="mb-8">
          <AnimatedGradientBorder
            borderRadius="rounded-2xl"
            gradientColors="from-indigo-600 via-purple-500 to-pink-600"
            containerClassName="mb-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="mr-3 h-8 w-1 bg-gradient-to-b from-indigo-500 to-pink-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                  Important Dates
                </h2>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {[
                  {
                    title: "Registration Opens",
                    date: "June 10, 2025",
                    color: "bg-indigo-500/30",
                    textColor: "text-indigo-300",
                    borderColor: "border-indigo-500/30",
                    gradientText: "from-indigo-400 to-blue-300",
                  },
                  {
                    title: "Submission Deadline",
                    date: "June 30, 2025",
                    color: "bg-purple-500/30",
                    textColor: "text-purple-300",
                    borderColor: "border-purple-500/30",
                    gradientText: "from-purple-400 to-fuchsia-300",
                  },
                  {
                    title: "Results Announced",
                    date: "July 10, 2025",
                    color: "bg-pink-500/30",
                    textColor: "text-pink-300",
                    borderColor: "border-pink-500/30",
                    gradientText: "from-pink-400 to-rose-300",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className={`relative w-full md:w-1/3 p-5 ${item.color} border ${item.borderColor} rounded-xl text-center group`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * idx, duration: 0.5 }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 },
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className={`font-semibold ${item.textColor} mb-2`}>
                      {item.title}
                    </h3>
                    <p
                      className={`text-2xl font-bold bg-gradient-to-br ${item.gradientText} bg-clip-text text-transparent`}
                    >
                      {item.date}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedGradientBorder>
        </motion.div>{" "}
        <motion.div
          className="flex justify-center mt-8"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Link href="/register">
            <IconButton
              icon={ArrowRightIcon}
              iconPosition="right"
              className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-xl hover:shadow-blue-500/30"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              Register Now
            </IconButton>
          </Link>
        </motion.div>
        <motion.p
          className="text-slate-400 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Registration closes on June 29, 2025
        </motion.p>
      </div>
    </main>
  );
}
