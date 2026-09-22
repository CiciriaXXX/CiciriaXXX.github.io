"""Crop the six user-supplied stills to matching 4:3 tiles, without labels."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = root / 'scripts/assets/rendering-cover'
cover = Image.new('RGB', (1800, 900))
for index, name in enumerate(['glass', 'diamond', 'jade', 'galaxy', 'fog', 'foliage']):
    with Image.open(source / (name + '.png')) as image:
        tile = ImageOps.fit(image.convert('RGB'), (600, 450), Image.Resampling.LANCZOS)
        cover.paste(tile, ((index % 3) * 600, (index // 3) * 450))
cover.save(root / 'public/rendering-practice/cover.webp', quality=94)
print('Cover: 1800 x 900; six 600 x 450 tiles; no added text.')
