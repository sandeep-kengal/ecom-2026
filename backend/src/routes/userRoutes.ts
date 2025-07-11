import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', userController.getUserById);

export default router; 