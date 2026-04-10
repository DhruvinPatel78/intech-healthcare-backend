import express from 'express';
import {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  replyToInquiry,
} from '../controllers/inquiry.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route
router.post('/', formRateLimiter, createInquiry);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getInquiries);
router.get('/:id', protect, authorize('admin'), getInquiry);
router.put('/:id', protect, authorize('admin'), updateInquiry);
router.delete('/:id', protect, authorize('admin'), deleteInquiry);
router.post('/:id/reply', protect, authorize('admin'), replyToInquiry);

export default router;

