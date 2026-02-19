import { api } from "./client";
import { apiUrl } from "@/lib/utils";

export type ImportResult = {
  imported: number;
  errors: { row: number; message: string }[];
};

// Match backend Prisma enums (identifier names)
export type BookName =
  | "Charaka_Samhita"
  | "Sushruta_Samhita"
  | "Ashtang_Hridaya"
  | "Ashtang_Samgraha";
export type Sthana =
  | "Chikitsa_Sthana"
  | "Indriya_Sthana"
  | "Kalpa_Sthana"
  | "Kalpa_siddhi_Sthana"
  | "Kalpana_Sthana"
  | "Nidana_Sthana"
  | "Sharir_Sthana"
  | "Sidhi_Sthana"
  | "Sutra_Sthana"
  | "Uttar_Tantra"
  | "Vimana_Sthana";
export type ChapterNumber =
  | "Chapter_1"
  | "Chapter_2"
  | "Chapter_3"
  | "Chapter_4"
  | "Chapter_5"
  | "Chapter_6"
  | "Chapter_7"
  | "Chapter_8"
  | "Chapter_9"
  | "Chapter_10"
  | "Chapter_11"
  | "Chapter_12"
  | "Chapter_13"
  | "Chapter_14"
  | "Chapter_15"
  | "Chapter_16"
  | "Chapter_17"
  | "Chapter_18"
  | "Chapter_19"
  | "Chapter_20"
  | "Chapter_21"
  | "Chapter_22"
  | "Chapter_23"
  | "Chapter_24"
  | "Chapter_25"
  | "Chapter_26"
  | "Chapter_27"
  | "Chapter_28"
  | "Chapter_29"
  | "Chapter_30"
  | "Chapter_31"
  | "Chapter_32"
  | "Chapter_33"
  | "Chapter_34"
  | "Chapter_35"
  | "Chapter_36"
  | "Chapter_37"
  | "Chapter_38"
  | "Chapter_39"
  | "Chapter_40"
  | "Chapter_41"
  | "Chapter_42"
  | "Chapter_43"
  | "Chapter_44"
  | "Chapter_45"
  | "Chapter_46"
  | "Chapter_47"
  | "Chapter_48"
  | "Chapter_49"
  | "Chapter_50";
export type SingleOrCombinationDrug = "Single" | "Combination" | "Both" | "Other";
export type UserExtOrInt = "INT" | "EXT";

