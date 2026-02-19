import { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
export declare function list(req: AuthRequest, res: Response): Promise<void>;
export declare function getById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function create(req: AuthRequest, res: Response): Promise<void>;
export declare function update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=users.controller.d.ts.map