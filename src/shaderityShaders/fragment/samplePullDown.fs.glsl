// <SGSP> NodeName: PullDown GUI Sample
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> GUIMode: PullDown
// <SGSP> UniqueUniformVariable: u_uniformMat4

// Note: The global precision specification will be removed in shader pack loader.
//       This specification may be necessary to avoid errors when using the Linter for GLSL fragment shaders.
precision highp float;

// Note: Only "enable" extension behavior is supported.
//       No matter which behavior you choose, the behavior will be "enable".
#extension GL_OES_standard_derivatives : enable

// Note: The return type of a function, the function name and the beginning of argument brackets('(')
//       must be filled in on one line.
// <SGSP> PullDownStr: optionA
void samplePullDown_0(in vec4 inVec4, in vec4 v_varyingVec4, in mat4 u_uniformMat4, out vec4 outVec4) {
  outVec4 = inVec4;
}

// <SGSP> PullDownStr: optionB
void samplePullDown_1(in vec4 inVec4, in vec4 v_varyingVec4, in mat4 u_uniformMat4, out vec4 outVec4) {
  outVec4 = dFdx(v_varyingVec4) + inVec4;
}

// <SGSP> PullDownStr: optionC
void samplePullDown_2(in vec4 inVec4, in vec4 v_varyingVec4, in mat4 u_uniformMat4, out vec4 outVec4) {
  outVec4 = u_uniformMat4 * inVec4;
}

