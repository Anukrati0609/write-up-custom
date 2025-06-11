import { create } from "zustand";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // User state management
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Computed values
  isAuthenticated: () => !!get().user,
  getUserId: () => get().user?.uid || null,
  getUserEmail: () => get().user?.email || null,
  hasSubmitted: () => get().user?.is_submitted || false,
  hasVoted: () => get().user?.is_voted || false,

  // Authentication actions
  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      set({ user: data.user, loading: false });
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Google sign-in error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      // First sign out from Firebase client
      await signOut(auth);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Entry management
  submitEntry: async (entryData) => {
    const user = get().user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          ...entryData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit entry");
      }

      // Update user's submission status
      set({
        user: { ...user, is_submitted: true },
        loading: false,
      });

      return { success: true, entryId: data.entryId };
    } catch (error) {
      console.error("Entry submission error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Get all entries
  getEntries: async () => {
    const user = get().user;
    set({ loading: true, error: null });

    try {
      const url = user ? `/api/entries?userId=${user.uid}` : "/api/entries";
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch entries");
      }

      set({ loading: false });
      return { success: true, entries: data.entries };
    } catch (error) {
      console.error("Fetch entries error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Vote for entry
  voteForEntry: async (entryId) => {
    const user = get().user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          entryId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cast vote");
      }

      // Update user's voting status
      set({
        user: { ...user, is_voted: true },
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Vote error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Refresh user data
  refreshUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await fetch(`/api/user?userId=${user.uid}`);
      const data = await response.json();

      if (response.ok) {
        set({ user: data.user });
      }
    } catch (error) {
      console.error("Refresh user data error:", error);
    }
  },

  // Initialize auth state listener
  initializeAuth: () => {
    set({ loading: true });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(`/api/user?userId=${firebaseUser.uid}`);
          const data = await response.json();

          if (response.ok) {
            set({ user: data.user, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });

    return unsubscribe;
  },
}));
