import { BookName, Sthana, ChapterNumber, SingleOrCombinationDrug, UserExtOrInt } from "@prisma/client";
import type { CreateSpeciesInput } from "./species.schema.js";
/** Excel header (trimmed) -> FloraSpecies field name */
export declare const EXCEL_HEADER_TO_FIELD: Record<string, string>;
export declare function normalizeBookName(s: string): BookName;
export declare function normalizeSthana(s: string): Sthana | null;
export declare function normalizeChapterNumber(s: string): ChapterNumber | null;
export declare function normalizeSingleOrCombination(s: string): SingleOrCombinationDrug;
export declare function normalizeUserExtOrInt(s: string): UserExtOrInt;
/** Build header name -> column index from first row (array of cell values) */
export declare function buildHeaderToIndex(headers: unknown[]): Record<string, number>;
/** Map one Excel row (array) to CreateSpeciesInput using headerToIndex. COMMENTRY + REMARKS -> remarks. */
export declare function mapRowToSpeciesInput(row: unknown[], headerToIndex: Record<string, number>): Partial<CreateSpeciesInput> & {
    drugName: string;
};
//# sourceMappingURL=import.mapping.d.ts.map