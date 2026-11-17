#!/bin/bash

# JewelAura Local CI/CD Pipeline
# This script mimics the GitHub Actions workflow locally

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="$PROJECT_ROOT/.pipeline-logs"
LOG_FILE="$LOG_DIR/pipeline_$TIMESTAMP.log"

# Create log directory
mkdir -p "$LOG_DIR"

# Logging function
log() {
    echo -e "${2:-$NC}$1${NC}" | tee -a "$LOG_FILE"
}

# Job status tracking
JOBS_PASSED=0
JOBS_FAILED=0

# Print header
print_header() {
    log "\n========================================" "$BLUE"
    log "$1" "$BLUE"
    log "========================================\n" "$BLUE"
}

# Print job result
print_result() {
    if [ $1 -eq 0 ]; then
        log "✅ $2 PASSED" "$GREEN"
        ((JOBS_PASSED++))
    else
        log "❌ $2 FAILED" "$RED"
        ((JOBS_FAILED++))
        return 1
    fi
}

# Start pipeline
log "\n🚀 Starting JewelAura Local CI/CD Pipeline" "$BLUE"
log "Timestamp: $(date)" "$BLUE"
log "Log file: $LOG_FILE\n" "$BLUE"

#############################################
# JOB 1: TEST
#############################################
print_header "JOB 1: TESTING"

# Backend tests
log "📦 Installing backend dependencies..." "$YELLOW"
cd "$PROJECT_ROOT/api"
npm install >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    log "✓ Backend dependencies installed" "$GREEN"
else
    log "✗ Backend dependency installation failed" "$RED"
    exit 1
fi

log "\n🧪 Running backend tests..." "$YELLOW"
export NODE_ENV=test
export MONGO_URL=${MONGO_URL:-"mongodb://localhost:27017/jewelaura_test"}
export JWT_SEC=${JWT_SEC:-"test_jwt_secret"}
export PASS_SEC=${PASS_SEC:-"test_pass_secret"}

npm test >> "$LOG_FILE" 2>&1
BACKEND_TEST_RESULT=$?
print_result $BACKEND_TEST_RESULT "Backend Tests" || true

# Frontend tests
log "\n📦 Installing frontend dependencies..." "$YELLOW"
cd "$PROJECT_ROOT/front_end"
npm install --legacy-peer-deps >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    log "✓ Frontend dependencies installed" "$GREEN"
else
    log "✗ Frontend dependency installation failed" "$RED"
    exit 1
fi

log "\n🧪 Running frontend tests..." "$YELLOW"
# Note: If tests hang, you can skip them by setting SKIP_FRONTEND_TESTS=1
if [ "${SKIP_FRONTEND_TESTS:-0}" = "1" ]; then
    log "⏭️  Skipping frontend tests (SKIP_FRONTEND_TESTS=1)" "$YELLOW"
    FRONTEND_TEST_RESULT=0
else
    CI=true npx vitest run --no-watch --reporter=verbose >> "$LOG_FILE" 2>&1
    FRONTEND_TEST_RESULT=$?
fi
print_result $FRONTEND_TEST_RESULT "Frontend Tests" || true

# Frontend linting
log "\n🔍 Running frontend linting..." "$YELLOW"
npm run lint >> "$LOG_FILE" 2>&1
LINT_RESULT=$?
print_result $LINT_RESULT "Frontend Linting" || true

# Frontend build test
log "\n🏗️  Building frontend..." "$YELLOW"
npm run build >> "$LOG_FILE" 2>&1
BUILD_RESULT=$?
print_result $BUILD_RESULT "Frontend Build" || true

# Check if test job passed
if [ $BACKEND_TEST_RESULT -ne 0 ] || [ $FRONTEND_TEST_RESULT -ne 0 ] || [ $LINT_RESULT -ne 0 ] || [ $BUILD_RESULT -ne 0 ]; then
    log "\n❌ TEST JOB FAILED - Pipeline stopped" "$RED"
    log "Check log file for details: $LOG_FILE" "$YELLOW"
    exit 1
fi

log "\n✅ TEST JOB PASSED" "$GREEN"

#############################################
# JOB 2: SECURITY & VALIDATION
#############################################
print_header "JOB 2: SECURITY & VALIDATION"

# Backend security audit
log "🔒 Running backend security audit..." "$YELLOW"
cd "$PROJECT_ROOT/api"
npm audit --audit-level=moderate >> "$LOG_FILE" 2>&1
BACKEND_AUDIT_RESULT=$?
if [ $BACKEND_AUDIT_RESULT -eq 0 ]; then
    print_result 0 "Backend Security Audit"
else
    log "⚠️  Backend has security vulnerabilities (continuing...)" "$YELLOW"
fi

