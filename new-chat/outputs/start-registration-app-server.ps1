$ProjectRoot = "C:\Users\tzvik\Documents\Codex\2026-07-05\new-chat\current-registration-project"
$AppRoot = Join-Path $ProjectRoot "registration-app"
$ServerFile = Join-Path $ProjectRoot "work\local-static-server.js"
$Port = 8799

Write-Host ""
Write-Host "Starting registration app preview..." -ForegroundColor Cyan
Write-Host "Folder: $AppRoot"
Write-Host "URL:    http://127.0.0.1:$Port/"
Write-Host ""
Write-Host "Keep this PowerShell window open while testing the form." -ForegroundColor Yellow
Write-Host "To stop the server later, close this window or press Ctrl+C."
Write-Host ""

Set-Location $AppRoot
node $ServerFile $AppRoot $Port
