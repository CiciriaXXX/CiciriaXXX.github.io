import images from './treeBodyImages.json';

const p = (text) => ({ type: 'paragraph', text });
const note = (text) => ({ type: 'note', text });
const details = (title, blocks) => ({ type: 'details', title, blocks });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const graph = (name, caption, alt) => ({ ...figure(name, caption, alt), naturalSize: true });
const video = (name, caption, alt) => ({
  type: 'video', src: `/a-great-big-tree/tree/${name}.mp4`,
  poster: `/a-great-big-tree/tree/${name}-poster.webp`, caption, alt,
});
const panel = (id, title, media, blocks, detailTitle, detailBlocks, mediaLayout) => ({
  type: 'technical-panel', id: `tree-body-${id}`, title, media, blocks, mediaLayout,
  ...(detailBlocks ? { detail: { type: 'details', title: detailTitle, blocks: detailBlocks } } : {}),
});

// Author's Obsidian captures and PengArt Trunk.shader / material settings checked November 3, 2026.
export const treeBodyRendering = {
  id: 'tree-branches-trunk',
  title: "树干、树枝与气根",
  layout: 'compact',
  lang: 'zh-CN',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', "原画局部 · 彭荣新", 'Interwoven trunks and aerial roots, with contour-following hatching and soft green washes in Peng Rongxin’s painting.'),
      blocks: [p("原画用描边和顺着树枝结构的排线表现形体，明部和暗部都带有绿色晕染。")],
    },
    panel('modeling', "01 / 建模", [
      figure('model-silhouette', null, 'Smooth trunk and branching forms blocked out in Blender.'),
      figure('model-branches', null, 'Intertwined branches and smaller offshoots defining the tree silhouette.'),
      figure('model-sculpt', null, 'Sculpted folds and grooves following the trunk and branches.'),
      figure('model-roots', null, 'The sculpted tree with clusters of hanging aerial roots.'),
    ], [
      p("我在 Blender 中完成了大形建立、雕刻、重拓扑和法线烘焙。这是我制作的第一个较为复杂的 3D 模型。"),
    ], undefined, undefined, 'compact'),
    panel('aerial-roots', "02 / 程序化气根", [], [
      p("我使用 Blender 的几何节点，帮助我快速生成和调整树木的气根。"),
      video('aerial-roots-demo', null, 'Blender Geometry Nodes demonstration of adjustable aerial-root clusters.'),
      p("**生成并调整气根簇**：在源网格上分布向下延伸的曲线，随机调整长度，并让末端逐渐变细。用噪声使曲线弯曲，越靠近末端偏移越大，顶部则保持固定。通过密度、长度、半径和弯曲程度参数，调整气根簇的疏密与形态。"),
      p("**修复 UV 接缝**：直接用曲线圆作为气根的截面时，UV 会不均匀。分辨率为 5 时，一圈五个侧面中有四个的 U 跨度都是 0.2，剩下一个面看起来却覆盖了 0–0.8。这可能是因为曲线圆的系数是循环的，最后一段本应从 0.8 到 1，却回绕成了 0.8 到 0。"),
      p("我用一个非闭合、由六个点组成的五边形替代曲线圆。首尾两个点位置重合，但分别保留 U = 0 和 U = 1。这样最后一面就能覆盖 0.8–1，和其余四个面一样保持 0.2 的跨度。"),
    ], "几何节点", [
      figure('root-uv-seam', "错误示例 · 使用曲线圆作为截面时的 UV", '使用曲线圆作为气根截面时，接缝处的 UV 跨度异常，造成排线纹理拉伸。'),
      graph('graph-geometry-roots', null, 'Geometry Nodes graph distributing curves on faces, varying their length, deforming and tapering them, and storing UV coordinates on face corners.'),
      p("**沿长度和截面生成 UV**：在 Curve to Mesh 之前，分别获取沿气根长度和截面方向的样条系数，组合成二维坐标，再存为面拐角域上的 `UVMap`。"),
    ]),
    panel('hatching', "03 / 排线与明暗控制", [], [
      p("**参考：** [Praun 等 · Real-Time Hatching（2001）](https://hhoppe.com/hatching.pdf) —— 我参考其中的光照到排线的映射和 TAM 纹理要求，实现了基础排线效果，再在此基础上调整暗部塑形和颜色表现。"),
      p("**按漫反射光照混合排线**：用法线贴图修正后的世界空间法线与主光方向点乘，得到漫反射光照。将调整后的明度映射到 0–6，对应由密到疏的六张排线纹理和白色；非整数值在相邻两级间混合，使笔触密度随明暗连续过渡。"),
      details("ASE 节点", [
        graph('graph-diffuse', "漫反射", 'ASE nodes taking the dot product of the main light direction and the normal-mapped world normal.'),
        graph('graph-hatch-blend', "排线混合", 'ASE nodes weighting six hatch textures and the unmarked white tone to form the hatch mask.'),
        graph('graph-hatch-weight', null, 'HatchWeight function using one minus the absolute distance from a tone index, clamped to zero through one.'),
        p("各层权重为 `saturate(1 - abs(hatchFactor - toneIndex))`：距离当前明度超过一级的纹理权重为零。将加权结果反相，得到笔触为 1、空白为 0 的排线遮罩。"),
        graph('graph-hatch-uv', null, 'ASE nodes multiplying the first UV channel by the fineness parameter.'),
      ]),
      p("**背光面塑形**：只依据漫反射选择排线时，背光面的排线会过于均匀。我尝试结合烘焙 AO 和与视角相关的 Fresnel 项，强化暗部的凹陷和轮廓，增加视觉变化。起初我直接减去颜色值，但这会同时压暗亮面，也偏离了用排线表现明暗的思路。最终改为将排线遮罩乘以 `1 + blockingRegion`，加深已有笔触，而遮罩为零的区域保持不变。"),
      {
        type: 'figure-gallery', layout: 'portrait', media: [
          figure('hatch-diffuse-only', "仅漫反射 · 背光面", 'A capsule with dense, nearly uniform hatching across its unlit side.'),
          figure('hatch-subtraction-lit', "直接减去颜色", 'A hatch test with direct color subtraction darkening the unmarked spaces near the silhouette.'),
          figure('hatch-multiply-lit', "遮罩相乘 · 受光面", 'A hatch test using mask multiplication to deepen the strokes while preserving the light gaps.'),
          figure('hatch-multiply-unlit', "遮罩相乘 · 背光面", 'The unlit side of the hatch test with a view-dependent edge term reinforcing the existing marks.'),
        ],
      },
      note("排线测试使用的是早期纹理。"),
      details("ASE 节点", [
        graph('graph-blocking', "与视角相关的边缘项", 'ASE nodes using the view-normal dot product, a power, and a scale to shape the edge contribution.'),
        p("对 `1 - AO` 做幂运算并缩放强度，突出凹陷区域；边缘项由 `1 - saturate(dot(N, V))` 计算，再用幂和强度参数控制范围。两者相加并限制到 0–1，得到 `blockingRegion`。"),
      ]),
      p("**提高混色权重以表现积墨**：用加强后的排线遮罩作为底色与排线色之间的 `lerp` 权重，并将上限放宽到 1.5。权重大于 1 时，颜色会越过设定的排线色继续加深，贴近原画中笔触叠加后的积墨效果；最终 RGB 用 saturate 限制在 0–1。"),
      details("ASE 节点", [
        graph('graph-composition', null, 'ASE graph multiplying the hatch mask by the blocking contribution, clamping the mix weight, blending base and hatch colors, and applying the moss tint.'),
      ]),
      p("**用噪声分布绿色晕染**：将物体空间位置乘以平铺参数后采样 3D 噪声，再把噪声重映射到 0–1 并反相，作为晕染遮罩。用遮罩在白色与绿色之间插值，再以正片叠底的方式叠加到最终颜色上，使明部和暗部都带有绿色色块。"),
      details("ASE 节点", [
        graph('graph-moss', null, 'ASE nodes sampling 3D simplex noise from object-space vertex position to produce the moss mask.'),
      ]),
      p("**调整排线的明暗分布**：在选择排线层级之前，先给光照值加上明度偏移，再乘以亮度参数，最后以 0.5 为中心缩放对比度，并限制到 0–1。这样可以改变各排线层级覆盖的范围，调整亮部留白、暗部密度及两者的过渡。"),
      video('tonal-controls-demo', null, 'Unity editor demonstration of the tree’s hatch density changing with the material’s tonal controls.'),
      details("ASE 节点", [
        graph('graph-lightness', null, 'ASE nodes remapping diffuse lighting to the lightness value used for hatching.'),
      ]),
    ]),
    panel('outline', "04 / 笔触描边", [
      figure('outline-object-space', "调整前 · 物体空间外扩", 'An early outline test with large differences in apparent line width between nearby and distant branches.'),
      figure('outline-clip-space', "调整后 · 补偿透视的外扩", 'The same early tree test with a more consistent outline width across branches at different depths.'),
    ], [
      note("描边测试使用的是第三方 Big Oak Tree FREE 模型。"),
      p("**补偿透视以统一描边宽度**：在物体空间沿法线外扩顶点，会让近处描边明显粗于远处，不太符合绘画的表现逻辑。因此，我改为沿投影后的法线，在裁剪空间 XY 方向偏移顶点，并补偿透视，使透视除法后的 NDC 描边宽度更一致。"),
      p("**用噪声改变描边粗细**：以世界空间位置采样 3D 噪声，将结果映射到 0.2–1.8，再乘到顶点外扩量上。轮廓因此沿空间位置呈现粗细变化，贴近毛笔描边中不均匀的抖动笔触。"),
    ], "ASE 节点", [
      graph('graph-outline', null, 'ASE graph expanding the clip-space XY position using the projected normal, clip W, aspect correction, and 3D noise while preserving Z and W.'),
      p("将 XY 偏移乘以裁剪空间 W，补偿透视除法，并按屏幕宽高比修正 X。`TreeOutline` Pass 使用正面剔除和深度测试。"),
    ]),
    panel('wind', "05 / 顶点色风动", [
      figure('vertex-wind-mask', null, 'Vertex colors marking flexible twigs and aerial roots in red while the main branches remain dark.'),
    ], [
      p("**分别控制主干、细枝和气根的风动**：绘制顶点色的红色通道，指定各部位的运动权重。再用独立的材质参数保持主干静止，并分别设置细枝和气根的速度与响应强度。"),
      p("**用正弦波驱动错开的摆动**：用随时间变化的正弦波驱动顶点位移，速度参数控制频率，顶点色权重和材质响应强度共同控制幅度。物体位置提供相位偏移，顶点色权重与相位延迟参数进一步让不同部位错开摆动节奏。"),
      p("**同步主体与描边的位移**：将摆动信号沿世界空间风向转换为位移，再变换到物体空间应用到顶点。主体和描边使用同一位移，避免摆动时轮廓与模型脱离。"),
    ], "ASE 节点", [
      graph('graph-wind', null, 'ASE nodes combining time, object position, phase lag, and the red vertex-color channel into the wind signal.'),
    ]),
  ],
};
