# Frontend + Backend Communication Test

## Quick Test Steps

### 1. Start Backend
```bash
cd Backend
npm run dev
# Should run on http://localhost:5000
```

### 2. Start Frontend  
```bash
cd Frontend
npm run dev
# Should run on http://localhost:5173
```

### 3. Test API Connection

Open browser console on http://localhost:5173 and run:

```javascript
// Test backend health
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Expected output: { status: 'OK', timestamp: '...' }
```

### 4. Test CORS

The backend already has CORS configured for localhost:5173. If you see CORS errors:

**Backend** `src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### 5. Test Supabase Auth (After setup)

```javascript
import { auth } from './lib/supabase';

// Test signup
const result = await auth.signUp('test@example.com', 'password123', {
  name: 'Test User',
  role: 'student'
});
console.log(result);
```

### 6. Test Backend API with Supabase Token

```javascript
import api from './services/api';

// Get events (requires auth)
const events = await api.get('/events');
console.log(events.data);
```

## Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Check `.env` file exists
- Check port 5000 is free: `netstat -ano | findstr :5000`

### Frontend can't reach backend?
- Check CORS configuration
- Verify `VITE_API_URL` in `.env`
- Check browser console for errors

### Supabase auth not working?
- Check Supabase project is created
- Verify environment variables
- Check email provider is enabled in Supabase dashboard

## Environment Variables Checklist

### Backend `.env`
```env
✅ NODE_ENV=development
✅ PORT=5000
✅ FRONTEND_URL=http://localhost:5173
✅ MONGODB_URI=mongodb://localhost:27017/campusflow
✅ SUPABASE_URL=https://xxx.supabase.co
✅ SUPABASE_ANON_KEY=eyJxxx...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Frontend `.env`
```env
✅ VITE_API_URL=http://localhost:5000/api
✅ VITE_SUPABASE_URL=https://xxx.supabase.co
✅ VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## Connection Status

Run this test script:

```bash
# In Frontend directory
curl http://localhost:5000/health
```

Expected output:
```json
{
  "status": "OK",
  "timestamp": "2026-01-27T..."
}
```

## Next Steps

1. ✅ Backend and Frontend installed dependencies
2. ✅ Created Supabase configuration files
3. ✅ Created API service layer
4. ⏳ Set up Supabase project (go to supabase.com)
5. ⏳ Add environment variables
6. ⏳ Test authentication flow
7. ⏳ Deploy to production
