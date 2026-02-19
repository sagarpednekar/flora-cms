import { api } from "./client";

export type UserListItem = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: { id: string; name: string; description: string | null }[];
};

export type UsersListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleIds: string[];
};

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  roleIds?: string[];
  active?: boolean;
};

export const usersApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<UsersListResponse>("/users", params as Record<string, string | number | undefined>),
  get: (id: string) => api.get<UserListItem>(`/users/${id}`),
  create: (data: CreateUserInput) => api.post<UserListItem>("/users", data),
  update: (id: string, data: UpdateUserInput) => api.put<UserListItem>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
