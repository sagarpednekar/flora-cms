import { z } from "zod";
export declare const patchSettingsSchema: z.ZodObject<{
    defaultRoleForNewUsers: z.ZodOptional<z.ZodString>;
    allowSignUps: z.ZodOptional<z.ZodBoolean>;
    oneAccountPerEmail: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    defaultRoleForNewUsers?: string | undefined;
    allowSignUps?: boolean | undefined;
    oneAccountPerEmail?: boolean | undefined;
}, {
    defaultRoleForNewUsers?: string | undefined;
    allowSignUps?: boolean | undefined;
    oneAccountPerEmail?: boolean | undefined;
}>;
export type PatchSettingsInput = z.infer<typeof patchSettingsSchema>;
//# sourceMappingURL=settings.schema.d.ts.map