export type FloraSpecies = {
  id: string;
  drugName: string;
  sanskritName: string | null;
  latinName: string | null;
  remarks: string | null;
  partOfPlantUsed: string | null;
  bookName: BookName;
  sthana: Sthana | null;
  chapterNumber: ChapterNumber | null;
  verseNumber: number | null;
  singleOrCombinationDrug: SingleOrCombinationDrug | null;
  formulationAsSingleDrug: string | null;
  formulationAsCombination: string | null;
  nameOfCombination: string | null;
  userExtOrInt: UserExtOrInt | null;
  typeOfExtUse: string | null;
  enteralRoute: string | null;
  parenteralRoute: string | null;
  usesAsSingleDrug: string | null;
  usesAsCombination: string | null;
  anupana: string | null;
  granthadikara: string | null;
  rogadhikara: string | null;
  sahapana: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SpeciesListResponse = {
  items: FloraSpecies[];
  total: number;
  page: number;
  limit: number;
};

export type SpeciesFilterEntry = {
  field: string;
  operator: string;
  value?: string | number | boolean | string[];
};

/** Filterable field config for Species list (field + type for operator/value UI). */
export const SPECIES_FILTER_FIELDS: Array<{
  id: string;
  label: string;
  type: "string" | "enum" | "number" | "boolean";
  enumOptions?: { value: string; label: string }[];
}> = [
  { id: "drugName", label: "Drug name", type: "string" },
  { id: "sanskritName", label: "Sanskrit name", type: "string" },
  { id: "latinName", label: "Latin name", type: "string" },
  { id: "bookName", label: "Book", type: "enum", enumOptions: [
    { value: "Charaka_Samhita", label: "Charaka Samhita" },
    { value: "Sushruta_Samhita", label: "Sushruta Samhita" },
    { value: "Ashtang_Hridaya", label: "Ashtang Hridaya" },
    { value: "Ashtang_Samgraha", label: "Ashtang Samgraha" },
  ]},
  { id: "sthana", label: "Sthana", type: "enum", enumOptions: [
    { value: "Chikitsa_Sthana", label: "Chikitsa Sthana" },
    { value: "Indriya_Sthana", label: "Indriya Sthana" },
    { value: "Kalpa_Sthana", label: "Kalpa Sthana" },
    { value: "Kalpa_siddhi_Sthana", label: "Kalpa siddhi Sthana" },
    { value: "Kalpana_Sthana", label: "Kalpana Sthana" },
    { value: "Nidana_Sthana", label: "Nidana Sthana" },
    { value: "Sharir_Sthana", label: "Sharir Sthana" },
    { value: "Sidhi_Sthana", label: "Sidhi Sthana" },
    { value: "Sutra_Sthana", label: "Sutra Sthana" },
    { value: "Uttar_Tantra", label: "Uttar Tantra" },
    { value: "Vimana_Sthana", label: "Vimana Sthana" },
  ]},
  { id: "chapterNumber", label: "Chapter", type: "enum", enumOptions: Array.from({ length: 50 }, (_, i) => ({
    value: `Chapter_${i + 1}`,
    label: `Chapter ${i + 1}`,
  }))},
  { id: "verseNumber", label: "Verse number", type: "number" },
  { id: "singleOrCombinationDrug", label: "Single/Combination", type: "enum", enumOptions: [
    { value: "Single", label: "Single" },
    { value: "Combination", label: "Combination" },
    { value: "Both", label: "Both" },
    { value: "Other", label: "Other" },
  ]},
  { id: "userExtOrInt", label: "INT/EXT", type: "enum", enumOptions: [
    { value: "INT", label: "INT" },
    { value: "EXT", label: "EXT" },
  ]},
  { id: "published", label: "Published", type: "boolean" },
  { id: "remarks", label: "Remarks", type: "string" },
  { id: "partOfPlantUsed", label: "Part of plant used", type: "string" },
  { id: "typeOfExtUse", label: "Type of ext use", type: "string" },
  { id: "enteralRoute", label: "Enteral route", type: "string" },
  { id: "parenteralRoute", label: "Parenteral route", type: "string" },
  { id: "anupana", label: "Anupana", type: "string" },
  { id: "granthadikara", label: "Granthadikara", type: "string" },
  { id: "rogadhikara", label: "Rogadhikara", type: "string" },
  { id: "sahapana", label: "Sahapana", type: "string" },
];

export type SpeciesCreateInput = {
  drugName: string;
  sanskritName?: string;
  latinName?: string;
  remarks?: string;
  partOfPlantUsed?: string;
  bookName?: BookName;
  sthana?: Sthana | null;
  chapterNumber?: ChapterNumber | null;
  verseNumber?: number | null;
  singleOrCombinationDrug?: SingleOrCombinationDrug | null;
  formulationAsSingleDrug?: string;
  formulationAsCombination?: string;
  nameOfCombination?: string;
  userExtOrInt?: UserExtOrInt | null;
  typeOfExtUse?: string;
  enteralRoute?: string;
  parenteralRoute?: string;
  usesAsSingleDrug?: string;
  usesAsCombination?: string;
  anupana?: string;
  granthadikara?: string;
  rogadhikara?: string;
  sahapana?: string;
  published?: boolean;
};

export const speciesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: SpeciesFilterEntry[];
  }) => {
    const query: Record<string, string | number | undefined> = {};
    if (params?.page != null) query.page = params.page;
    if (params?.limit != null) query.limit = params.limit;
    if (params?.search != null && params.search !== "") query.search = params.search;
    if (params?.filters != null && params.filters.length > 0) {
      query.filters = JSON.stringify(params.filters);
    }
    return api.get<SpeciesListResponse>("/species", query);
  },
  get: (id: string) => api.get<FloraSpecies>(`/species/${id}`),
  create: (data: SpeciesCreateInput) => api.post<FloraSpecies>("/species", data),
  update: (id: string, data: Partial<SpeciesCreateInput>) =>
    api.put<FloraSpecies>(`/species/${id}`, data),
  delete: (id: string) => api.delete(`/species/${id}`),
  importSpecies: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${apiUrl}/species/import`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || "Import failed");
    }
    return res.json();
  },
};
