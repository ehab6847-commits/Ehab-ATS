Add-Type -AssemblyName System.Drawing

$src = "C:\Users\ALBAHA\.gemini\antigravity\brain\02232f35-1a9b-40bb-b4c8-bf90fc8899bb\app_icon_gold_black_1786371027237.jpg"
$img = [System.Drawing.Image]::FromFile($src)

function ResizeAndSave([System.Drawing.Image]$source, [int]$width, [int]$height, [string]$destination) {
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    $destImage = New-Object System.Drawing.Bitmap $width, $height
    $destImage.SetResolution($source.HorizontalResolution, $source.VerticalResolution)

    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $graphics.DrawImage($source, $destRect, 0, 0, $source.Width, $source.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $destImage.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destImage.Dispose()
}

ResizeAndSave $img 192 192 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-192.png"
ResizeAndSave $img 512 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-512.png"
ResizeAndSave $img 180 180 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\apple-touch-icon.png"
ResizeAndSave $img 512 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-maskable.png"
ResizeAndSave $img 64 64 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\favicon.png"

$img.Dispose()
Write-Host "PWA PNG icons generated successfully!"
