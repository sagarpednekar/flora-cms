"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function list(query) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where = search
        ? {
            OR: [
                { drugName: { contains: search, mode: "insensitive" } },
                { sanskritName: { contains: search, mode: "insensitive" } },
                { latinName: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    const [items, total] = await Promise.all([
        prisma.floraSpecies.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
        prisma.floraSpecies.count({ where }),
    ]);
    return { items, total, page, limit };
}
async function getById(id) {
    return prisma.floraSpecies.findUnique({ where: { id } });
}
async function create(data) {
    return prisma.floraSpecies.create({
        data: {
            drugName: data.drugName,
            sanskritName: data.sanskritName,
            latinName: data.latinName,
            remarks: data.remarks,
            partOfPlantUsed: data.partOfPlantUsed,
            bookName: data.bookName ?? client_1.BookName.Charaka_Samhita,
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
async function update(id, data) {
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
async function remove(id) {
    await prisma.floraSpecies.delete({ where: { id } });
}
//# sourceMappingURL=species.service.js.map