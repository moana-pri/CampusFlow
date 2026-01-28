@echo off
echo ========================================
echo     CampusFlow Frontend Startup
echo ========================================
echo.

cd Frontend

echo [1/2] Checking environment...
if not exist ".env" (
    echo ❌ Frontend/.env not found
    echo Copying from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit Frontend/.env and add:
    echo    - VITE_API_URL=http://localhost:5000/api
    echo    - VITE_SUPABASE_URL and keys from supabase.com
    echo.
    pause
)

echo ✅ Environment file exists
echo.
echo [2/2] Starting frontend...
echo.
start "CampusFlow Frontend" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo     Frontend Started!
echo ========================================
echo.
echo Open: http://localhost:5173
echo.
echo To test API connection:
echo Press F12 in browser, go to Console, and run:
echo   fetch('http://localhost:5000/health').then(r =^> r.json()).then(console.log)
echo.
pause
