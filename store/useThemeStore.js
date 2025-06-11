"use client";

import React from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Helper to determine system theme preference
const getSystemTheme = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "system";
};

// Create theme store with persistence
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "system", // default theme
      resolvedTheme: "light", // actual theme being applied (light/dark)

      // Set theme (light, dark, or system)
      setTheme: (theme) => {
        const newResolvedTheme = theme === "system" ? getSystemTheme() : theme;

        set({
          theme,
          resolvedTheme: newResolvedTheme,
        });

        // Update DOM
        if (typeof window !== "undefined") {
          const root = window.document.documentElement;
          root.classList.remove("light", "dark");
          root.classList.add(newResolvedTheme);
        }
      },

      // Initialize theme on app load
      initTheme: () => {
        const state = get();
        const systemTheme = getSystemTheme();
        const resolvedTheme =
          state.theme === "system" ? systemTheme : state.theme;

        set({ resolvedTheme });

        // Update DOM
        if (typeof window !== "undefined") {
          const root = window.document.documentElement;
          root.classList.remove("light", "dark");
          root.classList.add(resolvedTheme);

          // Set up system theme change listener
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            if (state.theme === "system") {
              const newSystemTheme = mediaQuery.matches ? "dark" : "light";
              set({ resolvedTheme: newSystemTheme });
              root.classList.remove("light", "dark");
              root.classList.add(newSystemTheme);
            }
          };

          mediaQuery.addEventListener("change", handleChange);
        }
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Create a client component to initialize theme
export function ThemeInitializer() {
  React.useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  return null;
}

// Function to provide compatibility with existing code
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
