<#
.SYNOPSIS
Builds tnctr download manager from the project root, regardless of the current directory.
.EXAMPLE
.\build.ps1
.EXAMPLE
& 'C:\Projects\tnctr download manager\build.ps1' -Configuration Debug
#>
param(
  [ValidateSet("Release", "Debug")]
  [string]$Configuration = "Release"
)

$ErrorActionPreference = "Stop"

# PowerShell's equivalent of a batch file's %~dp0.
Push-Location -LiteralPath $PSScriptRoot
try {
  $cargo = Get-Command cargo -CommandType Application -ErrorAction SilentlyContinue
  if (-not $cargo) {
    $cargoHome = if ($env:CARGO_HOME) { $env:CARGO_HOME } else { Join-Path $HOME ".cargo" }
    $cargoName = if ($env:OS -eq "Windows_NT") { "cargo.exe" } else { "cargo" }
    $cargoPath = Join-Path (Join-Path $cargoHome "bin") $cargoName
    $cargo = Get-Command $cargoPath -CommandType Application -ErrorAction SilentlyContinue
  }
  if (-not $cargo) {
    throw "Cargo was not found. Install Rust stable from https://rustup.rs (MSVC on Windows) and the Visual Studio C++ build tools on Windows."
  }

  $buildArgs = @("build", "--locked", "-p", "mdm-app", "-p", "mdm-nmhost", "-p", "mdm-cli", "-p", "mdm-mcp")
  if ($Configuration -eq "Release") { $buildArgs += "--release" }

  Write-Host "Building tnctr download manager ($Configuration)..."
  & $cargo.Source @buildArgs
  if ($LASTEXITCODE -ne 0) { throw "Cargo build failed (exit code $LASTEXITCODE)." }
  Write-Host "Build completed. Default output: target/$($Configuration.ToLowerInvariant())/ (unless overridden in Cargo settings)."
} finally {
  Pop-Location
}
