import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../services/auth";
import apiInstance from "../services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const customStorage = {
  getItem: async (name: string) => {
    try {
      const response = await apiInstance.get(`/storage/${name}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get item from custom storage", error);
      return null;
    }
  },
  setItem: async (name: string, value: any) => {
    try {
      await apiInstance.post(`/storage/${name}`, { value });
    } catch (error) {
      console.error("Failed to set item in custom storage", error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await apiInstance.delete(`/storage/${name}`);
    } catch (error) {
      console.error("Failed to remove item from custom storage", error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      storage: customStorage,
    }
  )
);
