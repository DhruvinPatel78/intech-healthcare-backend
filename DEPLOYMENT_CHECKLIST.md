# ✅ Deployment Checklist - InTech Healthcare Backend

Complete checklist for deploying your backend to production.

---

## 📋 Pre-Deployment Checklist

### 1. ✅ MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account (free)
- [ ] Create M0 free cluster
- [ ] Create database user
- [ ] Get connection string
- [ ] Whitelist all IPs (0.0.0.0/0) for Vercel
- [ ] Test connection locally

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/intech-healthcare?retryWrites=true&w=majority
```

### 2. ✅ Cloudinary Setup
- [ ] Create Cloudinary account (free)
- [ ] Get credentials from dashboard
  - [ ] Cloud Name
  - [ ] API Key
  - [ ] API Secret
- [ ] Test upload locally

### 3. ✅ Email Setup (Gmail)
- [ ] Enable 2-Step Verification
- [ ] Generate App Password
- [ ] Test email sending locally

### 4. ✅ Local Testing
- [ ] Run `npm install`
- [ ] Configure `.env` file
- [ ] Run `npm run seed`
- [ ] Run `npm run dev`
- [ ] Test all endpoints
- [ ] Test image upload
- [ ] Test email notifications

---

## 🚀 Vercel Deployment Steps

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Initial Deployment

```bash
cd intech-healthcare-backend
vercel
```

**Answer prompts:**
- Set up and deploy: **Yes**
- Which scope: **Your account**
- Link to existing project: **No**
- What's your project name: **intech-healthcare-backend**
- In which directory is your code located: **./**
- Want to modify settings: **No**

### Step 4: Build Configuration

Vercel should auto-detect settings, but verify:

**Project Settings > General:**
- Framework Preset: **Other**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 5: Add Environment Variables

**In Vercel Dashboard > Project > Settings > Environment Variables:**

Add all these variables for **Production, Preview, and Development**:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intech-healthcare
JWT_SECRET=your_super_secret_production_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@intechhealthcare.com
ADMIN_EMAIL=admin@intechhealthcare.com
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://admin.intechhealthcare.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

**OR use Vercel CLI:**

```bash
vercel env add NODE_ENV
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRE
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add EMAIL_FROM
vercel env add ADMIN_EMAIL
vercel env add FRONTEND_URL
vercel env add ADMIN_URL
vercel env add RATE_LIMIT_WINDOW
vercel env add RATE_LIMIT_MAX
```

### Step 6: Deploy to Production

```bash
vercel --prod
```

**Your API will be live at:** `https://intech-healthcare-backend.vercel.app`

---

## ✅ Post-Deployment Verification

### 1. Test Health Endpoint

```bash
curl https://intech-healthcare-backend.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Intech Healthcare API is running",
  "timestamp": "2025-12-17T..."
}
```

### 2. Test Login

```bash
curl -X POST https://intech-healthcare-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "intechhealthcare@gmail.com",
    "password": "Intech@Admin"
  }'
```

**Expected:** Token in response

### 3. Test Product List

```bash
curl https://intech-healthcare-backend.vercel.app/api/products
```

**Expected:** List of products

### 4. Test Image Upload

Use Postman or frontend to test:
- Create product with image
- Verify image appears on Cloudinary
- Verify image URL is returned

### 5. Test Email

Submit an inquiry from frontend:
- Check email received at ADMIN_EMAIL
- Verify email content is correct

---

## 🔧 Configure Frontend & Admin Panel

### Update API URLs

**In Frontend (.env or config):**
```env
VITE_API_URL=https://intech-healthcare-backend.vercel.app/api
```

**In Admin Panel (.env or config):**
```env
VITE_API_URL=https://intech-healthcare-backend.vercel.app/api
```

### Update CORS

If you add new domains, update in `src/server.ts`:

```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://intechhealthcare.com',
    'https://admin.intechhealthcare.com',
    // Add more domains if needed
  ],
  credentials: true
}));
```

Then redeploy:
```bash
vercel --prod
```

---

## 📊 Monitoring

### Vercel Dashboard

**Monitor:**
- Deployment logs
- Function execution
- Error logs
- Bandwidth usage

**Access:** https://vercel.com/dashboard

### MongoDB Atlas

**Monitor:**
- Database size
- Connection count
- Query performance

**Access:** https://cloud.mongodb.com

### Cloudinary Dashboard

**Monitor:**
- Storage usage
- Bandwidth usage
- Transformations

**Access:** https://cloudinary.com/console

---

## 🔒 Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong JWT_SECRET (64+ random characters)
- [ ] Never commit `.env` to Git
- [ ] Enable 2FA on all service accounts
- [ ] Regularly check MongoDB Atlas IP whitelist
- [ ] Monitor Vercel logs for suspicious activity
- [ ] Keep dependencies updated

---

## 🐛 Troubleshooting

### Deployment Failed

**Check:**
1. All environment variables are set
2. `vercel.json` is present
3. Build succeeds locally: `npm run build`
4. Node version compatibility

### MongoDB Connection Error

**Solutions:**
1. Verify MONGODB_URI is correct
2. Check IP whitelist (allow 0.0.0.0/0 for Vercel)
3. Verify database user credentials
4. Test connection from MongoDB Compass

### Cloudinary Upload Error

**Solutions:**
1. Verify all 3 credentials are correct
2. Check Cloudinary dashboard for quota
3. Verify image size < 5MB
4. Check file format is supported

### Email Not Sending

**Solutions:**
1. Use Gmail App Password (not regular password)
2. Enable 2-Step Verification
3. Check EMAIL_USER and EMAIL_PASSWORD
4. Verify Gmail hasn't blocked the app

### CORS Error

**Solutions:**
1. Add frontend domain to CORS whitelist in server.ts
2. Redeploy after changes
3. Check FRONTEND_URL and ADMIN_URL environment variables

---

## 🔄 Continuous Deployment

### Auto-Deploy from Git

**Connect Git Repository:**
1. Go to Vercel Dashboard
2. Connect GitHub/GitLab
3. Select repository
4. Configure branch (main/master)

**Now every push to main branch auto-deploys! 🎉**

---

## 📈 Performance Tips

1. **Enable Cloudinary Auto-Optimization**
   - Already configured in code
   - Serves WebP to supported browsers

2. **Database Indexing**
   - Already configured in models
   - Improves query performance

3. **Response Compression**
   - Already enabled
   - Reduces bandwidth usage

4. **Rate Limiting**
   - Already active
   - Prevents abuse

---

## ✅ Final Checklist

- [ ] Backend deployed to Vercel
- [ ] All environment variables configured
- [ ] Health endpoint working
- [ ] Login endpoint working
- [ ] Product APIs working
- [ ] Image upload working
- [ ] Email notifications working
- [ ] Frontend connected to backend
- [ ] Admin panel connected to backend
- [ ] All endpoints tested
- [ ] Admin credentials secured
- [ ] Monitoring setup
- [ ] Documentation reviewed

---

## 🎉 You're Live!

Your InTech Healthcare backend is now running in production! 🚀

**API Base URL:** `https://intech-healthcare-backend.vercel.app/api`

**Health Check:** `https://intech-healthcare-backend.vercel.app/api/health`

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Production URL:** `https://intech-healthcare-backend.vercel.app`

