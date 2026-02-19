import type { CreateRoleInput, UpdateRoleInput } from "./roles.schema.js";
export declare function list(): Promise<({
    _count: {
        users: number;
    };
} & {
    id: string;
    name: string;
    description: string | null;
})[]>;
export declare function getById(id: string): Promise<({
    _count: {
        users: number;
    };
} & {
    id: string;
    name: string;
    description: string | null;
}) | null>;
export declare function create(data: CreateRoleInput): Promise<{
    id: string;
    name: string;
    description: string | null;
}>;
export declare function update(id: string, data: UpdateRoleInput): Promise<{
    id: string;
    name: string;
    description: string | null;
}>;
export declare function remove(id: string): Promise<void>;
//# sourceMappingURL=roles.service.d.ts.map