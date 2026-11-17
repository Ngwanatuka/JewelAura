# Local CI/CD Pipeline

This directory contains local pipeline scripts that replicate the GitHub Actions workflow for local testing and deployment.

## Available Scripts

### 1. Bash Script (Linux/WSL/Mac)
**File**: `pipeline.sh`

**Usage**:
```bash
# Make executable
chmod +x pipeline.sh

# Run full pipeline
./pipeline.sh

# The script will prompt for deployment options
```

### 2. PowerShell Script (Windows)
**File**: `pipeline.ps1`

**Usage**:
```powershell
# Run full pipeline
.\pipeline.ps1

# Skip specific jobs
.\pipeline.ps1 -SkipTests
.\pipeline.ps1 -SkipSecurity
.\pipeline.ps1 -SkipBuild
.\pipeline.ps1 -SkipDeploy

# Combine flags
.\pipeline.ps1 -SkipSecurity -SkipDeploy
```

## Pipeline Jobs

### Job 1: Testing
- Installs backend dependencies
- Runs backend tests (`npm test`)
- Installs frontend dependencies
- Runs frontend tests
- Runs frontend linting
- Builds frontend for production

**Environment Variables**:
- `NODE_ENV=test`
- `MONGO_URL` (default: `mongodb://localhost:27017/jewelaura_test`)
- `JWT_SEC` (default: `test_jwt_secret`)
- `PASS_SEC` (default: `test_pass_secret`)

### Job 2: Security & Validation
- Runs `npm audit` on backend (moderate level)
- Runs `npm audit` on frontend (moderate level)
- Reports vulnerabilities but continues pipeline

### Job 3: Build
- Checks for Docker installation
- Builds backend Docker image: `jewelaura-backend:local`
- Builds frontend Docker image: `jewelaura-frontend:local`
- Skips Docker builds if Docker is not installed

### Job 4: Deploy
Interactive deployment with options:
1. **Docker Compose** - Deploys locally using `docker-compose.yml`
2. **Manual** - Shows build directories for manual deployment
3. **Skip** - Skips deployment

## Prerequisites

### Required
- Node.js 18+
- npm
- MongoDB (running on localhost:27017 for tests)

### Optional
- Docker (for build and deployment jobs)
- Docker Compose (for local deployment)

## Logs

All pipeline runs create detailed logs in `.pipeline-logs/`:
- Format: `pipeline_YYYYMMDD_HHMMSS.log`
- Contains full output from all commands
- Useful for debugging failures

## Example Output

```
🚀 Starting JewelAura Local CI/CD Pipeline
Timestamp: 2025-12-11 16:30:00

========================================
JOB 1: TESTING
========================================

📦 Installing backend dependencies...
✓ Backend dependencies installed

🧪 Running backend tests...
✅ Backend Tests PASSED

📦 Installing frontend dependencies...
✓ Frontend dependencies installed

🧪 Running frontend tests...
✅ Frontend Tests PASSED

🔍 Running frontend linting...
✅ Frontend Linting PASSED

🏗️  Building frontend...
✅ Frontend Build PASSED

✅ TEST JOB PASSED

========================================
JOB 2: SECURITY & VALIDATION
========================================

🔒 Running backend security audit...
✅ Backend Security Audit PASSED

🔒 Running frontend security audit...
✅ Frontend Security Audit PASSED

✅ SECURITY & VALIDATION JOB COMPLETED

========================================
JOB 3: BUILD
========================================

🐳 Docker detected - Building images...

🏗️  Building backend Docker image...
✅ Backend Docker Build PASSED

🏗️  Building frontend Docker image...
✅ Frontend Docker Build PASSED

✅ BUILD JOB PASSED

========================================
JOB 4: DEPLOY
========================================

📋 Deployment Options:
  1. Docker Compose (local)
  2. Manual deployment
  3. Skip deployment

Select deployment option (1-3): 1

🚀 Deploying with Docker Compose...
✅ Docker Compose Deployment PASSED

📍 Application deployed at:
   Frontend: http://localhost:3000
   Backend:  http://localhost:5000

✅ DEPLOY JOB COMPLETED

========================================
PIPELINE SUMMARY
========================================

Jobs Passed: 8
Jobs Failed: 0

Log file: .pipeline-logs/pipeline_20251211_163000.log

🎉 PIPELINE COMPLETED SUCCESSFULLY! 🎉
```

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Docker Not Found
Install Docker:
- **Linux**: https://docs.docker.com/engine/install/
- **Windows**: https://docs.docker.com/desktop/install/windows-binaries/
- **Mac**: https://docs.docker.com/desktop/install/mac-install/

### Permission Denied (Bash)
Make the script executable:
```bash
chmod +x pipeline.sh
```

### PowerShell Execution Policy Error
Allow script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Integration with GitHub Actions

This local pipeline mirrors the GitHub Actions workflow defined in `.github/workflows/docker.yml`. Running it locally before pushing ensures:
- All tests pass
- No security vulnerabilities
- Docker images build successfully
- Deployment works as expected

This helps catch issues early and reduces failed CI/CD runs on GitHub.