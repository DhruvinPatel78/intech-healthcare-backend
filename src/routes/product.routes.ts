import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', protect as any, authorize('admin') as any, uploadSingle, createProduct);
router.put('/:id', protect as any, authorize('admin') as any, uploadSingle, updateProduct);
router.delete('/:id', protect as any, authorize('admin') as any, deleteProduct);

export default router;

