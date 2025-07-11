"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class OrderController {
    constructor() {
        this.getMyOrders = async (req, res) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Get my orders endpoint - implement with JWT middleware'
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to get orders', 500);
            }
        };
        this.createOrder = async (req, res) => {
            try {
                const { user_id, total_amount, shipping_address, items } = req.body;
                if (!user_id || !total_amount || !items || items.length === 0) {
                    throw (0, errorHandler_1.createError)('User ID, total amount, and items are required', 400);
                }
                const client = await database_1.pool.connect();
                try {
                    await client.query('BEGIN');
                    const orderResult = await client.query(`INSERT INTO orders (user_id, total_amount, shipping_address)
           VALUES ($1, $2, $3)
           RETURNING *`, [user_id, total_amount, shipping_address]);
                    const order = orderResult.rows[0];
                    for (const item of items) {
                        await client.query(`INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES ($1, $2, $3, $4)`, [order.id, item.product_id, item.quantity, item.price]);
                    }
                    await client.query('COMMIT');
                    res.status(201).json({
                        success: true,
                        data: order,
                        message: 'Order created successfully'
                    });
                }
                catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                }
                finally {
                    client.release();
                }
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to create order', 500);
            }
        };
        this.getOrderById = async (req, res) => {
            try {
                const { id } = req.params;
                const { rows } = await database_1.pool.query(`SELECT o.*, oi.product_id, oi.quantity, oi.price as item_price
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.id = $1`, [id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Order not found', 404);
                }
                const order = {
                    ...rows[0],
                    items: rows.map(row => ({
                        product_id: row.product_id,
                        quantity: row.quantity,
                        price: row.item_price
                    })).filter(item => item.product_id)
                };
                res.status(200).json({
                    success: true,
                    data: order
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to fetch order', 500);
            }
        };
        this.updateOrderStatus = async (req, res) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                if (!status) {
                    throw (0, errorHandler_1.createError)('Status is required', 400);
                }
                const { rows } = await database_1.pool.query(`UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`, [status, id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Order not found', 404);
                }
                res.status(200).json({
                    success: true,
                    data: rows[0],
                    message: 'Order status updated successfully'
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to update order status', 500);
            }
        };
        this.getAllOrders = async (req, res) => {
            try {
                const { rows } = await database_1.pool.query('SELECT * FROM orders ORDER BY created_at DESC');
                res.status(200).json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch orders', 500);
            }
        };
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map