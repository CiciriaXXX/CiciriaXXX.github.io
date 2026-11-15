import images from './treeWaterImages.json';
import notes from './treeWaterNotes.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const panel = (id, title, media, blocks, detailTitle, detailBlocks) => ({
  type: 'technical-panel', id: `tree-water-${id}`, title, media, blocks,
  detail: { type: 'details', title: detailTitle, blocks: detailBlocks },
});

// Surface rendering only; source captures and PengArt implementation checked October 22.
export const treeWaterRendering = {
  id: 'rendering',
  title: "渲染 · 水面",
  layout: 'compact',
  lang: 'zh-CN',
  blocks: [
    {
      type: 'technical-intro',
      media: figure('painting-reference', "原画局部 · 彭荣新", 'Swans, ink-like reflections, and pale foam in Peng Rongxin’s painting.'),
      blocks: [p("原画的水体是深蓝色，倒影晕染成柔和的竖向条纹，水面散布着不连续的白色浮沫。")],
    },
    panel('reflection', "01 / 反射与水墨晕染", [
      figure('reflection-base', "01 · 平面反射，排除天空", 'Tree reflection without the white sky.'),
      figure('reflection-ripples', "02 · 细节法线扭曲 UV", 'Small ripples distort the reflected tree.'),
      figure('reflection-smear', "03 · 定向晕染", 'Reflected colors bleed into irregular vertical streaks.'),
      figure('outline-artifact', "弃用方案 · 反射包含描边", 'Broad brown outline shapes overlap the reflected branches.'),
    ], [
      p("**捕获不含天空的平面反射**：将相机沿水面镜像，并裁掉水面以下的几何体。反射中排除天空，以保留湖水的深蓝色。"),
      p("**用细节法线扭曲倒影**：用世界空间 XZ 坐标和时间偏移采样法线贴图，将解码后的法线 XY 分量加到屏幕 UV 上。偏移强度除以裁剪空间 W，使近处倒影有细碎波纹，远处扭曲逐渐减弱。"),
      p("**将倒影晕染成竖向条纹**：沿竖向偏移反射纹理的采样位置，并加入横向随机扰动。将 12 次采样按距离加权合并，离原始 UV 越远权重越低，再与原始反射混合，形成边缘柔和、宽窄不一的晕染条纹。"),
      p("**从反射中排除树木描边**：树木外扩的描边会在镜像视图中形成大片棕色形状，因此让反射相机跳过描边 Pass，避免这些色块遮挡倒影。"),
    ], "代码与节点", notes.reflection),
    panel('color', "02 / 深度、折射与 Fresnel", [
      figure('depth-color', "深度颜色与折射场景", 'Deep blue water fading into visible shallow terrain.'),
      figure('fresnel-composite', "叠加晕染后的反射", 'Smeared tree reflections combined with deep blue water.'),
    ], [
      p("**扭曲水下场景以模拟折射**：复用细节法线的 XY 分量，乘以独立的水下扭曲强度，偏移屏幕 UV 后采样不透明场景颜色。这样可以单独控制水下地形的变形幅度，不必同时改变倒影的波纹强度。"),
      p("**按视角混合水色与反射**：用固定的世界向上向量与视线方向点乘，计算 Fresnel 权重，再通过幂、强度和偏移参数调整过渡范围。该权重用于混合深蓝色与反射，使俯视时水色更明显，掠射角下倒影更强。"),
      p("**按深度显露水下地形**：从场景深度重建水下位置，取它与水面的世界空间高度差，计算 `saturate(exp(-depth / depthRange))`。这个权重随水深增加而减小，使浅水区混入更多折射后的场景颜色，深处则保留水色与反射。"),
    ], "ASE 节点", notes.color),
    panel('foam', "03 / 岸边浮沫", [
      figure('foam-camera-depth', "调整前 · 相机深度包含草", 'Pale foam artifacts spread through the shoreline grass.'),
      figure('foam-filtered-depth', "调整后 · 独立浮沫深度", 'Cleaner bank-shaped foam with shoreline grass retained.'),
    ], [
      p("**排除草对浮沫分布的干扰**：相机深度中的草会让每片草叶周围都产生浮沫。单独渲染一张排除草的深度纹理，让浮沫沿岸边分布。"),
      p("**生成断续移动的岸边浮沫**：从筛选后的深度中重建岸边高度，与水面高度比较。用高度差生成正弦带，再通过动态噪声将其打散成移动的斑块。"),
    ], "代码与节点", notes.foam),
    panel('motion', "04 / 水面运动", [], [
      p("**用 Gerstner 波驱动水面与漂浮物**：用单个波移动水面顶点，改变岸边水面与草地的接触区域，以及玩家入水时看到的水线，增强水的动态感。天鹅等漂浮物采样同一个波，以跟随水面起伏和倾斜。"),
      p("**将波浪位移与表面着色分离**：我没有用波浪引起的顶点位移和法线变化驱动反射、折射扭曲及 Fresnel。这是因为水面网格面数较低时，让波浪影响表面着色会使重复规律过于明显。"),
      p("**参考：** [Jasper Flick / Catlike Coding · Waves](https://catlikecoding.com/unity/tutorials/flow/waves/) —— Gerstner 波代码，本项目将陡峭度乘以 0.01。[代码许可：MIT-0](https://catlikecoding.com/unity/tutorials/license/)。"),
    ], "ASE 节点", notes.motion),
  ],
};
