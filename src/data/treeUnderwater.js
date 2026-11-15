import images from './treeUnderwaterImages.json';

const p = (text) => ({ type: 'paragraph', text });
const figure = (name, caption, alt) => ({ type: 'figure', ...images[name], caption, alt });
const graph = (name, caption, alt) => ({ ...figure(name, caption, alt), naturalSize: true });
const code = (caption, text) => ({ type: 'code', language: 'HLSL', caption, code: text });
const panel = (id, title, media, blocks, detailBlocks, mediaLayout) => ({
  type: 'technical-panel', id: `tree-underwater-${id}`, title, media, blocks, mediaLayout,
  ...(detailBlocks ? { detail: { type: 'details', title: id === 'reflection' ? 'ASE Nodes' : 'Code', blocks: detailBlocks } } : {}),
});

// Author's November 4 captures; checked against PengArt's current water shaders,
// WaterlineRendererFeature, WaterVolumeMeshCache and FogFirstPersonController.
export const treeUnderwaterRendering = {
  id: 'underwater-waterline',
  title: 'Underwater & Waterline',
  layout: 'compact',
  lang: 'en',
  blocks: [
    panel('layers', '01 / Water Underside', [
      figure('underside', '01 · Water underside', 'The gradient-colored water underside, with underwater terrain and grass still clearly visible.'),
    ], [
      p('**Simplifying the underside for its visible area**: Players stay near the surface after entering the water, so its underside occupies only a small part of the view. There are no scenes viewed from deeper underwater looking up. I therefore represent the underside with a color gradient, omitting full underwater reflection and refraction calculations.'),
    ]),
    panel('waterline', '02 / Wave-Following Waterline', [
      figure('waterline', '02 · With the waterline', 'The waterline added along the boundary, with underwater terrain and grass still clear.'),
    ], [
      p('**Generating an underwater mask**: Use the water surface mesh as the top of a closed volume, adding sides and a bottom. Apply the same Gerstner wave displacement to its top. A separate render pass classifies whether each pixel’s position on the camera’s near clipping plane lies inside the water and writes the result to a screen-space mask.'),
      p('**Extracting the waterline**: Sample the mask at the current pixel and its four axial neighbors, then subtract the minimum value from the maximum to find the boundary. Average the results at two sampling radii to control line width and edge softness, then apply the line color and opacity over the scene.'),
    ], [
      p('**Classifying the water volume**: Render both sides of the closed mesh with a separate depth buffer to retain the nearest intersection beyond the near clipping plane. A back face at that intersection indicates a ray exiting the water from inside. Store this flag in R and the intersection’s view-space depth in G.'),
      code('WaterVolumeMask.shader · Volume classification', `float4 Frag(Varyings Input, FRONT_FACE_TYPE Face : FRONT_FACE_SEMANTIC) : SV_Target
{
    return float4(IS_FRONT_VFACE(Face, 0.0, 1.0), Input.eyeDepth, 0, 0);
}`),
      code('WaterlineOverlay.shader · Mask edges', `float MaskEdge(float2 UV, float Radius, float Center)
{
    float2 Pixel = Radius / _ScaledScreenParams.xy;
    float Minimum = Center, Maximum = Center;
    float4 Neighbours = float4(WaterInfo(UV + float2(Pixel.x, 0)).r,
        WaterInfo(UV - float2(Pixel.x, 0)).r,
        WaterInfo(UV + float2(0, Pixel.y)).r,
        WaterInfo(UV - float2(0, Pixel.y)).r);
    Minimum = min(Minimum, min(min(Neighbours.x, Neighbours.y), min(Neighbours.z, Neighbours.w)));
    Maximum = max(Maximum, max(max(Neighbours.x, Neighbours.y), max(Neighbours.z, Neighbours.w)));
    return Maximum - Minimum;
}

float HalfWidth = max(0.5, 0.5 * _WaterlineSettings.x);
float LineMask = 0.5 * (MaskEdge(UV, HalfWidth, UnderWaterMask)
    + MaskEdge(UV, HalfWidth + _WaterlineSettings.y, UnderWaterMask));
half LineAlpha = LineMask * _WaterlineColor.a;`),
    ]),
    panel('turbidity', '03 / Underwater Distance Fog', [
      figure('turbidity', '03 · With underwater distance fog', 'Blue-green distance fog added beneath the waterline, fading distant underwater scenery into the water color.'),
    ], [
      p('**Measuring the underwater ray length**: Within the underwater mask, read the scene depth and water-exit depth and use the nearer endpoint. Subtract the near clipping distance, then account for the viewing direction to convert view-space depth into distance along the ray.'),
      p('**Blending fog color by distance**: Calculate the blend weight with `1 - exp(-density * max(0, distance - startDistance))` to fade the scene toward blue-green. The start distance preserves nearby grass details, density controls how quickly distant scenery fades, and maximum opacity limits the final obscuration.'),
    ], [
      code('WaterlineOverlay.shader · Underwater distance and exponential attenuation', `float SceneEyeDepth = LinearEyeDepth(SampleSceneDepth(UV), _ZBufferParams);
float3 NearWS = ComputeWorldSpacePosition(UV, UNITY_NEAR_CLIP_VALUE, UNITY_MATRIX_I_VP);
float RayScale = length(NearWS - _WorldSpaceCameraPos) / max(_ProjectionParams.y, 0.00001);
float WaterDistance = max(0.0, min(SceneEyeDepth, Water.g) - _ProjectionParams.y) * RayScale;
half FogAmount = min(_WaterlineFog.z,
    1.0 - exp(-_WaterlineFog.x * max(0.0, WaterDistance - _WaterlineFog.y)));
Scene = lerp(Scene, _WaterlineFogColor.rgb, FogAmount);`),
    ]),
    panel('reflection', '04 / Reflections Near the Waterline', [
      figure('reflection-last', 'Comparison · Blend depth colors, then reflection', 'Adding reflection last leaves strong reflection detail in the shallow shoreline water.'),
      figure('shallow-last', 'Selected · Blend water and reflection, then shallow color', 'Adding shallow-water color last creates a softer transition between visible terrain and the water surface.'),
    ], [
      p('**Changing the blend order**: Blending deep and shallow colors before adding reflection made the shoreline look busy, with reflections overlapping underwater detail. I instead blend deep-water color with reflection using Fresnel, then add refracted scene color according to water depth, revealing more terrain in shallow areas.'),
      p('**Reflections overridden near the waterline**: Adding refracted color last also weakens the reflection. When the shallow-water weight becomes too high near the waterline, refraction overrides the reflection even with a Fresnel weight close to 1.'),
      {
        type: 'figure-gallery', media: [
          figure('grazing-before', 'Before · Reflection overridden near the waterline', 'An unwanted dark refraction result appears across the narrow surface band near the waterline.'),
          figure('grazing-after', 'After · Restored reflection-dominant surface', 'Reflections restored to the narrow surface band while retaining the underwater effects.'),
        ],
      },
      p('**Controlling the correction by height and viewing angle**: Derive a proximity weight from the camera’s distance to the base water height and a grazing-angle weight from `1 - saturate(dot(float3(0, 1, 0), ViewDirWS))`. Shape each transition with `smoothstep` and multiply the weights. As the camera approaches the surface and the view becomes nearly horizontal, blend toward the reflection color; elsewhere, retain the original blend.'),
      p('**Adding an off-white fill near the waterline**: I excluded the white skybox from the reflection texture, leaving a black background to preserve the painting’s deep blue water when viewed from shore. Displaying that texture directly after entering the water produced harsh black areas near the waterline. I blend dark reflection areas toward an off-white color in the correction branch to achieve the intended look from this viewpoint.'),
    ], [
      p('**Filling dark reflection areas**: Take the reflection texture’s maximum RGB component, remap it with `smoothstep`, and invert the result to blend between the reflection and fill colors. Dark areas receive more fill while brighter areas retain the reflection.'),
      graph('graph-grazing-correction', 'Reflection color and dark-area fill', 'ASE nodes using the reflection texture’s maximum RGB component and Smoothstep to control the fill, producing GrazeLook.'),
      graph('graph-composition', 'Combining the original blend and waterline correction', 'ASE nodes blending OriginalLook with GrazeLook using Correction, then adding foam color.'),
    ]),
  ],
};
