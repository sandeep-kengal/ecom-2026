import { Request, Response } from 'express';
export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    category?: string;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
}
export declare class ProductController {
    getAllProducts: (req: Request, res: Response) => Promise<void>;
    getProductById: (req: Request, res: Response) => Promise<void>;
    createProduct: (req: Request, res: Response) => Promise<void>;
    updateProduct: (req: Request, res: Response) => Promise<void>;
    deleteProduct: (req: Request, res: Response) => Promise<void>;
    getProductsByCategory: (req: Request, res: Response) => Promise<void>;
    searchProducts: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=productController.d.ts.map