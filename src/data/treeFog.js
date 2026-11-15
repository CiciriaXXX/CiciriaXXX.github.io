import code from './treeFogCode.json';

const p = (text) => ({ type: 'paragraph', text });
const details = (blocks) => ({ type: 'details', title: "Code", blocks });

export const treeFogRendering = {
  id: 'fog',
  title: "Fog",
  lang: 'en',
  layout: 'compact',
  blocks: [
    p("Players need to be able to walk into the fog. I use a box to define its volume and raymarch through it, accumulating density so visibility changes with the distance traveled through the fog."),
    {
      type: 'video',
      src: '/a-great-big-tree/fog/fog-demo.mp4',
      poster: '/a-great-big-tree/fog/fog-demo-poster.webp',
      alt: "In-game volumetric fog showing flowing dissolution, height fading, and tinted edges.",
    },
    p("**Finding the ray interval inside the fog**: Transform the view ray to object space and intersect it with the box. Sampling starts at the entry point when the camera is outside, or at the camera when it is inside. Stop at the nearer of the exit point and the opaque scene surface to avoid drawing fog over foreground objects. Rendering the box’s back faces keeps raymarching active when the camera enters the volume."),
    details(code.interval),
    p("**Varying dissolution across the volume with moving noise**: Scroll the 3D noise coordinates with a world-space velocity and scale the vertical frequency separately to shape the fog. Smoothly interpolate between two dissolve thresholds along local Z, then use `smoothstep` to turn noise into a density mask, making one side more broken up while keeping the other more solid."),
    details(code.dissolve),
    p("**Fading toward the top to soften the wall-like boundary**: Calculate each sample’s distance below the box’s top face in world units, then use `smoothstep` to reduce density near the top. This removes the straight upper edge when looking toward the tree from the other side of the fog."),
    details(code.height),
    p("**Tinting dissolve edges**: Derive an edge weight from the difference between the noise value and the dissolve threshold. Weight its contribution by the transmittance through the fog in front and the opacity of the current sample segment, reducing the influence of edges hidden behind dense fog. Use the accumulated weight to blend the fog color with a blue-green edge tint, adding color variation closer to the painting."),
    details(code.edge),
    p("**Accumulating optical depth and terminating early**: Multiply each sample’s density by the step length, accumulate optical depth, and convert it to opacity with `1 - exp(-OpticalDepth)`. This makes step count primarily a sampling-quality control. The current material uses 24 steps; stop early when transmittance falls below 1% to skip samples with little remaining contribution."),
    details(code.accumulation),
  ],
};
