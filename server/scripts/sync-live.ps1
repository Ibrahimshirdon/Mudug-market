# Sync MongoDB Data from Local to Live Atlas
# Usage: .\scripts\sync-live.ps1 -AtlasUri "mongodb+srv://user:pass@cluster.mongodb.net/mudug_market"

param (
    [Parameter(Mandatory=$true)]
    [string]$AtlasUri
)

$LocalDb = "mudug_market"
$DumpFolder = "dump_temp"

Write-Host "🚀 Starting Database Synchronization..." -ForegroundColor Cyan

# 1. Clean up old dumps
if (Test-Path $DumpFolder) {
    Remove-Item -Recurse -Force $DumpFolder
}

# 2. Dump local data
Write-Host "📦 Dumping local data from $LocalDb..." -ForegroundColor Yellow
mongodump --db $LocalDb --out $DumpFolder

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to dump local data. Ensure mongodump is installed and MongoDB is running." -ForegroundColor Red
    exit
}

# 3. Restore to Atlas
Write-Host "📤 Restoring data to live Atlas cluster..." -ForegroundColor Yellow
mongorestore --uri="$AtlasUri" "$DumpFolder/$LocalDb"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to restore to Atlas. Check your connection string and network access." -ForegroundColor Red
} else {
    Write-Host "✅ Successfully synchronized all data to live database!" -ForegroundColor Green
}

# 4. Cleanup
Remove-Item -Recurse -Force $DumpFolder
Write-Host "✨ Done."
