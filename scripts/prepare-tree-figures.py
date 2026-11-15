"""Prepare the author's animal/character captures and reveal video for the website."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil')
OUTPUT = ROOT / 'public/a-great-big-tree/figures'
CAPTURES = {
    'music-reference': '20261105173335',
    'listener-model': '20261105172332',
    'long-dress-model': '20261105174617',
    'guitar-model': '20261105174717',
    'gathering-reference': '20261105173449',
    'umbrella-model': '20261105174816',
    'floral-dress-model': '20261105175015',
    'orange-dress-model': '20261105175318',
    'clapping-model': '20261105175644',
    'conversation-reference': '20261105173500',
    'seated-floral-model': '20261105175437',
    'seated-purple-model': '20261105175528',
    'walking-reference': '20261105173528',
    'black-white-dress-model': '20261105175821',
    'yellow-shirt-model': '20261105175905',
    'cattle-reference': '20261105180618',
    'cattle-outline': '20261105181222',
    'cattle-diffuse': '20261105181350',
    'cattle-noise': '20261105181619',
    'cattle-ink-edge': '20261105181806',
    'cattle-final': '20261105182010',
    'swan-final': '20261105182222',
    'graph-animal-composition': '20261105184109',
    'graph-animal-lighting': '20261105184223',
    'graph-animal-outline': '20261105184136',
    'graph-animal-ink-edge': '20261105184153',
    'graph-character-composition': '20261106200708',
    'graph-character-edge': '20261106200731',
    'graph-character-height': '20261106200901',
    'graph-character-reveal': '20261106200918',
}


def prepare_images():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    wanted = {f'Pasted image {stamp}.png' for stamp in CAPTURES.values()}
    sources = {p.name: p for p in SOURCE.rglob('Pasted image 202611*.png') if p.name in wanted}
    metadata = {}
    for name, timestamp in CAPTURES.items():
        with Image.open(sources[f'Pasted image {timestamp}.png']) as image:
            image.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
            preview = image.copy()
            if not name.startswith('graph-'):
                preview.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
            preview.save(OUTPUT / f'{name}-preview.webp', 'WEBP',
                         quality=95 if name.startswith('graph-') else 90, method=6)
            metadata[name] = {
                'src': f'/a-great-big-tree/figures/{name}-preview.webp',
                'fullSrc': f'/a-great-big-tree/figures/{name}.webp',
                'width': image.width, 'height': image.height,
            }
    (ROOT / 'src/data/treeFiguresImages.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared {len(metadata)} images.', flush=True)
    subprocess.run(['node', str(ROOT / 'scripts/prepare-tree-model-collages.mjs')], check=True)


def prepare_video(ffmpeg):
    video = OUTPUT / 'character-reveal.mp4'
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error',
        '-i', r'C:\申请\作品集\好大一棵树\人物出现演示.mp4',
        '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart', str(video),
    ], check=True)
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error', '-ss', '1.5', '-i', str(video),
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-c:v', 'libwebp', '-quality', '90',
        str(OUTPUT / 'character-reveal-poster.webp'),
    ], check=True)
    print(f'Prepared reveal video: {video.stat().st_size:,} bytes.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    prepare_images()
    prepare_video(args.ffmpeg)
