import json
import re
import shutil
from pathlib import Path

root = Path('C:/Portfolio/my-portfolio')
translations = {
'treeBody.js': [
'Trunk, Branches & Aerial Roots',
'Painting detail · Peng Rongxin',
'The painting describes form through outlines and hatching that follows the branches, with green washes across both light and dark areas.',
'01 / Modeling',
'I completed the blockout, sculpting, retopology, and normal baking in Blender. This was my first relatively complex 3D model.',
'02 / Procedural Aerial Roots',
'I used Blender Geometry Nodes to quickly generate and adjust clusters of aerial roots.',
'**Generating and adjusting root clusters**: Distribute downward curves over a source mesh, randomize their lengths, and taper their tips. Noise bends the curves with increasing displacement toward the tips while keeping their tops fixed. Density, length, radius, and bend parameters control the spacing and shape of each cluster.',
'**Fixing the UV seam**: Using a Curve Circle as the root profile produced uneven UVs. At a resolution of five, four side faces each spanned 0.2 in U, while the remaining face appeared to cover 0–0.8. This seemed to result from the cyclic spline factor: the final segment wrapped from 0.8 back to 0 instead of reaching 1.',
'I replaced the circle with an open, six-point pentagonal profile. Its first and last points share the same position but retain U = 0 and U = 1 respectively. The final face then covers 0.8–1, matching the 0.2 span of the other four faces.',
'Geometry Nodes',
'UV issue · Curve Circle profile',
'Uneven UV spacing at the seam of a Curve Circle profile stretches the hatch texture.',
'**Generating UVs along the root and profile**: Before Curve to Mesh, obtain the spline factors along the root and around its profile. Combine them into 2D coordinates and store them as `UVMap` on the face corner domain.',
'03 / Hatching & Tonal Control',
'**Reference:** [Praun et al. · Real-Time Hatching (2001)](https://hhoppe.com/hatching.pdf) — I used its mapping from diffuse lighting to hatch tones and its tonal art map (TAM) texture requirements for the base effect, then developed my own shadow shaping and color treatment.',
'**Blending hatch tones from diffuse lighting**: Take the dot product of the normal-mapped world normal and the main light direction to obtain diffuse lighting. Map the adjusted tonal value to 0–6, covering six hatch textures from dense to sparse, followed by white. Fractional values blend adjacent levels so stroke density transitions smoothly with the lighting.',
'ASE Nodes',
'Diffuse lighting',
'Hatch blending',
'Each level uses `saturate(1 - abs(hatchFactor - toneIndex))`, giving zero weight to levels more than one step away. Invert the weighted result to form a hatch mask, with darker strokes approaching 1 and unmarked white areas at 0.',
'**Shaping the unlit side**: Selecting hatch tones from diffuse lighting alone made the unlit side too uniform. I combined baked AO with a view-dependent Fresnel term to reinforce recesses and contours. Initially, I subtracted color values directly, but this also darkened light areas and undermined the idea of expressing tone through hatching. Instead, I multiply the hatch mask by `1 + blockingRegion`, deepening existing strokes while leaving zero-mask areas unchanged.',
'Diffuse only · Unlit side',
'Direct color subtraction',
'Mask multiplication · Lit side',
'Mask multiplication · Unlit side',
'These hatch tests use an early texture set.',
'ASE Nodes',
'View-dependent rim term',
'Apply a power and intensity scale to `1 - AO` to emphasize recesses. Calculate the rim term from `1 - saturate(dot(N, V))`, with separate power and intensity controls. Add the two terms and clamp to 0–1 to obtain `blockingRegion`.',
'**Extending the blend weight for ink buildup**: Use the reinforced hatch mask as the `lerp` weight between the base and hatch colors, allowing values up to 1.5. Weights above 1 extrapolate beyond the darker hatch color, approximating the deeper ink produced by overlapping brushstrokes in the painting. Clamp the final RGB to 0–1 with `saturate`.',
'ASE Nodes',
'**Distributing green washes with noise**: Scale object-space positions by a tiling parameter to sample 3D noise, then remap it to 0–1 and invert it to form a wash mask. Use the mask to interpolate between white and green, and apply the result to the final color with Multiply blending, adding green patches to both light and dark areas.',
'ASE Nodes',
'**Adjusting the tonal distribution of hatching**: Before selecting a hatch level, add a tonal offset to the lighting value, multiply by brightness, scale contrast around 0.5, and clamp to 0–1. This changes the area covered by each hatch level, controlling the unmarked highlights, dense shadows, and transitions between them.',
'ASE Nodes',
'04 / Brushstroke Outlines',
'Before · Object-space expansion',
'After · Perspective-compensated expansion',
'The outline tests use the third-party Big Oak Tree FREE model.',
'**Compensating for perspective to keep line widths consistent**: Extruding vertices along object-space normals made nearby outlines much thicker than distant ones, which did not suit the painting. I instead offset clip-space XY along the projected normal and compensate for perspective, keeping the outline width more consistent in normalized device coordinates (NDC) after perspective division.',
'**Varying line width with noise**: Sample 3D noise using world-space positions, remap it to 0.2–1.8, and multiply it into the extrusion amount. The outline varies in thickness along the surface, resembling the uneven marks of a brush.',
'ASE Nodes',
'Multiply the XY offset by clip-space W to compensate for perspective division, and correct X for the screen aspect ratio. The `TreeOutline` pass uses front-face culling and depth testing.',
'05 / Vertex-Color Wind Animation',
'**Controlling trunk, twig, and root motion separately**: Paint the red vertex-color channel to assign local motion weights. Separate material parameters keep the trunk still while setting the speed and response strength of twigs and aerial roots independently.',
'**Driving staggered motion with a sine wave**: A time-varying sine wave drives vertex displacement. Speed controls its frequency, while vertex-color weights and material response strength control amplitude. Object position offsets the phase; vertex weights and a phase-lag parameter further stagger the motion across different parts.',
'**Keeping the surface and outline in sync**: Convert the motion signal into displacement along the world-space wind direction, then transform it to object space before applying it to vertices. The surface and outline use the same displacement so they remain aligned as the tree sways.',
'ASE Nodes',
],
'treeWater.js': [
'Rendering · Water Surface',
'Painting detail · Peng Rongxin',
'The painting features deep blue water, reflections bleeding into soft vertical streaks, and scattered patches of pale foam.',
'01 / Reflections & Ink Bleeding',
'01 · Planar reflection without the sky',
'02 · UV distortion from detail normals',
'03 · Directional color bleeding',
'Discarded approach · Outlines in reflections',
'**Capturing planar reflections without the sky**: Mirror the camera across the water plane and clip geometry below it. Exclude the sky from the reflection to preserve the deep blue of the lake.',
'**Distorting reflections with detail normals**: Sample a normal map using world-space XZ coordinates and a time offset, then add its decoded XY components to screen UVs. Divide the offset strength by clip-space W so nearby reflections show small ripples while distant distortion fades.',
'**Smearing reflections into vertical streaks**: Offset reflection samples vertically and add horizontal jitter. Combine 12 samples with lower weights farther from the original UV, then blend with the original reflection to create soft streaks of varying width.',
'**Excluding tree outlines from reflections**: The extruded tree outlines formed broad brown shapes in the mirrored view. The reflection camera skips the outline pass to prevent these shapes from obscuring the reflected branches.',
'Code & Nodes',
'02 / Depth, Refraction & Fresnel',
'Depth color and refracted scene',
'With smeared reflections',
'**Distorting the underwater scene to approximate refraction**: Reuse the detail normal’s XY components, multiply by a separate underwater distortion strength, and offset screen UVs before sampling the opaque scene color. This controls underwater distortion independently of the ripples in the reflection.',
'**Blending water color and reflection by viewing angle**: Calculate a Fresnel weight from the dot product of a fixed world-up vector and the view direction, with power, scale, and bias controls. Use it to blend deep blue with the reflection, emphasizing water color when looking down and reflections at grazing angles.',
'**Revealing underwater terrain according to depth**: Reconstruct the underwater position from scene depth, take its world-space height difference from the surface, and calculate `saturate(exp(-depth / depthRange))`. This weight decreases with depth, revealing more refracted scene color in shallow areas while retaining water color and reflections farther down.',
'ASE Nodes',
'03 / Shoreline Foam',
'Before · Camera depth includes grass',
'After · Separate foam depth',
'**Removing grass from the foam depth input**: Grass in the camera depth texture caused foam around individual blades. Render a separate depth texture that excludes grass so the foam follows the shoreline.',
'**Creating broken, moving shoreline foam**: Reconstruct the bank height from the filtered depth and compare it with the water height. Use the height difference to generate a sine band, then break it into moving patches with animated noise.',
'Code & Nodes',
'04 / Water Motion',
'**Driving the surface and floating objects with a Gerstner wave**: A single wave displaces the water vertices, changing the contact area between water and grass along the bank and the waterline seen when entering the lake. Swans and other floating objects sample the same wave to follow the surface height and tilt.',
'**Separating wave displacement from surface shading**: I do not use the wave-driven displacement and normals to drive reflections, refraction distortion, or Fresnel. With a low-resolution water mesh, letting the wave affect surface shading made the repeating pattern too obvious.',
'**Reference:** [Jasper Flick / Catlike Coding · Waves](https://catlikecoding.com/unity/tutorials/flow/waves/) — Gerstner wave code; this project scales steepness by 0.01. [Code license: MIT-0](https://catlikecoding.com/unity/tutorials/license/).',
'ASE Nodes',
],
'treeFog.js': [
'Code',
'Fog',
'Players need to be able to walk into the fog. I use a box to define its volume and raymarch through it, accumulating density so visibility changes with the distance traveled through the fog.',
'In-game volumetric fog showing flowing dissolution, height fading, and tinted edges.',
'**Finding the ray interval inside the fog**: Transform the view ray to object space and intersect it with the box. Sampling starts at the entry point when the camera is outside, or at the camera when it is inside. Stop at the nearer of the exit point and the opaque scene surface to avoid drawing fog over foreground objects. Rendering the box’s back faces keeps raymarching active when the camera enters the volume.',
'**Varying dissolution across the volume with moving noise**: Scroll the 3D noise coordinates with a world-space velocity and scale the vertical frequency separately to shape the fog. Smoothly interpolate between two dissolve thresholds along local Z, then use `smoothstep` to turn noise into a density mask, making one side more broken up while keeping the other more solid.',
'**Fading toward the top to soften the wall-like boundary**: Calculate each sample’s distance below the box’s top face in world units, then use `smoothstep` to reduce density near the top. This removes the straight upper edge when looking toward the tree from the other side of the fog.',
'**Tinting dissolve edges**: Derive an edge weight from the difference between the noise value and the dissolve threshold. Weight its contribution by the transmittance through the fog in front and the opacity of the current sample segment, reducing the influence of edges hidden behind dense fog. Use the accumulated weight to blend the fog color with a blue-green edge tint, adding color variation closer to the painting.',
'**Accumulating optical depth and terminating early**: Multiply each sample’s density by the step length, accumulate optical depth, and convert it to opacity with `1 - exp(-OpticalDepth)`. This makes step count primarily a sampling-quality control. The current material uses 24 steps; stop early when transmittance falls below 1% to skip samples with little remaining contribution.',
],
'treeBreakdown.js': ['Design', 'Rendering & Modeling', 'Tree', 'Leaves', 'Water', 'Water Surface', 'Underwater & Waterline', 'Grass', 'Characters', 'Animals', 'Peonies'],
}

