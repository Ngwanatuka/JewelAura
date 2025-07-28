@echo off
echo Checking Docker status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Building JewelAura Docker Images v1.2.0...

echo Building backend image...
docker build -t jewelaura-backend:1.2.0 -t jewelaura-backend:latest ./api
if %errorlevel% neq 0 exit /b 1

echo Building frontend image...
docker build -t jewelaura-frontend:1.2.0 -t jewelaura-frontend:latest ./front_end
if %errorlevel% neq 0 exit /b 1

echo Tagging for registry...
docker tag jewelaura-backend:1.2.0 ngwanatuka/jewelaura-backend:1.2.0
docker tag jewelaura-frontend:1.2.0 ngwanatuka/jewelaura-frontend:1.2.0

echo Build complete! Images created:
docker images | findstr jewelaura

echo.
echo To push to Docker Hub:
echo docker push ngwanatuka/jewelaura-backend:1.2.0
echo docker push ngwanatuka/jewelaura-frontend:1.2.0