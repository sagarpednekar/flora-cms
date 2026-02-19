"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXCEL_HEADER_TO_FIELD = void 0;
exports.normalizeBookName = normalizeBookName;
exports.normalizeSthana = normalizeSthana;
exports.normalizeChapterNumber = normalizeChapterNumber;
exports.normalizeSingleOrCombination = normalizeSingleOrCombination;
exports.normalizeUserExtOrInt = normalizeUserExtOrInt;
exports.buildHeaderToIndex = buildHeaderToIndex;
exports.mapRowToSpeciesInput = mapRowToSpeciesInput;
const client_1 = require("@prisma/client");
/** Excel header (trimmed) -> FloraSpecies field name */
exports.EXCEL_HEADER_TO_FIELD = {
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
function cell(row, index) {
    const v = row[index];
    if (v == null)
        return "";
    return String(v).trim();
}
function cellInt(row, index) {
    const v = row[index];
    if (v == null || v === "")
        return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : Math.floor(n);
}
function normalizeBookName(s) {
    const t = s.trim();
    if (/charaka/i.test(t))
        return client_1.BookName.Charaka_Samhita;
    if (/sushruta/i.test(t))
        return client_1.BookName.Sushruta_Samhita;
    if (/ashtang\s*hridaya/i.test(t))
        return client_1.BookName.Ashtang_Hridaya;
    if (/ashtang\s*samgraha/i.test(t))
        return client_1.BookName.Ashtang_Samgraha;
    return client_1.BookName.Charaka_Samhita;
}
const STHANA_MAP = {
    "chikitsa sthana": client_1.Sthana.Chikitsa_Sthana,
    "indriya sthana": client_1.Sthana.Indriya_Sthana,
    "kalpa sthana": client_1.Sthana.Kalpa_Sthana,
    "kalpa siddhi sthana": client_1.Sthana.Kalpa_siddhi_Sthana,
    "kalpana sthana": client_1.Sthana.Kalpana_Sthana,
    "nidana sthana": client_1.Sthana.Nidana_Sthana,
    "sharir sthana": client_1.Sthana.Sharir_Sthana,
    "sidhi sthana": client_1.Sthana.Sidhi_Sthana,
    "sutra sthana": client_1.Sthana.Sutra_Sthana,
    "uttar tantra": client_1.Sthana.Uttar_Tantra,
    "vimana sthana": client_1.Sthana.Vimana_Sthana,
};
function normalizeSthana(s) {
    const t = s.trim().toLowerCase();
    return STHANA_MAP[t] ?? null;
}
function normalizeChapterNumber(s) {
    const t = s.trim();
    const match = t.match(/(\d+)/);
    const n = match ? parseInt(match[1], 10) : NaN;
    if (Number.isNaN(n) || n < 1 || n > 50)
        return null;
    const key = `Chapter_${n}`;
    return client_1.ChapterNumber[key] ?? null;
}
function normalizeSingleOrCombination(s) {
    const t = s.trim().toLowerCase();
    if (t.includes("combination") && !t.includes("single"))
        return client_1.SingleOrCombinationDrug.Combination;
    if (t.includes("both"))
        return client_1.SingleOrCombinationDrug.Both;
    if (t.includes("other"))
        return client_1.SingleOrCombinationDrug.Other;
    return client_1.SingleOrCombinationDrug.Single;
}
function normalizeUserExtOrInt(s) {
    const t = s.trim().toUpperCase();
    return t === "EXT" ? client_1.UserExtOrInt.EXT : client_1.UserExtOrInt.INT;
}
/** Build header name -> column index from first row (array of cell values) */
function buildHeaderToIndex(headers) {
    const out = {};
    for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] ?? "").trim();
        if (h)
            out[h] = i;
    }
    return out;
}
/** Map one Excel row (array) to CreateSpeciesInput using headerToIndex. COMMENTRY + REMARKS -> remarks. */
function mapRowToSpeciesInput(row, headerToIndex) {
    const get = (header) => cell(row, headerToIndex[header] ?? -1);
    const getInt = (header) => cellInt(row, headerToIndex[header] ?? -1);
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
//# sourceMappingURL=import.mapping.js.map