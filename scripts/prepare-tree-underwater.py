"""Prepare website copies of the author's underwater captures, preserving sources."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil\作品集\好大一棵树\原图片')
OUTPUT = ROOT / 'public/a-great-big-tree/underwater'
CAPTURES = {
    'underside': '232426',
    'waterline': '232509',
    'turbidity': '232447',
    'graph-grazing-correction': '230743',
    'graph-composition': '230828',
    'reflection-last': '231001',
    'shallow-last': '231059',
    'grazing-before': '231647',
    'grazing-after': '231720',
}

OUTPUT.mkdir(parents=True, exist_ok=True)
metadata = {}
contact = Image.new('RGB', (960, 3 * 230), '#eeeeee')
draw = ImageDraw.Draw(contact)
for index, (name, timestamp) in enumerate(CAPTURES.items()):
    replacement = ROOT / 'scripts/assets/tree-underwater' / f'{name}.png'
    source_path = replacement if replacement.exists() else SOURCE / f'Pasted image 20261104{timestamp}.png'
    with Image.open(source_path) as source:
        source.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
        preview = source.copy()
        if not name.startswith('graph-'):
            preview.thumbnail((960, 960), Image.Resampling.LANCZOS)
        preview.save(OUTPUT / f'{name}-preview.webp', 'WEBP', quality=94 if name.startswith('graph-') else 88, method=6)
        metadata[name] = {
            'src': f'/a-great-big-tree/underwater/{name}-preview.webp',
            'fullSrc': f'/a-great-big-tree/underwater/{name}.webp',
            'width': source.width, 'height': source.height,
        }
        thumb = source.convert('RGB')
        thumb.thumbnail((312, 198), Image.Resampling.LANCZOS)
        x, y = (index % 3) * 320, (index // 3) * 230
        contact.paste(thumb, (x, y + 24))
        draw.text((x + 4, y + 4), name, fill='black')
(ROOT / 'src/data/treeUnderwaterImages.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
(ROOT / 'output').mkdir(exist_ok=True)
contact.save(ROOT / 'output/tree-underwater-contact.jpg')
print(f'Prepared {len(metadata)} captures with full-resolution copies.')
