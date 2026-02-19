import { z } from "zod";

export const patchSettingsSchema = z.object({
  defaultRoleForNewUsers: z.string().uuid().optional(),
  allowSignUps: z.boolean().optional(),
  oneAccountPerEmail: z.boolean().optional(),
});

export type PatchSettingsInput = z.infer<typeof patchSettingsSchema>;
