import { treeWaterRendering } from './treeWater';
import { treeUnderwaterRendering } from './treeUnderwater';
import { treeBodyRendering } from './treeBody';
import { treeFogRendering } from './treeFog';
import { treePeonies } from './treePeonies';
import { treeFigures } from './treeFigures';
import { treeGrass } from './treeGrass';
import { treeLeaves } from './treeLeaves';

export const treeBreakdown = [
  { id: 'design', title: "Design" },
  {
    id: 'rendering-models', title: "Rendering & Modeling",
    children: [
      {
        id: 'tree', title: "Tree",
        children: [
          { ...treeBodyRendering, contentHeadingLevel: 6 },
          treeLeaves,
        ],
      },
      {
        id: 'water', title: "Water",
        children: [
          { ...treeWaterRendering, id: 'water-surface', title: "Water Surface", contentHeadingLevel: 6 },
          { ...treeUnderwaterRendering, contentHeadingLevel: 6 },
        ],
      },
      treeGrass,
      treeFogRendering,
      treePeonies,
      treeFigures,
    ],
  },
];
