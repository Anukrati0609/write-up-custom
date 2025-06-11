import { create } from "zustand";

export const useAdminStore = create((set, get) => ({
  admin: null,
  loading: false,
  error: null,
  settings: null,
  entries: [],
  users: [],

  // Admin state management
  setAdmin: (admin) => set({ admin, error: null }),
  clearAdmin: () => set({ admin: null, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setEntries: (entries) => set({ entries }),
  setUsers: (users) => set({ users }),
  setSettings: (settings) => set({ settings }),

  // Computed values
  isAuthenticated: () => !!get().admin,
  
  // Admin authentication
  adminLogin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      set({ admin: data.admin, loading: false });
      return { success: true, admin: data.admin };
    } catch (error) {
      console.error("Admin login error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  adminRegister: async (email, password, secretKey) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, secretKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      set({ admin: data.admin, loading: false });
      return { success: true, admin: data.admin };
    } catch (error) {
      console.error("Admin registration error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  adminLogout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/auth/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      set({ admin: null, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Admin logout error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  validateAdminSession: async () => {
    try {
      const response = await fetch("/api/auth/admin/validate", {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        set({ admin: null });
        return false;
      }

      set({ admin: data.admin });
      return true;
    } catch (error) {
      set({ admin: null });
      return false;
    }
  },

  // Data fetching
  fetchAllEntries: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/admin?action=entries");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch entries");
      }

      set({ entries: data.entries, loading: false });
      return data.entries;
    } catch (error) {
      console.error("Fetch entries error:", error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/admin?action=users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      set({ users: data.users, loading: false });
      return data.users;
    } catch (error) {
      console.error("Fetch users error:", error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  // Settings management
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/admin?action=settings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch settings");
      }

      set({ settings: data.settings, loading: false });
      return data.settings;
    } catch (error) {
      console.error("Fetch settings error:", error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateSettings: async (settings) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateSettings",
          settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      set({ settings: data.settings, loading: false });
      return { success: true, settings: data.settings };
    } catch (error) {
      console.error("Update settings error:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }
}));
