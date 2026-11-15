"""Prepare the fog demonstration and HLSL excerpts for the portfolio."""
import argparse
import json
import re
import subprocess
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHADER = Path('C:/Projects/PengArt/Assets/Enviroment/Fog/Shaders/Chapter1VolumeFog.shader')
SOURCE = Path('C:/申请/作品集/好大一棵树/雾效实机.mp4')
OUTPUT = ROOT / 'public/a-great-big-tree/fog'


def prepare_code():
    source = SHADER.read_text(encoding='utf-8')
    # Match the PascalCase local-variable style of the water HLSL excerpts.
    names = '''originWS directionWS opaqueDistance originOS directionOS inverseDirection
        nearFace farFace enter leave positionWS uv rawDepth opaqueWS interval count
        stepLength topMetresPerUnit frequency opticalDepth edgeContribution remaining
        alongZ dissolve noise threshold shape belowTop heightFade pointDensity edge
        opacity edgeWeight'''.split()
    renamed = {name: name[0].upper() + name[1:] for name in names}
    renamed.update({'uv': 'UV', 'a': 'PlaneA', 'b': 'PlaneB', 'p': 'SamplePositionWS',
                    'local': 'SamplePositionOS', 'i': 'SampleIndex', 'input': 'Input'})

    def excerpt(start, end):
        start_index = source.index(start)
        line_start = source.rfind('\n', 0, start_index) + 1
        code = textwrap.dedent(source[line_start:source.index(end)].rstrip())
        lines = []
        for line in code.splitlines():
            statement, marker, comment = line.partition('//')
            for old, new in renamed.items():
                statement = re.sub(r'(?<![\w.])' + old + r'\b', new, statement)
            lines.append(statement + marker + comment)
        return '\n'.join(lines)

    def block(caption, code):
        return {'type': 'code', 'caption': caption, 'language': 'HLSL', 'code': code}

    blocks = {
        'interval': [
            block('Ray–box intersection', excerpt('float2 IntersectBox(', '            float PathRemaining(')),
            block('Clipping the ray interval to scene depth (excerpt)', excerpt('float2 uv = GetNormalizedScreenSpaceUV', '                int count =')),
        ],
        'dissolve': [block('Scrolling noise and directional dissolution (excerpt)',
            excerpt('float3 frequency =', '                float opticalDepth =') + '\n\n'
            + excerpt('float3 local =', '                    float belowTop ='))],
        'height': [block('Fading density near the top (excerpt)',
            excerpt('float topMetresPerUnit =', '                float3 frequency =') + '\n\n'
            + excerpt('float belowTop =', '                    float pointDensity ='))],
        'edge': [block('Edge weighting and color composition (excerpt)',
            excerpt('float edge =', '                    opticalDepth +=') + '\n\n'
            + excerpt('float edgeWeight =', '            }\n            ENDHLSL'))],
        'accumulation': [block('Step length, optical depth, and early termination (excerpt)',
            excerpt('int count =', '                float topMetresPerUnit =') + '\n\n'
            + excerpt('float pointDensity =', '                    float edge =') + '\n'
            + excerpt('opticalDepth +=', '                }\n                float opacity =') + '\n\n'
            + excerpt('float opacity =', '                float edgeWeight ='))],
    }
    (ROOT / 'src/data/treeFogCode.json').write_text(
        json.dumps(blocks, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def prepare_video(ffmpeg):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / 'fog-demo.mp4'
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error', '-i', str(SOURCE),
        '-map', '0:v:0', '-map', '0:a?', '-map_metadata', '-1',
        '-vf', r'scale=min(1600\,iw):-2', '-r', '30',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
        '-movflags', '+faststart', str(destination),
    ], check=True)
    subprocess.run([
        ffmpeg, '-y', '-loglevel', 'error', '-ss', '2', '-i', str(destination),
        '-frames:v', '1', '-vf', 'scale=960:-2', '-c:v', 'libwebp',
        '-quality', '85', str(OUTPUT / 'fog-demo-poster.webp'),
    ], check=True)
    print(f'Fog demonstration: {SOURCE.stat().st_size:,} -> {destination.stat().st_size:,} bytes.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg')
    args = parser.parse_args()
    prepare_code()
    if args.ffmpeg:
        prepare_video(args.ffmpeg)
