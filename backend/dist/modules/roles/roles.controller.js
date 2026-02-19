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
const rolesService = __importStar(require("./roles.service.js"));
async function list(_req, res) {
    const roles = await rolesService.list();
    res.json(roles.map((r) => ({ id: r.id, name: r.name, description: r.description, userCount: r._count.users })));
}
async function getById(req, res) {
    const role = await rolesService.getById(req.params.id);
    if (!role)
        return res.status(404).json({ error: "Role not found" });
    res.json({ id: role.id, name: role.name, description: role.description, userCount: role._count.users });
}
async function create(req, res) {
    try {
        const role = await rolesService.create(req.body);
        res.status(201).json(role);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Create failed";
        res.status(400).json({ error: message });
    }
}
async function update(req, res) {
    try {
        const existing = await rolesService.getById(req.params.id);
        if (!existing)
            return res.status(404).json({ error: "Role not found" });
        const role = await rolesService.update(req.params.id, req.body);
        res.json(role);
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Update failed";
        res.status(400).json({ error: message });
    }
}
async function remove(req, res) {
    const existing = await rolesService.getById(req.params.id);
    if (!existing)
        return res.status(404).json({ error: "Role not found" });
    await rolesService.remove(req.params.id);
    res.status(204).send();
}
//# sourceMappingURL=roles.controller.js.map