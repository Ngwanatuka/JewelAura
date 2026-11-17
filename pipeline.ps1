# JewelAura Local CI/CD Pipeline (PowerShell)
# This script mimics the GitHub Actions workflow locally on Windows

param(
    [switch]$SkipTests = $false,
    [switch]$SkipSecurity = $false,
    [switch]$SkipBuild = $false,
    [switch]$SkipDeploy = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogDir = Join-Path $ProjectRoot ".pipeline-logs"
$LogFile = Join-Path $LogDir "pipeline_$Timestamp.log"

# Create log directory
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# Job tracking
$JobsPassed = 0
$JobsFailed = 0

# Logging function
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
    Add-Content -Path $LogFile -Value $Message
}

# Print header
function Write-Header {
    param([string]$Title)
    Write-Log "`n========================================" "Cyan"
    Write-Log $Title "Cyan"
    Write-Log "========================================`n" "Cyan"
}

# Print result
function Write-Result {
    param(
        [bool]$Success,
        [string]$JobName
    )
    if ($Success) {
        Write-Log "✅ $JobName PASSED" "Green"
        $script:JobsPassed++
    } else {
        Write-Log "❌ $JobName FAILED" "Red"
        $script:JobsFailed++
        throw "$JobName failed"
    }
}

# Start pipeline
Write-Log "`n🚀 Starting JewelAura Local CI/CD Pipeline" "Cyan"
Write-Log "Timestamp: $(Get-Date)" "Cyan"
Write-Log "Log file: $LogFile`n" "Cyan"

