param(
    [Parameter(Mandatory = $true)]
    [string]$JsonPath
)

if (-not (Test-Path -LiteralPath $JsonPath)) {
    throw "File not found: $JsonPath"
}

# Read JSON explicitly as UTF-8 to preserve non-ASCII characters like å/ä/ö.
$jsonText = [System.IO.File]::ReadAllText($JsonPath, [System.Text.Encoding]::UTF8)
$json = $jsonText | ConvertFrom-Json

function Get-InvalidFirebaseKeys {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Node,
        [string]$Path = ''
    )

    $invalid = @()

    if ($null -eq $Node) {
        return $invalid
    }

    if ($Node -is [System.Management.Automation.PSCustomObject]) {
        foreach ($prop in $Node.PSObject.Properties) {
            $key = [string]$prop.Name
            $currentPath = if ([string]::IsNullOrEmpty($Path)) { $key } else { "$Path/$key" }

            if ([string]::IsNullOrWhiteSpace($key) -or $key -match '[\$#\[\]\./]') {
                $invalid += $currentPath
            }

            $invalid += Get-InvalidFirebaseKeys -Node $prop.Value -Path $currentPath
        }
    }
    elseif ($Node -is [System.Collections.IEnumerable] -and -not ($Node -is [string])) {
        $index = 0
        foreach ($item in $Node) {
            $itemPath = "$Path[$index]"
            $invalid += Get-InvalidFirebaseKeys -Node $item -Path $itemPath
            $index++
        }
    }

    return $invalid
}

$invalidBefore = Get-InvalidFirebaseKeys -Node $json
if ($invalidBefore.Count -gt 0) {
    $preview = ($invalidBefore | Select-Object -First 20) -join ', '
    throw "Input JSON contains invalid Firebase keys. Examples: $preview"
}

if (-not $json.PSObject.Properties.Name.Contains('cars')) {
    $json | Add-Member -NotePropertyName 'cars' -NotePropertyValue ([pscustomobject]@{})
}

$carInfoRoot = $json.'car-info'
$fuelRoot = $json.'car-fueling'
$maintenanceRoot = $json.'car-maintenance'

# Deep copies are used for migration writes to avoid self-referencing objects.
$carInfoFlatCopy = if ($null -ne $carInfoRoot) { $carInfoRoot | ConvertTo-Json -Depth 100 | ConvertFrom-Json } else { $null }
$fuelFlatCopy = if ($null -ne $fuelRoot) { $fuelRoot | ConvertTo-Json -Depth 100 | ConvertFrom-Json } else { $null }
$maintenanceFlatCopy = if ($null -ne $maintenanceRoot) { $maintenanceRoot | ConvertTo-Json -Depth 100 | ConvertFrom-Json } else { $null }

$targetCarId = $null
$singleCarInfo = $null

# Use existing car id from cars node as primary migration target.
if ($null -ne $json.cars -and $json.cars.PSObject.Properties.Count -gt 0) {
    $targetCarId = ($json.cars.PSObject.Properties | Select-Object -First 1).Name
}

# Fallback: if cars is empty, try deriving one car from root car-info.
if ([string]::IsNullOrWhiteSpace($targetCarId) -and $null -ne $carInfoRoot -and $carInfoRoot.PSObject.Properties.Count -gt 0) {
    $first = $carInfoRoot.PSObject.Properties | Select-Object -First 1
    $targetCarId = $first.Name
    $singleCarInfo = $first.Value
}

if ([string]::IsNullOrWhiteSpace($targetCarId)) {
    $targetCarId = 'migrated-car-1'
}

if (-not $json.cars.PSObject.Properties.Name.Contains($targetCarId)) {
    $newCar = [ordered]@{}

    if ($null -ne $singleCarInfo) {
        $titleParts = @()
        if ($singleCarInfo.registerNumber) { $titleParts += [string]$singleCarInfo.registerNumber }
        if ($singleCarInfo.modelYear) { $titleParts += [string]$singleCarInfo.modelYear }
        if ($titleParts.Count -gt 0) { $newCar.title = ($titleParts -join ' ') }

        if ($singleCarInfo.modelYear) { $newCar.modelYear = [string]$singleCarInfo.modelYear }
        if ($singleCarInfo.registerNumber) { $newCar.registerNumber = [string]$singleCarInfo.registerNumber }
        if ($singleCarInfo.created) { $newCar.created = $singleCarInfo.created }
        if ($singleCarInfo.createdBy) { $newCar.createdBy = $singleCarInfo.createdBy }
    }

    $json.cars | Add-Member -NotePropertyName $targetCarId -NotePropertyValue ([pscustomobject]$newCar)
}

