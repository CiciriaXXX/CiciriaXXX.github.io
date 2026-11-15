import images from './treeLeavesImages.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const nodes = (name, caption, alt) => ({
  type: 'details', title: 'ASE Nodes',
  blocks: [{ ...figure(name, caption, alt), naturalSize: true }],
});
const panel = (id, title, blocks) => ({
  type: 'technical-panel', id: `tree-leaves-${id}`, title, media: [], blocks,
});

// Checked against LeafCluster.prefab, FoliageShape.shader and FoliageColor.shader.
export const treeLeaves = {
  id: 'tree-leaves',
  title: 'Leaves',
  lang: 'en',
  layout: 'compact',
  contentHeadingLevel: 6,
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', 'Porcelain painting detail · Peng Rongxin', 'The canopy in the porcelain painting, with dense dark leaf shapes and soft green and gray-green areas.'),
      blocks: [p('In the original painting, leaf shapes are first drawn in dark tones, then overlaid with softly blended colors. I divide my leaf rendering into these same two parts.')],
    },
    panel('shape', '01 / Leaf Shapes', [
      p('**Building leaf clusters with billboards**: Fixed leaf cards made their flat geometry apparent in this scene, weakening the painterly look. I keep the cards facing the camera, combine several billboards into each cluster, and distribute the clusters across the canopy.'),
      {
        type: 'video', src: '/a-great-big-tree/leaves/leaf-cluster.mp4',
        poster: '/a-great-big-tree/leaves/leaf-cluster-poster.webp',
        caption: 'Leaf Cluster Demo',
        alt: 'A leaf cluster viewed from different angles, showing its arrangement of camera-facing billboards.',
      },
      p('**Adapting shapes and colors to in-game viewpoints**: Most leaves in the painting point downward, but combining that direction with rotating billboards looked unnatural from below or from the side. I therefore use a rounder cluster arrangement. Some painted leaves have gradients of gray and black; overlapping many translucent leaf cards would add overdraw and blending cost. I use alpha clipping for the silhouettes and blue-green tones instead of uniformly dark colors to keep the canopy from feeling too heavy. These adjustments prioritize the overall painterly appearance in the game.'),
      nodes('graph-leaf-shape', 'Leaf shapes, colors & billboards', 'ASE nodes combining leaf cutouts, two leaf colors, spherical billboarding, and wind displacement.'),
    ]),
    panel('color', '02 / Color Layer', [
      { ...figure('color-overlay', null, 'The isolated foliage color layer, with blue-green and yellow-green patches fading softly toward the mesh boundary.'), naturalSize: true, width: 520, height: Math.round(520 * images['color-overlay'].height / images['color-overlay'].width) },
      p('**Layering color with rounded meshes**: Place a rounded mesh around each leaf cluster and use Multiply blending with the existing scene color, adding continuous color variation over the leaf shapes. Derive noise UVs from view-space XY and blend three colors using two noise layers at different scales. The color approaches white near the silhouette, weakening the multiplicative tint and creating a soft transition.'),
      nodes('graph-leaf-color', 'Three-color blending & edge transition', 'ASE nodes blending Color1, Color2, and Color3 with two noise layers and using RimRegion to control the edge color.'),
    ]),
  ],
};
