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
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const usersService = __importStar(require("./users.service.js"));
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
async function list(req, res) {
    const result = await usersService.list(req.query);
    res.json({
        ...result,
        items: result.items.map((u) => toUserResponse(u)),
    });
}
async function getById(req, res) {
    const user = await usersService.getById(req.params.id);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json(toUserResponse(user));
}
async function create(req, res) {
    try {
        const user = await usersService.create(req.body);
        res.status(201).json(toUserResponse(user));
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Create failed";
        res.status(400).json({ error: message });
    }
}
async function update(req, res) {
    try {
        const existing = await usersService.getById(req.params.id);
        if (!existing)
            return res.status(404).json({ error: "User not found" });
        const user = await usersService.update(req.params.id, req.body);
        res.json(toUserResponse(user));
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Update failed";
        res.status(400).json({ error: message });
    }
}
async function remove(req, res) {
    const existing = await usersService.getById(req.params.id);
    if (!existing)
        return res.status(404).json({ error: "User not found" });
    await usersService.remove(req.params.id);
    res.status(204).send();
}
//# sourceMappingURL=users.controller.js.map