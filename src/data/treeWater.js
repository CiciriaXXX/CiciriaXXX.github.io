import images from './treeWaterImages.json';
import notes from './treeWaterNotes.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const panel = (id, title, media, blocks, detailTitle, detailBlocks) => ({
  type: 'technical-panel', id: `tree-water-${id}`, title, media, blocks,
  detail: { type: 'details', title: detailTitle, blocks: detailBlocks },
});

// Surface rendering only; source captures and PengArt implementation checked October 22.
export const treeWaterRendering = {
  id: 'rendering',
  title: "Rendering · Water Surface",
  layout: 'compact',
  lang: 'en',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', "Porcelain painting detail · Peng Rongxin", 'Swans, soft vertical reflections, and pale foam in Peng Rongxin’s porcelain painting.'),
      blocks: [p("The painting features deep blue water, reflections with soft vertical streaks and irregular edges, and scattered patches of pale foam.")],
    },
    panel('reflection', "01 / Reflections & Color Smearing", [
      figure('reflection-base', "01 · Planar reflection without the sky", 'Tree reflection without the white sky.'),
      figure('reflection-ripples', "02 · UV distortion from detail normals", 'Small ripples distort the reflected tree.'),
      figure('reflection-smear', "03 · Directional color smearing", 'Reflected colors spread into soft, irregular vertical streaks.'),
      figure('outline-artifact', "Discarded approach · Outlines in reflections", 'Broad brown outline shapes overlap the reflected branches.'),
    ], [
      p("**Capturing planar reflections without the sky**: Mirror the camera across the water plane and clip geometry below it. Exclude the sky from the reflection to preserve the deep blue of the lake."),
      p("**Distorting reflections with detail normals**: Sample a normal map using world-space XZ coordinates and a time offset, then add its decoded XY components to screen UVs. Divide the offset strength by clip-space W so nearby reflections show small ripples while distant distortion fades."),
      p("**Smearing reflections into vertical streaks**: Offset reflection samples vertically and add horizontal jitter. Combine 12 samples with lower weights farther from the original UV, then blend with the original reflection to create soft streaks of varying width."),
      p("**Excluding tree outlines from reflections**: The extruded tree outlines formed broad brown shapes in the mirrored view. The reflection camera skips the outline pass to prevent these shapes from obscuring the reflected branches."),
    ], "Code & Nodes", notes.reflection),
    panel('color', "02 / Depth, Refraction & Fresnel", [
      figure('depth-color', "Depth color and refracted scene", 'Deep blue water fading into visible shallow terrain.'),
      figure('fresnel-composite', "With smeared reflections", 'Smeared tree reflections combined with deep blue water.'),
    ], [
      p("**Distorting the underwater scene to approximate refraction**: Reuse the detail normal’s XY components, multiply by a separate underwater distortion strength, and offset screen UVs before sampling the opaque scene color. This controls underwater distortion independently of the ripples in the reflection."),
      p("**Blending water color and reflection by viewing angle**: Calculate a Fresnel weight from the dot product of a fixed world-up vector and the view direction, with power, scale, and bias controls. Use it to blend deep blue with the reflection, emphasizing water color when looking down and reflections at grazing angles."),
      p("**Revealing underwater terrain according to depth**: Reconstruct the underwater position from scene depth, take its world-space height difference from the surface, and calculate `saturate(exp(-depth / depthRange))`. This weight decreases with depth, revealing more refracted scene color in shallow areas while retaining water color and reflections farther down."),
    ], "ASE Nodes", notes.color),
    panel('foam', "03 / Shoreline Foam", [
      figure('foam-camera-depth', "Before · Camera depth includes grass", 'Pale foam artifacts spread through the shoreline grass.'),
      figure('foam-filtered-depth', "After · Separate foam depth", 'Cleaner bank-shaped foam with shoreline grass retained.'),
    ], [
      p("**Removing grass from the foam depth input**: Grass in the camera depth texture caused foam around individual blades. Render a separate depth texture that excludes grass so the foam follows the shoreline."),
      p("**Creating broken, moving shoreline foam**: Reconstruct the bank height from the filtered depth and compare it with the water height. Use the height difference to generate a sine band, then break it into moving patches with animated noise."),
    ], "Code & Nodes", notes.foam),
    panel('motion', "04 / Water Motion", [], [
      p("**Driving the surface and floating objects with a Gerstner wave**: A single wave displaces the water vertices, changing the contact area between water and grass along the bank and the waterline seen when entering the lake. Swans and other floating objects sample the same wave to follow the surface height and tilt."),
      p("**Separating wave displacement from surface shading**: I do not use the wave-driven displacement and normals to drive reflections, refraction distortion, or Fresnel. With a low-resolution water mesh, letting the wave affect surface shading made the repeating pattern too obvious."),
      p("**Reference:** [Jasper Flick / Catlike Coding · Waves](https://catlikecoding.com/unity/tutorials/flow/waves/) — Gerstner wave code; this project scales steepness by 0.01. [Code license: MIT-0](https://catlikecoding.com/unity/tutorials/license/)."),
    ], "ASE Nodes", notes.motion),
  ],
};
