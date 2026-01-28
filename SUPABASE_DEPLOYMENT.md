# Supabase + MongoDB Deployment Configuration

## Overview
We'll use:
- **Supabase Auth** - Built-in authentication (email verification, OAuth)
- **MongoDB Atlas** - Main database for events, bookings, etc.
- **Supabase Storage** - File uploads (alternative to Cloudinary)
- **Railway/Render** - Backend API hosting
- **Vercel** - Frontend hosting

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project
```bash
# Go to https://supabase.com and create a new project
# Save your credentials:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.2 Enable Email Authentication
1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Supabase handles email verification automatically!

### 1.3 Configure Supabase Storage
```sql
-- Create buckets for file uploads
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Step 2: Install Supabase in Backend

```bash
cd Backend
npm install @supabase/supabase-js
```

## Step 3: Update Backend Configuration

Create `Backend/src/config/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Step 4: Update Auth Controller to Use Supabase

Replace email OTP with Supabase Auth:
```typescript
// Register with Supabase
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${process.env.FRONTEND_URL}/verify-email`,
  },
});

// Supabase sends verification email automatically!
```

## Step 5: Frontend Supabase Integration

```bash
cd Frontend
npm install @supabase/supabase-js
```

Create `Frontend/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Step 6: Environment Variables

### Backend `.env`
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MongoDB Atlas (still used for app data)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusflow

# Remove these (Supabase handles auth):
# JWT_SECRET=...
# BREVO_API_KEY=...
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 7: Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd Backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

## Step 8: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

cd Frontend
vercel

# Set environment variables:
# VITE_API_URL=https://your-railway-app.up.railway.app
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Benefits of This Setup

✅ **No Email Service Required** - Supabase handles all email verification
✅ **Built-in OAuth** - Google, GitHub, etc. authentication ready
✅ **Free Tier Generous** - 50,000 monthly active users
✅ **File Storage Included** - 1GB free storage
✅ **Realtime Subscriptions** - Database changes in real-time
✅ **Row Level Security** - Built-in authorization

## Cost Breakdown (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Supabase | Free | 50K MAU, 500MB DB, 1GB storage |
| MongoDB Atlas | Free | 512MB M0 cluster |
| Railway | Free | 500 hours/month, $5 credit |
| Vercel | Free | Unlimited deployments |

## Next Steps

1. Run `npm run setup:supabase` (we'll create this script)
2. Update auth controllers to use Supabase
3. Test frontend-backend communication
4. Deploy to production
