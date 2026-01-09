$ErrorActionPreference = "Stop"

Write-Host "Building Blazor App..."
dotnet publish .\IsekaiStatusMaker\IsekaiStatusMaker.csproj -c Release -o .\dist\blazor

Write-Host "Deploying to Next.js public directory..."
$dest = ".\public\isekai-status-maker"

# Clean destination
if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Copy files
Copy-Item -Recurse -Force .\dist\blazor\wwwroot\* $dest

Write-Host "Deployment Complete! Access at /isekai-status-maker/index.html"
