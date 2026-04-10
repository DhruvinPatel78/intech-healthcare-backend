# 🔧 Environment Variables Template

Create a `.env` file in the root directory with these variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/intech-healthcare

# MongoDB Atlas (Production) - Get from: https://cloud.mongodb.com
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intech-healthcare?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (Free Account)
# Sign up at: https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (SMTP)
# For Gmail: Enable "App Passwords" in Google Account Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@intechhealthcare.com
ADMIN_EMAIL=admin@intechhealthcare.com

# Frontend URLs (for CORS)
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://admin.intechhealthcare.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

---

## 📝 Setup Instructions

### 1. Create `.env` file

```bash
# Copy this template
touch .env
```

Then paste the above content and update with your actual credentials.

---

## 🔐 Getting Credentials

### MongoDB Atlas (Free 512MB)
1. Go to https://cloud.mongodb.com
2. Create free account → Create M0 cluster
3. Database Access → Add user → Save credentials
4. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Connect → Drivers → Copy connection string
6. Replace `<password>` with your database password

**Example:**
```env
MONGODB_URI=mongodb+srv://intechuser:MyPassword123@cluster0.abc123.mongodb.net/intech-healthcare?retryWrites=true&w=majority
```

### Cloudinary (Free 25GB)
1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Dashboard → Copy credentials:
   - Cloud Name
   - API Key
   - API Secret

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

### Gmail SMTP (Free)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Create app password for "Mail"
5. Copy 16-character password

**Example:**
```env
EMAIL_USER=intechhealthcare@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### JWT Secret
Generate a random secure string:

```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 64

# Option 3: Use online generator
# Visit: https://randomkeygen.com
```

**Example:**
```env
JWT_SECRET=9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0
```

---

## ⚠️ Important Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Use different values for production** - Especially JWT_SECRET
3. **Keep credentials secure** - Don't share in public repositories
4. **Whitelist all IPs for MongoDB Atlas** - Required for Vercel deployment

---

## ✅ Verify Setup

Test your environment variables:

```bash
# Start the server
npm run dev

# You should see:
✅ MongoDB Connected
📊 Database: intech-healthcare
🏥 Intech Healthcare API Server
✅ Running on: http://localhost:5000
```

If you see connection errors, check your `.env` file values!

---

## 🚀 For Vercel Deployment

Add all these environment variables in:
**Vercel Dashboard → Project → Settings → Environment Variables**

Make sure to add them for all environments:
- ✅ Production
- ✅ Preview
- ✅ Development

