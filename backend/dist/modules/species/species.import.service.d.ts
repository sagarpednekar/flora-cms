export type ImportResult = {
    imported: number;
    errors: {
        row: number;
        message: string;
    }[];
};
export declare function importFromBuffer(buffer: Buffer): Promise<ImportResult>;
//# sourceMappingURL=species.import.service.d.ts.map