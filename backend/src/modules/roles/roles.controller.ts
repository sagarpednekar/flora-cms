import { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import * as rolesService from "./roles.service.js";

export async function list(_req: AuthRequest, res: Response) {
  const roles = await rolesService.list();
  res.json(roles.map((r) => ({ id: r.id, name: r.name, description: r.description, userCount: r._count.users })));
}

export async function getById(req: AuthRequest, res: Response) {
  const role = await rolesService.getById(req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  res.json({ id: role.id, name: role.name, description: role.description, userCount: role._count.users });
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const role = await rolesService.create(req.body);
    res.status(201).json(role);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    res.status(400).json({ error: message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const existing = await rolesService.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Role not found" });
    const role = await rolesService.update(req.params.id, req.body);
    res.json(role);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    res.status(400).json({ error: message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  const existing = await rolesService.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Role not found" });
  await rolesService.remove(req.params.id);
  res.status(204).send();
}
