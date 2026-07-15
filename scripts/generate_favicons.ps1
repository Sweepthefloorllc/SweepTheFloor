$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = 'c:\Users\Cheet\OneDrive\SweepTheFloorWebsite\SweepTheFloor_actual_site\stf_rebuild'
$src = Join-Path $root 'assets\logo.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)

# Manual crop focused on house/wave logo mark (excluding STF text).
$rect = New-Object System.Drawing.Rectangle(40, 18, 240, 170)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)

function Save-ResizedPng {
  param(
    [System.Drawing.Bitmap]$SourceBitmap,
    [int]$Size,
    [string]$OutputPath
  )

  $dest = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($dest)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::White)

  # Keep the mark centered with slight top padding for better tab-legibility.
  $destRect = New-Object System.Drawing.Rectangle(0, [int]($Size * 0.14), $Size, [int]($Size * 0.72))
  $g.DrawImage($SourceBitmap, $destRect)

  $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $dest.Dispose()
}

Save-ResizedPng -SourceBitmap $crop -Size 16  -OutputPath (Join-Path $root 'favicon-16x16.png')
Save-ResizedPng -SourceBitmap $crop -Size 32  -OutputPath (Join-Path $root 'favicon-32x32.png')
Save-ResizedPng -SourceBitmap $crop -Size 180 -OutputPath (Join-Path $root 'apple-touch-icon.png')
Save-ResizedPng -SourceBitmap $crop -Size 192 -OutputPath (Join-Path $root 'android-chrome-192x192.png')
Save-ResizedPng -SourceBitmap $crop -Size 512 -OutputPath (Join-Path $root 'android-chrome-512x512.png')

$icoBmp = New-Object System.Drawing.Bitmap(32, 32)
$g2 = [System.Drawing.Graphics]::FromImage($icoBmp)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.Clear([System.Drawing.Color]::White)
$destRectIco = New-Object System.Drawing.Rectangle(0, 4, 32, 23)
$g2.DrawImage($crop, $destRectIco)

$hIcon = $icoBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$iconPath = Join-Path $root 'favicon.ico'
$fs = [System.IO.File]::Create($iconPath)
$icon.Save($fs)
$fs.Close()

$g2.Dispose()
$icoBmp.Dispose()
$crop.Dispose()
$bmp.Dispose()

Write-Output 'Generated favicon files successfully.'
