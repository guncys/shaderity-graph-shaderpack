// <SGSP> NodeName: Matrix44
// <SGSP> Category: Input Basic
// <SGSP> GUIMode: SetMatrix

// <SGSP> SocketName: outMat4 mat44
// <SGSP> SetMatrix_DefaultValues: 1.0 0 0 0   0 1.0 0 0   0 0 1.0 0   0 0 0 1.0
void uniformMatrix44(in mat4 u_inMat4, out mat4 outMat4) {
  outMat4 = u_inMat4;
}
