import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../services/auth";
import { authService } from "../services/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  loadToken: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        await authService.storeToken(user.id, token);
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user: User) => {
        set({ user });
      },
      loadToken: async (userId: string) => {
        try {
          const token = await authService.getToken(userId);
          if (token) {
            set({ token, isAuthenticated: true });
          } else {
            console.warn("Token not found");
          }
        } catch (error) {
          console.error("Failed to load token:", error);
          // Do not change the authentication state here
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
