// <SGSP> NodeName: Mat4 to Mat3
// <SGSP> Category: Channel RemoveElements

// <SGSP> SocketName: inMat in
// <SGSP> SocketName: outMat out
void mat4ToMat3(
  in mat4 inMat,
  out mat3 outMat
) {
  outMat[0][0] = inMat[0][0];
  outMat[0][1] = inMat[0][1];
  outMat[0][2] = inMat[0][2];
  outMat[1][0] = inMat[1][0];
  outMat[1][1] = inMat[1][1];
  outMat[1][2] = inMat[1][2];
  outMat[2][0] = inMat[2][0];
  outMat[2][1] = inMat[2][1];
  outMat[2][2] = inMat[2][2];
}
