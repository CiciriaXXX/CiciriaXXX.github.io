"""Prepare grass reference, ASE captures and the terrain-painting demonstration."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil\作品集\好大一棵树\原图片')
OUTPUT = ROOT / 'public/a-great-big-tree/grass'
CAPTURES = {
    'painting-reference': '20261106232412',
    'grass-prefab': '20261107000531',
    'graph-color-shadow': '20261107000556',
    'graph-terrain-color': '20261107000730',
    'graph-wind': '20261107000749',
}


def prepare_images():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    metadata = {}
    for name, timestamp in CAPTURES.items():
        with Image.open(SOURCE / f'Pasted image {timestamp}.png') as image:
            image.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
            preview = image.copy()
            if not name.startswith('graph-'):
                preview.thumbnail((1600, 1280), Image.Resampling.LANCZOS)
            preview.save(OUTPUT / f'{name}-preview.webp', 'WEBP',
                         quality=95 if name.startswith('graph-') else 90, method=6)
            metadata[name] = {
                'src': f'/a-great-big-tree/grass/{name}-preview.webp',
                'fullSrc': f'/a-great-big-tree/grass/{name}.webp',
                'width': image.width, 'height': image.height,
            }
    (ROOT / 'src/data/treeGrassImages.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared {len(metadata)} grass images.', flush=True)


def prepare_video(ffmpeg):
    video = OUTPUT / 'terrain-painting.mp4'
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error',
        '-i', r'C:\申请\作品集\好大一棵树\草上色演示.mp4',
        '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
        '-vf', r'scale=min(1600\,iw):-2', '-r', '30',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '21',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart', str(video),
    ], check=True)
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error', '-ss', '12', '-i', str(video),
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-c:v', 'libwebp', '-quality', '90',
        str(OUTPUT / 'terrain-painting-poster.webp'),
    ], check=True)
    print(f'Prepared terrain-painting video: {video.stat().st_size:,} bytes.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    prepare_images()
    prepare_video(args.ffmpeg)
