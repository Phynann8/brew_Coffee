$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$folders = Get-ChildItem -Path $base -Directory | Sort-Object Name

if ($folders.Count -eq 0) {
    Write-Host "No asset folders found." -ForegroundColor Yellow
    exit 1
}

$missing = @()

foreach ($folder in $folders) {
    $codePath = Join-Path $folder.FullName "code.html"
    $screenPath = Join-Path $folder.FullName "screen.png"

    $hasCode = Test-Path $codePath
    $hasScreen = Test-Path $screenPath

    if (-not $hasCode -or -not $hasScreen) {
        $missing += [pscustomobject]@{
            Folder = $folder.Name
            HasCodeHtml = $hasCode
            HasScreenPng = $hasScreen
        }
    }
}

Write-Host "Total screen folders: $($folders.Count)"
Write-Host "Missing required files: $($missing.Count)"

if ($missing.Count -gt 0) {
    $missing | Format-Table -AutoSize
    exit 2
}

Write-Host "Validation passed: all folders contain code.html and screen.png." -ForegroundColor Green
