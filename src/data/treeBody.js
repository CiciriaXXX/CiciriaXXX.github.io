import images from './treeBodyImages.json';

const p = (text) => ({ type: 'paragraph', text });
const note = (text) => ({ type: 'note', text });
const details = (title, blocks) => ({ type: 'details', title, blocks });
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
  title: "Trunk, Branches & Aerial Roots",
  layout: 'compact',
  lang: 'en',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', "Porcelain painting detail · Peng Rongxin", 'Interwoven trunks and aerial roots, with contour-following hatching and soft green tints in Peng Rongxin’s porcelain painting.'),
      blocks: [p("The painting describes form through outlines and hatching that follows the branches, with soft green tints across both light and dark areas.")],
    },
    panel('modeling', "01 / Modeling", [
      figure('model-silhouette', null, 'Smooth trunk and branching forms blocked out in Blender.'),
      figure('model-branches', null, 'Intertwined branches and smaller offshoots defining the tree silhouette.'),
      figure('model-sculpt', null, 'Sculpted folds and grooves following the trunk and branches.'),
      figure('model-roots', null, 'The sculpted tree with clusters of hanging aerial roots.'),
    ], [
      p("I completed the blockout, sculpting, retopology, and normal baking in Blender. This was my first relatively complex 3D model."),
    ], undefined, undefined, 'compact'),
    panel('aerial-roots', "02 / Procedural Aerial Roots", [], [
      p("I used Blender Geometry Nodes to quickly generate and adjust clusters of aerial roots."),
      video('aerial-roots-demo', null, 'Blender Geometry Nodes demonstration of adjustable aerial-root clusters.'),
      p("**Generating and adjusting root clusters**: Distribute downward curves over a source mesh, randomize their lengths, and taper their tips. Noise bends the curves with increasing displacement toward the tips while keeping their tops fixed. Density, length, radius, and bend parameters control the spacing and shape of each cluster."),
      p("**Fixing the UV seam**: Using a Curve Circle as the root profile produced uneven UVs. At a resolution of five, four side faces each spanned 0.2 in U, while the remaining face appeared to cover 0–0.8. This seemed to result from the cyclic spline factor: the final segment wrapped from 0.8 back to 0 instead of reaching 1."),
      p("I replaced the circle with an open, six-point pentagonal profile. Its first and last points share the same position but retain U = 0 and U = 1 respectively. The final face then covers 0.8–1, matching the 0.2 span of the other four faces."),
    ], "Geometry Nodes", [
      figure('root-uv-seam', "UV issue · Curve Circle profile", "Uneven UV spacing at the seam of a Curve Circle profile stretches the hatch texture."),
      graph('graph-geometry-roots', null, 'Geometry Nodes graph distributing curves on faces, varying their length, deforming and tapering them, and storing UV coordinates on face corners.'),
      p("**Generating UVs along the root and profile**: Before Curve to Mesh, obtain the spline factors along the root and around its profile. Combine them into 2D coordinates and store them as `UVMap` on the face corner domain."),
    ]),
    panel('hatching', "03 / Hatching & Tonal Control", [], [
      p("**Reference:** [Praun et al. · Real-Time Hatching (2001)](https://hhoppe.com/hatching.pdf) — I used its mapping from diffuse lighting to hatch tones and its tonal art map (TAM) texture requirements for the base effect, then developed my own shadow shaping and color treatment."),
      p("**Blending hatch tones from diffuse lighting**: Take the dot product of the normal-mapped world normal and the main light direction to obtain diffuse lighting. Map the adjusted tonal value to 0–6, covering six hatch textures from dense to sparse, followed by white. Fractional values blend adjacent levels so stroke density transitions smoothly with the lighting."),
      details("ASE Nodes", [
        graph('graph-diffuse', "Diffuse lighting", 'ASE nodes taking the dot product of the main light direction and the normal-mapped world normal.'),
        graph('graph-hatch-blend', "Hatch blending", 'ASE nodes weighting six hatch textures and the unmarked white tone to form the hatch mask.'),
        graph('graph-hatch-weight', null, 'HatchWeight function using one minus the absolute distance from a tone index, clamped to zero through one.'),
        p("Each level uses `saturate(1 - abs(hatchFactor - toneIndex))`, giving zero weight to levels more than one step away. Invert the weighted result to form a hatch mask, with darker strokes approaching 1 and unmarked white areas at 0."),
        graph('graph-hatch-uv', null, 'ASE nodes multiplying the first UV channel by the fineness parameter.'),
      ]),
      p("**Shaping the unlit side**: Selecting hatch tones from diffuse lighting alone made the unlit side too uniform. I combined baked AO with a view-dependent Fresnel term to reinforce recesses and contours. Initially, I subtracted color values directly, but this also darkened light areas and undermined the idea of expressing tone through hatching. Instead, I multiply the hatch mask by `1 + blockingRegion`, deepening existing strokes while leaving zero-mask areas unchanged."),
      {
        type: 'figure-gallery', layout: 'portrait', media: [
          figure('hatch-diffuse-only', "Diffuse only · Unlit side", 'A capsule with dense, nearly uniform hatching across its unlit side.'),
          figure('hatch-subtraction-lit', "Direct color subtraction", 'A hatch test with direct color subtraction darkening the unmarked spaces near the silhouette.'),
          figure('hatch-multiply-lit', "Mask multiplication · Lit side", 'A hatch test using mask multiplication to deepen the strokes while preserving the light gaps.'),
          figure('hatch-multiply-unlit', "Mask multiplication · Unlit side", 'The unlit side of the hatch test with a view-dependent edge term reinforcing the existing marks.'),
        ],
      },
      note("These hatch tests use an early texture set."),
      details("ASE Nodes", [
        graph('graph-blocking', "View-dependent rim term", 'ASE nodes using the view-normal dot product, a power, and a scale to shape the edge contribution.'),
        p("Apply a power and intensity scale to `1 - AO` to emphasize recesses. Calculate the rim term from `1 - saturate(dot(N, V))`, with separate power and intensity controls. Add the two terms and clamp to 0–1 to obtain `blockingRegion`."),
      ]),
      p("**Extending the blend weight to deepen strokes**: Use the reinforced hatch mask as the `lerp` weight between the base and hatch colors, allowing values up to 1.5. Weights above 1 extrapolate beyond the darker hatch color, creating denser dark marks to match the painting’s tonal variation. Clamp the final RGB to 0–1 with `saturate`."),
      details("ASE Nodes", [
        graph('graph-composition', null, 'ASE graph multiplying the hatch mask by the blocking contribution, clamping the mix weight, blending base and hatch colors, and applying the moss tint.'),
      ]),
      p("**Distributing green tints with noise**: Scale object-space positions by a tiling parameter to sample 3D noise, then remap it to 0–1 and invert it to form a tint mask. Use the mask to interpolate between white and green, and apply the result to the final color with Multiply blending, adding green patches to both light and dark areas."),
      details("ASE Nodes", [
        graph('graph-moss', null, 'ASE nodes sampling 3D simplex noise from object-space vertex position to produce the moss mask.'),
      ]),
      p("**Adjusting the tonal distribution of hatching**: Before selecting a hatch level, add a tonal offset to the lighting value, multiply by brightness, scale contrast around 0.5, and clamp to 0–1. This changes the area covered by each hatch level, controlling the unmarked highlights, dense shadows, and transitions between them."),
      video('tonal-controls-demo', null, 'Unity editor demonstration of the tree’s hatch density changing with the material’s tonal controls.'),
      details("ASE Nodes", [
        graph('graph-lightness', null, 'ASE nodes remapping diffuse lighting to the lightness value used for hatching.'),
      ]),
    ]),
    panel('outline', "04 / Brushstroke Outlines", [
      figure('outline-object-space', "Before · Object-space expansion", 'An early outline test with large differences in apparent line width between nearby and distant branches.'),
      figure('outline-clip-space', "After · Perspective-compensated expansion", 'The same early tree test with a more consistent outline width across branches at different depths.'),
    ], [
      note("The outline tests use the third-party Big Oak Tree FREE model."),
      p("**Compensating for perspective to keep line widths consistent**: Extruding vertices along object-space normals made nearby outlines much thicker than distant ones, which did not suit the painting. I instead offset clip-space XY along the projected normal and compensate for perspective, keeping the outline width more consistent in normalized device coordinates (NDC) after perspective division."),
      p("**Varying line width with noise**: Sample 3D noise using world-space positions, remap it to 0.2–1.8, and multiply it into the extrusion amount. The outline varies in thickness along the surface, resembling the uneven marks of a brush."),
    ], "ASE Nodes", [
      graph('graph-outline', null, 'ASE graph expanding the clip-space XY position using the projected normal, clip W, aspect correction, and 3D noise while preserving Z and W.'),
      p("Multiply the XY offset by clip-space W to compensate for perspective division, and correct X for the screen aspect ratio. The `TreeOutline` pass uses front-face culling and depth testing."),
    ]),
    panel('wind', "05 / Vertex-Color Wind Animation", [
      figure('vertex-wind-mask', null, 'Vertex colors marking flexible twigs and aerial roots in red while the main branches remain dark.'),
    ], [
      p("**Controlling trunk, twig, and root motion separately**: Paint the red vertex-color channel to assign local motion weights. Separate material parameters keep the trunk still while setting the speed and response strength of twigs and aerial roots independently."),
      p("**Driving staggered motion with a sine wave**: A time-varying sine wave drives vertex displacement. Speed controls its frequency, while vertex-color weights and material response strength control amplitude. Object position offsets the phase; vertex weights and a phase-lag parameter further stagger the motion across different parts."),
      p("**Keeping the surface and outline in sync**: Convert the motion signal into displacement along the world-space wind direction, then transform it to object space before applying it to vertices. The surface and outline use the same displacement so they remain aligned as the tree sways."),
    ], "ASE Nodes", [
      graph('graph-wind', null, 'ASE nodes combining time, object position, phase lag, and the red vertex-color channel into the wind signal.'),
    ]),
  ],
};
