// <SGSP> NodeName: Mat3 to Mat4
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inMat in
// <SGSP> SocketName: outMat out
void mat3ToMat4(
  in mat3 inMat,
  out mat4 outMat
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

  outMat[0][3] = 0.0;
  outMat[1][3] = 0.0;
  outMat[2][3] = 0.0;
  outMat[3][0] = 0.0;
  outMat[3][1] = 0.0;
  outMat[3][2] = 0.0;
  outMat[3][3] = 0.0;
}
