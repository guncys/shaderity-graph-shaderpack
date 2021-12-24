// <SGSP> NodeName: Discard Vec4
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec4 in
// <SGSP> SocketName: outVec4 out
void discardVec4(in vec4 inVec4, in bool boolean, out vec4 outVec4) {
  if (boolean) {
    discard;
  } else {
    outVec4 = inVec4;
  }
}
