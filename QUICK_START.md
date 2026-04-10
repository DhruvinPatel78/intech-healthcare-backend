# ⚡ Quick Start - InTech Healthcare Backend

Get up and running in 5 minutes!

## 🚀 Fast Setup

### Step 1: Install Dependencies (1 minute)

```bash
cd intech-healthcare-backend
npm install
```

### Step 2: Environment Setup (2 minutes)

```bash
# Copy environment template
cp .env.sample .env
```

**Edit `.env` with your credentials:**

```env
# MongoDB Atlas (Get from: https://cloud.mongodb.com)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intech-healthcare

# JWT Secret (Generate random string)
JWT_SECRET=your_random_secret_key_here

# Cloudinary (Get from: https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (Generate app password at: https://myaccount.google.com/apppasswords)
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=admin@intechhealthcare.com

# URLs (Update for production)
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://admin.intechhealthcare.com
```

### Step 3: Seed Database (30 seconds)

```bash
npm run seed
```

**Creates:**
- Admin user: `intechhealthcare@gmail.com` / `Intech@Admin`

### Step 4: Start Server (10 seconds)

```bash
npm run dev
```

**✅ Server running at:** `http://localhost:5000`

**✅ Test:** `http://localhost:5000/api/health`

---

## 🎯 First API Call

### Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intechhealthcare@gmail.com",
    "password": "Intech@Admin"
  }'
```

**Response includes token:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get All Products

```bash
curl http://localhost:5000/api/products
```

---

## 📦 What You Get

| Feature | Status |
|---------|--------|
| MongoDB Database | ✅ Connected |
| Cloudinary Images | ✅ Ready |
| Authentication | ✅ Working |
| Product APIs | ✅ Working |
| Inquiry APIs | ✅ Working |
| Quote APIs | ✅ Working |
| Email Notifications | ✅ Ready |
| Rate Limiting | ✅ Active |
| Security | ✅ Enabled |

---

## 🔧 Quick Commands

```bash
# Development (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed

# Check types
npm run lint
```

---

## 🌐 Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Then deploy to production
vercel --prod
```

**Done! Your API is live! 🎉**

---

## 📖 Need More Details?

- **[Complete Setup Guide](SETUP_GUIDE.md)** - MongoDB, Cloudinary, Email setup
- **[API Documentation](API_COMPLETE_DOCUMENTATION.md)** - All endpoints with examples
- **[README](README.md)** - Full documentation

---

## 🐛 Common Issues

### "Cannot connect to MongoDB"
→ Check `MONGODB_URI` in `.env`  
→ Whitelist your IP in MongoDB Atlas

### "Cloudinary upload failed"
→ Verify credentials in `.env`  
→ Check image size < 5MB

### "Email not sending"
→ Use Gmail App Password (not regular password)  
→ Enable 2-Step Verification first

---

## ✅ You're Ready!

Your backend is running and ready to connect with:
- Website: `intechhealthcare.com`
- Admin Panel: `admin.intechhealthcare.com`

**API Base URL:** `http://localhost:5000/api`

Happy coding! 🚀
