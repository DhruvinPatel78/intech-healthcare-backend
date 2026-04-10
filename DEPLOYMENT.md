# Deployment Guide - Intech Healthcare Backend API

## Quick Deployment Options

### Option 1: Render (Recommended - Free Tier Available)
### Option 2: Railway
### Option 3: Heroku
### Option 4: AWS/DigitalOcean

---

## Option 1: Deploy to Render (Recommended)

Render offers a free tier perfect for backend APIs.

### Step 1: Prepare Your Repository

```bash
# Make sure your code is in a Git repository
git init
git add .
git commit -m "Initial backend setup"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create MongoDB Atlas Database (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a new cluster (free M0 tier)
4. **Database Access:** Create a database user
   - Username: `intechuser`
   - Password: (generate strong password)
5. **Network Access:** Add IP `0.0.0.0/0` (allow from anywhere)
6. Get your connection string:
   ```
   mongodb+srv://intechuser:PASSWORD@cluster.mongodb.net/intech-healthcare
   ```

### Step 3: Deploy to Render

1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** intech-healthcare-api
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 4: Add Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://intechuser:YOUR_PASSWORD@cluster.mongodb.net/intech-healthcare
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=intechhealthcare@gmail.com
ADMIN_EMAIL=admin@intechhealthcare.com
FRONTEND_URL=https://intechhealthcare.com
ADMIN_URL=https://app.intechhealthcare.com
```

### Step 5: Deploy

Click "Create Web Service" - Render will automatically build and deploy!

Your API will be available at:
```
https://intech-healthcare-api.onrender.com
```

### Step 6: Seed the Database

After first deployment, run seed script manually:

```bash
# SSH into Render or use their shell
npm run seed
```

Or use the MongoDB Compass/Atlas UI to add the admin user manually.

---

## Option 2: Deploy to Railway

Railway is another excellent free option.

### Steps:

1. Go to https://railway.app/
2. Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)
6. Click "Deploy"

Railway will give you a URL like:
```
https://intech-healthcare-backend.up.railway.app
```

---

## Option 3: Deploy to Heroku

### Steps:

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create intech-healthcare-api`
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set JWT_SECRET=your-secret
   # ... add all other env vars
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

---

## Configure Frontend to Use Backend

### Update Frontend Environment Variables

**Main Website (`intech-healthcare/.env`):**
```env
VITE_API_URL=https://intech-healthcare-api.onrender.com/api
```

**Admin Panel (`intech-healthcare-admin/.env`):**
```env
VITE_API_URL=https://intech-healthcare-api.onrender.com/api
```

### Update Contact Form

In `src/pages/ProductDetail.tsx`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const response = await fetch(`${API_URL}/quotes`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

---

## Testing Your Deployed API

### Health Check

```bash
curl https://intech-healthcare-api.onrender.com/api/health
```

### Create Admin User

```bash
curl -X POST https://intech-healthcare-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@intechhealthcare.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Login

```bash
curl -X POST https://intech-healthcare-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@intechhealthcare.com",
    "password": "admin123"
  }'
```

### Get Products

```bash
curl https://intech-healthcare-api.onrender.com/api/products
```

---

## Custom Domain (Optional)

### Using Render

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain: `api.intechhealthcare.com`
4. Update DNS records as instructed:
   - Type: CNAME
   - Name: api
   - Value: intech-healthcare-api.onrender.com

---

## Monitoring & Maintenance

### Logs

**Render:**
- Dashboard → Your Service → Logs

**Railway:**
- Dashboard → Your Project → Logs

### Database Backups

**MongoDB Atlas:**
1. Go to your cluster
2. Click "Backup"
3. Enable continuous backups (free on M10+, paid on M0)

### Health Monitoring

Set up uptime monitoring:
- UptimeRobot: https://uptimerobot.com/ (Free)
- Pingdom
- StatusCake

Monitor: `https://your-api.com/api/health`

---

## Performance Tips

1. **Enable Compression:** Already enabled in code
2. **Database Indexing:** Already configured in models
3. **Rate Limiting:** Already configured
4. **Caching:** Consider adding Redis for frequently accessed data

---

## Security Checklist

- ✅ Environment variables in deployment platform (not in code)
- ✅ Strong JWT secret (min 32 characters)
- ✅ MongoDB user credentials secured
- ✅ CORS configured for your domains
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ HTTPS enforced (automatic on Render/Railway)

---

## Troubleshooting

### Build Fails

**Error:** `Cannot find module`
- **Fix:** Ensure all dependencies are in `package.json`
- Run `npm install` locally first

### Database Connection Fails

**Error:** `MongoNetworkError`
- **Fix:** Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string is correct

### CORS Errors

**Error:** `Access blocked by CORS`
- **Fix:** Add your frontend URLs to `server.ts` CORS configuration

### Email Not Sending

**Error:** `Invalid login`
- **Fix:** Use Gmail App Password, not regular password
- Enable 2FA and generate app password

---

## Cost Estimation

### Free Tier (Sufficient for getting started)

| Service | Plan | Cost |
|---------|------|------|
| Render Web Service | Free | $0 |
| MongoDB Atlas | M0 Free | $0 |
| **Total** | | **$0/month** |

**Free Tier Limits:**
- Render: 750 hours/month (enough for 1 service)
- MongoDB: 512 MB storage
- Bandwidth: 100 GB/month

### Paid Tier (Production scale)

| Service | Plan | Cost |
|---------|------|------|
| Render | Starter | $7/month |
| MongoDB Atlas | M10 | $57/month |
| **Total** | | **$64/month** |

---

## Support

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Railway Docs:** https://docs.railway.app/

---

**Deployment Status:** Ready to Deploy ✅  
**Estimated Setup Time:** 15-30 minutes  
**Recommended:** Render + MongoDB Atlas (Free)

