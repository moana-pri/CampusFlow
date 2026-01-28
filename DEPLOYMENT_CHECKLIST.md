# 🚀 Deployment Checklist

## Pre-Deployment (Development)

### ✅ Step 1: Local Setup (5 minutes)

- [ ] MongoDB running
  - Local: `net start MongoDB` (Windows) or `brew services start mongodb-community` (Mac)
  - OR Atlas: Get connection string from mongodb.com/cloud/atlas
  
- [ ] Backend started
  ```bash
  cd Backend
  npm run dev
  # Should see: "Server running on http://localhost:5000"
  ```

- [ ] Frontend started
  ```bash
  cd Frontend
  npm run dev
  # Should see: "Local: http://localhost:5173"
  ```

- [ ] Test communication
  - Open http://localhost:5173
  - Press F12 → Console → Run:
    ```javascript
    fetch('http://localhost:5000/health').then(r => r.json()).then(console.log)
    ```
  - Expected: `{status: "OK", timestamp: "..."}`

---

## Production Deployment

### 🎯 Step 2: Setup Supabase (5 minutes)

1. **Create Project**
   - [ ] Go to https://supabase.com → Sign up/Login
   - [ ] Click "New Project"
   - [ ] Name: `CampusFlow`
   - [ ] Database Password: (Save securely!)
   - [ ] Region: (Choose closest)
   - [ ] Wait ~2 minutes

2. **Get Credentials**
   - [ ] Go to Project Settings → API
   - [ ] Copy these 3 values:
     ```
     Project URL: https://xxxxx.supabase.co
     anon public: eyJhbGc...
     service_role: eyJhbGc... (⚠️ SECRET!)
     ```

3. **Enable Email Auth**
   - [ ] Go to Authentication → Providers
   - [ ] Enable "Email" provider
   - [ ] Configure email templates (optional)
   - [ ] Save

4. **Setup Storage Buckets**
   - [ ] Go to Storage
   - [ ] Create bucket: `profiles` (public)
   - [ ] Create bucket: `events` (public)
   - [ ] Create bucket: `certificates` (private)

5. **Update Environment Files**
   - [ ] `Backend/.env`:
     ```env
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=eyJhbGc...
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
     ```
   - [ ] `Frontend/.env`:
     ```env
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGc...
     ```

---

### 🗄️ Step 3: Setup MongoDB Atlas (3 minutes)

1. **Create Cluster**
   - [ ] Go to https://mongodb.com/cloud/atlas
   - [ ] Sign up/Login
   - [ ] Create Free M0 Cluster (512MB)
   - [ ] Choose region closest to you

2. **Configure Access**
   - [ ] Database Access → Add Database User
     - Username: `campusflow`
     - Password: (Generate strong password, save it!)
   - [ ] Network Access → Add IP Address
     - IP: `0.0.0.0/0` (Allow from anywhere)

3. **Get Connection String**
   - [ ] Click "Connect" on your cluster
   - [ ] Choose "Connect your application"
   - [ ] Copy connection string:
     ```
     mongodb+srv://campusflow:<password>@cluster.mongodb.net/campusflow
     ```
   - [ ] Replace `<password>` with your actual password

4. **Update Backend/.env**
   ```env
   MONGODB_URI=mongodb+srv://campusflow:yourpassword@cluster.mongodb.net/campusflow
   ```

---

### 🚂 Step 4: Deploy Backend to Railway (10 minutes)

1. **Prepare Backend**
   - [ ] Make sure `Backend/package.json` has:
     ```json
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "dev": "nodemon src/index.ts"
     }
     ```
   - [ ] Create `Backend/Procfile` (optional):
     ```
     web: npm start
     ```

2. **Deploy to Railway**
   - [ ] Install Railway CLI: `npm install -g @railway/cli`
   - [ ] Login: `railway login`
   - [ ] Initialize:
     ```bash
     cd Backend
     railway init
     # Choose: Create new project
     # Name: CampusFlow-Backend
     ```
   - [ ] Deploy:
     ```bash
     railway up
     ```

3. **Set Environment Variables**
   - [ ] Go to Railway dashboard
   - [ ] Select your project → Variables
   - [ ] Add ALL variables from `Backend/.env`:
     - `MONGODB_URI`
     - `PORT=5000`
     - `NODE_ENV=production`
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `FRONTEND_URL=https://yourapp.vercel.app` (will get later)
     - `CLOUDINARY_*` (optional)

4. **Get Railway URL**
   - [ ] Go to Settings → Domains
   - [ ] Generate domain: `campusflow-backend.up.railway.app`
   - [ ] Save this URL!

5. **Test Backend**
   ```bash
   curl https://campusflow-backend.up.railway.app/health
   # Expected: {"status":"OK","timestamp":"..."}
   ```

---

### ⚡ Step 5: Deploy Frontend to Vercel (5 minutes)

