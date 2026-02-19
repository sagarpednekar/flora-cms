import { api } from "./client";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: { id: string; name: string; description: string | null }[];
};

export type AuthResponse = { user: User; token?: string };

export const authApi = {
  me: () => api.get<{ user: User }>("/auth/me"),
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post<AuthResponse>("/auth/register", data),
  logout: () => api.post<{ ok: boolean }>("/auth/logout", {}),
};
