import {
  PrismaClient,
  BookName,
  Sthana,
  ChapterNumber,
  SingleOrCombinationDrug,
  UserExtOrInt,
} from "@prisma/client";
import type {
  CreateSpeciesInput,
  UpdateSpeciesInput,
  ListSpeciesQuery,
  FilterEntry,
} from "./species.schema.js";
import {
  filterEntrySchema,
  FILTER_FIELD_STRING,
  FILTER_FIELD_ENUM,
  FILTER_FIELD_NUMBER,
  FILTER_FIELD_BOOLEAN,
  FILTER_OPERATORS_STRING,
  FILTER_OPERATORS_ENUM,
  FILTER_OPERATORS_NUMBER,
  FILTER_OPERATORS_BOOLEAN,
} from "./species.schema.js";
import type { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const ENUM_SETS = {
  bookName: new Set<string>(Object.values(BookName)),
  sthana: new Set<string>(Object.values(Sthana)),
  chapterNumber: new Set<string>(Object.values(ChapterNumber)),
  singleOrCombinationDrug: new Set<string>(Object.values(SingleOrCombinationDrug)),
  userExtOrInt: new Set<string>(Object.values(UserExtOrInt)),
} as const;

function parseFilters(filtersJson: string | undefined): FilterEntry[] {
  if (!filtersJson || typeof filtersJson !== "string") return [];
  try {
    const raw = JSON.parse(filtersJson) as unknown;
    if (!Array.isArray(raw)) return [];
    const out: FilterEntry[] = [];
    for (const item of raw) {
      const parsed = filterEntrySchema.safeParse(item);
      if (!parsed.success) continue;
      const { field, operator, value } = parsed.data;
      const fieldStr = FILTER_FIELD_STRING.includes(field as (typeof FILTER_FIELD_STRING)[number]);
      const fieldEnum = FILTER_FIELD_ENUM.includes(field as (typeof FILTER_FIELD_ENUM)[number]);
      const fieldNum = FILTER_FIELD_NUMBER.includes(field as (typeof FILTER_FIELD_NUMBER)[number]);
      const fieldBool = FILTER_FIELD_BOOLEAN.includes(field as (typeof FILTER_FIELD_BOOLEAN)[number]);
      if (!fieldStr && !fieldEnum && !fieldNum && !fieldBool) continue;
      if (fieldStr && !FILTER_OPERATORS_STRING.includes(operator as (typeof FILTER_OPERATORS_STRING)[number])) continue;
      if (fieldEnum && !FILTER_OPERATORS_ENUM.includes(operator as (typeof FILTER_OPERATORS_ENUM)[number])) continue;
      if (fieldNum && !FILTER_OPERATORS_NUMBER.includes(operator as (typeof FILTER_OPERATORS_NUMBER)[number])) continue;
      if (fieldBool && !FILTER_OPERATORS_BOOLEAN.includes(operator as (typeof FILTER_OPERATORS_BOOLEAN)[number])) continue;
      if (operator !== "empty" && (value === undefined || value === null)) continue;
      if (fieldEnum && operator !== "empty" && value !== undefined && value !== null) {
        const arr = Array.isArray(value) ? value : [String(value)];
        if (field in ENUM_SETS) {
          const valid = arr.every((v) => (ENUM_SETS as Record<string, Set<string>>)[field].has(String(v)));
          if (!valid) continue;
        }
      }
      out.push(parsed.data);
    }
    return out;
  } catch {
    return [];
  }
}

function buildWhereFromFilters(filters: FilterEntry[]): Prisma.FloraSpeciesWhereInput {
  const andClauses: Prisma.FloraSpeciesWhereInput[] = [];
  const insensitive = "insensitive" as const;
  for (const { field, operator, value } of filters) {
    if (operator === "empty") {
      if (FILTER_FIELD_STRING.includes(field as (typeof FILTER_FIELD_STRING)[number])) {
        andClauses.push({
          [field]: { OR: [{ equals: null }, { equals: "" }] },
        } as Prisma.FloraSpeciesWhereInput);
      } else {
        andClauses.push({ [field]: { equals: null } } as Prisma.FloraSpeciesWhereInput);
      }
      continue;
    }
    if (value === undefined || value === null) continue;
    if (FILTER_FIELD_STRING.includes(field as (typeof FILTER_FIELD_STRING)[number])) {
      const str = String(value);
      if (operator === "contains") {
        andClauses.push({ [field]: { contains: str, mode: insensitive } } as Prisma.FloraSpeciesWhereInput);
      } else if (operator === "eq") {
        andClauses.push({ [field]: { equals: str, mode: insensitive } } as Prisma.FloraSpeciesWhereInput);
      }
    } else if (FILTER_FIELD_ENUM.includes(field as (typeof FILTER_FIELD_ENUM)[number])) {
      if (operator === "eq") {
        andClauses.push({ [field]: { equals: value as string } } as Prisma.FloraSpeciesWhereInput);
      } else if (operator === "in" && Array.isArray(value)) {
        andClauses.push({ [field]: { in: value } } as Prisma.FloraSpeciesWhereInput);
      }
    } else if (FILTER_FIELD_NUMBER.includes(field as (typeof FILTER_FIELD_NUMBER)[number])) {
      const num = Number(value);
      if (Number.isNaN(num)) continue;
      if (operator === "eq") andClauses.push({ [field]: { equals: num } } as Prisma.FloraSpeciesWhereInput);
      else if (operator === "gte") andClauses.push({ [field]: { gte: num } } as Prisma.FloraSpeciesWhereInput);
      else if (operator === "lte") andClauses.push({ [field]: { lte: num } } as Prisma.FloraSpeciesWhereInput);
    } else if (FILTER_FIELD_BOOLEAN.includes(field as (typeof FILTER_FIELD_BOOLEAN)[number])) {
      const bool = value === true || value === "true";
      andClauses.push({ [field]: { equals: bool } } as Prisma.FloraSpeciesWhereInput);
    }
  }
  if (andClauses.length === 0) return {};
  if (andClauses.length === 1) return andClauses[0]!;
  return { AND: andClauses };
}

export async function list(query: ListSpeciesQuery) {
  const { page, limit, search, filters: filtersJson } = query;
  const skip = (page - 1) * limit;
  const searchWhere: Prisma.FloraSpeciesWhereInput = search
    ? {
        OR: [
          { drugName: { contains: search, mode: "insensitive" } },
          { sanskritName: { contains: search, mode: "insensitive" } },
          { latinName: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};
  const filters = parseFilters(filtersJson);
  const filterWhere = buildWhereFromFilters(filters);
  const where: Prisma.FloraSpeciesWhereInput = (() => {
    const parts: Prisma.FloraSpeciesWhereInput[] = [];
    if (Object.keys(searchWhere).length > 0) parts.push(searchWhere);
    if (Object.keys(filterWhere).length > 0) parts.push(filterWhere);
    if (parts.length === 0) return {};
    if (parts.length === 1) return parts[0]!;
    return { AND: parts };
  })();
  const [items, total] = await Promise.all([
    prisma.floraSpecies.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
    prisma.floraSpecies.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function getById(id: string) {
  return prisma.floraSpecies.findUnique({ where: { id } });
}

export async function create(data: CreateSpeciesInput) {
  return prisma.floraSpecies.create({
    data: {
      drugName: data.drugName,
      sanskritName: data.sanskritName,
      latinName: data.latinName,
      remarks: data.remarks,
      partOfPlantUsed: data.partOfPlantUsed,
      bookName: data.bookName ?? BookName.Charaka_Samhita,
      sthana: data.sthana,
      chapterNumber: data.chapterNumber,
      verseNumber: data.verseNumber,
      singleOrCombinationDrug: data.singleOrCombinationDrug,
      formulationAsSingleDrug: data.formulationAsSingleDrug ?? "NA",
      formulationAsCombination: data.formulationAsCombination ?? "NA",
      nameOfCombination: data.nameOfCombination ?? "NA",
      userExtOrInt: data.userExtOrInt,
      typeOfExtUse: data.typeOfExtUse,
      enteralRoute: data.enteralRoute,
      parenteralRoute: data.parenteralRoute,
      usesAsSingleDrug: data.usesAsSingleDrug ?? "NA",
      usesAsCombination: data.usesAsCombination ?? "NA",
      anupana: data.anupana,
      granthadikara: data.granthadikara,
      rogadhikara: data.rogadhikara,
      sahapana: data.sahapana,
      published: data.published ?? false,
    },
  });
}

export async function update(id: string, data: UpdateSpeciesInput) {
  return prisma.floraSpecies.update({
    where: { id },
    data: {
      ...(data.drugName != null && { drugName: data.drugName }),
      ...(data.sanskritName !== undefined && { sanskritName: data.sanskritName }),
      ...(data.latinName !== undefined && { latinName: data.latinName }),
      ...(data.remarks !== undefined && { remarks: data.remarks }),
      ...(data.partOfPlantUsed !== undefined && { partOfPlantUsed: data.partOfPlantUsed }),
      ...(data.bookName != null && { bookName: data.bookName }),
      ...(data.sthana !== undefined && { sthana: data.sthana }),
      ...(data.chapterNumber !== undefined && { chapterNumber: data.chapterNumber }),
      ...(data.verseNumber !== undefined && { verseNumber: data.verseNumber }),
      ...(data.singleOrCombinationDrug !== undefined && {
        singleOrCombinationDrug: data.singleOrCombinationDrug,
      }),
      ...(data.formulationAsSingleDrug !== undefined && {
        formulationAsSingleDrug: data.formulationAsSingleDrug,
      }),
      ...(data.formulationAsCombination !== undefined && {
        formulationAsCombination: data.formulationAsCombination,
      }),
      ...(data.nameOfCombination !== undefined && { nameOfCombination: data.nameOfCombination }),
      ...(data.userExtOrInt !== undefined && { userExtOrInt: data.userExtOrInt }),
      ...(data.typeOfExtUse !== undefined && { typeOfExtUse: data.typeOfExtUse }),
      ...(data.enteralRoute !== undefined && { enteralRoute: data.enteralRoute }),
      ...(data.parenteralRoute !== undefined && { parenteralRoute: data.parenteralRoute }),
      ...(data.usesAsSingleDrug !== undefined && { usesAsSingleDrug: data.usesAsSingleDrug }),
      ...(data.usesAsCombination !== undefined && { usesAsCombination: data.usesAsCombination }),
      ...(data.anupana !== undefined && { anupana: data.anupana }),
      ...(data.granthadikara !== undefined && { granthadikara: data.granthadikara }),
      ...(data.rogadhikara !== undefined && { rogadhikara: data.rogadhikara }),
      ...(data.sahapana !== undefined && { sahapana: data.sahapana }),
      ...(data.published !== undefined && { published: data.published }),
    },
  });
}

export async function remove(id: string) {
  await prisma.floraSpecies.delete({ where: { id } });
}
