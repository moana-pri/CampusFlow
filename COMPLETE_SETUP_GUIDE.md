# 🚀 Complete Setup & Deployment Guide

## Current Status

✅ **Backend**: Complete with all 10 controllers
✅ **Frontend**: React app with dashboard UI  
✅ **Supabase Integration**: Ready for auth & storage
✅ **API Communication**: Configured and ready to test

---

## Quick Start (Development)

### 1. Prerequisites
```bash
# Install globally if not already
npm install -g nodemon ts-node

# MongoDB (choose one):
# Option A: Local MongoDB
# Option B: MongoDB Atlas (free tier)
```

### 2. Backend Setup

```bash
cd Backend

# Copy environment file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI (local or Atlas connection string)
# - SUPABASE_URL (from supabase.com after creating project)
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Install dependencies (already done)
npm install

# Start backend
npm run dev
# ✅ Should show: Server running on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd Frontend

# Copy environment file
cp .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:5000/api
# VITE_SUPABASE_URL=your-project-url
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Install dependencies (already done)
npm install

# Start frontend
npm run dev
# ✅ Should show: Local: http://localhost:5173
```

### 4. Test Connection

Open browser to http://localhost:5173

Open Developer Console (F12) and run:
```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
// ✅ Should show: { status: 'OK', timestamp: '...' }
```

---

## Supabase Setup (For Auth & Storage)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Fill in:
   - Name: `CampusFlow`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait ~2 minutes for setup

### Step 2: Get Credentials

1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`  
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Enable Email Auth

1. Go to Authentication → Providers
2. Enable "Email" provider
3. Disable "Confirm email" for testing (optional)
4. Save

### Step 4: Configure Storage

1. Go to Storage
2. Create bucket: `profiles` (for profile pictures)
3. Create bucket: `events` (for event images)
4. Set public access policies

---

## MongoDB Setup Options

### Option A: Local MongoDB (Fastest for Development)

```bash
# Windows: Download from mongodb.com/try/download/community
# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connection string:
MONGODB_URI=mongodb://localhost:27017/campusflow
```

### Option B: MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Login
3. Create Free M0 Cluster (512MB free)
4. Go to Database Access → Add User
5. Go to Network Access → Add IP (0.0.0.0/0 for development)
6. Click "Connect" → "Connect your application"
7. Copy connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusflow
   ```

---

## Deployment (Production)

### 1. Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

cd Backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard:
# - MONGODB_URI (Atlas connection string)
# - SUPABASE_URL
# - SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_ROLE_KEY
# - NODE_ENV=production
# - FRONTEND_URL=https://your-app.vercel.app

# Get your Railway URL (e.g., https://campusflow-backend.up.railway.app)
```

### 2. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

cd Frontend
vercel

# Set environment variables in Vercel dashboard:
# - VITE_API_URL=https://campusflow-backend.up.railway.app/api
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY

# Get your Vercel URL (e.g., https://campusflow.vercel.app)
```

### 3. Update CORS

In Backend, update `FRONTEND_URL` environment variable in Railway to your Vercel URL.

---

## Testing Checklist

### Backend Health Check
```bash
curl http://localhost:5000/health
# ✅ Expected: {"status":"OK","timestamp":"..."}
```

### Frontend API Call
```javascript
// In browser console on localhost:5173
import api from './services/api';
const result = await api.get('/health');
console.log(result.data);
// ✅ Expected: {status: "OK", ...}
```

### Supabase Auth Test
```javascript
import { auth } from './lib/supabase';

const result = await auth.signUp('test@example.com', 'password123', {
  name: 'Test User',
  role: 'student'
});
console.log(result);
// ✅ Expected: {data: {user: {...}, session: {...}}, error: null}
```

---

## Common Issues & Fixes

### Issue: Backend won't start
**Fix**: Check MongoDB is running
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017
```

### Issue: CORS errors in frontend
**Fix**: Check `FRONTEND_URL` in backend .env matches frontend URL

### Issue: Supabase auth not working
**Fix**: 
1. Check environment variables are set
2. Check email provider is enabled
3. Check Supabase project URL is correct

### Issue: Can't connect to MongoDB Atlas
**Fix**:
1. Check Network Access allows your IP (0.0.0.0/0)
2. Check Database User password is correct
3. Replace `<password>` in connection string

---

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │ (React + Vite)
│   Vercel        │ Port 5173 (dev) / Vercel URL (prod)
└────────┬────────┘
         │ HTTP + Supabase Auth Token
         │
┌────────▼────────┐
│   Backend API   │ (Express + TypeScript)
│   Railway       │ Port 5000 (dev) / Railway URL (prod)
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼─────┐  ┌▼──────────────┐
│   MongoDB    │  │   Supabase    │
│   Atlas      │  │   (Auth +     │
│   (Data)     │  │    Storage)   │
└──────────────┘  └───────────────┘
```

---

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| **Supabase** | 50K MAU, 500MB DB, 1GB storage |
| **MongoDB Atlas** | 512MB M0 cluster |
| **Railway** | $5 credit/month (≈500 hours) |
| **Vercel** | Unlimited deployments |

**Total Cost**: $0/month for development + small production apps! 🎉

---

## Next Steps

1. ✅ Run `cd Backend && npm run dev`
2. ✅ Run `cd Frontend && npm run dev`  
3. ⏳ Create Supabase project
4. ⏳ Update environment variables
5. ⏳ Test authentication flow
6. ⏳ Deploy to production

**Need help?** Check:
- [CONNECTION_TEST.md](CONNECTION_TEST.md) - Test frontend-backend connection
- [SUPABASE_DEPLOYMENT.md](SUPABASE_DEPLOYMENT.md) - Detailed Supabase setup
- [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) - Backend API documentation
