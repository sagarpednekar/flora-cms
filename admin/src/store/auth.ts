import { create } from "zustand";
import type { User } from "@/api/auth";

const TOKEN_KEY = "flora_auth_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setToken: (token) => saveToken(token),
  logout: () => {
    clearToken();
    set({ user: null });
  },
}));
