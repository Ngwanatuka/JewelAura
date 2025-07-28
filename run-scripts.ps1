#!/usr/bin/env pwsh

Write-Host "🔍 Finding all .sh scripts in JewelAura..." -ForegroundColor Cyan

$scripts = Get-ChildItem -Path . -Filter "*.sh" -Recurse

if ($scripts.Count -eq 0) {
    Write-Host "❌ No .sh scripts found!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Found $($scripts.Count) script(s):" -ForegroundColor Green
foreach ($script in $scripts) {
    Write-Host "  • $($script.FullName)" -ForegroundColor Yellow
}

Write-Host "`n🚀 Running scripts..." -ForegroundColor Cyan

foreach ($script in $scripts) {
    Write-Host "`n▶️ Executing: $($script.Name)" -ForegroundColor Magenta
    
    # Check if WSL is available
    if (Get-Command wsl -ErrorAction SilentlyContinue) {
        $wslPath = $script.FullName -replace '\\', '/' -replace 'C:', '/mnt/c'
        wsl chmod +x $wslPath
        wsl bash $wslPath
    }
    # Check if Git Bash is available
    elseif (Get-Command bash -ErrorAction SilentlyContinue) {
        bash $script.FullName
    }
    else {
        Write-Host "❌ Neither WSL nor Git Bash found. Please install one to run .sh scripts." -ForegroundColor Red
        Write-Host "💡 Alternatively, use the deploy.bat file for Windows." -ForegroundColor Yellow
    }
}

Write-Host "`n✅ All scripts executed!" -ForegroundColor Green