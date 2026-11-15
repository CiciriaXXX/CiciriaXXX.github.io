"""Prepare the author's foliage references, node captures and cluster demonstration."""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil')
OUTPUT = ROOT / 'public/a-great-big-tree/leaves'
CAPTURES = {
    'painting-reference': '20261107012616',
    'graph-leaf-shape': '20261107013753',
    'graph-leaf-color': '20261107015522',
}


def prepare_images():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    metadata = {}
    sources = {name: SOURCE / f'Pasted image {timestamp}.png' for name, timestamp in CAPTURES.items()}
    sources['color-overlay'] = ROOT / 'scripts/assets/tree-leaves/color-overlay.png'
    for name, source in sources.items():
        with Image.open(source) as image:
            image.save(OUTPUT / f'{name}.webp', 'WEBP', lossless=True, method=6)
            preview = image.copy()
            if not name.startswith('graph-'):
                preview.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
            preview.save(OUTPUT / f'{name}-preview.webp', 'WEBP',
                         quality=95 if name.startswith('graph-') else 90, method=6)
            metadata[name] = {
                'src': f'/a-great-big-tree/leaves/{name}-preview.webp',
                'fullSrc': f'/a-great-big-tree/leaves/{name}.webp',
                'width': image.width, 'height': image.height,
            }
    (ROOT / 'src/data/treeLeavesImages.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'Prepared {len(metadata)} foliage images.', flush=True)


def prepare_video(ffmpeg):
    video = OUTPUT / 'leaf-cluster.mp4'
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error',
        '-i', r'C:\申请\作品集\好大一棵树\树叶prefab.mp4',
        '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart', str(video),
    ], check=True)
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error', '-ss', '2', '-i', str(video),
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-c:v', 'libwebp', '-quality', '90',
        str(OUTPUT / 'leaf-cluster-poster.webp'),
    ], check=True)
    print(f'Prepared leaf-cluster video: {video.stat().st_size:,} bytes.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    prepare_images()
    prepare_video(args.ffmpeg)
