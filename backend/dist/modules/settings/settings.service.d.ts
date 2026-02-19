import type { PatchSettingsInput } from "./settings.schema.js";
export declare function getSettings(): Promise<{
    defaultRoleForNewUsers: string;
    allowSignUps: boolean;
    oneAccountPerEmail: boolean;
}>;
export declare function patchSettings(data: PatchSettingsInput): Promise<{
    defaultRoleForNewUsers: string;
    allowSignUps: boolean;
    oneAccountPerEmail: boolean;
}>;
//# sourceMappingURL=settings.service.d.ts.map