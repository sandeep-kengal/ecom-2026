import { Request, Response } from 'express';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

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

export class ProductController {
  // Get all products
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC'
      );
      
      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      throw createError('Failed to fetch products', 500);
    }
  };

  // Get product by ID
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );

      if (rows.length === 0) {
        throw createError('Product not found', 404);
      }

      res.status(200).json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to fetch product', 500);
    }
  };

  // Create new product
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, price, stock_quantity, category, image_url }: Product = req.body;

      if (!name || !price) {
        throw createError('Name and price are required', 400);
      }

      const { rows } = await pool.query(
        `INSERT INTO products (name, description, price, stock_quantity, category, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, price, stock_quantity || 0, category, image_url]
      );

      res.status(201).json({
        success: true,
        data: rows[0],
        message: 'Product created successfully'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to create product', 500);
    }
  };

  // Update product
  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, price, stock_quantity, category, image_url }: Product = req.body;

      const { rows } = await pool.query(
        `UPDATE products 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             stock_quantity = COALESCE($4, stock_quantity),
             category = COALESCE($5, category),
             image_url = COALESCE($6, image_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [name, description, price, stock_quantity, category, image_url, id]
      );

      if (rows.length === 0) {
        throw createError('Product not found', 404);
      }

      res.status(200).json({
        success: true,
        data: rows[0],
        message: 'Product updated successfully'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to update product', 500);
    }
  };

  // Delete product
  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        throw createError('Product not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to delete product', 500);
    }
  };

  // Get products by category
  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;
      const { rows } = await pool.query(
        'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
        [category]
      );

      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      throw createError('Failed to fetch products by category', 500);
    }
  };

  // Search products
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.params;
      const { rows } = await pool.query(
        `SELECT * FROM products 
         WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
         ORDER BY created_at DESC`,
        [`%${query}%`]
      );

      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      throw createError('Failed to search products', 500);
    }
  };
} 