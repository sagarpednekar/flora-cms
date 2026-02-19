import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

export function getCookieOptions() {
  return JWT_COOKIE_OPTIONS;
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already registered");

  const editorRole = await prisma.role.findUnique({ where: { name: "Editor" } });
  if (!editorRole) throw new Error("Default role not found");

  const passwordHash = await bcrypt.hash(input.password, 10);
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

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { roles: { include: { role: true } } },
  });
  if (!user || !user.active) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  return user;
}

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
}
