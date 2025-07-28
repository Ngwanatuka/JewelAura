@echo off
echo 🗄️ Starting Local MongoDB...

where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB not installed. Installing via Chocolatey...
    where choco >nul 2>nul
    if %errorlevel% neq 0 (
        echo Please install Chocolatey first: https://chocolatey.org/install
        echo Or download MongoDB manually: https://www.mongodb.com/try/download/community
        pause
        exit /b 1
    )
    choco install mongodb -y
)

if not exist "C:\data\db" mkdir "C:\data\db"
start "MongoDB" mongod --dbpath "C:\data\db"
echo ✅ MongoDB started on mongodb://localhost:27017