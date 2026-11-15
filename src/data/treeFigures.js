import images from './treeFiguresImages.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const graph = (name, caption, alt) => ({ ...figure(name, caption, alt), naturalSize: true });
const gallery = (media, layout) => ({ type: 'figure-gallery', media, layout });
const details = (blocks) => ({ type: 'details', title: 'ASE Nodes', blocks });
const panel = (id, title, blocks) => ({
  type: 'technical-panel', id: `tree-figures-${id}`, title, media: [], blocks,
});

// Based on the author's animal/character notes and captures; animal shading and
// character reveal checked against Cattle.shader and CharacterRevealShowcase.shader.
export const treeFigures = {
  id: 'animals-characters',
  title: 'Animals & Characters',
  hideSubsectionsInContents: true,
  lang: 'en',
  layout: 'compact',
  blocks: [
    panel('models', '01 / Models', [
      p('I used AI assistance for the character and animal meshes and UVs: I drew reference sketches, used Image2 to generate untextured model references, then used Tripo3D to generate the meshes and UVs. Tripo3D also provided initial rigs and animations for the standing characters. I repaired missing faces, adjusted animation frames and corrected jitter, and painted the character textures; some fabric patterns were also generated with Image2.'),
      p('**Redistributing polygons**: The generated meshes tended to allocate too many polygons to the head and face, although these characters use textures for facial features. I generated body parts separately and assembled them to keep unnecessary facial detail from dominating the polygon allocation.'),
      gallery([
        figure('music-reference', null, 'Painting detail showing listeners and a guitarist beneath the tree.'),
        figure('music-models', null, 'Model composite: a seated listener, the back of a figure in a long dress, and a guitarist, from left to right.'),
      ], 'model-comparison'),
      gallery([
        figure('gathering-reference', null, 'Painting detail showing an umbrella holder and standing and seated figures.'),
        figure('gathering-models', null, 'Model composite: an umbrella holder, a figure in a floral dress, a seated figure in an orange dress, and a clapping figure, from left to right.'),
      ], 'model-comparison'),
      gallery([
        figure('conversation-reference', null, 'Painting detail showing two figures talking beneath the tree.'),
        figure('conversation-models', null, 'Model composite: a seated figure in a floral dress on the left and a figure in a purple dress holding her knees on the right.'),
      ], 'model-comparison'),
      gallery([
        figure('walking-reference', null, 'Painting detail showing a figure in a black-and-white dress and a figure in a yellow shirt.'),
        figure('walking-models', null, 'Model composite: a figure in a black-and-white dress on the left and a figure in a yellow shirt on the right.'),
      ], 'model-comparison'),
    ]),
    panel('animals', '02 / Animal Rendering', [
      {
        type: 'technical-intro',
        media: figure('cattle-reference', 'Porcelain painting detail · Peng Rongxin', 'Cattle depicted with outlines and soft, irregular tonal transitions in the porcelain painting.'),
        blocks: [p('Although the animals are small in the painting, their outlines and soft, irregular tonal transitions remain visible. I developed the material for the cattle, then adapted it for the swans.')],
      },
      gallery([
        figure('cattle-outline', '01 · Outlines', 'Fine outlines on the cattle model.'),
        figure('cattle-diffuse', '02 · Diffuse shading', 'The cattle model with diffuse shading added.'),
      ]),
      p('**Outlines and base shading**: Reuse the tree’s perspective-compensated outline extrusion, varying line width with noise. Shade the surface using the dot product of its normal and the main light direction, then control the light and dark regions with a threshold and transition softness.'),
      details([
        graph('graph-animal-outline', 'Outline width & noise variation', 'ASE nodes for outline extrusion and width variation.'),
        graph('graph-animal-lighting', 'Normal–light dot product', 'ASE nodes combining the normal–light dot product with light attenuation to produce NdotL.'),
      ]),
      gallery([
        figure('cattle-noise', '03 · Noise variation', 'Noise makes the tonal transitions across the cattle model irregular.'),
        figure('cattle-ink-edge', '04 · Darker tonal boundaries', 'The cattle model with darker edges added near the light–dark boundaries.'),
      ]),
      p('**Breaking up shading and darkening boundaries**: Add 3D noise to the shading value for a more hand-painted appearance. Separately, derive an edge weight from the unperturbed normal–light dot product and darken the light–dark boundary to reproduce the darker edges between colors in the painting. `EdgeCenter` controls their position, and `BleedPower` controls their concentration.'),
      details([
        graph('graph-animal-ink-edge', 'Dark edge range & concentration', 'ASE nodes generating the Edge weight from PrimeNdotL, EdgeCenter, and BleedPower.'),
      ]),
      gallery([
        figure('cattle-final', '05 · Accent colors & AO', 'The cattle model with local accent colors and grainy ambient occlusion.'),
        figure('swan-final', 'Swan material variant', 'A pale swan material using the same animal shader.'),
      ]),
      p('**Adding accent colors and AO**: When applying the ambient occlusion (AO) map, I noticed grainy noise from insufficient bake sampling. The noise brought the result closer to the granular texture of the original painting, so I kept it.'),
      p('**Unifying the cattle and swans**: The swans in the painting are mainly white silhouettes. To keep the animals visually consistent in the game, I reuse the cattle shader and adjust its material parameters for different tones and colors.'),
      details([
        graph('graph-animal-composition', 'Shading, dark edges, accent colors & AO', 'ASE nodes combining animal shading, edge tinting, local accent colors, and ambient occlusion.'),
      ]),
    ]),
    panel('characters', '03 / Character Rendering', [
      p('Painted textures define the characters’ facial features and clothing, a color tint adjusts their overall palette, and outlines define their silhouettes. A vertical dissolve with a white edge reveals each character as if it were being painted into the scene.'),
      {
        type: 'video', src: '/a-great-big-tree/figures/character-reveal.mp4',
        poster: '/a-great-big-tree/figures/character-reveal-poster.webp',
        caption: 'Character Reveal Demo', alt: 'A character gradually appears along a vertical reveal, with a white edge moving along the boundary.',
      },
      p('**Controlling the reveal with height and noise**: Map world-space height to `HeightMask`, blend it with 3D noise `BrushNoise`, and compare the result with the reveal progress to create a clipping mask. Height controls the vertical progression, while noise breaks up the boundary.'),
      details([
        graph('graph-character-height', 'Vertical height mask', 'ASE nodes generating HeightMask from world-space height, the top height, and the reveal range.'),
        graph('graph-character-reveal', 'Reveal progress & clipping mask', 'ASE nodes blending HeightMask with BrushNoise and using reveal progress to generate RevealDistance and RevealMask.'),
      ]),
      p('**Synchronizing the white edge and outline**: Use the difference between the reveal field and its threshold to generate `EdgeMask`, blending the edge toward white to suggest a character whose form is complete but has not yet been colored. The main mesh and outline share the reveal progress and edge mask, so they turn white and are clipped together.'),
      details([
        graph('graph-character-edge', 'White edge width', 'ASE nodes using RevealDistance to generate the white edge mask, EdgeMask.'),
        graph('graph-character-composition', 'Texture, tint & white edge', 'ASE nodes combining the character texture, color tint, white reveal edge, and clipping mask.'),
      ]),
    ]),
  ],
};
