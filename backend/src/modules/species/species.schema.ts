import { z } from "zod";
import {
  BookName,
  Sthana,
  ChapterNumber,
  SingleOrCombinationDrug,
  UserExtOrInt,
} from "@prisma/client";

/** Filter entry as sent from client (field, operator, optional value). */
export const filterEntrySchema = z.object({
  field: z.string(),
  operator: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
});
export type FilterEntry = z.infer<typeof filterEntrySchema>;

/** Filterable field types for validation and operators. */
export const FILTER_FIELD_STRING = [
  "drugName", "sanskritName", "latinName", "remarks", "partOfPlantUsed",
  "formulationAsSingleDrug", "formulationAsCombination", "nameOfCombination",
  "typeOfExtUse", "enteralRoute", "parenteralRoute", "usesAsSingleDrug", "usesAsCombination",
  "anupana", "granthadikara", "rogadhikara", "sahapana",
] as const;
export const FILTER_FIELD_ENUM = ["bookName", "sthana", "chapterNumber", "singleOrCombinationDrug", "userExtOrInt"] as const;
export const FILTER_FIELD_NUMBER = ["verseNumber"] as const;
export const FILTER_FIELD_BOOLEAN = ["published"] as const;
export const FILTER_FIELD_ALL = [...FILTER_FIELD_STRING, ...FILTER_FIELD_ENUM, ...FILTER_FIELD_NUMBER, ...FILTER_FIELD_BOOLEAN] as const;
export const FILTER_OPERATORS_STRING = ["contains", "eq", "empty"] as const;
export const FILTER_OPERATORS_ENUM = ["eq", "in", "empty"] as const;
export const FILTER_OPERATORS_NUMBER = ["eq", "gte", "lte", "empty"] as const;
export const FILTER_OPERATORS_BOOLEAN = ["eq"] as const;

export const createSpeciesSchema = z.object({
  drugName: z.string().min(1),
  sanskritName: z.string().optional(),
  latinName: z.string().optional(),
  remarks: z.string().optional(),
  partOfPlantUsed: z.string().optional(),
  bookName: z.nativeEnum(BookName).default(BookName.Charaka_Samhita),
  sthana: z.nativeEnum(Sthana).optional(),
  chapterNumber: z.nativeEnum(ChapterNumber).optional(),
  verseNumber: z.coerce.number().int().optional(),
  singleOrCombinationDrug: z.nativeEnum(SingleOrCombinationDrug).optional(),
  formulationAsSingleDrug: z.string().optional().default("NA"),
  formulationAsCombination: z.string().optional().default("NA"),
  nameOfCombination: z.string().optional().default("NA"),
  userExtOrInt: z.nativeEnum(UserExtOrInt).optional(),
  typeOfExtUse: z.string().optional(),
  enteralRoute: z.string().optional(),
  parenteralRoute: z.string().optional(),
  usesAsSingleDrug: z.string().optional().default("NA"),
  usesAsCombination: z.string().optional().default("NA"),
  anupana: z.string().optional(),
  granthadikara: z.string().optional(),
  rogadhikara: z.string().optional(),
  sahapana: z.string().optional(),
  published: z.boolean().optional().default(false),
});

export const updateSpeciesSchema = createSpeciesSchema.partial();

export const listSpeciesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  filters: z.string().optional(),
});

export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>;
export type UpdateSpeciesInput = z.infer<typeof updateSpeciesSchema>;
export type ListSpeciesQuery = z.infer<typeof listSpeciesQuerySchema>;
