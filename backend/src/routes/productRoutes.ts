import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create new product (admin only)
router.post('/', productController.createProduct);

// Update product (admin only)
router.put('/:id', productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', productController.deleteProduct);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Search products
router.get('/search/:query', productController.searchProducts);

export default router; 