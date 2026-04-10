# 🏥 InTech Healthcare Backend API

Complete RESTful API for InTech Healthcare pharmaceutical product management with image upload, inquiry handling, and quote requests.

## ✨ Features

- 🔐 **JWT Authentication** - Secure admin authentication with role-based access
- 📦 **Product Management** - CRUD operations for pharmaceutical products
- 🖼️ **Image Upload** - Cloudinary integration for product images with auto-optimization
- 💬 **Inquiry System** - Contact form submissions and management
- 💰 **Quote Requests** - Product quote request handling
- 📧 **Email Notifications** - Automatic email alerts for inquiries and quotes
- 🛡️ **Security** - Rate limiting, helmet, CORS protection
- 📊 **MongoDB Database** - Scalable NoSQL database with MongoDB Atlas support
- 🚀 **TypeScript** - Type-safe development
- ☁️ **Cloudinary CDN** - Fast image delivery with automatic optimization

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **Cloudinary** for image storage and CDN
- **Multer** for file uploads
- **JWT** for authentication
- **Nodemailer** for email notifications
- **Bcrypt** for password hashing

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (FREE - 512MB)
- Cloudinary account (FREE - 25GB)
- Gmail account (or other SMTP) for email notifications

## 📚 Documentation

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[API Documentation](API_COMPLETE_DOCUMENTATION.md)** - Complete API reference with examples

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.sample .env
```

Then update the values:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intech-healthcare

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Cloudinary (Sign up at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@intechhealthcare.com
ADMIN_EMAIL=admin@intechhealthcare.com

# Frontend URLs (CORS)
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://admin.intechhealthcare.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### 3. Gmail App Password (For Email)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use this password in `EMAIL_PASSWORD`

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- Admin user: `intechhealthcare@gmail.com` / `Intech@Admin`

### 5. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |

### Products (with Image Upload)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| GET | `/api/products/search?q=term` | Search products | Public |
| POST | `/api/products` | Create product with image | Admin |
| PUT | `/api/products/:id` | Update product with image | Admin |
| DELETE | `/api/products/:id` | Delete product (& image) | Admin |

**Image Upload Details:**
- Field name: `image`
- Max size: 5MB
- Formats: JPG, PNG, GIF, WebP
- Automatic Cloudinary upload with optimization

### Inquiries (Contact Form)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/inquiries` | Submit inquiry | Public |
| GET | `/api/inquiries` | Get all inquiries | Admin |
| GET | `/api/inquiries/:id` | Get single inquiry | Admin |
| PUT | `/api/inquiries/:id` | Update inquiry | Admin |
| DELETE | `/api/inquiries/:id` | Delete inquiry | Admin |

### Quotes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/quotes` | Submit quote request | Public |
| GET | `/api/quotes` | Get all quotes | Admin |
| GET | `/api/quotes/:id` | Get single quote | Admin |
| PUT | `/api/quotes/:id` | Update quote | Admin |
| DELETE | `/api/quotes/:id` | Delete quote | Admin |

## API Examples

### Register Admin User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Intech Admin",
  "email": "intechhealthcare@gmail.com",
  "password": "Intech@Admin",
  "role": "admin"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "intechhealthcare@gmail.com",
  "password": "Intech@Admin"
}

# Response includes token:
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Product with Image (Protected - Requires Token)

```javascript
// Using FormData (JavaScript/React)
const formData = new FormData();
formData.append('name', 'ADAPALENE');
formData.append('genericName', 'Adapalene');
formData.append('composition', 'Adapalene 0.1% w/w');
formData.append('category', 'Dermatology');
formData.append('description', 'Topical retinoid for acne treatment');
formData.append('uses', JSON.stringify(['Acne vulgaris', 'Comedones']));
formData.append('dosage', 'Apply once daily at bedtime');
formData.append('sideEffects', JSON.stringify(['Skin irritation', 'Dryness']));
formData.append('precautions', JSON.stringify(['Avoid sun exposure']));
formData.append('packaging', JSON.stringify(['15g tube', '30g tube']));
formData.append('storage', 'Store below 25°C');
formData.append('image', imageFile); // File from input
formData.append('status', 'active');

const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Response includes Cloudinary image URL
```

### Submit Contact Inquiry

```bash
POST /api/inquiries
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Pharma",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products."
}
```

### Submit Quote Request

```bash
POST /api/quotes
Content-Type: application/json

{
  "productId": "65a1b2c3d4e5f6789abcdef0",
  "productName": "ADAPALENE",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Pharma",
  "quantity": "1000 units",
  "country": "USA",
  "message": "Bulk order inquiry"
}
```

## Project Structure

