"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function getToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer "))
        return authHeader.slice(7);
    return req.cookies?.token ?? null;
}
function authenticate(req, res, next) {
    const token = getToken(req);
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        prisma.user
            .findUnique({
            where: { id: payload.userId },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        })
            .then((user) => {
            if (!user || !user.active) {
                return res.status(401).json({ error: "Invalid or inactive user" });
            }
            req.user = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                active: user.active,
                roles: user.roles,
            };
            next();
        })
            .catch(() => res.status(500).json({ error: "Authentication failed" }));
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
function requireRole(roleName) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Authentication required" });
        const hasRole = req.user.roles.some((r) => r.role.name === roleName);
        if (!hasRole) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
}
//# sourceMappingURL=authenticate.js.map