import code from './treeFogCode.json';

const p = (text) => ({ type: 'paragraph', text });
const details = (blocks) => ({ type: 'details', title: '代码', blocks });

export const treeFogRendering = {
  id: 'fog',
  title: '雾',
  lang: 'zh-CN',
  layout: 'compact',
  blocks: [
    p('玩家需要能够走进雾中，因此我用长方体限定雾的范围，通过光线步进累积体积密度，让遮挡程度随视线穿过雾的距离变化。'),
    {
      type: 'video',
      src: '/a-great-big-tree/fog/fog-demo.mp4',
      poster: '/a-great-big-tree/fog/fog-demo-poster.webp',
      alt: '体积雾实机演示：流动溶解、顶部渐隐与边缘染色。',
    },
    p('**计算视线在雾中的采样区间**：将视线转换到物体空间，与长方体求交。相机在雾外时从入射点开始采样，在雾内时从相机位置开始；终点取出射点与不透明场景表面中更近的一处，避免雾覆盖前方物体。绘制长方体背面，使相机进入雾内后仍能执行步进。'),
    details(code.interval),
    p('**用流动噪声控制两侧的溶解程度**：沿世界空间速度偏移 3D 噪声的采样位置，并单独缩放竖向频率来调整雾的形态。根据采样点在局部 Z 轴上的位置，在两端的溶解阈值之间平滑插值，再用 smoothstep 将噪声转成密度遮罩，让一侧破碎、另一侧更完整。'),
    details(code.dissolve),
    p('**向顶部渐隐以弱化墙状边界**：计算采样点到长方体顶面的距离，换算成世界空间长度，再用 smoothstep 逐渐降低靠近顶部的密度。这样从雾另一侧向树看时，顶部不会呈现整齐的硬边。'),
    details(code.height),
    p('**沿溶解边缘叠加颜色变化**：用噪声值与溶解阈值的差生成边缘色权重。累积时，再乘以前方雾的透射率和当前采样段的不透明度，使被前方浓雾遮住的边缘贡献更小。最后按这个权重混合雾色与蓝绿色边缘色，增加接近原画的色彩变化。'),
    details(code.edge),
    p('**按光学厚度累积并提前结束采样**：将每段密度乘以步长，累积为光学厚度，再用 `1 - exp(-opticalDepth)` 得到不透明度，使步数调整主要影响采样精度。当前材质使用 24 步；当透射率低于 1% 时提前结束循环，减少浓雾中后续贡献很小的采样。'),
    details(code.accumulation),
  ],
};
