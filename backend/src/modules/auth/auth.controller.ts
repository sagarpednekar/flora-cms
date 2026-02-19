import { Response } from "express";
import * as authService from "./auth.service.js";
import type { AuthRequest } from "../../middleware/authenticate.js";

export function toUserResponse(user: {
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

export async function register(req: AuthRequest, res: Response) {
  try {
    const user = await authService.register(req.body);
    const token = authService.signToken(user.id, user.email);
    res.cookie("token", token, authService.getCookieOptions());
    res.status(201).json({ user: toUserResponse(user), token });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed";
    res.status(400).json({ error: message });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const user = await authService.login(req.body);
    const token = authService.signToken(user.id, user.email);
    res.cookie("token", token, authService.getCookieOptions());
    res.json({ user: toUserResponse(user), token });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid credentials";
    res.status(401).json({ error: message });
  }
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const user = await authService.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "User not found" });
  res.json({ user: toUserResponse(user) });
}

export async function logout(_req: AuthRequest, res: Response) {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
}
