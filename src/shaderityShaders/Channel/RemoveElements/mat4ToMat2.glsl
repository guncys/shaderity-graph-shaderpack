// <SGSP> NodeName: Mat4 to Mat2
// <SGSP> Category: Channel RemoveElements

// <SGSP> SocketName: inMat in
// <SGSP> SocketName: outMat out
void mat4ToMat2(
  in mat4 inMat,
  out mat2 outMat
) {
  outMat[0][0] = inMat[0][0];
  outMat[0][1] = inMat[0][1];
  outMat[1][0] = inMat[1][0];
  outMat[1][1] = inMat[1][1];
}