try {
    #############################################
    # JOB 1: TEST
    #############################################
    if (-not $SkipTests) {
        Write-Header "JOB 1: TESTING"

        # Backend tests
        Write-Log "📦 Installing backend dependencies..." "Yellow"
        Set-Location (Join-Path $ProjectRoot "api")
        npm install *>> $LogFile
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✓ Backend dependencies installed" "Green"
        } else {
            throw "Backend dependency installation failed"
        }

        Write-Log "`n🧪 Running backend tests..." "Yellow"
        $env:NODE_ENV = "test"
        $env:MONGO_URL = if ($env:MONGO_URL) { $env:MONGO_URL } else { "mongodb://localhost:27017/jewelaura_test" }
        $env:JWT_SEC = if ($env:JWT_SEC) { $env:JWT_SEC } else { "test_jwt_secret" }
        $env:PASS_SEC = if ($env:PASS_SEC) { $env:PASS_SEC } else { "test_pass_secret" }

        npm test *>> $LogFile
        $BackendTestResult = $LASTEXITCODE -eq 0
        Write-Result $BackendTestResult "Backend Tests"

        # Frontend tests
        Write-Log "`n📦 Installing frontend dependencies..." "Yellow"
        Set-Location (Join-Path $ProjectRoot "front_end")
        npm install --legacy-peer-deps *>> $LogFile
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✓ Frontend dependencies installed" "Green"
        } else {
            throw "Frontend dependency installation failed"
        }

        Write-Log "`n🧪 Running frontend tests..." "Yellow"
        npx vitest run *>> $LogFile
        $FrontendTestResult = $LASTEXITCODE -eq 0
        Write-Result $FrontendTestResult "Frontend Tests"

        # Frontend linting
        Write-Log "`n🔍 Running frontend linting..." "Yellow"
        npm run lint *>> $LogFile
        $LintResult = $LASTEXITCODE -eq 0
        Write-Result $LintResult "Frontend Linting"

        # Frontend build test
        Write-Log "`n🏗️  Building frontend..." "Yellow"
        npm run build *>> $LogFile
        $BuildResult = $LASTEXITCODE -eq 0
        Write-Result $BuildResult "Frontend Build"

        Write-Log "`n✅ TEST JOB PASSED" "Green"
    } else {
        Write-Log "⏭️  Skipping tests" "Yellow"
    }

    #############################################
    # JOB 2: SECURITY & VALIDATION
    #############################################
    if (-not $SkipSecurity) {
        Write-Header "JOB 2: SECURITY & VALIDATION"

        # Backend security audit
        Write-Log "🔒 Running backend security audit..." "Yellow"
        Set-Location (Join-Path $ProjectRoot "api")
        npm audit --audit-level=moderate *>> $LogFile
        if ($LASTEXITCODE -eq 0) {
            Write-Result $true "Backend Security Audit"
        } else {
            Write-Log "⚠️  Backend has security vulnerabilities (continuing...)" "Yellow"
        }

        # Frontend security audit
        Write-Log "`n🔒 Running frontend security audit..." "Yellow"
        Set-Location (Join-Path $ProjectRoot "front_end")
        npm audit --audit-level=moderate *>> $LogFile
        if ($LASTEXITCODE -eq 0) {
            Write-Result $true "Frontend Security Audit"
        } else {
            Write-Log "⚠️  Frontend has security vulnerabilities (continuing...)" "Yellow"
        }

        Write-Log "`n✅ SECURITY & VALIDATION JOB COMPLETED" "Green"
    } else {
        Write-Log "⏭️  Skipping security validation" "Yellow"
    }

    #############################################
    # JOB 3: BUILD
    #############################################
    if (-not $SkipBuild) {
        Write-Header "JOB 3: BUILD"

        # Check if Docker is available
        $DockerAvailable = Get-Command docker -ErrorAction SilentlyContinue
        if ($DockerAvailable) {
            Write-Log "🐳 Docker detected - Building images..." "Yellow"
            
            Set-Location $ProjectRoot
            
            # Build backend image
            Write-Log "`n🏗️  Building backend Docker image..." "Yellow"
            docker build -t jewelaura-backend:local ./api *>> $LogFile
            $BackendBuildResult = $LASTEXITCODE -eq 0
            Write-Result $BackendBuildResult "Backend Docker Build"
            
            # Build frontend image
            Write-Log "`n🏗️  Building frontend Docker image..." "Yellow"
            docker build -t jewelaura-frontend:local ./front_end *>> $LogFile
            $FrontendBuildResult = $LASTEXITCODE -eq 0
            Write-Result $FrontendBuildResult "Frontend Docker Build"
            
            Write-Log "`n✅ BUILD JOB PASSED" "Green"
        } else {
            Write-Log "⚠️  Docker not found - Skipping Docker builds" "Yellow"
            Write-Log "Frontend production build already completed in test job" "Yellow"
            Write-Log "`n✅ BUILD JOB COMPLETED (Docker skipped)" "Green"
        }
    } else {
        Write-Log "⏭️  Skipping build" "Yellow"
    }

    #############################################
    # JOB 4: DEPLOY
    #############################################
    if (-not $SkipDeploy) {
        Write-Header "JOB 4: DEPLOY"

        Write-Log "📋 Deployment Options:" "Yellow"
        Write-Log "  1. Docker Compose (local)" "Yellow"
        Write-Log "  2. Manual deployment" "Yellow"
        Write-Log "  3. Skip deployment`n" "Yellow"

        $DeployOption = Read-Host "Select deployment option (1-3)"

        switch ($DeployOption) {
            "1" {
                Write-Log "`n🚀 Deploying with Docker Compose..." "Yellow"
                Set-Location $ProjectRoot
                
                if (Test-Path "docker-compose.yml") {
                    docker-compose down *>> $LogFile
                    docker-compose up -d *>> $LogFile
                    $DeployResult = $LASTEXITCODE -eq 0
                    
                    if ($DeployResult) {
                        Write-Result $true "Docker Compose Deployment"
                        Write-Log "`n📍 Application deployed at:" "Green"
                        Write-Log "   Frontend: http://localhost:3000" "Green"
                        Write-Log "   Backend:  http://localhost:5000" "Green"
                    } else {
                        Write-Result $false "Docker Compose Deployment"
                    }
                } else {
                    Write-Log "❌ docker-compose.yml not found" "Red"
                    throw "docker-compose.yml not found"
                }
            }
            "2" {
                Write-Log "`n📝 Manual deployment selected" "Yellow"
                Write-Log "Backend build: $ProjectRoot\api" "Yellow"
                Write-Log "Frontend build: $ProjectRoot\front_end\dist" "Yellow"
                Write-Log "`nDeploy these directories to your hosting platform" "Yellow"
            }
            "3" {
                Write-Log "`n⏭️  Deployment skipped" "Yellow"
            }
            default {
                Write-Log "`n❌ Invalid option - Deployment skipped" "Red"
            }
        }

        Write-Log "`n✅ DEPLOY JOB COMPLETED" "Green"
    } else {
        Write-Log "⏭️  Skipping deployment" "Yellow"
    }

    #############################################
    # PIPELINE SUMMARY
    #############################################
    Write-Header "PIPELINE SUMMARY"

    Write-Log "Jobs Passed: $JobsPassed" "Green"
    Write-Log "Jobs Failed: $JobsFailed" "Red"
    Write-Log "`nLog file: $LogFile" "Cyan"

    if ($JobsFailed -eq 0) {
        Write-Log "`n🎉 PIPELINE COMPLETED SUCCESSFULLY! 🎉" "Green"
        exit 0
    } else {
        Write-Log "`n❌ PIPELINE FAILED" "Red"
        Write-Log "Check the log file for details: $LogFile" "Yellow"
        exit 1
    }

} catch {
    Write-Log "`n❌ PIPELINE FAILED: $_" "Red"
    Write-Log "Check the log file for details: $LogFile" "Yellow"
    exit 1
} finally {
    Set-Location $ProjectRoot
}
