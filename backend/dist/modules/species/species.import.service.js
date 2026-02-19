"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFromBuffer = importFromBuffer;
const XLSX = __importStar(require("xlsx"));
const client_1 = require("@prisma/client");
const species_schema_js_1 = require("./species.schema.js");
const import_mapping_js_1 = require("./import.mapping.js");
const prisma = new client_1.PrismaClient();
const MAX_ROWS = 2000;
async function importFromBuffer(buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
        return { imported: 0, errors: [{ row: 0, message: "No sheet found" }] };
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length < 2) {
        return { imported: 0, errors: [] };
    }
    const headerRow = rows[0];
    const headerToIndex = (0, import_mapping_js_1.buildHeaderToIndex)(headerRow);
    const toCreate = [];
    const errors = [];
    const dataRows = rows.slice(1, 1 + MAX_ROWS);
    for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const excelRowNumber = i + 2; // 1-based, and +1 for header row
        const mapped = (0, import_mapping_js_1.mapRowToSpeciesInput)(row, headerToIndex);
        if (!mapped.drugName)
            continue; // skip empty drug name rows
        const parsed = species_schema_js_1.createSpeciesSchema.safeParse(mapped);
        if (!parsed.success) {
            const firstError = parsed.error.flatten().fieldErrors;
            const msg = Object.entries(firstError)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join("; ");
            errors.push({ row: excelRowNumber, message: msg });
            continue;
        }
        toCreate.push({
            drugName: parsed.data.drugName,
            sanskritName: parsed.data.sanskritName ?? null,
            latinName: parsed.data.latinName ?? null,
            remarks: parsed.data.remarks ?? null,
            partOfPlantUsed: parsed.data.partOfPlantUsed ?? null,
            bookName: parsed.data.bookName ?? "Charaka_Samhita",
            sthana: parsed.data.sthana ?? null,
            chapterNumber: parsed.data.chapterNumber ?? null,
            verseNumber: parsed.data.verseNumber ?? null,
            singleOrCombinationDrug: parsed.data.singleOrCombinationDrug ?? "Single",
            formulationAsSingleDrug: parsed.data.formulationAsSingleDrug ?? "NA",
            formulationAsCombination: parsed.data.formulationAsCombination ?? "NA",
            nameOfCombination: parsed.data.nameOfCombination ?? "NA",
            userExtOrInt: parsed.data.userExtOrInt ?? "INT",
            typeOfExtUse: parsed.data.typeOfExtUse ?? null,
            enteralRoute: parsed.data.enteralRoute ?? null,
            parenteralRoute: parsed.data.parenteralRoute ?? null,
            usesAsSingleDrug: parsed.data.usesAsSingleDrug ?? "NA",
            usesAsCombination: parsed.data.usesAsCombination ?? "NA",
            anupana: parsed.data.anupana ?? null,
            granthadikara: parsed.data.granthadikara ?? null,
            rogadhikara: parsed.data.rogadhikara ?? null,
            sahapana: parsed.data.sahapana ?? null,
            published: parsed.data.published ?? false,
        });
    }
    if (toCreate.length > 0) {
        await prisma.floraSpecies.createMany({ data: toCreate });
    }
    return { imported: toCreate.length, errors };
}
//# sourceMappingURL=species.import.service.js.map