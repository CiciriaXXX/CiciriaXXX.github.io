import { treeWaterRendering } from './treeWater';
import { treeBodyRendering } from './treeBody';
import { treeFogRendering } from './treeFog';

export const treeBreakdown = [
  { id: 'design', title: '设计' },
  {
    id: 'rendering-models', title: '渲染与模型',
    children: [
      {
        id: 'tree', title: '树木',
        children: [
          { id: 'tree-leaves', title: '树叶' },
          { ...treeBodyRendering, contentHeadingLevel: 6 },
        ],
      },
      {
        id: 'water', title: '水体',
        children: [
          { ...treeWaterRendering, id: 'water-surface', title: '水面', contentHeadingLevel: 6 },
          { id: 'underwater-waterline', title: '水下与水线' },
        ],
      },
      { id: 'grass', title: '草地' },
      treeFogRendering,
      { id: 'characters', title: '人物' },
      { id: 'animals', title: '动物' },
      { id: 'peonies', title: '牡丹' },
    ],
  },
];
