# 🎯 Quick Start (2 Minutes)

## Prerequisites Check
- ✅ Node.js v22.14.0 installed
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Environment files created

## Option 1: Windows Users (Easiest)

### Step 1: Choose MongoDB
Pick ONE:

**A) Local MongoDB (Recommended for development)**
```bash
# Check if MongoDB is installed
mongod --version

# If not installed, download from:
# https://www.mongodb.com/try/download/community

# Start MongoDB service (Windows)
net start MongoDB

# Or run manually:
mongod --dbpath C:\data\db
```

**B) MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create Free M0 Cluster (512MB)
3. Database Access → Add User (save password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → "Connect your application" → Copy connection string
6. Edit `Backend\.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusflow
   ```

### Step 2: Start Backend
```bash
# Double-click this file:
start-backend.bat

# OR manually:
cd Backend
npm run dev
```

### Step 3: Start Frontend  
```bash
# Double-click this file:
start-frontend.bat

# OR manually:
cd Frontend
npm run dev
```

### Step 4: Open Browser
Go to: http://localhost:5173

---

## Option 2: Linux/Mac Users

```bash
# Make script executable
chmod +x start-dev.sh

# Run start script
./start-dev.sh
```

---

## Quick Test

### Test 1: Backend Health
Open browser console (F12) and run:
```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log);
```

Expected: `{status: "OK", timestamp: "..."}`

### Test 2: API Communication
```javascript
fetch('http://localhost:5000/api/events')
  .then(r => r.json())
  .then(console.log);
```

Expected: `[]` or list of events

---

## Common Issues

### ❌ "Backend is NOT running"
**Fix:** Check MongoDB is running
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017
```

### ❌ "Port 5000 already in use"
**Fix:** Kill process using port 5000
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### ❌ CORS errors in browser
**Fix:** Make sure `FRONTEND_URL` in `Backend/.env` matches your frontend URL:
```
FRONTEND_URL=http://localhost:5173
```

### ❌ "Cannot connect to MongoDB"
**Fix Options:**
1. Start MongoDB service: `net start MongoDB`
2. Use MongoDB Atlas (see instructions above)
3. Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

---

## What's Running?

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | React + Vite |
| **Backend API** | http://localhost:5000 | Express + TypeScript |
| **MongoDB** | mongodb://localhost:27017 | Database |

---

## Next: Add Supabase (Optional for now)

Supabase provides:
- ✅ Built-in authentication (no custom JWT needed)
- ✅ Email verification (no SMTP setup)
- ✅ File storage (alternative to Cloudinary)

### Setup Supabase:
1. Go to https://supabase.com
2. Create account → New Project
3. Copy credentials from Project Settings → API:
   - Project URL
   - anon public key
   - service_role key (⚠️ keep secret!)

4. Update environment files:

**Backend/.env**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (secret!)
```

**Frontend/.env**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

5. Restart both servers

---

## File Locations

```
CampusFlow/
├── start-backend.bat       ← Windows: Start backend
├── start-frontend.bat      ← Windows: Start frontend
├── start-dev.sh           ← Linux/Mac: Start both
├── test-connection.js     ← Test if backend is running
├── COMPLETE_SETUP_GUIDE.md ← Full deployment guide
├── Backend/
│   ├── .env              ← MongoDB + Supabase config
│   └── package.json      ← Backend dependencies
└── Frontend/
    ├── .env              ← API URL + Supabase config
    └── package.json      ← Frontend dependencies
```

---

## Status: ✅ READY TO RUN!

Everything is configured. Just need to:
1. Start MongoDB
2. Run `start-backend.bat`
3. Run `start-frontend.bat`
4. Open http://localhost:5173

**For deployment:** See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
