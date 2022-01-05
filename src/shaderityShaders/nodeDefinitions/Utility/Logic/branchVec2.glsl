// <SGSP> NodeName: Branch Vec2
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outVec2 out
void branchVec2(in vec2 A, in vec2 B, in bool boolean, out vec2 outVec2) {
  if (boolean) {
    outVec2 = A;
  } else {
    outVec2 = B;
  }
}
