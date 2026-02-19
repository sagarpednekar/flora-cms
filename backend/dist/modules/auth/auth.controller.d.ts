import { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
export declare function toUserResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    roles: {
        role: {
            id: string;
            name: string;
            description: string | null;
        };
    }[];
}): {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    roles: {
        id: string;
        name: string;
        description: string | null;
    }[];
};
export declare function register(req: AuthRequest, res: Response): Promise<void>;
export declare function login(req: AuthRequest, res: Response): Promise<void>;
export declare function me(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function logout(_req: AuthRequest, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map