backup = root / 'output/tree-body-review/chinese-final'
backup.mkdir(parents=True, exist_ok=True)
rx = re.compile(r'"[^"\n]*"|\'[^\'\n]*\'')
for name, values in translations.items():
    path = root / 'src/data' / name
    shutil.copyfile(path, backup / name)
    text = path.read_text(encoding='utf-8')
    matches = [m for m in rx.finditer(text) if re.search(r'[\u4e00-\u9fff]', m.group())]
    assert len(matches) == len(values), (name, len(matches), len(values))
    for match, value in reversed(list(zip(matches, values))):
        text = text[:match.start()] + json.dumps(value, ensure_ascii=False) + text[match.end():]
    text = text.replace("lang: 'zh-CN'", "lang: 'en'")
    path.write_text(text, encoding='utf-8')

notes = root / 'src/data/treeWaterNotes.json'
shutil.copyfile(notes, backup / notes.name)
data = json.loads(notes.read_text(encoding='utf-8'))
values = [
'**Outline occlusion in the mirrored view**: The outline expands the tree in screen space while retaining the original mesh depth. The expanded pixels can cover branches and trunks in the mirrored view.',
'TreeOutlineRendererFeature.cs · Excluding reflection cameras',
'PlanarReflection.cs · Camera setup (excerpt)',
'**Correcting mirrored culling and preventing recursion**: Invert culling while rendering the reflection, then restore the previous state in `finally`. A rendering guard prevents the reflection camera from triggering another capture.',
'ASE · World-space detail normals and scrolling speed',
'ASE · Distance-based reflection distortion',
'ASE · Reflection UV offset',
'**Weighting samples and controlling bleed strength**: Combine 12 texture samples, reducing their weight with distance from the original UV. `_PigmentBleed` controls color bleeding, while `_SmearStrength` controls the blend between the filtered and original reflections.',
'PlanarReflection.cs · Rendering, filtering, and binding (excerpt)',
'WatercolorReflection.shader · Directional accumulation (loop excerpt)',
'**Controlling sample offsets**: `VerticalSpan` sets streak length and direction; `HorizontalSpan` sets lateral jitter, both in texels. Ignore samples outside the texture bounds to avoid stretching edge colors.',
'ASE · Distorted scene-color sampling',
'ASE · Separate depth inputs for water color and shoreline foam',
'ASE · Exponential shallow-water mask',
'ASE · Adjustable Fresnel with a fixed up vector',
'ASE · Final water-color composition',
'Set the render queue cutoff to 2449 to exclude grass in queue 2450.',
'FoamDepthRendererFeature.cs · Render queue filtering (excerpt)',
'ASE · Foam range, frequency, motion, and breakup',
'ASE · Vertex displacement and wave-normal calculation',
'ASE Custom Expression · A single directional Gerstner wave',
]
targets = [(b,k) for blocks in data.values() for b in blocks for k,v in b.items() if isinstance(v,str) and re.search(r'[\u4e00-\u9fff]',v)]
assert len(targets)==len(values), (len(targets),len(values))
for (b,k),v in zip(targets,values): b[k]=v
notes.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('Translated tree, water, fog, navigation, and water captions.')