1. **Prepare Frontend**
   - [ ] Update `Frontend/.env.production`:
     ```env
     VITE_API_URL=https://campusflow-backend.up.railway.app/api
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGc...
     ```

2. **Deploy to Vercel**

   **Method A: CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   cd Frontend
   vercel
   # Follow prompts:
   # - Setup and deploy? Y
   # - Scope: Your account
   # - Link to existing project? N
   # - Project name: CampusFlow
   # - Directory: ./
   # - Override settings? N
   ```

   **Method B: GitHub (Recommended)**
   - [ ] Push code to GitHub
   - [ ] Go to https://vercel.com/new
   - [ ] Import your repository
   - [ ] Framework: Vite
   - [ ] Root Directory: `Frontend`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Deploy

3. **Set Environment Variables**
   - [ ] Go to Vercel dashboard
   - [ ] Select project → Settings → Environment Variables
   - [ ] Add:
     - `VITE_API_URL` = `https://campusflow-backend.up.railway.app/api`
     - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGc...`

4. **Get Vercel URL**
   - [ ] Copy production URL: `https://campusflow.vercel.app`

5. **Update Backend CORS**
   - [ ] Go back to Railway dashboard
   - [ ] Update environment variable:
     ```
     FRONTEND_URL=https://campusflow.vercel.app
     ```
   - [ ] Redeploy backend (Railway auto-deploys)

---

### 🧪 Step 6: Test Production (5 minutes)

1. **Test Frontend**
   - [ ] Open `https://campusflow.vercel.app`
   - [ ] Should load landing page

2. **Test Backend Connection**
   - [ ] Open browser console (F12)
   - [ ] Run:
     ```javascript
     fetch('https://campusflow-backend.up.railway.app/health')
       .then(r => r.json())
       .then(console.log);
     ```
   - [ ] Expected: `{status: "OK", ...}`

3. **Test API Communication**
   - [ ] In browser console:
     ```javascript
     fetch('https://campusflow-backend.up.railway.app/api/events')
       .then(r => r.json())
       .then(console.log);
     ```
   - [ ] Expected: `[]` or list of events

4. **Test Authentication**
   - [ ] Click "Sign Up" on frontend
   - [ ] Enter email and password
   - [ ] Should:
     - Create user in Supabase
     - Send verification email
     - Redirect to dashboard

5. **Test File Upload** (if using Supabase Storage)
   - [ ] Upload profile picture
   - [ ] Check Supabase Storage bucket
   - [ ] Verify image appears

---

## Post-Deployment

### 📊 Step 7: Monitor & Optimize

1. **Setup Error Tracking**
   - [ ] Add Sentry (optional): sentry.io
   - [ ] Monitor Railway logs
   - [ ] Monitor Vercel logs

2. **Performance**
   - [ ] Run Lighthouse audit
   - [ ] Check API response times
   - [ ] Optimize images (use WebP)

3. **Security**
   - [ ] Review Supabase RLS policies
   - [ ] Check CORS settings
   - [ ] Rotate secrets if exposed
   - [ ] Enable HTTPS only

4. **Backup**
   - [ ] MongoDB Atlas auto-backups enabled
   - [ ] Export Supabase data periodically
   - [ ] Keep `.env` files backed up securely

---

## 🎉 Deployment Complete!

### Your Live URLs:
- **Frontend:** https://campusflow.vercel.app
- **Backend API:** https://campusflow-backend.up.railway.app
- **Supabase Dashboard:** https://app.supabase.com

### Free Tier Usage:
| Service | Limit | Monitoring |
|---------|-------|------------|
| Supabase | 50K MAU | Dashboard → Usage |
| MongoDB Atlas | 512MB | Atlas → Metrics |
| Railway | $5/month (~500hrs) | Dashboard → Usage |
| Vercel | Unlimited | Dashboard → Analytics |

### Need Custom Domain?
1. Buy domain (Namecheap, Google Domains, etc.)
2. Vercel: Settings → Domains → Add custom domain
3. Update DNS records as shown
4. Update Railway `FRONTEND_URL`

---

## 📞 Support

**Logs:**
- Railway: `railway logs`
- Vercel: Dashboard → Deployments → Click deployment → View logs

**Common Issues:**
- **502 Bad Gateway:** Backend not running, check Railway logs
- **CORS error:** Check `FRONTEND_URL` in Railway matches Vercel URL
- **Auth not working:** Verify Supabase URL and keys in env vars
- **Database connection failed:** Check MongoDB Atlas IP whitelist

**Documentation:**
- Railway: docs.railway.app
- Vercel: vercel.com/docs
- Supabase: supabase.com/docs
- MongoDB Atlas: docs.atlas.mongodb.com

---

**Total Deployment Time:** ~30 minutes  
**Total Cost:** $0/month (free tiers)  
**Status:** Production Ready! 🚀
