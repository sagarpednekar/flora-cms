import { PrismaClient } from "@prisma/client";
import type { CreateRoleInput, UpdateRoleInput } from "./roles.schema.js";

const prisma = new PrismaClient();

export async function list() {
  return prisma.role.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });
}

export async function getById(id: string) {
  return prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });
}

export async function create(data: CreateRoleInput) {
  const existing = await prisma.role.findUnique({ where: { name: data.name } });
  if (existing) throw new Error("Role name already exists");
  return prisma.role.create({
    data: { name: data.name, description: data.description },
  });
}

export async function update(id: string, data: UpdateRoleInput) {
  if (data.name) {
    const existing = await prisma.role.findFirst({
      where: { name: data.name, NOT: { id } },
    });
    if (existing) throw new Error("Role name already exists");
  }
  return prisma.role.update({
    where: { id },
    data: {
      ...(data.name != null && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
}

export async function remove(id: string) {
  await prisma.role.delete({ where: { id } });
}
