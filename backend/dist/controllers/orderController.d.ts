import { Request, Response } from 'express';
export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}
export interface Order {
    id?: number;
    user_id: number;
    total_amount: number;
    status?: string;
    shipping_address?: string;
    items?: OrderItem[];
}
export declare class OrderController {
    getMyOrders: (req: Request, res: Response) => Promise<void>;
    createOrder: (req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<void>;
    updateOrderStatus: (req: Request, res: Response) => Promise<void>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=orderController.d.ts.map