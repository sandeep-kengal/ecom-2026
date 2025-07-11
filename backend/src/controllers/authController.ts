import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { createError } from '../middleware/errorHandler';

export interface User {
  id?: number;
  email: string;
  password: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export class AuthController {
  // Register new user
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, first_name, last_name }: User = req.body;

      if (!email || !password || !first_name || !last_name) {
        throw createError('All fields are required', 400);
      }

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw createError('User already exists', 400);
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, first_name, last_name, role, created_at`,
        [email, password_hash, first_name, last_name]
      );

      // Generate JWT token
      const token = jwt.sign(
        { userId: rows[0].id, email: rows[0].email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: rows[0],
          token
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to register user', 500);
    }
  };

  // Login user
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw createError('Email and password are required', 400);
      }

      // Find user
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        throw createError('Invalid credentials', 401);
      }

      const user = rows[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        throw createError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
          },
          token
        },
        message: 'Login successful'
      });
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to login', 500);
    }
  };

  // Logout user
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // In a real application, you might want to blacklist the token
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      throw createError('Failed to logout', 500);
    }
  };

  // Get current user
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // This would typically use middleware to extract user from JWT
      // For now, we'll return a placeholder
      res.status(200).json({
        success: true,
        message: 'Current user endpoint - implement with JWT middleware'
      });
    } catch (error) {
      throw createError('Failed to get current user', 500);
    }
  };
} 
