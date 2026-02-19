"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.getCookieOptions = getCookieOptions;
exports.register = register;
exports.login = login;
exports.findById = findById;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};
function signToken(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}
function getCookieOptions() {
    return JWT_COOKIE_OPTIONS;
}
async function register(input) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing)
        throw new Error("Email already registered");
    const editorRole = await prisma.role.findUnique({ where: { name: "Editor" } });
    if (!editorRole)
        throw new Error("Default role not found");
    const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
    const user = await prisma.user.create({
        data: {
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            roles: { create: [{ roleId: editorRole.id }] },
        },
        include: {
            roles: { include: { role: true } },
        },
    });
    return user;
}
async function login(input) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { roles: { include: { role: true } } },
    });
    if (!user || !user.active)
        throw new Error("Invalid credentials");
    const ok = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!ok)
        throw new Error("Invalid credentials");
    return user;
}
async function findById(id) {
    return prisma.user.findUnique({
        where: { id },
        include: { roles: { include: { role: true } } },
    });
}
//# sourceMappingURL=auth.service.js.map