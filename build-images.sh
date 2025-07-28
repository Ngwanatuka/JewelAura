#!/bin/bash

echo "Checking Docker status..."
if ! docker info >/dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "Building JewelAura Docker Images v1.1.0..."

echo "Building backend image..."
docker build -t jewelaura-backend:1.1.0 -t jewelaura-backend:latest ./api
if [ $? -ne 0 ]; then exit 1; fi

echo "Building frontend image..."
docker build -t jewelaura-frontend:1.1.0 -t jewelaura-frontend:latest ./front_end
if [ $? -ne 0 ]; then exit 1; fi

echo "Tagging for registry..."
docker tag jewelaura-backend:1.1.0 ngwanatuka/jewelaura-backend:1.1.0
docker tag jewelaura-frontend:1.1.0 ngwanatuka/jewelaura-frontend:1.1.0

echo "Build complete! Images created:"
docker images | grep jewelaura

echo ""
echo "To push to Docker Hub:"
echo "docker push ngwanatuka/jewelaura-backend:1.1.0"
echo "docker push ngwanatuka/jewelaura-frontend:1.1.0"