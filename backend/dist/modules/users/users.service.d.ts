import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from "./users.schema.js";
export declare function list(query: ListUsersQuery): Promise<{
    items: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        active: boolean;
        createdAt: Date;
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    }[];
    total: number;
    page: number;
    limit: number;
}>;
export declare function getById(id: string): Promise<({
    roles: ({
        role: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        userId: string;
        roleId: string;
    })[];
} & {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt: Date;
}) | null>;
export declare function create(data: CreateUserInput): Promise<{
    roles: ({
        role: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        userId: string;
        roleId: string;
    })[];
} & {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt: Date;
}>;
export declare function update(id: string, data: UpdateUserInput): Promise<{
    roles: ({
        role: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        userId: string;
        roleId: string;
    })[];
} & {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    active: boolean;
    createdAt: Date;
}>;
export declare function remove(id: string): Promise<void>;
//# sourceMappingURL=users.service.d.ts.map