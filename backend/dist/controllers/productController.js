"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class ProductController {
    constructor() {
        this.getAllProducts = async (req, res) => {
            try {
                const { rows } = await database_1.pool.query('SELECT * FROM products ORDER BY created_at DESC');
                res.status(200).json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch products', 500);
            }
        };
        this.getProductById = async (req, res) => {
            try {
                const { id } = req.params;
                const { rows } = await database_1.pool.query('SELECT * FROM products WHERE id = $1', [id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Product not found', 404);
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
                throw (0, errorHandler_1.createError)('Failed to fetch product', 500);
            }
        };
        this.createProduct = async (req, res) => {
            try {
                const { name, description, price, stock_quantity, category, image_url } = req.body;
                if (!name || !price) {
                    throw (0, errorHandler_1.createError)('Name and price are required', 400);
                }
                const { rows } = await database_1.pool.query(`INSERT INTO products (name, description, price, stock_quantity, category, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, [name, description, price, stock_quantity || 0, category, image_url]);
                res.status(201).json({
                    success: true,
                    data: rows[0],
                    message: 'Product created successfully'
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to create product', 500);
            }
        };
        this.updateProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const { name, description, price, stock_quantity, category, image_url } = req.body;
                const { rows } = await database_1.pool.query(`UPDATE products 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             stock_quantity = COALESCE($4, stock_quantity),
             category = COALESCE($5, category),
             image_url = COALESCE($6, image_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`, [name, description, price, stock_quantity, category, image_url, id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Product not found', 404);
                }
                res.status(200).json({
                    success: true,
                    data: rows[0],
                    message: 'Product updated successfully'
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to update product', 500);
            }
        };
        this.deleteProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const { rows } = await database_1.pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
                if (rows.length === 0) {
                    throw (0, errorHandler_1.createError)('Product not found', 404);
                }
                res.status(200).json({
                    success: true,
                    message: 'Product deleted successfully'
                });
            }
            catch (error) {
                if (error instanceof Error && 'statusCode' in error) {
                    throw error;
                }
                throw (0, errorHandler_1.createError)('Failed to delete product', 500);
            }
        };
        this.getProductsByCategory = async (req, res) => {
            try {
                const { category } = req.params;
                const { rows } = await database_1.pool.query('SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC', [category]);
                res.status(200).json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to fetch products by category', 500);
            }
        };
        this.searchProducts = async (req, res) => {
            try {
                const { query } = req.params;
                const { rows } = await database_1.pool.query(`SELECT * FROM products 
         WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
         ORDER BY created_at DESC`, [`%${query}%`]);
                res.status(200).json({
                    success: true,
                    data: rows,
                    count: rows.length
                });
            }
            catch (error) {
                throw (0, errorHandler_1.createError)('Failed to search products', 500);
            }
        };
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map