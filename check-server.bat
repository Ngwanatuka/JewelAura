@echo off
echo 🔍 Checking if backend server is running...

curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running on port 5000
    curl http://localhost:5000/health
) else (
    echo ❌ Server is NOT running on port 5000
    echo 💡 Start the server with: npm start
)

netstat -an | findstr :5000
if %errorlevel% equ 0 (
    echo 📡 Port 5000 is in use
) else (
    echo 🚫 Port 5000 is not in use
)