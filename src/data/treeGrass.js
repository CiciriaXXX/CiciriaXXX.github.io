import images from './treeGrassImages.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const nodes = (name, caption, alt) => ({
  type: 'details', title: 'ASE Nodes',
  blocks: [{ ...figure(name, caption, alt), naturalSize: true }],
});

// Checked against Grass.prefab, GrassUnlit.shader and TerrainColorCapture.
export const treeGrass = {
  id: 'grass',
  title: 'Grass',
  lang: 'en',
  layout: 'compact',
  blocks: [
    figure('painting-reference', 'Porcelain painting detail · Peng Rongxin', 'Grass in the porcelain painting, with yellow-green and blue-green areas, brighter tips, and darker roots and shadows.'),
    p('The painting treats grass differently across regions. I distill these variations into regional color changes, brighter blade tips, and shadows cast and received by the grass.'),
    {
      type: 'technical-intro',
      media: figure('grass-prefab', 'Grass Clump Prefab', 'A grass clump prefab built from cards with alpha-clipped textures.'),
      blocks: [p('Use the grass clump prefab as a Terrain Detail and paint its distribution with the terrain tools. Alpha clipping defines the grass blade silhouettes.')],
    },
    p('**Controlling grass color with terrain painting**: An orthographic camera looks down at the terrain and captures a color map. Its distance from the ground exceeds the grass draw distance, keeping grass out of the capture. The grass shader maps world-space XZ to UVs using the terrain origin and dimensions, then samples the ground color beneath each blade as its base color. Painting the terrain therefore also controls regional grass colors and helps the grass blend naturally into the ground.'),
    {
      type: 'video', src: '/a-great-big-tree/grass/terrain-painting.mp4',
      poster: '/a-great-big-tree/grass/terrain-painting-poster.webp',
      caption: 'Grass Color Painting Demo',
      alt: 'Painting terrain textures in Unity updates regional grass colors through the terrain color map.',
    },
    p('The color map is updated and saved as needed while painting in the editor. At runtime, the saved map is reused.'),
    nodes('graph-terrain-color', 'World position to terrain color UVs', 'ASE nodes mapping world position to terrain color UVs with TerrainBounds and sampling TerrainColor.'),
    p('**Brighter tips and shadows**: Generate `HeightMask` from object-space height to blend from the terrain color at the roots to a brighter `TopColor`. Use the main light’s shadow attenuation to blend between this color and its `ShadowColor`-tinted version so the grass receives scene shadows. Cast shadows also follow the alpha-clipped blade silhouettes.'),
    nodes('graph-color-shadow', 'Height gradient, shadows & blade cutouts', 'ASE nodes combining TerrainColor, TopColor, HeightMask, main-light shadows, and GrassTex alpha.'),
    p('**Wind motion**: Sample two noise layers at different scales using world coordinates and scroll them over time to vary the wind across the grass. Multiply the wind strength by the V component of the blade UVs, then displace vertices along the wind direction, keeping the roots fixed while the tips sway.'),
    nodes('graph-wind', 'Wind noise & blade motion weights', 'ASE nodes combining two scrolling noise layers and multiplying by the texture-coordinate V component to produce WindWave.'),
  ],
};
