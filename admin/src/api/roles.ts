import { api } from "./client";

export type Role = {
  id: string;
  name: string;
  description: string | null;
  userCount?: number;
};

export type CreateRoleInput = { name: string; description?: string };
export type UpdateRoleInput = { name?: string; description?: string };

export const rolesApi = {
  list: () => api.get<Role[]>("/roles"),
  get: (id: string) => api.get<Role>(`/roles/${id}`),
  create: (data: CreateRoleInput) => api.post<Role>("/roles", data),
  update: (id: string, data: UpdateRoleInput) => api.put<Role>(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
};
