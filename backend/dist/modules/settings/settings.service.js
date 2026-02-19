"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.patchSettings = patchSettings;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SETTINGS_KEYS = [
    "defaultRoleForNewUsers",
    "allowSignUps",
    "oneAccountPerEmail",
];
async function getSettings() {
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
async function patchSettings(data) {
    for (const [key, value] of Object.entries(data)) {
        if (value === undefined)
            continue;
        const str = typeof value === "boolean" ? String(value) : value;
        await prisma.setting.upsert({
            where: { key },
            create: { key, value: str },
            update: { value: str },
        });
    }
    return getSettings();
}
//# sourceMappingURL=settings.service.js.map