# Frontend security audit
log "\n🔒 Running frontend security audit..." "$YELLOW"
cd "$PROJECT_ROOT/front_end"
npm audit --audit-level=moderate >> "$LOG_FILE" 2>&1
FRONTEND_AUDIT_RESULT=$?
if [ $FRONTEND_AUDIT_RESULT -eq 0 ]; then
    print_result 0 "Frontend Security Audit"
else
    log "⚠️  Frontend has security vulnerabilities (continuing...)" "$YELLOW"
fi

log "\n✅ SECURITY & VALIDATION JOB COMPLETED" "$GREEN"

#############################################
# JOB 3: BUILD
#############################################
print_header "JOB 3: BUILD"

# Check if Docker is available
if command -v docker &> /dev/null; then
    log "🐳 Docker detected - Building images..." "$YELLOW"
    
    # Build backend image
    log "\n🏗️  Building backend Docker image..." "$YELLOW"
    cd "$PROJECT_ROOT"
    docker build -t jewelaura-backend:local ./api >> "$LOG_FILE" 2>&1
    BACKEND_BUILD_RESULT=$?
    print_result $BACKEND_BUILD_RESULT "Backend Docker Build" || true
    
    # Build frontend image
    log "\n🏗️  Building frontend Docker image..." "$YELLOW"
    docker build -t jewelaura-frontend:local ./front_end >> "$LOG_FILE" 2>&1
    FRONTEND_BUILD_RESULT=$?
    print_result $FRONTEND_BUILD_RESULT "Frontend Docker Build" || true
    
    if [ $BACKEND_BUILD_RESULT -ne 0 ] || [ $FRONTEND_BUILD_RESULT -ne 0 ]; then
        log "\n❌ BUILD JOB FAILED" "$RED"
        exit 1
    fi
    
    log "\n✅ BUILD JOB PASSED" "$GREEN"
else
    log "⚠️  Docker not found - Skipping Docker builds" "$YELLOW"
    log "Frontend production build already completed in test job" "$YELLOW"
    log "\n✅ BUILD JOB COMPLETED (Docker skipped)" "$GREEN"
fi

#############################################
# JOB 4: DEPLOY
#############################################
print_header "JOB 4: DEPLOY"

log "📋 Deployment Options:" "$YELLOW"
log "  1. Docker Compose (local)" "$YELLOW"
log "  2. Manual deployment" "$YELLOW"
log "  3. Skip deployment\n" "$YELLOW"

read -p "Select deployment option (1-3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        log "\n🚀 Deploying with Docker Compose..." "$YELLOW"
        cd "$PROJECT_ROOT"
        
        if [ -f "docker-compose.yml" ]; then
            docker-compose down >> "$LOG_FILE" 2>&1
            docker-compose up -d >> "$LOG_FILE" 2>&1
            DEPLOY_RESULT=$?
            
            if [ $DEPLOY_RESULT -eq 0 ]; then
                print_result 0 "Docker Compose Deployment"
                log "\n📍 Application deployed at:" "$GREEN"
                log "   Frontend: http://localhost:3000" "$GREEN"
                log "   Backend:  http://localhost:5000" "$GREEN"
            else
                print_result 1 "Docker Compose Deployment"
            fi
        else
            log "❌ docker-compose.yml not found" "$RED"
            DEPLOY_RESULT=1
        fi
        ;;
    2)
        log "\n📝 Manual deployment selected" "$YELLOW"
        log "Backend build: $PROJECT_ROOT/api" "$YELLOW"
        log "Frontend build: $PROJECT_ROOT/front_end/dist" "$YELLOW"
        log "\nDeploy these directories to your hosting platform" "$YELLOW"
        DEPLOY_RESULT=0
        ;;
    3)
        log "\n⏭️  Deployment skipped" "$YELLOW"
        DEPLOY_RESULT=0
        ;;
    *)
        log "\n❌ Invalid option - Deployment skipped" "$RED"
        DEPLOY_RESULT=1
        ;;
esac

if [ $DEPLOY_RESULT -eq 0 ]; then
    log "\n✅ DEPLOY JOB COMPLETED" "$GREEN"
else
    log "\n❌ DEPLOY JOB FAILED" "$RED"
fi

#############################################
# PIPELINE SUMMARY
#############################################
print_header "PIPELINE SUMMARY"

log "Jobs Passed: $JOBS_PASSED" "$GREEN"
log "Jobs Failed: $JOBS_FAILED" "$RED"
log "\nLog file: $LOG_FILE" "$BLUE"

if [ $JOBS_FAILED -eq 0 ]; then
    log "\n🎉 PIPELINE COMPLETED SUCCESSFULLY! 🎉" "$GREEN"
    exit 0
else
    log "\n❌ PIPELINE FAILED" "$RED"
    log "Check the log file for details: $LOG_FILE" "$YELLOW"
    exit 1
fi
