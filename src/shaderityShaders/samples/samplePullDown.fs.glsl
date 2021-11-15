// <SGSP> NodeName: PullDown GUI Sample
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> GUIMode: PullDown
// <SGSP> SharingUniformVariable: u_uniformMat4

// Note: The global precision specification will be removed in shader pack loader.
//       This specification may be necessary to avoid errors when using the Linter for GLSL fragment shaders.
precision highp float;

// Note: Only "enable" extension behavior is supported.
//       No matter which behavior you choose, the behavior will be "enable".
#extension GL_OES_standard_derivatives : enable

// <SGSP> PullDown_Description: description sample

// Note: The return type of a function, the function name and the beginning of argument brackets('(')
//       must be filled in on one line.
// <SGSP> PullDown_DisplayName: option A
void samplePullDown_0(
  in highp vec4 inVec4,
  in vec4 v_varyingVec4,
  in mediump mat4 u_uniformMat4,
  out lowp vec4 outVec4
) {
  outVec4 = inVec4;
}

// <SGSP> PullDown_DisplayName: option B
void samplePullDown_1(
  in highp vec4 inVec4,
  in vec4 v_varyingVec4,
  in mediump mat4 u_uniformMat4,
  out lowp vec4 outVec4
) {
  outVec4 = dFdx(v_varyingVec4) + inVec4;
}

// <SGSP> PullDown_DisplayName: option C
void samplePullDown_2(
  in highp vec4 inVec4,
  in vec4 v_varyingVec4,
  in mediump mat4 u_uniformMat4,
  out lowp vec4 outVec4
) {
  outVec4 = u_uniformMat4 * inVec4;
}

