import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import quoteRoutes from './routes/quote.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(compression() as any); // Express v5 type compatibility
app.use(morgan('dev')); // Logging

// CORS Configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const extraOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : [];

    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8080',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'https://intechhealthcare.com',
      'https://www.intechhealthcare.com',
      'https://admin.intechhealthcare.com',
      ...extraOrigins,
    ].filter(Boolean);
    
    // In development, allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions) as any); // Express v5 type compatibility
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Intech Healthcare API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/quotes', quoteRoutes);

// 404 handler - Express v5: Don't use '*' as path parameter
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════╗
    ║  🏥 Intech Healthcare API Server         ║
    ║  ✅ Running on: http://localhost:${PORT}    ║
    ║  🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
    ╚═══════════════════════════════════════════╝
  `);
});

export default app;

