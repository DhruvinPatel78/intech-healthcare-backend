import express from 'express';
import {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  replyToQuote,
} from '../controllers/quote.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route
router.post('/', formRateLimiter, createQuote);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getQuotes);
router.get('/:id', protect, authorize('admin'), getQuote);
router.put('/:id', protect, authorize('admin'), updateQuote);
router.delete('/:id', protect, authorize('admin'), deleteQuote);
router.post('/:id/reply', protect, authorize('admin'), replyToQuote);

export default router;

