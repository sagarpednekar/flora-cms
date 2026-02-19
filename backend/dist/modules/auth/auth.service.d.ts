import type { RegisterInput, LoginInput } from "./auth.schema.js";
export declare function signToken(userId: string, email: string): string;
export declare function getCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    maxAge: number;
    path: string;
};
export declare function register(input: RegisterInput): Promise<{
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
export declare function login(input: LoginInput): Promise<{
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
export declare function findById(id: string): Promise<({
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
//# sourceMappingURL=auth.service.d.ts.map