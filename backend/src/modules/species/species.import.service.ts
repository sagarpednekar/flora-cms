import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { createSpeciesSchema } from "./species.schema.js";
import {
  buildHeaderToIndex,
  mapRowToSpeciesInput,
} from "./import.mapping.js";

const prisma = new PrismaClient();

const MAX_ROWS = 2000;

export type ImportResult = {
  imported: number;
  errors: { row: number; message: string }[];
};

export async function importFromBuffer(buffer: Buffer): Promise<ImportResult> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    return { imported: 0, errors: [{ row: 0, message: "No sheet found" }] };
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
  if (rows.length < 2) {
    return { imported: 0, errors: [] };
  }

  const headerRow = rows[0] as unknown[];
  const headerToIndex = buildHeaderToIndex(headerRow);

  const toCreate: Array<Record<string, unknown>> = [];
  const errors: { row: number; message: string }[] = [];

  const dataRows = rows.slice(1, 1 + MAX_ROWS);
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i] as unknown[];
    const excelRowNumber = i + 2; // 1-based, and +1 for header row

    const mapped = mapRowToSpeciesInput(row, headerToIndex);
    if (!mapped.drugName) continue; // skip empty drug name rows

    const parsed = createSpeciesSchema.safeParse(mapped);
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
    await prisma.floraSpecies.createMany({ data: toCreate as never });
  }

  return { imported: toCreate.length, errors };
}
