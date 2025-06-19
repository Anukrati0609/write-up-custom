"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import FormStep1 from "@/components/FormStep1";
import FormStep2 from "@/components/FormStep2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

// Import reusable components
import TechBackground from "@/components/backgrounds/TechBackground";
import StepIndicator from "@/components/ui/step-indicator";
import AnimatedGradientBorder from "@/components/ui/animated-gradient-border";
import AnimatedCard from "@/components/ui/animated-card";
import IconButton from "@/components/ui/icon-button";

// Import icons
import {
  FileIcon,
  HomeIcon,
  CheckIcon,
  TechCircleIcon,
  UserIcon,
  EditIcon,
} from "@/components/icons";

export default function Register() {
  const { user, loading, error, submitEntry, hasSubmitted, initializeAuth } =
    useUserStore();

  // Define branches array
  const branches = [
    {
      value: "AI & DS",
      label: "Artificial Intelligence and Data Science Engineering",
    },
    { value: "CSE", label: "Computer Science Engineering" },
    { value: "IT", label: "Information Technology" },
    { value: "ECE", label: "Electronics & Communication" },
    { value: "EE", label: "Electrical Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "IP", label: "Industrial and Production Engineering" },
    { value: "MT", label: "Mechatronics Engineering" },
    { value: "Other", label: "Other" },
  ];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    year: "",
    branch: "",
    title: "",
    content: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    setAnimateBackground(true);
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (user && hasSubmitted()) {
      setSubmitted(true);
    }
  }, [user, hasSubmitted]);

  const handleGoogleSignIn = (userData) => {
    // User data is already set in the store by GoogleSignInButton
    console.log("User signed in:", userData);
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    setSubmissionLoading(true);
    try {
      const result = await submitEntry(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.error || "Failed to submit entry");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit entry. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  const isLoggedIn = !!user;
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Tech-inspired animated backgrounds */}
      <TechBackground />

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
        className={`absolute top-3/4 left-1/4 w-1/4 h-1/4 bg-cyan-500/20 blur-[80px] rounded-full transition-transform`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: animateBackground ? 0.4 : 0,
          scale: animateBackground ? 1 : 0.8,
        }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center mb-5"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <FileIcon className="w-7 h-7 text-white" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold ml-3 tracking-tight text-white">
              Matrix
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Whisper Escape
              </span>
            </h3>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join Matrix Whisper Escape Competition
          </motion.h1>

          <motion.p
            className="text-slate-300 text-lg max-w-2xl mx-auto backdrop-blur-sm bg-slate-800/20 px-4 py-2 rounded-lg inline-block shadow-lg border border-slate-700/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="inline-block transform hover:scale-105 transition-transform">
              💡
            </span>
            Showcase your content writing skills and compete with talented
            writers from Jabalpur Engineering College.
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 p-8 md:p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-xl rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 blur-xl rounded-full -ml-12 -mb-12"></div>
          {/* Tech pattern decorations */}
          <div className="absolute top-8 right-8">
            <TechCircleIcon className="h-24 w-24 opacity-20 text-indigo-500" />
          </div>
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div
                key="sign-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-6 relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-3 flex items-center justify-center relative z-10 mx-auto shadow-xl shadow-blue-500/20">
                      <FileIcon className="w-8 h-8 text-white mx-auto" />
                    </div>
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Sign in to continue
                  </motion.h2>

                  <motion.p
                    className="text-slate-400 mt-2 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Use your Google account to register for the competition and
                    showcase your writing talent
                  </motion.p>
                </div>

                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <GoogleSignInButton onClick={handleGoogleSignIn} />
                  </motion.div>

                  <div className="mt-6 text-center text-slate-500 text-sm">
                    <p>
                      By continuing, you agree to our&nbsp;
                      <Link
                        href="/guidelines"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      >
                        Competition Guidelines
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ) : submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-green-500"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  ></motion.div>
                  <CheckIcon
                    className="h-12 w-12 text-green-500"
                    animate={true}
                  />
                </motion.div>

                <motion.h2
                  className="text-4xl font-bold mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Registration Complete!
                  </span>
                </motion.h2>

                <motion.p
                  className="text-slate-300 text-balance max-w-md mx-auto mb-8 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  Your submission has been received.Wishing you good luck
                </motion.p>

                <motion.button
                  onClick={() => (window.location.href = "/")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-500/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    <HomeIcon className="h-5 w-5" />
                    Back to Home
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key={`form-step-${step}`}
                initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative mb-10">
                  {/* Step indicators container */}
                  <div className="flex items-center justify-between relative z-10">
                    {/* Left Step */}
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{
                        scale: step === 1 ? 1.05 : 1,
                      }}
                    >
                      <div
                        className={`h-12 w-12 mb-2 rounded-full flex items-center justify-center shadow-lg ${
                          step === 1
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-900"
                            : "bg-slate-800 border border-slate-700"
                        }`}
                      >
                        <motion.div
                          animate={{
                            scale: step === 1 ? [1, 1.2, 1] : 1,
                            opacity: step === 1 ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <UserIcon className="h-6 w-6 text-white" />
                        </motion.div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step === 1 ? "text-blue-400" : "text-slate-500"
                        }`}
                      >
                        Personal Info
                      </span>
                    </motion.div>

                    {/* Progress bar - Positioned absolutely to ensure proper alignment */}
                    <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-0 px-12">
                      <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden w-full mx-auto">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                          initial={{ width: step === 1 ? "0%" : "100%" }}
                          animate={{ width: step === 1 ? "50%" : "100%" }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Right Step */}
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{
                        scale: step === 2 ? 1.05 : 1,
                      }}
                    >
                      <div
                        className={`h-12 w-12 mb-2 rounded-full flex items-center justify-center shadow-lg ${
                          step === 2
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-900"
                            : "bg-slate-800 border border-slate-700"
                        }`}
                      >
                        <motion.div
                          animate={{
                            scale: step === 2 ? [1, 1.2, 1] : 1,
                            opacity: step === 2 ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <EditIcon className="h-6 w-6 text-white" />
                        </motion.div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step === 2 ? "text-blue-400" : "text-slate-500"
                        }`}
                      >
                        Your Content
                      </span>
                    </motion.div>
                  </div>
                </div>
                {step === 1 ? (
                  <FormStep1
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                    branches={branches}
                  />
                ) : (
                  <FormStep2
                    formData={formData}
                    setFormData={setFormData}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    loading={submissionLoading}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
