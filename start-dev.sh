#!/bin/bash

echo "========================================"
echo "  CampusFlow Quick Start (Development)"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Install from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check MongoDB
echo ""
echo "Checking MongoDB..."
if nc -z localhost 27017 2>/dev/null; then
    echo -e "${GREEN}✅ MongoDB running on localhost:27017${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not detected${NC}"
    echo ""
    echo "Options:"
    echo "1. Start local MongoDB:"
    echo "   - Install: https://www.mongodb.com/try/download/community"
    echo "   - Or Docker: docker run -d -p 27017:27017 mongo"
    echo ""
    echo "2. Use MongoDB Atlas (cloud - free):"
    echo "   - Go to: https://www.mongodb.com/cloud/atlas"
    echo "   - Create M0 cluster (free 512MB)"
    echo "   - Update Backend/.env with connection string"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check backend .env
echo ""
echo "Checking Backend configuration..."
if [ ! -f "Backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend/.env not found${NC}"
    cp Backend/.env.example Backend/.env
    echo -e "${GREEN}✅ Created from .env.example${NC}"
    echo ""
    echo "Edit Backend/.env if needed (especially MONGODB_URI)"
else
    echo -e "${GREEN}✅ Backend/.env exists${NC}"
fi

# Check frontend .env
echo ""
echo "Checking Frontend configuration..."
if [ ! -f "Frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  Frontend/.env not found${NC}"
    cp Frontend/.env.example Frontend/.env
    echo -e "${GREEN}✅ Created from .env.example${NC}"
    echo ""
    echo "Edit Frontend/.env to add Supabase credentials (optional for testing)"
else
    echo -e "${GREEN}✅ Frontend/.env exists${NC}"
fi

# Start backend
echo ""
echo "========================================"
echo "  Starting Backend..."
echo "========================================"
cd Backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend
echo "Waiting for backend to start..."
sleep 5

# Test backend
echo ""
echo "Testing backend connection..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend running on http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
    echo "Check Backend terminal for errors"
fi

# Start frontend
echo ""
echo "========================================"
echo "  Starting Frontend..."
echo "========================================"
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend
echo "Waiting for frontend to start..."
sleep 5

echo ""
echo "========================================"
echo "  🎉 CampusFlow is Running!"
echo "========================================"
echo ""
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo "Test API from browser console (F12):"
echo "  fetch('http://localhost:5000/health').then(r => r.json()).then(console.log)"
echo ""
echo "To stop servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop this script"
echo ""

# Keep script running
wait
