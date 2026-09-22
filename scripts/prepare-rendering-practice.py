"""Import the portfolio note and prepare web media without changing source files.

Run with Python + Pillow and --vault / --videos / --ffmpeg paths.
"""
import argparse
import concurrent.futures
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--vault', type=Path, required=True)
parser.add_argument('--videos', type=Path, required=True)
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--cover-only', action='store_true', help='Refresh the contact sheet from existing videos.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'public/rendering-practice'
out.mkdir(parents=True, exist_ok=True)
note = next(args.vault.rglob('渲染练习-作品集网站内容.md'))
source = note.read_text(encoding='utf-8')
names = ['geometry', 'scan', 'matcap-beetle', 'vine', 'stencil', 'post-processing', 'dissolve', 'jade', 'diamond', 'glass', 'galaxy', 'fog', 'foliage']
videos = [None, '人物扫光', '甲虫', '顶点动画', '魔法相框', '后处理', '溶解', '玉石', '钻石', '玻璃', '星云', '线性雾', '灌木']
kaltura = 'https://cdnapisec.kaltura.com/p/391241/embedPlaykitJs/uiconf_id/44855082?iframeembed=true&entry_id=1_u4u8zzs3&config%5Bprovider%5D=%7B%22widgetId%22%3A%221_0uwsc7qz%22%7D&config%5Bplayback%5D=%7B%22startTime%22%3A0%7D'

def request_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as response:
        return json.load(response)

def create_cover():
    subprocess.run([sys.executable, str(root / 'scripts/build-rendering-cover.py')], check=True)

if args.cover_only:
    create_cover()
    raise SystemExit(0)

def citation(url, topic):
    url = url.split('?spm_id')[0].split('?vd_source')[0].rstrip('/')
    try:
        if 'bilibili.com' in url:
            bvid = re.search(r'BV\w+', url)[0]
            data = request_json('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid)['data']
            return {'url': url, 'label': f"{data['title']} · {data['owner']['name']} · Bilibili"}
        if 'youtube.com' in url:
            data = request_json('https://www.youtube.com/oembed?format=json&url=' + url)
            return {'url': url, 'label': f"{data['title']} · {data['author_name']} · YouTube"}
        if 'sketchfab.com' in url:
            data = request_json('https://sketchfab.com/oembed?url=' + url)
            return {'url': url, 'label': f"{data['title']} · {data['author_name']} · Sketchfab"}
    except Exception as error:
        print('Citation metadata unavailable:', url, str(error), flush=True)
    fixed = {
        '574690984': '后处理参考文章 · 知乎',
        '574196980': '玉石材质参考文章 · 知乎',
        '1937894026360624395': '双 Pass 钻石材质参考文章 · 知乎',
        '666556891': '距离与高度雾参考文章 · 知乎',
        'fancy_picture_frame_02': 'Fancy Picture Frame 02 · Poly Haven',
        'ftpgrass-dirt': 'Free Texture Pack: Grass & Dirt · JulioVII · itch.io',
        'allsky-free': 'AllSky Free · Distant Lantern · itch.io',
        'perspective-correct-matcaps-unity': 'Perspective Correct Matcaps in Unity · orels · orels tips',
    }
    label = next((label for key, label in fixed.items() if key in url), None)
    if not label:
        platform = 'Bilibili' if 'bilibili' in url else 'YouTube' if 'youtube' in url else 'Sketchfab'
        label = f'{topic} · 参考资料 · {platform}'
    return {'url': url, 'label': label}

sections = []
jobs = []
parts = re.split(r'^# (.+)$', source, flags=re.M)
assert len(parts[1::2]) == len(names)
for i, (title, body) in enumerate(zip(parts[1::2], parts[2::2])):
    slug = names[i]
    section = {'id': slug, 'title': title.replace('藤曼', '藤蔓'), 'blocks': []}
    if videos[i]:
        section.update(video=f'/rendering-practice/{slug}.mp4', poster=f'/rendering-practice/{slug}-poster.webp')
    else:
        section['embed'] = kaltura
    # Split Obsidian image embeds even when attached directly to a paragraph.
    body = re.sub(r'(!\[\[.*?\]\])', r'\n\1\n', body)
    for line in body.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith('![['):
            filename = line[3:-2]
            matches = list(args.vault.rglob(filename))
            assert matches, filename
            image = Image.open(matches[0]).convert('RGB')
            target = f'{slug}-{len(section["blocks"]):02}.webp'
            image.save(out / target, quality=90)
            section['blocks'].append({'type': 'image', 'src': '/rendering-practice/' + target, 'alt': title + '：技术实现配图', 'width': image.width, 'height': image.height})
        elif line.startswith('## '):
            section['blocks'].append({'type': 'heading', 'text': line[3:].rstrip('：:')})
        elif line.startswith('https://'):
            block = {'type': 'reference'}
            section['blocks'].append(block)
            jobs.append((block, line, title))
        else:
            line = line.replace('glman (https://web.engr.oregonstate.edu/~mjb/glman/)', '[glman · Mike Bailey · Oregon State University](https://web.engr.oregonstate.edu/~mjb/glman/)')
            section['blocks'].append({'type': 'paragraph', 'text': line})
    sections.append(section)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(lambda job: citation(job[1], job[2]), jobs))
for (block, _, _), result in zip(jobs, results):
    block.update(result)
(root / 'src/data/renderingPractice.json').write_text(json.dumps(sections, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
subprocess.run([sys.executable, str(root / 'scripts/translate-rendering-practice.py')], check=True)

def ffmpeg(*options):
    subprocess.run([args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', *map(str, options)], check=True)

for slug, video in zip(names, videos):
    if not video:
        continue
    src = args.videos / (video + '.mp4')
    dest = out / (slug + '.mp4')
    if not dest.exists():
        ffmpeg('-i', src, '-map', '0:v:0', '-map', '0:a?', '-vf', 'scale=min(1920\\,iw):-2,fps=30', '-c:v', 'libx264', '-threads', '4', '-preset', 'fast', '-crf', '25', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', dest)
    ffmpeg('-ss', '2', '-i', dest, '-frames:v', '1', '-vf', 'scale=1280:-2', out / (slug + '-poster.webp'))
    print(slug, src.stat().st_size, '->', dest.stat().st_size, flush=True)

create_cover()
print('Imported', len(sections), 'sections; web assets ready.', flush=True)
