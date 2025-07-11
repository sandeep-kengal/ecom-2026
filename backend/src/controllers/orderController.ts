import { Request, Response } from 'express';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

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

export class OrderController {
  // Get user orders
  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      // This would typically use middleware to get user from JWT
      res.status(200).json({
        success: true,
        message: 'Get my orders endpoint - implement with JWT middleware'
      });
    } catch (error) {
      throw createError('Failed to get orders', 500);
    }
  };

  // Create new order
  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, total_amount, shipping_address, items }: Order = req.body;

      if (!user_id || !total_amount || !items || items.length === 0) {
        throw createError('User ID, total amount, and items are required', 400);
      }

      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        // Create order
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, total_amount, shipping_address)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [user_id, total_amount, shipping_address]
        );

        const order = orderResult.rows[0];

        // Create order items
        for (const item of items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES ($1, $2, $3, $4)`,
            [order.id, item.product_id, item.quantity, item.price]
          );
        }

        await client.query('COMMIT');

        res.status(201).json({
          success: true,
          data: order,
          message: 'Order created successfully'
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to create order', 500);
    }
  };

  // Get order by ID
  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const { rows } = await pool.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price as item_price
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.id = $1`,
        [id]
      );

      if (rows.length === 0) {
        throw createError('Order not found', 404);
      }

      // Group items by order
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
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to fetch order', 500);
    }
  };

  // Update order status (admin only)
  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw createError('Status is required', 400);
      }

      const { rows } = await pool.query(
        `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      if (rows.length === 0) {
        throw createError('Order not found', 404);
      }

      res.status(200).json({
        success: true,
        data: rows[0],
        message: 'Order status updated successfully'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to update order status', 500);
    }
  };

  // Get all orders (admin only)
  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );

      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      throw createError('Failed to fetch orders', 500);
    }
  };
} 