# JewelAura CI/CD Pipeline

## Overview
This document describes the CI/CD pipeline setup for the JewelAura e-commerce project.

## Pipeline Stages

### 1. Test Stage
- Runs on every push and pull request
- Installs dependencies for both frontend and backend
- Executes tests (when available)
- Runs linting (when configured)

### 2. Security Stage
- Performs npm audit on both applications
- Checks for high-severity vulnerabilities
- Blocks deployment if critical issues found

### 3. Build Stage
- Only runs on main branch
- Builds Docker images for both services
- Pushes images to GitHub Container Registry
- Uses Docker layer caching for efficiency

### 4. Deploy Stage
- Runs after successful build
- Requires manual approval (production environment)
- Can be extended with actual deployment logic

## Quick Start

### Development
```bash
# Start development environment
./deploy.sh dev
```

### Production
```bash
# Set environment variables
export MONGO_URL="your_mongo_connection_string"
export JWT_SECRET="your_jwt_secret"
export STRIPE_SECRET_KEY="your_stripe_secret"

# Deploy to production
./deploy.sh prod
```

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe secret key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## Docker Services

### Development (`docker-compose.yml`)
- MongoDB database
- Backend API (with hot reload)
- Frontend React app (with hot reload)

### Production (`docker-compose.prod.yml`)
- Backend API (production build)
- Frontend React app (production build)
- Nginx reverse proxy

## Monitoring

- Health checks available at `/health` endpoint
- Docker health checks configured
- Automatic restart policies in place

## Security Features

- Automated security audits
- Container image scanning
- Environment variable validation
- CORS configuration
- JWT authentication