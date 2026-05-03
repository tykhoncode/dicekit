param()

# Read the hook input JSON from stdin
$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }

try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

# Prefer the response path (post-write actual location), fall back to input
$file = $null
if ($data.tool_response -and $data.tool_response.filePath) {
    $file = $data.tool_response.filePath
} elseif ($data.tool_input -and $data.tool_input.file_path) {
    $file = $data.tool_input.file_path
}

if (-not $file) { exit 0 }
if (-not (Test-Path -LiteralPath $file)) { exit 0 }

# Project root is the parent of this script's .claude/ folder
$projectRoot = (Get-Item -LiteralPath $PSScriptRoot).Parent.FullName
$resolved = (Resolve-Path -LiteralPath $file).Path
if (-not $resolved.StartsWith($projectRoot, [StringComparison]::OrdinalIgnoreCase)) { exit 0 }

# Run local binaries directly — avoids npx overhead and PATH issues from the hook context
$prettier = Join-Path $projectRoot "node_modules\.bin\prettier.cmd"
$eslint   = Join-Path $projectRoot "node_modules\.bin\eslint.cmd"

if (Test-Path -LiteralPath $prettier) {
    & $prettier --write --log-level warn --ignore-unknown $resolved 2>$null | Out-Null
}

$lintReport = $null
if ($resolved -match '\.(ts|tsx|js|jsx|mjs|cjs)$' -and (Test-Path -LiteralPath $eslint)) {
    # First pass: auto-fix everything ESLint can fix on its own
    & $eslint --fix --no-warn-ignored $resolved 2>$null | Out-Null

    # Second pass: report whatever could not be fixed
    $lintOutput = & $eslint --no-warn-ignored --format=stylish $resolved 2>&1
    if ($LASTEXITCODE -ne 0) {
        $lintReport = ($lintOutput | Out-String).Trim()
    }
}

if ($lintReport) {
    $payload = [ordered]@{
        hookSpecificOutput = [ordered]@{
            hookEventName     = "PostToolUse"
            additionalContext = "ESLint reports remaining issues in $resolved that --fix could not resolve. Address them in a follow-up edit:`n`n$lintReport"
        }
    } | ConvertTo-Json -Depth 5 -Compress
    Write-Output $payload
}

exit 0
