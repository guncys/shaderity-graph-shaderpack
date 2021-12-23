// <SGSP> NodeName: Fragment Color
// <SGSP> Category: Utility Output
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> GUIMode: Standard

precision highp float;

// <SGSP> SocketName: inVec4 color
// <SGSP> ShaderOutputSocket: outVec4
void fragmentColor(in vec4 inVec4, out vec4 outVec4) {
  outVec4 = inVec4;
}
