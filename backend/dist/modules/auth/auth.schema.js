"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one number");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: passwordSchema,
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
//# sourceMappingURL=auth.schema.js.map