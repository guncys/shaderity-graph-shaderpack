// <SGSP> NodeName: Branch Vec4
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outVec4 out
void branchVec4(in vec4 A, in vec4 B, in bool boolean, out vec4 outVec4) {
  if (boolean) {
    outVec4 = A;
  } else {
    outVec4 = B;
  }
}
