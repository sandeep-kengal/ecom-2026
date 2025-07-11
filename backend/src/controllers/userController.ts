import { Request, Response } from 'express';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

export class UserController {
  // Get user profile
  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // This would typically use middleware to get user from JWT
      res.status(200).json({
        success: true,
        message: 'Get profile endpoint - implement with JWT middleware'
      });
    } catch (error) {
      throw createError('Failed to get profile', 500);
    }
  };

  // Update user profile
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // This would typically use middleware to get user from JWT
      res.status(200).json({
        success: true,
        message: 'Update profile endpoint - implement with JWT middleware'
      });
    } catch (error) {
      throw createError('Failed to update profile', 500);
    }
  };

  // Get all users (admin only)
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
      );

      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
    } catch (error) {
      throw createError('Failed to fetch users', 500);
    }
  };

  // Get user by ID (admin only)
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(
        'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1',
        [id]
      );

      if (rows.length === 0) {
        throw createError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to fetch user', 500);
    }
  };
} 