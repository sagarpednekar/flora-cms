"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function list() {
    return prisma.role.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { users: true } } },
    });
}
async function getById(id) {
    return prisma.role.findUnique({
        where: { id },
        include: { _count: { select: { users: true } } },
    });
}
async function create(data) {
    const existing = await prisma.role.findUnique({ where: { name: data.name } });
    if (existing)
        throw new Error("Role name already exists");
    return prisma.role.create({
        data: { name: data.name, description: data.description },
    });
}
async function update(id, data) {
    if (data.name) {
        const existing = await prisma.role.findFirst({
            where: { name: data.name, NOT: { id } },
        });
        if (existing)
            throw new Error("Role name already exists");
    }
    return prisma.role.update({
        where: { id },
        data: {
            ...(data.name != null && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
        },
    });
}
async function remove(id) {
    await prisma.role.delete({ where: { id } });
}
//# sourceMappingURL=roles.service.js.map