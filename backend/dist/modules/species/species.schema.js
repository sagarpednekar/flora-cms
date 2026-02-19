"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSpeciesQuerySchema = exports.updateSpeciesSchema = exports.createSpeciesSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createSpeciesSchema = zod_1.z.object({
    drugName: zod_1.z.string().min(1),
    sanskritName: zod_1.z.string().optional(),
    latinName: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
    partOfPlantUsed: zod_1.z.string().optional(),
    bookName: zod_1.z.nativeEnum(client_1.BookName).default(client_1.BookName.Charaka_Samhita),
    sthana: zod_1.z.nativeEnum(client_1.Sthana).optional(),
    chapterNumber: zod_1.z.nativeEnum(client_1.ChapterNumber).optional(),
    verseNumber: zod_1.z.coerce.number().int().optional(),
    singleOrCombinationDrug: zod_1.z.nativeEnum(client_1.SingleOrCombinationDrug).optional(),
    formulationAsSingleDrug: zod_1.z.string().optional().default("NA"),
    formulationAsCombination: zod_1.z.string().optional().default("NA"),
    nameOfCombination: zod_1.z.string().optional().default("NA"),
    userExtOrInt: zod_1.z.nativeEnum(client_1.UserExtOrInt).optional(),
    typeOfExtUse: zod_1.z.string().optional(),
    enteralRoute: zod_1.z.string().optional(),
    parenteralRoute: zod_1.z.string().optional(),
    usesAsSingleDrug: zod_1.z.string().optional().default("NA"),
    usesAsCombination: zod_1.z.string().optional().default("NA"),
    anupana: zod_1.z.string().optional(),
    granthadikara: zod_1.z.string().optional(),
    rogadhikara: zod_1.z.string().optional(),
    sahapana: zod_1.z.string().optional(),
    published: zod_1.z.boolean().optional().default(false),
});
exports.updateSpeciesSchema = exports.createSpeciesSchema.partial();
exports.listSpeciesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=species.schema.js.map