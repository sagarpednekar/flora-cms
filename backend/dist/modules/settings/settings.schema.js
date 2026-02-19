"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchSettingsSchema = void 0;
const zod_1 = require("zod");
exports.patchSettingsSchema = zod_1.z.object({
    defaultRoleForNewUsers: zod_1.z.string().uuid().optional(),
    allowSignUps: zod_1.z.boolean().optional(),
    oneAccountPerEmail: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=settings.schema.js.map