# Build seamless, single-image covers from the supplied artwork. Originals stay intact.
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$artRoot = Join-Path $PSScriptRoot '../public/artworks'
$output = Join-Path $artRoot 'covers'
New-Item -ItemType Directory -Force $output | Out-Null
function Build-Cover($name, $tiles) {
    $canvas = [System.Drawing.Bitmap]::new(1200, 1200)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    foreach ($tile in $tiles) {
        $source = [System.Drawing.Image]::FromFile((Join-Path $artRoot $tile[0]))
        $x = $tile[1]; $y = $tile[2]; $width = $tile[3]; $height = $tile[4]
        $scale = [Math]::Max($width / $source.Width, $height / $source.Height)
        if ($name -eq 'character-design') {
            $scale = [Math]::Min($width / $source.Width, $height / $source.Height)
            $graphics.DrawImage($source, [System.Drawing.RectangleF]::new($x + ($width - $source.Width * $scale) / 2, $y + ($height - $source.Height * $scale) / 2, $source.Width * $scale, $source.Height * $scale))
            $source.Dispose()
            continue
        }
        $cropWidth = $width / $scale; $cropHeight = $height / $scale
        $target = [System.Drawing.RectangleF]::new($x, $y, $width, $height)
        $crop = [System.Drawing.RectangleF]::new(($source.Width - $cropWidth) / 2, ($source.Height - $cropHeight) / 2, $cropWidth, $cropHeight)
        $graphics.DrawImage($source, $target, $crop, [System.Drawing.GraphicsUnit]::Pixel)
        $source.Dispose()
    }
    $canvas.Save((Join-Path $output "$name.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose(); $canvas.Dispose()
}
Build-Cover 'character-illustration' @(
    @('rest.png', 0, 0, 600, 600),
    @('red-haired-character.jpg', 600, 0, 600, 600),
    @('rain-water.jpg', 0, 600, 600, 600),
    @('grain-rain.jpg', 600, 600, 600, 600)
)
Build-Cover 'graphic-design' @(
    @('philosophy-shirt.jpg', 0, 0, 500, 1200),
    @('welcome-banner.jpg', 500, 0, 700, 500),
    @('philosophy-logo.jpg', 500, 500, 700, 270),
    @('philosophy-month.jpg', 500, 770, 700, 430)
)
Build-Cover 'character-design' @(
    @('environment-mascots.jpg', 0, 0, 600, 650),
    @('graduation-mascots.jpg', 600, 0, 600, 650),
    @('campus-characters.jpg', 0, 650, 1200, 550)
)
