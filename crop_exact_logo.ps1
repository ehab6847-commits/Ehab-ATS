Add-Type -AssemblyName System.Drawing

$src = "C:\Users\ALBAHA\.gemini\antigravity\brain\02232f35-1a9b-40bb-b4c8-bf90fc8899bb\.user_uploaded\media_1786945179248.png"
$img = [System.Drawing.Image]::FromFile($src)

Write-Host "Original Image Size: $($img.Width) x $($img.Height)"

# The icon is centered in the square image (roughly between 20% and 80% or centered squircle)
# Let's crop the app icon perfectly or use the full image centered
$cropX = [int]($img.Width * 0.19)
$cropY = [int]($img.Height * 0.19)
$cropW = [int]($img.Width * 0.62)
$cropH = [int]($img.Height * 0.62)

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH

function Save-Cropped([System.Drawing.Image]$source, [System.Drawing.Rectangle]$crop, [int]$size, [string]$outPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $bmp.SetResolution(96, 96)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $g.DrawImage($source, $destRect, $crop.X, $crop.Y, $crop.Width, $crop.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
}

Save-Cropped $img $srcRect 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-512.png"
Save-Cropped $img $srcRect 192 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-192.png"
Save-Cropped $img $srcRect 180 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\apple-touch-icon.png"
Save-Cropped $img $srcRect 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-maskable.png"
Save-Cropped $img $srcRect 64  "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\favicon.png"
Save-Cropped $img $srcRect 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\logo.png"

$img.Dispose()
Write-Host "Exact user logo cropped and saved successfully!"
