import { api } from "./client";

export type Settings = {
  defaultRoleForNewUsers: string | null;
  allowSignUps: boolean;
  oneAccountPerEmail: boolean;
};

export type PatchSettingsInput = Partial<Settings>;

export const settingsApi = {
  get: () => api.get<Settings>("/settings"),
  patch: (data: PatchSettingsInput) => api.patch<Settings>("/settings", data),
};
