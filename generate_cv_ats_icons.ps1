Add-Type -AssemblyName System.Drawing

function Generate-CVATSIcon([int]$size, [string]$outPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $scale = $size / 512.0

    # 1. Background dark rounded rect
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF 0, 0),
        (New-Object System.Drawing.PointF $size, $size),
        [System.Drawing.Color]::FromArgb(255, 11, 15, 25),
        [System.Drawing.Color]::FromArgb(255, 30, 27, 75)
    )
    $radius = 110 * $scale
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.X + $rect.Width - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.X + $rect.Width - $d, $rect.Y + $rect.Height - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Y + $rect.Height - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)

    # Gold Border
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 245, 158, 11), (5 * $scale))
    $g.DrawPath($goldPen, $path)

    # 2. CV Document Sheet (White)
    $docW = 180 * $scale
    $docH = 240 * $scale
    $docX = 166 * $scale
    $docY = 65 * $scale
    $docRadius = 14 * $scale
    $docPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $dd = $docRadius * 2
    $docRect = New-Object System.Drawing.RectangleF $docX, $docY, $docW, $docH
    $docPath.AddArc($docRect.X, $docRect.Y, $dd, $dd, 180, 90)
    $docPath.AddArc($docRect.X + $docRect.Width - $dd, $docRect.Y, $dd, $dd, 270, 90)
    $docPath.AddArc($docRect.X + $docRect.Width - $dd, $docRect.Y + $docRect.Height - $dd, $dd, $dd, 0, 90)
    $docPath.AddArc($docRect.X, $docRect.Y + $docRect.Height - $dd, $dd, $dd, 90, 90)
    $docPath.CloseFigure()
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillPath($whiteBrush, $docPath)

    # Top gold header of CV
    $cvHeadH = 45 * $scale
    $cvHeadBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF $docX, $docY),
        (New-Object System.Drawing.PointF ($docX + $docW), ($docY + $cvHeadH)),
        [System.Drawing.Color]::FromArgb(255, 251, 191, 36),
        [System.Drawing.Color]::FromArgb(255, 217, 119, 6)
    )
    $g.FillRectangle($cvHeadBrush, $docX, ($docY + 8 * $scale), $docW, ($cvHeadH - 8 * $scale))

    # Avatar circle on CV
    $avBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $g.FillEllipse($avBrush, ($docX + 16 * $scale), ($docY + 12 * $scale), (24 * $scale), (24 * $scale))
    
    # CV text lines
    $line1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $g.FillRectangle($line1, ($docX + 50 * $scale), ($docY + 16 * $scale), (70 * $scale), (7 * $scale))
    $line2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 71, 85, 105))
    $g.FillRectangle($line2, ($docX + 50 * $scale), ($docY + 28 * $scale), (45 * $scale), (5 * $scale))

    # Indigo section titles
    $indigoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 79, 70, 229))
    $g.FillRectangle($indigoBrush, ($docX + 16 * $scale), ($docY + 60 * $scale), (45 * $scale), (6 * $scale))
    $g.FillRectangle($indigoBrush, ($docX + 16 * $scale), ($docY + 105 * $scale), (55 * $scale), (6 * $scale))
    $g.FillRectangle($indigoBrush, ($docX + 16 * $scale), ($docY + 165 * $scale), (40 * $scale), (6 * $scale))

    # Gray content lines
    $grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 148, 163, 184))
    $g.FillRectangle($grayBrush, ($docX + 16 * $scale), ($docY + 74 * $scale), (145 * $scale), (4 * $scale))
    $g.FillRectangle($grayBrush, ($docX + 16 * $scale), ($docY + 84 * $scale), (120 * $scale), (4 * $scale))

    $goldDot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $g.FillEllipse($goldDot, ($docX + 16 * $scale), ($docY + 120 * $scale), (6 * $scale), (6 * $scale))
    $g.FillRectangle($grayBrush, ($docX + 28 * $scale), ($docY + 120 * $scale), (130 * $scale), (4 * $scale))
    $g.FillEllipse($goldDot, ($docX + 16 * $scale), ($docY + 138 * $scale), (6 * $scale), (6 * $scale))
    $g.FillRectangle($grayBrush, ($docX + 28 * $scale), ($docY + 138 * $scale), (115 * $scale), (4 * $scale))

    # Skill pills
    $pill1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 224, 231, 255))
    $pill2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 243, 199))
    $pill3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 252, 231))
    $g.FillRectangle($pill1, ($docX + 16 * $scale), ($docY + 180 * $scale), (42 * $scale), (12 * $scale))
    $g.FillRectangle($pill2, ($docX + 64 * $scale), ($docY + 180 * $scale), (45 * $scale), (12 * $scale))
    $g.FillRectangle($pill3, ($docX + 115 * $scale), ($docY + 180 * $scale), (40 * $scale), (12 * $scale))

    # 3. Verified Shield Badge (Bottom Right)
    $badgeX = ($docX + $docW - 35 * $scale)
    $badgeY = ($docY + $docH - 45 * $scale)
    $badgeSize = 60 * $scale
    $badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $g.FillEllipse($badgeBg, $badgeX, $badgeY, $badgeSize, $badgeSize)
    $badgeGoldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 158, 11), (3 * $scale))
    $g.DrawEllipse($badgeGoldPen, $badgeX, $badgeY, $badgeSize, $badgeSize)
    
    $greenShield = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
    $g.FillEllipse($greenShield, ($badgeX + 8 * $scale), ($badgeY + 8 * $scale), ($badgeSize - 16 * $scale), ($badgeSize - 16 * $scale))

    # Checkmark inside badge
    $checkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, (4 * $scale))
    $checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($checkPen, ($badgeX + 18 * $scale), ($badgeY + 30 * $scale), ($badgeX + 26 * $scale), ($badgeY + 38 * $scale))
    $g.DrawLine($checkPen, ($badgeX + 26 * $scale), ($badgeY + 38 * $scale), ($badgeX + 42 * $scale), ($badgeY + 20 * $scale))

    # 4. Text: CV-ATS
    $fontFamily = New-Object System.Drawing.FontFamily("Arial Black")
    $fontTitle = New-Object System.Drawing.Font($fontFamily, (44 * $scale), [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF 0, (330 * $scale)),
        (New-Object System.Drawing.PointF $size, (390 * $scale)),
        [System.Drawing.Color]::FromArgb(255, 253, 224, 71),
        [System.Drawing.Color]::FromArgb(255, 217, 119, 6)
    )
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("CV-ATS", $fontTitle, $titleBrush, ($size / 2.0), (330 * $scale), $sf)

    # Subtitle: RESUME BUILDER
    $fontSub = New-Object System.Drawing.Font("Arial", (14 * $scale), [System.Drawing.FontStyle]::Bold)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 203, 213, 225))
    $g.DrawString("SMART RESUME BUILDER", $fontSub, $subBrush, ($size / 2.0), (395 * $scale), $sf)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

Generate-CVATSIcon 192 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-192.png"
Generate-CVATSIcon 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-512.png"
Generate-CVATSIcon 180 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\apple-touch-icon.png"
Generate-CVATSIcon 512 "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\icon-maskable.png"
Generate-CVATSIcon 64  "c:\Users\ALBAHA\OneDrive\Desktop\Ehab-ATS\public\static\favicon.png"

Write-Host "New CV-ATS icons generated successfully!"
