@echo off
echo 🚀 Starting JewelAura Development Server...

echo 📦 Starting Backend...
start "Backend" cmd /k "cd api && npm start"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend...
start "Frontend" cmd /k "cd front_end && npm run dev"

echo ✅ All servers starting in separate windows!
echo 🔧 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo 🗄️ Database: MongoDB Atlas (Cloud)