import { Request, Response, NextFunction } from "express";
export interface JwtPayload {
    userId: string;
    email: string;
}
export interface AuthRequest extends Request {
    user?: {
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
    };
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireRole(roleName: string): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authenticate.d.ts.map