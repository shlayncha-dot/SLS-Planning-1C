param(
  [Parameter(Mandatory = $false)]
  [string]$ConfigPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent (Resolve-Path $PSCommandPath)
$indexerPath = Join-Path $scriptDir 'indexer.ps1'

if (-not $ConfigPath) {
  $ConfigPath = Join-Path $scriptDir 'config.json'
}
elseif (-not [System.IO.Path]::IsPathRooted($ConfigPath)) {
  $ConfigPath = Join-Path $scriptDir $ConfigPath
}

if (-not (Test-Path -LiteralPath $indexerPath)) {
  throw "indexer.ps1 not found at '$indexerPath'."
}

if (-not (Test-Path -LiteralPath $ConfigPath)) {
  throw "config.json not found at '$ConfigPath'. Copy config.json.example to config.json and update settings."
}

$windowsPowerShell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
if (-not (Test-Path -LiteralPath $windowsPowerShell)) {
  throw "powershell.exe not found at '$windowsPowerShell'."
}

& $windowsPowerShell -NoProfile -ExecutionPolicy Bypass -File $indexerPath -ConfigPath $ConfigPath
exit $LASTEXITCODE
