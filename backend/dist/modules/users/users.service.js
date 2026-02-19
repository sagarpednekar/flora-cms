"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function list(query) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = search
        ? {
            OR: [
                { email: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
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
async function getById(id) {
    return prisma.user.findUnique({
        where: { id },
        include: { roles: { include: { role: true } } },
    });
}
async function create(data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error("Email already in use");
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
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
async function update(id, data) {
    if (data.email) {
        const existing = await prisma.user.findFirst({
            where: { email: data.email, NOT: { id } },
        });
        if (existing)
            throw new Error("Email already in use");
    }
    const updateData = {
        ...(data.firstName != null && { firstName: data.firstName }),
        ...(data.lastName != null && { lastName: data.lastName }),
        ...(data.email != null && { email: data.email }),
        ...(data.active !== undefined && { active: data.active }),
    };
    if (data.password) {
        updateData.passwordHash = await bcryptjs_1.default.hash(data.password, 10);
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
async function remove(id) {
    await prisma.user.delete({ where: { id } });
}
//# sourceMappingURL=users.service.js.map