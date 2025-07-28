@echo off
setlocal

echo 🚀 Starting JewelAura deployment...

if "%1"=="" (
    echo Usage: deploy.bat [dev^|prod]
    exit /b 1
)

set ENV=%1

if "%ENV%"=="dev" (
    echo 📦 Deploying to development environment...
    docker-compose down
    docker-compose up --build -d
    echo ✅ Development deployment complete!
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 Backend: http://localhost:5000
    echo 🗄️ MongoDB: mongodb://localhost:27017
) else if "%ENV%"=="prod" (
    echo 🏭 Deploying to production environment...
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml pull
    docker-compose -f docker-compose.prod.yml up -d
    echo ✅ Production deployment complete!
    echo 🌐 Application: http://localhost
) else (
    echo ❌ Invalid environment. Use 'dev' or 'prod'
    exit /b 1
)

echo 🎉 Deployment finished!