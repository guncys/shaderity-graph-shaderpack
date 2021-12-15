// <SGSP> NodeName: Color
// <SGSP> GUIMode: SetVector

// <SGSP> SocketName: outVec4 vector4
// <SGSP> SetVector_Descriptions: u_inVec4 r g b a
// <SGSP> SetVector_DefaultValues: u_inVec4 0 0 0 1.0
void uniformColor(in vec4 u_inVec4, out vec4 outVec4) {
  outVec4 = u_inVec4;
}
