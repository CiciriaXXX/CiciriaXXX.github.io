"""Prepare web copies of the author's tree captures and demonstrations."""
import argparse
import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Administrator\SiaCecil\作品集\好大一棵树\原图片')
VIDEO_SOURCE = Path(r'C:\申请\作品集\好大一棵树')
OUTPUT = ROOT / 'public/a-great-big-tree/tree'
CAPTURES = {
    'painting-reference': '164151',
    'model-silhouette': '164508',
    'model-branches': '164542',
    'model-sculpt': '164600',
    'model-roots': '164713',
    'root-uv-seam': '170132',
    'graph-geometry-roots': '170452',
    'vertex-wind-mask': '171124',
    'hatch-diffuse-only': '185944',
    'hatch-subtraction-lit': '190208',
    'hatch-subtraction-unlit': '190219',
    'hatch-multiply-lit': '190256',
    'hatch-multiply-unlit': '191029',
    'outline-object-space': '211157',
    'outline-clip-space': '211150',
    'graph-composition': '213047',
    'graph-outline': '213145',
    'graph-blocking': '213845',
    'graph-moss': '214055',
    'graph-hatch-blend': '214141',
    'graph-hatch-weight': '214159',
    'graph-lightness': '214240',
    'graph-diffuse': '214309',
    'graph-hatch-uv': '214329',
    'graph-wind': '213219',
}
VIDEOS = {
    'aerial-roots-demo': '气根几何节点.mp4',
    'tonal-controls-demo': '明暗调整.mp4',
}


def prepare_images():
    metadata = {}
    total_full = total_preview = 0
    for name, stamp in CAPTURES.items():
        with Image.open(SOURCE / f'Pasted image 20261103{stamp}.png') as image:
            full_path = OUTPUT / f'{name}.webp'
            image.save(full_path, 'WEBP', lossless=True, method=6)
            preview = image.copy()
            is_graph = name.startswith('graph-')
            if not is_graph:
                preview.thumbnail((960, 960), Image.Resampling.LANCZOS)
            preview_path = OUTPUT / f'{name}-preview.webp'
            preview.save(preview_path, 'WEBP', quality=94 if is_graph else 85, method=6)
            if preview_path.stat().st_size > full_path.stat().st_size:
                shutil.copyfile(full_path, preview_path)
            total_full += full_path.stat().st_size
            total_preview += preview_path.stat().st_size
            metadata[name] = {
                'src': f'/a-great-big-tree/tree/{preview_path.name}',
                'fullSrc': f'/a-great-big-tree/tree/{full_path.name}',
                'width': image.width, 'height': image.height,
            }
            if not is_graph:
                small = image.copy()
                small.thumbnail((480, 480), Image.Resampling.LANCZOS)
                small_path = OUTPUT / f'{name}-small.webp'
                small.save(small_path, 'WEBP', quality=85, method=6)
                metadata[name].update({
                    'srcSet': f'/a-great-big-tree/tree/{small_path.name} {small.width}w, '
                              f'/a-great-big-tree/tree/{preview_path.name} {preview.width}w',
                    'sizes': 'auto, 50vw',
                })
    (ROOT / 'src/data/treeBodyImages.json').write_text(
        json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    print(f'{len(metadata)} images: {total_full:,} full-size bytes; '
          f'{total_preview:,} preview bytes ({1-total_preview/total_full:.1%} smaller).')


def prepare_videos(ffmpeg):
    for name, filename in VIDEOS.items():
        source = VIDEO_SOURCE / filename
        destination = OUTPUT / f'{name}.mp4'
        subprocess.run([
            ffmpeg, '-y', '-loglevel', 'error', '-i', str(source),
            '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
            '-vf', r'scale=min(1600\,iw):-2', '-r', '30',
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
            '-movflags', '+faststart', str(destination),
        ], check=True)
        subprocess.run([
            ffmpeg, '-y', '-loglevel', 'error', '-ss', '2', '-i', str(destination),
            '-frames:v', '1', '-vf', 'scale=960:-2', '-c:v', 'libwebp',
            '-quality', '85', str(OUTPUT / f'{name}-poster.webp'),
        ], check=True)
        print(f'{filename}: {source.stat().st_size:,} -> {destination.stat().st_size:,} bytes.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
    parser.add_argument('--images-only', action='store_true')
    args = parser.parse_args()
    if not args.images_only and not args.ffmpeg:
        parser.error('Pass --ffmpeg with the path to FFmpeg, or use --images-only.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    prepare_images()
    if not args.images_only:
        prepare_videos(args.ffmpeg)
