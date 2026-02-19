import {
  BookName,
  Sthana,
  ChapterNumber,
  SingleOrCombinationDrug,
  UserExtOrInt,
} from "@prisma/client";
import type { CreateSpeciesInput } from "./species.schema.js";

/** Excel header (trimmed) -> FloraSpecies field name */
export const EXCEL_HEADER_TO_FIELD: Record<string, string> = {
  "NAME OF DRUG MENTIONED": "drugName",
  "Sanskrit Name": "sanskritName",
  "Latin name": "latinName",
  "NAME OF SAMHITA": "bookName",
  STHANA: "sthana",
  ADHYAYA: "chapterNumber",
  SUTRA: "verseNumber",
  COMMENTRY: "commentry",
  "PART OF PLANT USED": "partOfPlantUsed",
  "USED AS SINGLE DRUG /COMBINATION": "singleOrCombinationDrug",
  "FORMULATION AS A SINGLE DRUG": "formulationAsSingleDrug",
  "FORMULATION AS COMBINATION": "formulationAsCombination",
  "NAME OF THE COMBINATION": "nameOfCombination",
  "USE-INT/EXT": "userExtOrInt",
  "TYPE OF EXT USE": "typeOfExtUse",
  "ENTERAL ROUTE": "enteralRoute",
  "PARENTERAL ROUTE": "parenteralRoute",
  "USES AS SINGLE DRUG": "usesAsSingleDrug",
  "USES AS COMBINATION": "usesAsCombination",
  "1.SAHAPANA /2.SAHAYOGI DRAVYA": "sahapana",
  ANUPANA: "anupana",
  GRANTHADIKARA: "granthadikara",
  ROGADHIKARA: "rogadhikara",
  REMARKS: "remarks",
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ").trim();
}

function cell(row: unknown[], index: number): string {
  const v = row[index];
  if (v == null) return "";
  return String(v).trim();
}

function cellInt(row: unknown[], index: number): number | undefined {
  const v = row[index];
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : Math.floor(n);
}

export function normalizeBookName(s: string): BookName {
  const t = s.trim();
  if (/charaka/i.test(t)) return BookName.Charaka_Samhita;
  if (/sushruta/i.test(t)) return BookName.Sushruta_Samhita;
  if (/ashtang\s*hridaya/i.test(t)) return BookName.Ashtang_Hridaya;
  if (/ashtang\s*samgraha/i.test(t)) return BookName.Ashtang_Samgraha;
  return BookName.Charaka_Samhita;
}

const STHANA_MAP: Record<string, Sthana> = {
  "chikitsa sthana": Sthana.Chikitsa_Sthana,
  "indriya sthana": Sthana.Indriya_Sthana,
  "kalpa sthana": Sthana.Kalpa_Sthana,
  "kalpa siddhi sthana": Sthana.Kalpa_siddhi_Sthana,
  "kalpana sthana": Sthana.Kalpana_Sthana,
  "nidana sthana": Sthana.Nidana_Sthana,
  "sharir sthana": Sthana.Sharir_Sthana,
  "sidhi sthana": Sthana.Sidhi_Sthana,
  "sutra sthana": Sthana.Sutra_Sthana,
  "uttar tantra": Sthana.Uttar_Tantra,
  "vimana sthana": Sthana.Vimana_Sthana,
};

export function normalizeSthana(s: string): Sthana | null {
  const t = s.trim().toLowerCase();
  return STHANA_MAP[t] ?? null;
}

export function normalizeChapterNumber(s: string): ChapterNumber | null {
  const t = s.trim();
  const match = t.match(/(\d+)/);
  const n = match ? parseInt(match[1], 10) : NaN;
  if (Number.isNaN(n) || n < 1 || n > 50) return null;
  const key = `Chapter_${n}` as keyof typeof ChapterNumber;
  return ChapterNumber[key] ?? null;
}

export function normalizeSingleOrCombination(s: string): SingleOrCombinationDrug {
  const t = s.trim().toLowerCase();
  if (t.includes("combination") && !t.includes("single")) return SingleOrCombinationDrug.Combination;
  if (t.includes("both")) return SingleOrCombinationDrug.Both;
  if (t.includes("other")) return SingleOrCombinationDrug.Other;
  return SingleOrCombinationDrug.Single;
}

export function normalizeUserExtOrInt(s: string): UserExtOrInt {
  const t = s.trim().toUpperCase();
  return t === "EXT" ? UserExtOrInt.EXT : UserExtOrInt.INT;
}

/** Build header name -> column index from first row (array of cell values). Keys are normalized for case- and space-insensitive lookup. */
export function buildHeaderToIndex(headers: unknown[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] ?? "").trim();
    if (h) out[normalizeHeader(h)] = i;
  }
  return out;
}

/** Map one Excel row (array) to CreateSpeciesInput using headerToIndex. COMMENTRY + REMARKS -> remarks. */
export function mapRowToSpeciesInput(
  row: unknown[],
  headerToIndex: Record<string, number>
): Partial<CreateSpeciesInput> & { drugName: string } {
  const get = (header: string) => cell(row, headerToIndex[normalizeHeader(header)] ?? -1);
  const getInt = (header: string) => cellInt(row, headerToIndex[normalizeHeader(header)] ?? -1);

  const commentry = get("COMMENTRY");
  const remarks = get("REMARKS");
  const remarksCombined = [commentry, remarks].filter(Boolean).join(" | ") || undefined;

  const drugName = get("NAME OF DRUG MENTIONED");
  const bookNameRaw = get("NAME OF SAMHITA");
  const sthanaRaw = get("STHANA");
  const chapterRaw = get("ADHYAYA");
  const singleComboRaw = get("USED AS SINGLE DRUG /COMBINATION");
  const userExtIntRaw = get("USE-INT/EXT");

  return {
    drugName,
    sanskritName: get("Sanskrit Name") || undefined,
    latinName: get("Latin name") || undefined,
    remarks: remarksCombined,
    partOfPlantUsed: get("PART OF PLANT USED") || undefined,
    bookName: normalizeBookName(bookNameRaw),
    sthana: normalizeSthana(sthanaRaw) ?? undefined,
    chapterNumber: normalizeChapterNumber(chapterRaw) ?? undefined,
    verseNumber: getInt("SUTRA"),
    singleOrCombinationDrug: normalizeSingleOrCombination(singleComboRaw),
    formulationAsSingleDrug: get("FORMULATION AS A SINGLE DRUG") || "NA",
    formulationAsCombination: get("FORMULATION AS COMBINATION") || "NA",
    nameOfCombination: get("NAME OF THE COMBINATION") || "NA",
    userExtOrInt: normalizeUserExtOrInt(userExtIntRaw),
    typeOfExtUse: get("TYPE OF EXT USE") || undefined,
    enteralRoute: get("ENTERAL ROUTE") || undefined,
    parenteralRoute: get("PARENTERAL ROUTE") || undefined,
    usesAsSingleDrug: get("USES AS SINGLE DRUG") || "NA",
    usesAsCombination: get("USES AS COMBINATION") || "NA",
    sahapana: get("1.SAHAPANA /2.SAHAYOGI DRAVYA") || undefined,
    anupana: get("ANUPANA") || undefined,
    granthadikara: get("GRANTHADIKARA") || undefined,
    rogadhikara: get("ROGADHIKARA") || undefined,
    published: false,
  };
}
