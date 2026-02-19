import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    roles: { role: { id: string; name: string; description: string | null } }[];
  };
}

function getToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.token ?? null;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
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
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roleName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    const hasRole = req.user.roles.some((r) => r.role.name === roleName);
    if (!hasRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
