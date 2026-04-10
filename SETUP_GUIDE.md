# 🚀 InTech Healthcare Backend - Complete Setup Guide

Complete backend API for InTech Healthcare with MongoDB, Cloudinary, and Email integration.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Email Setup](#email-setup)
- [Running the Application](#running-the-application)
- [Deployment to Vercel](#deployment-to-vercel)
- [API Endpoints](#api-endpoints)

---

## ✅ Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (FREE)
- Cloudinary account (FREE)
- Gmail account for email (or any SMTP service)

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.sample .env

# 3. Configure environment variables (see below)
nano .env

# 4. Start development server
npm run dev
```

Server will run at: `http://localhost:5000`

---

## 🔧 Environment Setup

### Step 1: Create `.env` file

Copy `.env.sample` to `.env`:
```bash
cp .env.sample .env
```

### Step 2: Configure Basic Settings

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Change `JWT_SECRET` to a random string for security!

---

## 🗄️ Database Setup (MongoDB Atlas - FREE)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE account
3. Create a FREE cluster (M0 - 512MB storage)

### Step 2: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your database password

### Step 3: Update `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intech-healthcare?retryWrites=true&w=majority
```

### Step 4: Whitelist IP Address

1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Vercel deployment)

---

## 🖼️ Cloudinary Setup (FREE - 25GB Storage)

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for FREE account (25GB storage + 25GB bandwidth/month)

### Step 2: Get API Credentials

1. Go to Dashboard
2. Find your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Update `.env`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_key_here
```

**Note:** Images will be automatically:
- Optimized to max 1000x1000px
- Compressed to best quality
- Converted to WebP (when supported)
- Stored in `intech-healthcare/products` folder

---

## 📧 Email Setup (Gmail SMTP - FREE)

### Step 1: Enable Gmail App Passwords

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to https://myaccount.google.com/apppasswords
4. Create app password for "Mail"
5. Copy the 16-character password

### Step 2: Update `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@intechhealthcare.com
ADMIN_EMAIL=admin@intechhealthcare.com
```

**Note:** Emails are sent for:
- New inquiry submissions (contact form)
- New quote requests
- Admin notifications

---

## 🏃 Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev
```

Server: `http://localhost:5000/api/health`

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Seed Database (Optional)

Create admin user:

```bash
npm run seed
```

Admin credentials:
- Email: `intechhealthcare@gmail.com`
- Password: `Intech@Admin`

**⚠️ Keep these credentials secure!**

---

## 🚀 Deployment to Vercel (FREE)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From backend directory
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Project name: intech-healthcare-backend
# - Directory: ./
```

### Step 4: Add Environment Variables

After deployment, add all environment variables:

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add ADMIN_EMAIL
vercel env add FRONTEND_URL
vercel env add ADMIN_URL
```

Or use Vercel Dashboard:
1. Go to your project settings
2. Click **Environment Variables**
3. Add all variables from `.env`
4. **Important:** Add to all environments (Production, Preview, Development)

### Step 5: Redeploy

```bash
vercel --prod
```

Your API will be live at: `https://intech-healthcare-backend.vercel.app`

---

## 📚 API Endpoints

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://intech-healthcare-backend.vercel.app/api`

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login user
GET  /api/auth/me             - Get current user (Protected)
PUT  /api/auth/profile        - Update profile (Protected)
PUT  /api/auth/change-password - Change password (Protected)
```

### Products
```
GET    /api/products          - Get all products (Public)
GET    /api/products/search   - Search products (Public)
GET    /api/products/:id      - Get single product (Public)
POST   /api/products          - Create product with image (Admin)
PUT    /api/products/:id      - Update product with image (Admin)
DELETE /api/products/:id      - Delete product (Admin)
```

**Image Upload:**
- Field name: `image`
- Max size: 5MB
- Formats: JPG, PNG, GIF, WebP
- Automatically uploaded to Cloudinary

### Inquiries (Contact Form)
```
GET    /api/inquiries         - Get all inquiries (Admin)
GET    /api/inquiries/:id     - Get single inquiry (Admin)
POST   /api/inquiries         - Submit inquiry (Public)
PUT    /api/inquiries/:id     - Update inquiry (Admin)
DELETE /api/inquiries/:id     - Delete inquiry (Admin)
```

### Quotes
```
GET    /api/quotes            - Get all quotes (Admin)
GET    /api/quotes/:id        - Get single quote (Admin)
POST   /api/quotes            - Request quote (Public)
PUT    /api/quotes/:id        - Update quote (Admin)
DELETE /api/quotes/:id        - Delete quote (Admin)
```

---

## 🔒 Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Request (JavaScript/Fetch):

```javascript
fetch('https://api.example.com/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

---

## 📦 Example: Creating Product with Image

### Using FormData (JavaScript):

```javascript
const formData = new FormData();
formData.append('name', 'Adapalene Gel');
formData.append('genericName', 'Adapalene');
formData.append('composition', 'Adapalene 0.1% w/w');
formData.append('category', 'Dermatology');
formData.append('description', 'Topical gel for acne treatment');
formData.append('dosage', 'Apply once daily before bedtime');
formData.append('storage', 'Store at room temperature');
formData.append('image', imageFile); // File from input

const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 🛠️ Available Scripts

```bash
npm run dev        # Development server with auto-reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run seed       # Seed database with initial data
npm run lint       # Run ESLint
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
✅ Check MONGODB_URI is correct
✅ Verify IP address is whitelisted in MongoDB Atlas
✅ Check username and password are correct
```

### Cloudinary Upload Error
```
✅ Verify CLOUDINARY credentials are correct
✅ Check image size is under 5MB
✅ Ensure image format is supported (JPG, PNG, GIF, WebP)
```

### Email Not Sending
```
✅ Verify Gmail App Password is correct (16 characters, no spaces)
✅ Check 2-Step Verification is enabled
✅ Verify EMAIL_USER and EMAIL_PASSWORD are set
```

### CORS Error
```
✅ Check FRONTEND_URL and ADMIN_URL in .env
✅ Verify URLs in src/server.ts CORS configuration
```

---

## 📊 Rate Limiting

Protection against abuse:

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 attempts per 15 minutes per IP
- **Forms (Contact/Quote):** 10 submissions per hour per IP

---

## 📈 Free Tier Limits

### MongoDB Atlas (M0 Free)
- ✅ 512MB Storage
- ✅ Shared RAM
- ✅ No credit card required

### Cloudinary (Free)
- ✅ 25GB Storage
- ✅ 25GB Bandwidth/month
- ✅ 7,500 transformations/month
- ✅ No credit card required

### Vercel (Hobby Free)
- ✅ 100GB Bandwidth/month
- ✅ 100GB-Hrs Serverless Function Execution
- ✅ 6,000 builds/month
- ✅ No credit card required

---

## 🔐 Security Best Practices

1. **Change JWT_SECRET** to a random 64-character string
2. **Change default admin password** after first login
3. **Never commit .env** to Git (already in .gitignore)
4. **Use environment variables** in Vercel Dashboard
5. **Enable HTTPS** (automatic on Vercel)
6. **Whitelist specific IPs** in MongoDB Atlas (optional)

---

## 📞 Support

For issues or questions:
- Check API_DOCUMENTATION.md for detailed API docs
- Review logs in Vercel Dashboard
- Check MongoDB Atlas logs for database issues

---

## 🎉 You're All Set!

Your backend is now ready to power InTech Healthcare! 

**Next Steps:**
1. Test locally with `npm run dev`
2. Deploy to Vercel with `vercel --prod`
3. Update frontend/admin URLs to use your Vercel API
4. Create your first product via admin panel

Happy coding! 💪

