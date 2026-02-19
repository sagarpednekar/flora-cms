import { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import type { ListUsersQuery } from "./users.schema.js";
import * as usersService from "./users.service.js";

function toUserResponse(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: { role: { id: string; name: string; description: string | null } }[];
}) {
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

export async function list(req: AuthRequest, res: Response) {
  const result = await usersService.list(req.query as unknown as ListUsersQuery);
  res.json({
    ...result,
    items: result.items.map((u) => toUserResponse(u)),
  });
}

export async function getById(req: AuthRequest, res: Response) {
  const user = await usersService.getById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(toUserResponse(user));
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const user = await usersService.create(req.body);
    res.status(201).json(toUserResponse(user));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    res.status(400).json({ error: message });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const existing = await usersService.getById(req.params.id);
    if (!existing) return res.status(404).json({ error: "User not found" });
    const user = await usersService.update(req.params.id, req.body);
    res.json(toUserResponse(user));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    res.status(400).json({ error: message });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  const existing = await usersService.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found" });
  await usersService.remove(req.params.id);
  res.status(204).send();
}