```
intech-healthcare-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── cloudinary.ts        # Cloudinary configuration
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication logic
│   │   ├── product.controller.ts # Product CRUD with images
│   │   ├── inquiry.controller.ts # Inquiry handling
│   │   └── quote.controller.ts   # Quote handling
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── upload.ts            # Multer file upload
│   │   ├── errorHandler.ts      # Error handling
│   │   └── rateLimiter.ts       # Rate limiting
│   ├── models/
│   │   ├── User.model.ts        # User schema
│   │   ├── Product.model.ts     # Product schema (with image)
│   │   ├── Inquiry.model.ts     # Inquiry schema
│   │   └── Quote.model.ts       # Quote schema
│   ├── routes/
│   │   ├── auth.routes.ts       # Auth routes
│   │   ├── product.routes.ts    # Product routes (with upload)
│   │   ├── inquiry.routes.ts    # Inquiry routes
│   │   └── quote.routes.ts      # Quote routes
│   ├── scripts/
│   │   └── seed.ts              # Database seeding
│   ├── utils/
│   │   └── email.ts             # Email sending utility
│   └── server.ts                # App entry point
├── .env.sample                  # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vercel.json                  # Vercel deployment config
├── SETUP_GUIDE.md               # Complete setup guide
├── API_COMPLETE_DOCUMENTATION.md # API documentation
└── README.md                    # This file
```

## 🔒 Security Features

- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **JWT Tokens** - Secure authentication (7-day expiry)
- ✅ **Rate Limiting** - Prevent brute force attacks
  - General API: 100 req/15min
  - Auth: 5 attempts/15min
  - Forms: 10 submissions/hour
- ✅ **Helmet** - Security headers
- ✅ **CORS** - Cross-origin resource sharing (whitelist)
- ✅ **Input Validation** - Mongoose validators
- ✅ **File Upload Validation** - Size & type restrictions
- ✅ **Error Handling** - Centralized error handler

## 🚀 Deployment to Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
# ... add all other env vars

# Deploy to production
vercel --prod
```

**Live API:** `https://intech-healthcare-backend.vercel.app`

### Required Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASSWORD=...
ADMIN_EMAIL=...
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://admin.intechhealthcare.com
```

**📖 For detailed deployment guide, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## Testing

### Using Postman

1. Import the API endpoints
2. Set up environment variables
3. Test authentication flow
4. Test CRUD operations

### Health Check

```bash
GET http://localhost:5000/api/health

Response:
{
  "status": "OK",
  "message": "Intech Healthcare API is running",
  "timestamp": "2025-12-17T..."
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
✅ Check MONGODB_URI is correct
✅ Verify IP address whitelisted in MongoDB Atlas
✅ Check username and password
```

### Cloudinary Upload Fails
```
✅ Verify credentials (cloud_name, api_key, api_secret)
✅ Check image size < 5MB
✅ Ensure supported format (JPG, PNG, GIF, WebP)
```

### Email Sending Fails
```
✅ Use Gmail App Password (not regular password)
✅ Enable 2-Step Verification first
✅ Check EMAIL_USER and EMAIL_PASSWORD
```

### CORS Errors
```
✅ Verify FRONTEND_URL and ADMIN_URL in .env
✅ Check CORS config in src/server.ts
```

**📖 For more troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 📊 Free Tier Limits

| Service | Free Tier | Sufficient For |
|---------|-----------|----------------|
| **MongoDB Atlas** | 512MB Storage | ~1000 products |
| **Cloudinary** | 25GB Storage + 25GB Bandwidth | Thousands of images |
| **Vercel** | 100GB Bandwidth + Serverless | High traffic |
| **Gmail SMTP** | 500 emails/day | All notifications |

## 📖 Additional Resources

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Step-by-step instructions for MongoDB, Cloudinary, Email setup
- **[API Documentation](API_COMPLETE_DOCUMENTATION.md)** - Complete API reference with request/response examples
- **[Seed Script](src/scripts/seed.ts)** - Database seeding with sample data

## 🎯 Quick Links

- **Local API:** `http://localhost:5000`
- **Production API:** `https://intech-healthcare-backend.vercel.app`
- **Health Check:** `/api/health`
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Cloudinary Dashboard:** https://cloudinary.com/console
- **Vercel Dashboard:** https://vercel.com/dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

ISC License - InTech Healthcare

## 💬 Support

For issues or questions:
- 📖 Check [SETUP_GUIDE.md](SETUP_GUIDE.md) and [API_COMPLETE_DOCUMENTATION.md](API_COMPLETE_DOCUMENTATION.md)
- 🐛 Review error logs in Vercel Dashboard
- 📧 Contact development team

---

**API Version:** 1.0.0  
**Last Updated:** December 17, 2025  
**Status:** ✅ Production Ready with Cloudinary Integration

**Features:**
✅ Complete REST API  
✅ MongoDB + Cloudinary Integration  
✅ Image Upload & CDN  
✅ Email Notifications  
✅ JWT Authentication  
✅ Rate Limiting & Security  
✅ TypeScript  
✅ Vercel Deployment Ready

