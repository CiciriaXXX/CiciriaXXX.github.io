"""Prepare the author's peony images and demonstrations without changing originals."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil')
VIDEO_SOURCE = Path(r'C:\申请\作品集\好大一棵树')
OUTPUT = ROOT / 'public/a-great-big-tree/peonies'
CAPTURES = {
    'painting-reference': '005640',
    'graph-petals': '001630',
    'graph-single-stamen': '001755',
    'graph-stamens': '001835',
    'graph-leaves': '003622',
    'graph-stem': '003848',
    'final-render': '010301',
}
VIDEOS = {
    'flower-demo': '牡丹花朵几何节点效果演示.mp4',
    'plant-demo': '牡丹花整体几何节点效果演示.mp4',
}


def prepare_images():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    metadata = {}
    for name, timestamp in CAPTURES.items():
        with Image.open(SOURCE / f'Pasted image 20261105{timestamp}.png') as image:
            image.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
            preview = image.copy()
            if not name.startswith('graph-'):
                preview.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
            preview.save(OUTPUT / f'{name}-preview.webp', 'WEBP',
                         quality=95 if name.startswith('graph-') else 90, method=6)
            metadata[name] = {
                'src': f'/a-great-big-tree/peonies/{name}-preview.webp',
                'fullSrc': f'/a-great-big-tree/peonies/{name}.webp',
                'width': image.width, 'height': image.height,
            }
    (ROOT / 'src/data/treePeoniesImages.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared {len(metadata)} images.', flush=True)


def prepare_videos(ffmpeg):
    for name, filename in VIDEOS.items():
        destination = OUTPUT / f'{name}.mp4'
        subprocess.run([
            ffmpeg, '-y', '-loglevel', 'error', '-i', str(VIDEO_SOURCE / filename),
            '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
            '-vf', r'scale=min(1600\,iw):-2', '-r', '30',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '21',
            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
            '-movflags', '+faststart', str(destination),
        ], check=True)
        subprocess.run([
            ffmpeg, '-y', '-loglevel', 'error', '-ss', '16' if name == 'plant-demo' else '1', '-i', str(destination),
            '-frames:v', '1', '-vf', 'scale=1280:-2',
            '-c:v', 'libwebp', '-quality', '90', str(OUTPUT / f'{name}-poster.webp'),
        ], check=True)
        print(f'Prepared {name}: {destination.stat().st_size:,} bytes.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    prepare_images()
    prepare_videos(args.ffmpeg)
