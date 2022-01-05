// <SGSP> NodeName: Discard Vec3
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec3 in
// <SGSP> SocketName: outVec3 out
void discardVec3(in vec3 inVec3, in bool boolean, out vec3 outVec3) {
  if (boolean) {
    discard;
  } else {
    outVec3 = inVec3;
  }
}
