import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from "./users.schema.js";

const prisma = new PrismaClient();

export async function list(query: ListUsersQuery) {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
        createdAt: true,
        roles: { include: { role: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function getById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
}

export async function create(data: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: {
        create: data.roleIds.map((roleId) => ({ roleId })),
      },
    },
    include: { roles: { include: { role: true } } },
  });
  return user;
}

export async function update(id: string, data: UpdateUserInput) {
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (existing) throw new Error("Email already in use");
  }

  const updateData: Parameters<typeof prisma.user.update>[0]["data"] = {
    ...(data.firstName != null && { firstName: data.firstName }),
    ...(data.lastName != null && { lastName: data.lastName }),
    ...(data.email != null && { email: data.email }),
    ...(data.active !== undefined && { active: data.active }),
  };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({ where: { id }, data: updateData });

  if (data.roleIds !== undefined) {
    await prisma.userRole.deleteMany({ where: { userId: id } });
    await prisma.userRole.createMany({
      data: data.roleIds.map((roleId) => ({ userId: id, roleId })),
    });
  }

  return prisma.user.findUniqueOrThrow({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
}

export async function remove(id: string) {
  await prisma.user.delete({ where: { id } });
}
