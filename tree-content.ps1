param (
    [string]$Path = "."
)

# List of folders to exclude
$excludeFolders = @("node_modules", ".angular", ".git", "dist", ".idea")

# Define the output file name using a timestamp
$timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
$outputFile = "tree.$timestamp.txt"

function Show-Tree {
    param (
        [string]$Path,
        [string]$Prefix = ""
    )

    # Common text file extensions
    # $textExtensions = @('.txt', '.md', '.js', '.ts', '.css', '.html', '.htm', '.xml', '.json', '.yml', '.yaml', '.ps1', '.psm1', '.psd1', '.sh', '.bash', '.py', '.java', '.cs', '.cpp', '.h', '.hpp', '.sql', '.log', '.config', '.conf', '.ini', '.env')
    $textExtensions = @('.html', '.ts', '.scss')

    # Get the list of directories and files, excluding specified folders
    $items = Get-ChildItem -Path $Path -Force | Where-Object {
        -not ($_.PSIsContainer -and ($_.Name -in $excludeFolders))
    } | Sort-Object -Property PSIsContainer, Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $items.Count - 1)

        # Determine the prefix for tree branches
        if ($isLast) {
            $currentPrefix = "$Prefix\-- "
            $nextPrefix = "$Prefix    "
        } else {
            $currentPrefix = "$Prefix+-- "
            $nextPrefix = "$Prefix|   "
        }

        # For files, get content and append it to the line
        $line = $currentPrefix + $item.Name
        if (-not $item.PSIsContainer) {
            $extension = [System.IO.Path]::GetExtension($item.Name).ToLower()
            if ($extension -in $textExtensions) {
                try {
                    $content = Get-Content -Path $item.FullName -Raw
                    if ($content) {
                        $content = $content -replace '[\r\n]+', ' ' -replace '\s+', ' '
                        $line += ": $content"
                    }
                }
                catch {
                    $line += ": <error reading file>"
                }
            }
        }

        Write-Output $line | Out-File -FilePath $outputFile -Append

        # Recurse into directories, skipping excluded folders
        if ($item.PSIsContainer) {
            Show-Tree -Path $item.FullName -Prefix $nextPrefix
        }
    }
}

Show-Tree -Path $Path
Write-Host "Directory structure saved to $outputFile."