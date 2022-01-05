// <SGSP> NodeName: Discard Vec2
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec2 in
// <SGSP> SocketName: outVec2 out
void discardVec2(in vec2 inVec2, in bool boolean, out vec2 outVec2) {
  if (boolean) {
    discard;
  } else {
    outVec2 = inVec2;
  }
}
