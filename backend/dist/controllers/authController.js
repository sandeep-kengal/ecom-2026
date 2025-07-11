"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { email, password, first_name, last_name } = req.body;
                if (!email || !password || !first_name || !last_name) {
                    throw (0, errorHandler_1.createError)('All fields are required', 400);
                }
                const existingUser = await database_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
                if (existingUser.rows.length > 0) {
                    throw (0, errorHandler_1.createError)('User already exists', 400);
                }
                const saltRounds = 12;
                const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
                const { rows } = await database_1.pool.query(`INSERT INTO users (email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, first_name, last_name, role, created_at`, [email, password_hash, first_name, last_name]);
                const token = jsonwebtoken_1.default.sign({ userId: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                res.status(201).json({
                    success: true,
                    data: {
                        user: rows[0],
                        token
                    },
                    message: 'User registered successfully'
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to register user', 500);
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw (0, errorHandler_1.createError)('Email and password are required', 400);
                }
                const { rows } = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Invalid credentials', 401);
                }
                const user = rows[0];
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
                if (!isPasswordValid) {
                    throw (0, errorHandler_1.createError)('Invalid credentials', 401);
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
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
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to login', 500);
            }
        };
        this.logout = async (req, res) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Logout successful'
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to logout', 500);
            }
        };
        this.getCurrentUser = async (req, res) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Current user endpoint - implement with JWT middleware'
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to get current user', 500);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map