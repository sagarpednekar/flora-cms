import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const superAdmin = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: { name: "Super Admin", description: "Full access to all features" },
  });
  const editor = await prisma.role.upsert({
    where: { name: "Editor" },
    update: {},
    create: { name: "Editor", description: "Can create and edit content" },
  });

  const existing = await prisma.user.findUnique({
    where: { email: "admin@flora.local" },
  });
  if (!existing) {
    const hash = await bcrypt.hash("Admin123!", 10);
    const user = await prisma.user.create({
      data: {
        email: "admin@flora.local",
        passwordHash: hash,
        firstName: "Super",
        lastName: "Admin",
        roles: {
          create: { roleId: superAdmin.id },
        },
      },
    });
    console.log("Created Super Admin user:", user.email);
  }

  console.log("Seeded roles:", superAdmin.name, editor.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
