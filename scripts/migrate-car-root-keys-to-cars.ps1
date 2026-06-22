param(
    [Parameter(Mandatory = $true)]
    [string]$JsonPath
)

function ConvertFrom-JsonCaseSensitive {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text
    )

    $convertFromJsonCommand = Get-Command ConvertFrom-Json
    if ($convertFromJsonCommand.Parameters.ContainsKey('AsHashtable')) {
        return $Text | ConvertFrom-Json -AsHashtable
    }

    Add-Type -AssemblyName System.Web.Extensions
    $serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
    $serializer.MaxJsonLength = [int]::MaxValue
    return $serializer.DeserializeObject($Text)
}

function Copy-JsonNode {
    param(
        [Parameter(Mandatory = $false)]
        [object]$Node
    )

    if ($null -eq $Node) {
        return $null
    }

    $nodeText = $Node | ConvertTo-Json -Depth 100
    return ConvertFrom-JsonCaseSensitive -Text $nodeText
}

if (-not (Test-Path -LiteralPath $JsonPath)) {
    throw "File not found: $JsonPath"
}

# Read JSON explicitly as UTF-8 to preserve non-ASCII characters like å/ä/ö.
$jsonText = [System.IO.File]::ReadAllText($JsonPath, [System.Text.Encoding]::UTF8)
$json = ConvertFrom-JsonCaseSensitive -Text $jsonText

if (-not ($json -is [System.Collections.IDictionary])) {
    throw "Input JSON root must be an object."
}

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

    if ($Node -is [System.Collections.IDictionary]) {
        foreach ($keyObject in $Node.Keys) {
            $key = [string]$keyObject
            $currentPath = if ([string]::IsNullOrEmpty($Path)) { $key } else { "$Path/$key" }

            if ([string]::IsNullOrWhiteSpace($key) -or $key -match '[\$#\[\]\./]') {
                $invalid += $currentPath
            }

            $invalid += Get-InvalidFirebaseKeys -Node $Node[$keyObject] -Path $currentPath
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

if (-not $json.ContainsKey('cars')) {
    $json['cars'] = [ordered]@{}
}

$carInfoRoot = $json['car-info']
$fuelRoot = $json['car-fueling']
$maintenanceRoot = $json['car-maintenance']

# Deep copies are used for migration writes to avoid self-referencing objects.
$carInfoFlatCopy = Copy-JsonNode -Node $carInfoRoot
$fuelFlatCopy = Copy-JsonNode -Node $fuelRoot
$maintenanceFlatCopy = Copy-JsonNode -Node $maintenanceRoot

$targetCarId = $null
$singleCarInfo = $null

# Use existing car id from cars node as primary migration target.
if ($null -ne $json['cars'] -and $json['cars'] -is [System.Collections.IDictionary] -and $json['cars'].Count -gt 0) {
    $targetCarId = [string]($json['cars'].Keys | Select-Object -First 1)
}

# Fallback: if cars is empty, try deriving one car from root car-info.
if ([string]::IsNullOrWhiteSpace($targetCarId) -and $null -ne $carInfoRoot -and $carInfoRoot -is [System.Collections.IDictionary] -and $carInfoRoot.Count -gt 0) {
    $targetCarId = [string]($carInfoRoot.Keys | Select-Object -First 1)
    $singleCarInfo = $carInfoRoot[$targetCarId]
}

if ([string]::IsNullOrWhiteSpace($targetCarId)) {
    $targetCarId = 'migrated-car-1'
}

if (-not $json['cars'].ContainsKey($targetCarId)) {
    $newCar = [ordered]@{}

    if ($null -ne $singleCarInfo) {
        $titleParts = @()
        if ($singleCarInfo['registerNumber']) { $titleParts += [string]$singleCarInfo['registerNumber'] }
        if ($singleCarInfo['modelYear']) { $titleParts += [string]$singleCarInfo['modelYear'] }
        if ($titleParts.Count -gt 0) { $newCar.title = ($titleParts -join ' ') }

        if ($singleCarInfo['modelYear']) { $newCar.modelYear = [string]$singleCarInfo['modelYear'] }
        if ($singleCarInfo['registerNumber']) { $newCar.registerNumber = [string]$singleCarInfo['registerNumber'] }
        if ($singleCarInfo['created']) { $newCar.created = $singleCarInfo['created'] }
        if ($singleCarInfo['createdBy']) { $newCar.createdBy = $singleCarInfo['createdBy'] }
    }

    $json['cars'][$targetCarId] = $newCar
}

# Build target structure at root level:
# car-info/{carId}/...
# car-fueling/{carId}/{fuelingId}
# car-maintenance/{carId}/{maintenanceId}

if (-not $json.ContainsKey('car-info') -or $null -eq $json['car-info']) {
    $json['car-info'] = [ordered]@{}
}

if (-not $json.ContainsKey('car-fueling') -or $null -eq $json['car-fueling']) {
    $json['car-fueling'] = [ordered]@{}
}

if (-not $json.ContainsKey('car-maintenance') -or $null -eq $json['car-maintenance']) {
    $json['car-maintenance'] = [ordered]@{}
}

# Keep references in case properties were recreated.
$carInfoNode = $json['car-info']
$fuelNode = $json['car-fueling']
$maintenanceNode = $json['car-maintenance']

# Move car-info under car-id if it is still in flat form.
if ($null -ne $carInfoFlatCopy -and $carInfoFlatCopy.Count -gt 0) {
    $alreadyNestedInfo = $carInfoNode.ContainsKey($targetCarId)
    if (-not $alreadyNestedInfo) {
        if ($carInfoFlatCopy.Count -eq 1) {
            $firstKey = [string]($carInfoFlatCopy.Keys | Select-Object -First 1)
            $infoValue = $carInfoFlatCopy[$firstKey]
            $carInfoNode[$targetCarId] = $infoValue
        }
        else {
            $carInfoNode[$targetCarId] = $carInfoFlatCopy
        }
    }
}

# Move car-fueling under car-id if it is still in flat form.
if ($null -ne $fuelFlatCopy -and $fuelFlatCopy.Count -gt 0) {
    $alreadyNestedFueling = $fuelNode.ContainsKey($targetCarId)
    if (-not $alreadyNestedFueling) {
        $fuelNode[$targetCarId] = $fuelFlatCopy
    }
}

# Move car-maintenance under car-id if it is still in flat form.
if ($null -ne $maintenanceFlatCopy -and $maintenanceFlatCopy.Count -gt 0) {
    $alreadyNestedMaintenance = $maintenanceNode.ContainsKey($targetCarId)
    if (-not $alreadyNestedMaintenance) {
        $maintenanceNode[$targetCarId] = $maintenanceFlatCopy
    }
}

# Remove top-level flat entries from the nested root nodes if any key is not car-id.
foreach ($key in @($carInfoNode.Keys)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $carInfoNode.Remove($key)
    }
}

foreach ($key in @($fuelNode.Keys)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $fuelNode.Remove($key)
    }
}

foreach ($key in @($maintenanceNode.Keys)) {
    if ($key -ne $targetCarId -and $key -like '-*') {
        $null = $maintenanceNode.Remove($key)
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
