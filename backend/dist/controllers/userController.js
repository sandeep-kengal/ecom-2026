"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class UserController {
    constructor() {
        this.getProfile = async (req, res) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Get profile endpoint - implement with JWT middleware'
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to get profile', 500);
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Update profile endpoint - implement with JWT middleware'
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to update profile', 500);
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const { rows } = await database_1.pool.query('SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC');
                res.status(200).json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch users', 500);
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const { id } = req.params;
                const { rows } = await database_1.pool.query('SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1', [id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('User not found', 404);
                }
                res.status(200).json({
                    success: true,
                    data: rows[0]
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to fetch user', 500);
            }
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map