import images from './treeBodyImages.json';

const p = (text) => ({ type: 'paragraph', text });
const note = (text) => ({ type: 'note', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const graph = (name, caption, alt) => ({ ...figure(name, caption, alt), naturalSize: true });
const video = (name, caption, alt) => ({
  type: 'video', src: `/a-great-big-tree/tree/${name}.mp4`,
  poster: `/a-great-big-tree/tree/${name}-poster.webp`, caption, alt,
});
const panel = (id, title, media, blocks, detailTitle, detailBlocks, mediaLayout) => ({
  type: 'technical-panel', id: `tree-body-${id}`, title, media, blocks, mediaLayout,
  ...(detailBlocks ? { detail: { type: 'details', title: detailTitle, blocks: detailBlocks } } : {}),
});

// Author's Obsidian captures and PengArt Trunk.shader / material settings checked November 3, 2026.
export const treeBodyRendering = {
  id: 'tree-branches-trunk',
  title: 'Branches, Trunk & Aerial Roots',
  layout: 'compact',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', 'Painting detail · Peng Rongxin', 'Interwoven trunks and aerial roots, with contour-following hatching and soft green washes in Peng Rongxin’s painting.'),
      blocks: [p('The painting uses dark outlines, hatching that follows the branches, and green washes across both light and shadow.')],
    },
    panel('modeling', '01 / Modeling', [
      figure('model-silhouette', null, 'Smooth trunk and branching forms blocked out in Blender.'),
      figure('model-branches', null, 'Intertwined branches and smaller offshoots defining the tree silhouette.'),
      figure('model-sculpt', null, 'Sculpted folds and grooves following the trunk and branches.'),
      figure('model-roots', null, 'The sculpted tree with clusters of hanging aerial roots.'),
    ], [
      p('I built the tree in Blender through blockout, sculpting, retopology, and normal baking. This was my first relatively complex 3D model.'),
    ], undefined, undefined, 'compact'),
    panel('aerial-roots', '02 / Procedural aerial roots', [
      video('aerial-roots-demo', null, 'Blender Geometry Nodes demonstration of adjustable aerial-root clusters.'),
    ], [
      p('**Generating clusters**: Distribute downward curves over a source mesh, randomize their lengths, and taper them toward the tips. Add noise-based bending that increases toward the tips, keeping the roots anchored at the top. Density, length, radius, and bend remain adjustable in Geometry Nodes.'),
      p('**Fixing the UV seam**: Using a Curve Circle as the root profile produced uneven UVs. At a resolution of 5, four side faces each covered 0.2 in U, but the remaining face appeared to span 0–0.8. The cyclic spline factor seemed to wrap the last segment from 0.8 back to 0 instead of continuing to 1.'),
      p('I replaced the circle with an open, six-point pentagon. Its first and last points share the same position but retain separate U values of 0 and 1. The final face can then cover 0.8–1, restoring the same 0.2 span as the other four faces.'),
    ], 'Implementation · geometry nodes and UVs', [
      figure('root-uv-seam', null, 'Blender UV editor and aerial-root meshes showing the hatch pattern around the profile seam.'),
      graph('graph-geometry-roots', null, 'Geometry Nodes graph distributing curves on faces, varying their length, deforming and tapering them, and storing UV coordinates on face corners.'),
      p('**UV output**: Capture spline factors along the root and around its profile before Curve to Mesh. Store the combined coordinates as `UVMap` on the face-corner domain.'),
    ]),
    panel('hatching', '03 / Hatching & tonal control', [
      video('tonal-controls-demo', null, 'Unity editor demonstration of the tree’s hatch density changing with the material’s tonal controls.'),
    ], [
      p('**Tonal control**: Use normal-mapped diffuse lighting to blend between six hatch textures and white, with denser strokes in darker areas. Illumination, brightness, and contrast controls adjust the lighting value before hatch selection.'),
      {
        type: 'figure-gallery', layout: 'portrait', media: [
          figure('hatch-diffuse-only', 'Diffuse only · unlit side', 'A capsule with dense, nearly uniform hatching across its unlit side.'),
          figure('hatch-subtraction-lit', 'Color subtraction', 'A hatch test with direct color subtraction darkening the unmarked spaces near the silhouette.'),
          figure('hatch-multiply-lit', 'Mask multiplication · lit side', 'A hatch test using mask multiplication to deepen the strokes while preserving the light gaps.'),
          figure('hatch-multiply-unlit', 'Mask multiplication · unlit side', 'The unlit side of the hatch test with a view-dependent edge term reinforcing the existing marks.'),
        ],
      },
      note('Hatching tests use an early texture set.'),
      p('**Shaping the unlit side**: Diffuse-only hatching becomes uniform away from the light. Combine baked AO with a view-dependent Fresnel term to emphasize creases and the silhouette.'),
      p('**Preserving the gaps**: Subtracting color darkens both strokes and blank areas. Multiplying the ink mask by `1 + blockingRegion` strengthens existing strokes while leaving a zero mask unchanged.'),
      p('**Ink buildup**: Let the color-mix weight exceed 1 to darken strokes beyond the hatch color, suggesting overlapping layers of ink. Cap the weight at 1.5 and saturate the final RGB.'),
      p('**Green washes**: Multiply the hatched color by a green tint varied with object-space 3D noise. This adds moss-like patches in both light and shadow.'),
      p('**Reference:** [Praun et al. · Real-Time Hatching (2001)](https://hhoppe.com/hatching.pdf) — tonal art maps and blending between hatch densities.'),
    ], 'Implementation · ASE nodes', [
      graph('graph-diffuse', 'Diffuse', 'ASE nodes taking the dot product of the main light direction and the normal-mapped world normal.'),
      graph('graph-lightness', 'Lightness remapping', 'ASE nodes remapping diffuse lighting to the lightness value used for hatching.'),
      graph('graph-hatch-blend', 'Hatch blending', 'ASE nodes weighting six hatch textures and the unmarked white tone to form the hatch mask.'),
      graph('graph-hatch-weight', null, 'HatchWeight function using one minus the absolute distance from a tone index, clamped to zero through one.'),
      p('Scale lightness to 0–6 and weight each tone with `saturate(1 - abs(hatchFactor - toneIndex))`. Invert the weighted sum to obtain the ink mask.'),
      graph('graph-hatch-uv', null, 'ASE nodes multiplying the first UV channel by the fineness parameter.'),
      graph('graph-blocking', 'View-dependent edge term', 'ASE nodes using the view-normal dot product, a power, and a scale to shape the edge contribution.'),
      p('Raise inverted AO to a controllable power, scale it, add the edge term, and saturate to obtain `blockingRegion`.'),
      graph('graph-composition', 'Color composition', 'ASE graph multiplying the hatch mask by the blocking contribution, clamping the mix weight, blending base and hatch colors, and applying the moss tint.'),
      graph('graph-moss', 'Green-wash mask', 'ASE nodes sampling 3D simplex noise from object-space vertex position to produce the moss mask.'),
    ]),
    panel('outline', '04 / Brush-like outlines', [
      figure('outline-object-space', 'Before · object-space expansion', 'An early outline test with large differences in apparent line width between nearby and distant branches.'),
      figure('outline-clip-space', 'After · perspective-compensated expansion', 'The same early tree test with a more consistent outline width across branches at different depths.'),
    ], [
      note('Outline tests use the third-party Big Oak Tree FREE model.'),
      p('**Width across depth**: Object-space expansion makes nearby outlines much thicker than distant ones. Offset vertices along the projected normal in clip-space XY, compensating for perspective to keep the apparent width more consistent.'),
      p('**Uneven brush edges**: Vary the width with world-space 3D noise and render the expanded back faces in a separate outline pass.'),
    ], 'Implementation · ASE nodes and render pass', [
      graph('graph-outline', null, 'ASE graph expanding the clip-space XY position using the projected normal, clip W, aspect correction, and 3D noise while preserving Z and W.'),
      p('Multiply the XY offset by clip-space W to compensate for perspective division, and correct X for the aspect ratio. Remap width noise to 0.2–1.8. The `TreeOutline` pass uses front-face culling and depth testing.'),
    ]),
    panel('wind', '05 / Vertex-painted wind', [
      figure('vertex-wind-mask', null, 'Vertex colors marking flexible twigs and aerial roots in red while the main branches remain dark.'),
    ], [
      p('**Wind weights**: Paint the red vertex-color channel to control movement strength. Separate material settings keep the trunk still and give twigs and aerial roots their own speeds and response strengths.'),
      p('**Sway**: Weight a sine wave with the painted values and displace vertices along the wind direction. Apply the same displacement to the body and outline so they stay aligned.'),
    ], 'Implementation · ASE nodes', [
      graph('graph-wind', null, 'ASE nodes combining time, object position, phase lag, and the red vertex-color channel into the wind signal.'),
      p('Object position and painted weight offset the wave’s phase. Transform the resulting world-space displacement into object space before applying it to the vertices.'),
    ]),
  ],
};
