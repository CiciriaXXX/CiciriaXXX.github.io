"""Prepare web copies of the author's water-surface captures; preserve originals."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil\作品集\好大一棵树\原图片')
OUTPUT = ROOT / 'public/a-great-big-tree/water'
CAPTURES = {
    'painting-reference': '153625',
    'reflection-base': '164420',
    'reflection-ripples': '153450',
    'outline-artifact': '155517',
    'reflection-smear': '153645',
    'depth-color': '154630',
    'fresnel-composite': '154804',
    'foam-camera-depth': '160253',
    'foam-filtered-depth': '160409',
    'graph-composition': '164820',
    'graph-reflection-uv': '164916',
    'graph-distance-distortion': '164930',
    'graph-detail-normal': '164949',
    'graph-fresnel': '165044',
    'graph-refraction': '165138',
    'graph-shallow-mask': '165212',
    'graph-depth-reconstruction': '165222',
    'graph-foam': '165259',
    'graph-wave': '165344',
    'graph-gerstner': '165356',
}

OUTPUT.mkdir(parents=True, exist_ok=True)
metadata = {}
original_bytes = 0
preview_bytes = 0
for name, timestamp in CAPTURES.items():
    source = SOURCE / f'Pasted image 20261022{timestamp}.png'
    with Image.open(source) as image:
        image.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
        original_bytes += (OUTPUT / f'{name}.webp').stat().st_size
        preview = image.copy()
        is_graph = name.startswith('graph-')
        if not is_graph:
            preview.thumbnail((960, 960), Image.Resampling.LANCZOS)
        preview_path = OUTPUT / f'{name}-preview.webp'
        preview.save(preview_path, 'WEBP', quality=94 if is_graph else 85, method=6)
        # Keep the smaller lossless encoding when a text capture compresses better that way.
        if preview_path.stat().st_size > (OUTPUT / f'{name}.webp').stat().st_size:
            preview_path.write_bytes((OUTPUT / f'{name}.webp').read_bytes())
        preview_bytes += preview_path.stat().st_size
        metadata[name] = {'src': f'/a-great-big-tree/water/{name}-preview.webp',
                          'fullSrc': f'/a-great-big-tree/water/{name}.webp',
                          'width': image.width, 'height': image.height}
        if not is_graph:
            small = image.copy()
            small.thumbnail((480, 480), Image.Resampling.LANCZOS)
            small.save(OUTPUT / f'{name}-small.webp', 'WEBP', quality=85, method=6)
            metadata[name]['srcSet'] = (f'/a-great-big-tree/water/{name}-small.webp {small.width}w, '
                                        f'/a-great-big-tree/water/{name}-preview.webp {preview.width}w')
            metadata[name]['sizes'] = 'auto, 50vw'
(ROOT / 'src/data/treeWaterImages.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
notes_path = ROOT / 'src/data/treeWaterNotes.json'
notes = json.loads(notes_path.read_text(encoding='utf-8'))
for blocks in notes.values():
    for block in blocks:
        if block['type'] == 'figure':
            name = Path(block.get('fullSrc', block['src'])).stem
            block.update(metadata[name])
notes_path.write_text(json.dumps(notes, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'{len(metadata)} images: {original_bytes:,} -> {preview_bytes:,} preview bytes '
      f'({1 - preview_bytes / original_bytes:.1%} smaller). Full-size copies retained.')
