// <SGSP> NodeName: Branch Vec3
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outVec3 out
void branchVec3(in vec3 A, in vec3 B, in bool boolean, out vec3 outVec3) {
  if (boolean) {
    outVec3 = A;
  } else {
    outVec3 = B;
  }
}
