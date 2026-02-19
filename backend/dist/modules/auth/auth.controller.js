"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
exports.register = register;
exports.login = login;
exports.me = me;
exports.logout = logout;
const authService = __importStar(require("./auth.service.js"));
function toUserResponse(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        active: user.active,
        roles: user.roles.map((r) => ({
            id: r.role.id,
            name: r.role.name,
            description: r.role.description,
        })),
    };
}
async function register(req, res) {
    try {
        const user = await authService.register(req.body);
        const token = authService.signToken(user.id, user.email);
        res.cookie("token", token, authService.getCookieOptions());
        res.status(201).json({ user: toUserResponse(user), token });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Registration failed";
        res.status(400).json({ error: message });
    }
}
async function login(req, res) {
    try {
        const user = await authService.login(req.body);
        const token = authService.signToken(user.id, user.email);
        res.cookie("token", token, authService.getCookieOptions());
        res.json({ user: toUserResponse(user), token });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Invalid credentials";
        res.status(401).json({ error: message });
    }
}
async function me(req, res) {
    if (!req.user)
        return res.status(401).json({ error: "Not authenticated" });
    const user = await authService.findById(req.user.id);
    if (!user)
        return res.status(401).json({ error: "User not found" });
    res.json({ user: toUserResponse(user) });
}
async function logout(_req, res) {
    res.clearCookie("token", { path: "/" });
    res.json({ ok: true });
}
//# sourceMappingURL=auth.controller.js.map