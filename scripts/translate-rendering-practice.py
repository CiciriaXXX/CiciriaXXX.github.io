"""Apply the reviewed English copy to the imported study structure."""
import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'src/data/renderingPractice.json'
sections = json.loads(path.read_text(encoding='utf-8'))
copy = {
'geometry': ('Geometry Shader: 3D Crosses', [
"One of my OSU CS457 assignments (Project 7A), written in GLSL (`#version 330 compatibility`) and tested with Professor Mike Bailey's [glman](https://web.engr.oregonstate.edu/~mjb/glman/) for interactive parameter adjustment.",
"**Sampling the triangle surface**: The vertex shader passes object-space positions and normals to the geometry shader, which processes one triangle at a time. Sample points are generated with `P = V0 + s * (V1 - V0) + t * (V2 - V0)`, where `s ≥ 0, t ≥ 0, s + t ≤ 1`. The subdivision level is controlled by `2^uLevel`.",
"**Quantizing positions to a grid**: Each XYZ component is snapped using `q(x) = float(int(x * uQuantize)) / uQuantize`. The grid spacing is `1 / uQuantize`, so larger values produce finer quantization. The integer conversion truncates toward zero.",
"**Building 3D crosses from line segments**: Two endpoints are emitted along each of the X, Y, and Z axes around every quantized point. `EmitVertex()` and `EndPrimitive()` produce three independent segments, each of length `2 * uSize`. The endpoints are transformed by the model-view-projection matrix, replacing the triangle surface with a field of spatial crosses.",
"**Preserving the model's lighting and form**: Triangle vertex normals are interpolated with the same s and t values and transformed into view space. Light and view directions are calculated at the cross center. Ambient light, Lambert diffuse shading, and Phong highlights let the line segments retain the original model's sense of volume.",
"**Coloring by depth (ChromaDepth)**: The view-space depth of each cross center is mapped between near and far limits onto a red–green–blue rainbow. This replaces the base color before lighting is applied. glman allows switching between regular and depth-based coloring."
]),
'scan': ('Holographic Character Scan', [
"**Fresnel rim lighting**: Using a unit normal N and a camera-facing view direction V in the same coordinate space, calculate `rim = pow(1 - saturate(dot(N, V)), power)`, then multiply by color and intensity. Front-facing surfaces remain darker while the silhouette glows; increasing power narrows the rim.",
"**Scrolling the scan texture**: Sample the scan texture with `uv = (worldPosition - objectWorldPosition).xy * tiling + time * speed` to animate the pattern.",
"**Depth prepass**: First record the nearest surface depth with `ColorMask 0 / ZWrite On`, then add the glow with `Blend SrcAlpha One`. The color pass uses depth testing to reject self-occluded surfaces, such as the chest behind an arm, preventing overlapping glow in those areas.",
"Character model generated with TripoAI."
]),
'matcap-beetle': ('MatCap Beetle Material', [
"**MatCap sampling**: Transform the normal into view space and map its direction to a 2D texture with `uv = normalVS.xy * 0.5 + 0.5`. Baked shading and highlights respond to surface orientation, creating the appearance of a beetle shell.",
"**Normal mapping**: Transform tangent-space normals into view space before sampling the MatCap, so reflections respond to the shell's surface detail.",
"**Layering two MatCaps**: Adjust the strength of each MatCap, add them together, and multiply by the base-color texture. This separates control over the main shading, additional reflections, and shell color.",
"**View-dependent color shifts**: Use the Fresnel value to sample a color gradient and multiply it into the material, approximating an iridescent shell. This is a view-driven color effect; it does not calculate optical path differences for thin-film interference."
]),
'vine': ('Vertex Animation: Growing Vines', [
"**UV-driven growth**: Arrange UV.y continuously from the root to the tip. Its difference from the growth progress determines when each part becomes visible.",
"**Tapering the growing tip**: Feed the difference between UV.y and progress into `smoothstep` to produce a smooth weight. Use it to move vertices inward along their normals, tapering the tip. A separate normal offset controls the overall vine thickness.",
"**Clipping ungrown sections**: Reuse the UV gradient and progress value in the fragment stage to discard the ungrown region, keeping visibility synchronized with the vertex contraction."
]),
'stencil': ('Stencil Buffer: A World Inside a Frame', [
"**Writing the stencil mask**: Render the window inside the frame first, using `Stencil Replace` to mark the screen pixels that may display the inner scene.",
"**Revealing the scene through the mask**: Render the inner scene and its background only where `Stencil Comp Equal` matches the marker, creating the illusion of looking through the frame into another space.",
"**Controlling render order**: Set the render queues so the window writes to the stencil buffer before the inner scene reads it. This ensures the mask exists when it is needed."
]),
'post-processing': ('Post-processing Studies', [
"**Full-screen post-processing**: In the Built-in Render Pipeline, retrieve the camera color texture through `OnRenderImage` and run a full-screen shader with `Graphics.Blit`, sampling the original image to produce the processed result.",
"**Hue adjustment (HSV)**: Convert RGB to HSV, offset H and wrap it into the 0–1 range, then convert back to RGB to shift the image's overall hue.",
"**Brightness, saturation, and contrast**: Multiply the color by a factor for brightness; use `lerp(grayscale, originalColor, saturation)` to control saturation; scale the difference from mid-gray to adjust contrast.",
"**Vignette**: Measure the distance from the screen UV to the center, create a smooth edge mask, and use it to darken the corners.",
"**Cracked-screen distortion**: Offset screen UVs with the XY components of a crack normal map, resample the original image, and overlay a crack mask and bright lines to simulate broken glass. I added aspect-ratio correction and scaling around the UV center to keep the cracks proportionate and centered across different screen shapes."
]),
'dissolve': ('Directional Dissolve', [
"**Height-driven direction**: Calculate `h = 1 - (y - minHeight) / (maxHeight - minHeight)` from object-space height, assigning 0 to the top and 1 to the bottom. Lower values disappear first, making the dissolve progress downward.",
"**Noise-shaped boundaries**: Sample noise with view-space position XY, calculate `n = 1 - Noise.r`, then `field = h + (n - 0.5) * spread`. Noise changes the disappearance order within each height band: bright areas in the source texture dissolve first, while darker areas remain longer. The spread parameter controls the boundary variation and the vertical range of fragments.",
"**Moving the threshold and clipping**: Map progress to a threshold, calculate `d = field - threshold`, and apply `clip(d)`. Values below 0 disappear; values at or above 0 remain. The threshold range covers the noise-perturbed field and leaves room for the glowing edge, keeping the object fully visible at progress 0 and fully dissolved at 1.",
"**Extracting and coloring the edge**: Reuse d to calculate `edge = 1 - smoothstep(0, 1, saturate(d / width))`, creating a fading mask in the surviving region `0 ≤ d < width`. Add `edge * edgeColor * emissionIntensity` to the base color so the glow follows the clipped boundary and fades inward. The color intensity is smooth, while surface visibility still uses hard clipping."
]),
'jade': ('Jade Material', [
"**Approximating backlit transmission**: Perturb the direction toward the light L with normal N using `L' = normalize(L + N * distortion)`, then calculate `pow(saturate(dot(V, -L')), power)`. This brightens regions viewed against the light to suggest translucent jade. N, L, and V are all in world space, with V pointing toward the camera.",
"**Controlling transmission with thickness**: Multiply the backlighting term by `1 - ThicknessMap.r`, producing stronger transmission in darker areas of the thickness map and weaker transmission in brighter areas.",
"**Base lighting**: Combine Lambert diffuse shading from `max(dot(N, L), 0)`, an approximation of overhead sky lighting from `N.y * 0.5 + 0.5`, and a constant fill color to control the material's overall values.",
"**Environment reflections**: Sample an HDR cubemap with `reflect(-V, N)` and rotate the sampling direction around the vertical axis to adjust the reflected environment. Apply a Fresnel weight to strengthen reflections at grazing angles."
]),
'diamond': ('Two-pass Diamond Material', [
"**Rendering back and front faces separately**: The first pass culls front faces and draws back faces; the second culls back faces and draws front faces. Layering the sampled environment patterns gives the diamond's facets a sense of depth.",
"**Approximating fire and internal reflections**: Back faces sample a cubemap made from dispersion photographs to create colored highlights. A separate environment cubemap is sampled with `reflect(-V, N)` to suggest internal reflections. The colors come from prepared textures, without spectral dispersion calculations or traced refraction.",
"**Adding front-face highlights**: Combine environment reflections and Fresnel rim lighting on the front faces, then additively blend them over the back-face result to emphasize bright facets."
]),
'glass': ('MatCap Glass Material', [
"**Correcting MatCap coordinates**: Following Ben Golus's approach, construct sampling coordinates from the cross product of the view-space view direction and normal. Reflections respond to both surface orientation and viewing direction, reducing banding where the cup's walls have similar normals. A normal map adds surface detail.",
"**Estimating apparent thickness**: Smoothly remap `1 - dot(N, V)`, add a thickness texture sampled by height, and clamp to 0–1. The first term emphasizes side edges; the second independently controls the apparent thickness of areas such as the base.",
"**Distorting the interior texture**: Use the approximate thickness to offset UVs, sample a prepared interior pattern, and blend it with the glass color to suggest refractive distortion. The sampled content is a texture, not the live scene background.",
"**Controlling opacity**: Use the larger of the reflection's R channel and the thickness weight as alpha. This makes reflections, side edges, and the base more visible while keeping the remaining surface more transparent."
]),
'galaxy': ('Galaxy Energy Material', [
"**Projecting the nebula pattern**: Transform the surface position and object center into view space, then use the XY components of their difference to sample a nebula texture. Perturb the UVs with the view-space normal XY to suggest an interior pattern that shifts with the viewing angle.",
"**Animating the flow texture**: Construct UVs from world-space position XY relative to the object center, adding a remapped `dot(N, V)` term and a time offset. Multiply the sampled flow texture into the nebula color and add a separate flowing emission layer.",
"**Fresnel rim glow**: Raise `1 - dot(N, V)` to a power, adjust its intensity, multiply by the rim color, and add it to the nebula result to strengthen the silhouette.",
"**Emphasizing stars**: Raise each RGB component of the nebula color to the fourth power to suppress dark areas and emphasize bright points. Multiply by the flow texture and an intensity factor, then add the result to create moving starlight."
]),
'fog': ('Distance and Height Fog', [
"**Distance-based fog**: From the surface-to-camera distance dist, calculate `distanceMask = saturate((dist - start) / (end - start))`. Fog increases gradually from the start distance to its maximum at the end distance.",
"**Height-based restriction**: Calculate `heightMask = saturate((top - y) / (top - bottom))` from world height y, approaching 1 at lower elevations and 0 higher up. Multiply by the distance mask to concentrate fog in distant lowlands.",
"**Sun-dependent fog color**: Take the dot product of the camera-to-surface direction and the sun direction, remap it to 0–1, and raise it to a power. Use this as the blend weight between the regular fog color and the sun-glow color.",
"**Blending terrain into fog**: Use `fog = distanceMask * heightMask * intensity` as the weight in `lerp(litTerrainColor, fogColor, fog)`, gradually blending distant lowlands into the fog color.",
"**Joining sky and terrain**: Create a gradient near the horizon from the vertical component of the sky direction. Blend the sky toward a fog color similar to the terrain's to soften the distant boundary."
]),
'foliage': ('Billboard Stylized Foliage', [
"**Expanding leaves from UVs**: In URP / ASE, construct a view-space XY direction from `uv * 2 - 1`, transform it into object space, normalize it, and add it to the original vertex position. This expands leaf clusters to face the camera.",
"**Controlling inflation and expansion**: Calculate `P' = P + LerpAlpha * (normalOS * Inflate + billboardOffset)` to control outward canopy inflation and billboard expansion separately.",
"**Preserving overall shading**: Keep the original normals for diffuse lighting, then add highlights, ambient fill, and rim lighting so the expanded leaves retain the canopy's overall volume.",
"**Noise-driven hue variation**: Sample noise with world-space position XY before expansion, calculate `H' = H + (noise + offset) * variety` in HSV, and blend with the original color to control strength. I developed this addition from my painting experience rather than a tutorial.",
"This approach suits the visual language I wanted for stylized foliage better than conventional leaf cards. Its main limitation is changing occlusion as the leaves rotate with the camera. If the texture has too few gaps, entire layers can appear to switch abruptly; adding gaps and reducing the area covered by each card can help."
])}
headings = {'技术要点':'Technical Notes', '参考':'References', '模型':'Model', '使用模型':'Model', '材质':'Textures & Materials'}
references = {
'BV1eN41127E4':'CS0103: Transparent Rendering & Texture Animation · Kerry · Bilibili',
'BV1mh4y1579u':'CS0104: Iridescent Beetle — MatCap Material · Kerry · Bilibili',
'BV1Yx4y1R7WG':'CS0105: Tentacles & Vines — Vertex Animation · Kerry · Bilibili',
'BV1qh4y117we':'CS0106: Magic Mirror — Stencil & Depth Testing · Kerry · Bilibili',
'BV11M41177dU':'Key Features of Dissolve Shaders · DaDa_Chan · Bilibili',
'BV15a411D7wZ':'Efficient Glass Rendering: Refraction, Reflection & Thickness · Bu Dao Yao De Yu Tu · Bilibili',
'574690984':'Unity Shader Post-processing: Shattered Screen · robot518 · Zhihu',
'574196980':'Unity Shader Notes 5: Creating Jade · 水月尽 · Zhihu',
'1937894026360624395':'Gemstone Material Effects · LeoEric · Zhihu',
'666556891':'Height Fog: Basic Principles and Implementation Details · 伊底1D · Zhihu',
'glass-cup-40ac':'Glass Cup · XC · Sketchfab',
}
for section in sections:
    title, paragraphs = copy[section['id']]
    section['title'] = title
    blocks = [block for block in section['blocks'] if block['type']=='paragraph']
    assert len(blocks)==len(paragraphs), section['id']
    for block, text in zip(blocks, paragraphs):
        block['text'] = text
    for block in section['blocks']:
        if block['type']=='heading':
            block['text'] = headings.get(block['text'], block['text'])
        elif block['type']=='image':
            block['alt'] = title + ': shader implementation diagram'
        elif block['type']=='reference':
            block['label'] = next((label for key,label in references.items() if key in block['url']), block['label'])
path.write_text(json.dumps(sections,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Updated all 13 studies with English copy.')
