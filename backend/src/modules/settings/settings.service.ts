import { PrismaClient } from "@prisma/client";
import type { PatchSettingsInput } from "./settings.schema.js";

const prisma = new PrismaClient();

const SETTINGS_KEYS = [
  "defaultRoleForNewUsers",
  "allowSignUps",
  "oneAccountPerEmail",
] as const;

export async function getSettings() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: [...SETTINGS_KEYS] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    defaultRoleForNewUsers: map.defaultRoleForNewUsers ?? null,
    allowSignUps: map.allowSignUps !== "false",
    oneAccountPerEmail: map.oneAccountPerEmail !== "false",
  };
}

export async function patchSettings(data: PatchSettingsInput) {
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    const str = typeof value === "boolean" ? String(value) : value;
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: str },
      update: { value: str },
    });
  }
  return getSettings();
}
