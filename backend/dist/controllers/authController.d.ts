import { Request, Response } from 'express';
export interface User {
    id?: number;
    email: string;
    password: string;
    password_hash?: string;
    first_name: string;
    last_name: string;
    role?: string;
}
export declare class AuthController {
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    getCurrentUser: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map