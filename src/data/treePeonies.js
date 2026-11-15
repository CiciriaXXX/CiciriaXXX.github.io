import images from './treePeoniesImages.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const graph = (name, caption, alt) => ({ ...figure(name, caption, alt), naturalSize: true });
const nodes = (blocks) => ({ type: 'details', title: 'Geometry Nodes', blocks });
const video = (name, caption, alt) => ({
  type: 'video', src: `/a-great-big-tree/peonies/${name}.mp4`,
  poster: `/a-great-big-tree/peonies/${name}-poster.webp`, caption, alt,
});
const panel = (id, title, blocks) => ({
  type: 'technical-panel', id: `tree-peonies-${id}`, title, media: [], blocks,
});

export const treePeonies = {
  id: 'peonies',
  title: 'Peonies',
  hideSubsectionsInContents: true,
  layout: 'compact',
  lang: 'en',
  blocks: [
    panel('appearance', '01 / Painting Reference & Final Look', [
      {
        type: 'figure-gallery', layout: 'peonies-reference', media: [
          figure('painting-reference', 'Porcelain painting detail · Peng Rongxin', 'Red and white peonies with blue stems and leaves in the original porcelain painting.'),
          figure('final-render', 'Final render', 'Rendered red, pink, and white peonies with blue stems and leaves.'),
        ],
      },
      p('The stems, leaves, and stamens use unlit textures. The petals add diffuse shading with adjustable shadow darkness, color, and coverage.'),
    ]),
    panel('flower', '02 / Flower Geometry Nodes', [
      p('I used Blender Geometry Nodes to generate and adjust the peonies and support animation. Each flower combines stamens, three layers of petals, and sepals. The petal layers and sepals share the same generation logic, and individual stamens are also modeled with nodes.'),
      video('flower-demo', 'Flower Adjustment Demo', 'Adjusting the peony flower through Geometry Nodes parameters in Blender.'),
      nodes([
        graph('graph-petals', 'Petals & sepals · Shared generation logic', 'Geometry Nodes distributing petal and sepal instances around a circle and adjusting their orientation.'),
        graph('graph-single-stamen', 'Modeling a single stamen', 'Geometry Nodes forming the filament and the anther at its tip.'),
        graph('graph-stamens', 'Stamen arrangement', 'The complete Geometry Nodes graph combining and distributing the stamens.'),
      ]),
    ]),
    panel('plant', '03 / Whole-Plant Geometry Nodes', [
      p('The whole-plant node group nests the flower group and adds the stem and leaves.'),
      video('plant-demo', 'Whole-Plant Generation & Adjustment Demo', 'Adjusting the flower, stem, and leaves of a complete peony plant in Blender.'),
      nodes([
        graph('graph-leaves', 'Leaf distribution', 'Geometry Nodes distributing leaves along the stem curve and controlling their orientation.'),
        graph('graph-stem', 'Stem generation', 'Geometry Nodes generating and shaping the stem from a curve.'),
      ]),
    ]),
  ],
};
