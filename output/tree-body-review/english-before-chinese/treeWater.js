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
  title: 'Rendering · Water Surface',
  layout: 'compact',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', 'Painting detail · Peng Rongxin', 'Swans, ink-like reflections, and pale foam in Peng Rongxin’s painting.'),
      blocks: [p('The painting’s water is deep blue, with reflections bleeding into soft vertical streaks and broken patches of white foam.')],
    },
    panel('reflection', '01 / Reflection & ink bleed', [
      figure('reflection-base', '01 · Planar reflection; sky excluded', 'Tree reflection without the white sky.'),
      figure('reflection-ripples', '02 · Detail-normal UV distortion', 'Small ripples distort the reflected tree.'),
      figure('reflection-smear', '03 · Directional smear', 'Reflected colors bleed into irregular vertical streaks.'),
      figure('outline-artifact', 'Rejected · Outline inside reflection', 'Broad brown outline shapes overlap the reflected branches.'),
    ], [
      p('**Planar reflection**: Mirror the camera across the water plane and clip geometry below it. Exclude the sky to preserve the lake’s dark blue color.'),
      p('**Distortion and ink bleed**: Offset reflection UVs with a scrolling normal map, reducing distortion with distance. A directional filter spreads the colors into irregular vertical streaks.'),
      p('**Outline artifacts**: The expanded tree outline produces broad brown shapes in the mirrored view. Skip the outline pass for reflection cameras.'),
    ], 'Implementation · code and nodes', notes.reflection),
    panel('color', '02 / Depth, refraction & Fresnel', [
      figure('depth-color', 'Depth color + refracted scene', 'Deep blue water fading into visible shallow terrain.'),
      figure('fresnel-composite', 'With the painted reflection', 'Smeared tree reflections combined with deep blue water.'),
    ], [
      p('**Refraction**: Offset the opaque scene-color UVs with the detail normal map to distort the terrain seen through the water.'),
      p('**Blending by angle and depth**: Use Fresnel to blend the deep blue color with reflection, increasing reflection at grazing angles. An exponential depth mask blends this result toward the refracted scene in shallow water.'),
    ], 'Implementation · ASE nodes', notes.color),
    panel('foam', '03 / Shoreline foam', [
      figure('foam-camera-depth', 'Before · Camera depth includes grass', 'Pale foam artifacts spread through the shoreline grass.'),
      figure('foam-filtered-depth', 'After · Dedicated foam depth', 'Cleaner bank-shaped foam with shoreline grass retained.'),
    ], [
      p('**Filtering shoreline depth**: Grass in the camera depth creates foam around individual blades. Render a separate depth texture that excludes grass, so foam follows the bank.'),
      p('**Shaping the foam**: Reconstruct the bank height from the filtered depth and compare it with the water height. Use a sine band to form the shoreline pattern and animated noise to break it into moving patches.'),
    ], 'Implementation · code and nodes', notes.foam),
    panel('motion', '04 / Motion', [], [
      p('**Gerstner displacement**: A single wave shifts the contact area between water and grass along the bank, adding visible motion even from shore. It also moves the waterline as the player enters the lake. Floating objects such as the swans sample the same wave for their height and tilt.'),
      p('**Keeping the reflection calm**: On the relatively coarse water mesh, wave-driven shading made the repeating wave pattern too obvious. Use scrolling detail normals for reflection and refraction distortion, and a fixed world-up normal for Fresnel, preserving the painted surface while retaining geometric motion.'),
      p('**Reference:** [Jasper Flick / Catlike Coding · Waves](https://catlikecoding.com/unity/tutorials/flow/waves/) — Gerstner wave code, with steepness scaled by 0.01 in this project. [Code license: MIT-0](https://catlikecoding.com/unity/tutorials/license/).'),
    ], 'Implementation · ASE nodes', notes.motion),
  ],
};
