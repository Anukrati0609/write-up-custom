"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ClientThemeProvider() {
  useEffect(() => {
    // Initialize theme on client side
    useThemeStore.getState().initTheme();
  }, []);

  return null;
}