$targetCar = $json.cars.$targetCarId

# Build target structure at root level:
# car-info/{carId}/...
# car-fueling/{carId}/{fuelingId}
# car-maintenance/{carId}/{maintenanceId}

if (-not $json.PSObject.Properties.Name.Contains('car-info') -or $null -eq $json.'car-info') {
    $json | Add-Member -NotePropertyName 'car-info' -NotePropertyValue ([pscustomobject]@{}) -Force
}

if (-not $json.PSObject.Properties.Name.Contains('car-fueling') -or $null -eq $json.'car-fueling') {
    $json | Add-Member -NotePropertyName 'car-fueling' -NotePropertyValue ([pscustomobject]@{}) -Force
}

if (-not $json.PSObject.Properties.Name.Contains('car-maintenance') -or $null -eq $json.'car-maintenance') {
    $json | Add-Member -NotePropertyName 'car-maintenance' -NotePropertyValue ([pscustomobject]@{}) -Force
}

# Keep references in case properties were recreated.
$carInfoNode = $json.'car-info'
$fuelNode = $json.'car-fueling'
$maintenanceNode = $json.'car-maintenance'

# Move car-info under car-id if it is still in flat form.
if ($null -ne $carInfoFlatCopy -and $carInfoFlatCopy.PSObject.Properties.Count -gt 0) {
    $alreadyNestedInfo = $carInfoNode.PSObject.Properties.Name -contains $targetCarId
    if (-not $alreadyNestedInfo) {
        if ($carInfoFlatCopy.PSObject.Properties.Count -eq 1) {
            $infoValue = ($carInfoFlatCopy.PSObject.Properties | Select-Object -First 1).Value
            $carInfoNode | Add-Member -NotePropertyName $targetCarId -NotePropertyValue $infoValue -Force
        }
        else {
            $carInfoNode | Add-Member -NotePropertyName $targetCarId -NotePropertyValue $carInfoFlatCopy -Force
        }
    }
}

# Move car-fueling under car-id if it is still in flat form.
if ($null -ne $fuelFlatCopy -and $fuelFlatCopy.PSObject.Properties.Count -gt 0) {
    $alreadyNestedFueling = $fuelNode.PSObject.Properties.Name -contains $targetCarId
    if (-not $alreadyNestedFueling) {
        $fuelNode | Add-Member -NotePropertyName $targetCarId -NotePropertyValue $fuelFlatCopy -Force
    }
}

# Move car-maintenance under car-id if it is still in flat form.
if ($null -ne $maintenanceFlatCopy -and $maintenanceFlatCopy.PSObject.Properties.Count -gt 0) {
    $alreadyNestedMaintenance = $maintenanceNode.PSObject.Properties.Name -contains $targetCarId
    if (-not $alreadyNestedMaintenance) {
        $maintenanceNode | Add-Member -NotePropertyName $targetCarId -NotePropertyValue $maintenanceFlatCopy -Force
    }
}

# Remove top-level flat entries from the nested root nodes if any key is not car-id.
foreach ($key in @($carInfoNode.PSObject.Properties.Name)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $carInfoNode.PSObject.Properties.Remove($key)
    }
}

foreach ($key in @($fuelNode.PSObject.Properties.Name)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $fuelNode.PSObject.Properties.Remove($key)
    }
}

foreach ($key in @($maintenanceNode.PSObject.Properties.Name)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $maintenanceNode.PSObject.Properties.Remove($key)
    }
}

$backupPath = "$JsonPath.before-car-migration.json"
Copy-Item -LiteralPath $JsonPath -Destination $backupPath -Force

$invalidAfter = Get-InvalidFirebaseKeys -Node $json
if ($invalidAfter.Count -gt 0) {
    $preview = ($invalidAfter | Select-Object -First 20) -join ', '
    throw "Migration result contains invalid Firebase keys. Examples: $preview"
}

$outputJson = $json | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($JsonPath, $outputJson, (New-Object System.Text.UTF8Encoding($false)))

Write-Output "Migrated root car keys under car-id level using $targetCarId"
Write-Output "Backup: $backupPath"
