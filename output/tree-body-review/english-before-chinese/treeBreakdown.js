import { treeWaterRendering } from './treeWater';
import { treeBodyRendering } from './treeBody';

export const treeBreakdown = [
  { id: 'design', title: 'Design' },
  {
    id: 'rendering-models', title: 'Rendering & Models',
    children: [
      {
        id: 'tree', title: 'Tree',
        children: [
          { id: 'tree-leaves', title: 'Leaves' },
          { ...treeBodyRendering, contentHeadingLevel: 6 },
        ],
      },
      {
        id: 'water', title: 'Water',
        children: [
          { ...treeWaterRendering, id: 'water-surface', title: 'Water Surface', contentHeadingLevel: 6 },
          { id: 'underwater-waterline', title: 'Underwater & Waterline' },
        ],
      },
      { id: 'grass', title: 'Grass' },
      { id: 'fog', title: 'Fog' },
      { id: 'characters', title: 'Characters' },
      { id: 'animals', title: 'Animals' },
      { id: 'peonies', title: 'Peonies' },
    ],
  },
];
