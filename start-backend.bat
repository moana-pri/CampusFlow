@echo off
echo ========================================
echo     CampusFlow Backend Startup
echo ========================================
echo.

cd Backend

echo [1/3] Checking MongoDB connection...
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/campusflow', {serverSelectionTimeoutMS: 2000}).then(() => { console.log('✅ MongoDB connected'); process.exit(0); }).catch((err) => { console.log('❌ MongoDB NOT running'); console.log(''); console.log('Options:'); console.log('1. Start local MongoDB service'); console.log('2. Use MongoDB Atlas (cloud - free tier):'); console.log('   - Go to https://www.mongodb.com/cloud/atlas'); console.log('   - Create free M0 cluster'); console.log('   - Get connection string'); console.log('   - Update Backend/.env MONGODB_URI'); process.exit(1); });"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo.
echo [2/3] Starting backend server...
echo.
start "CampusFlow Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] Testing connection...
cd ..
node test-connection.js

echo.
echo ========================================
echo     Backend Started!
echo ========================================
echo.
echo Now run: start-frontend.bat
echo.
pause
