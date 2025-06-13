"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import TechBackground from "@/components/backgrounds/TechBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminRegister() {
  const router = useRouter();
  const { adminRegister, loading, error, validateAdminSession } =
    useAdminStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const checkAdminAuth = async () => {
      const isValid = await validateAdminSession();
      if (isValid) {
        router.push("/admin/dashboard");
      }
    };

    checkAdminAuth();
  }, [validateAdminSession, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!email || !password || !confirmPassword || !secretKey) {
      setValidationError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    const result = await adminRegister(email, password, secretKey);
    if (result.success) {
      router.push("/admin/dashboard");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 relative overflow-hidden">
      {/* Tech-inspired animated background */}
      <TechBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="p-6 bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin Registration
            </h1>
            <p className="text-slate-400">
              Register to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(validationError || error) && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded text-sm mb-4">
                {validationError || error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-slate-800 border-slate-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <span>Hide</span> : <span>Show</span>}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                At least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey" className="text-white">
                Admin Secret Key
              </Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Enter secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={loading}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                The secret key is required to register as an admin
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-400">
                Already have an account?
                <Link
                  href="/admin/login"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
