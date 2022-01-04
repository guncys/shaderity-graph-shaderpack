// <SGSP> NodeName: Float to Vec4
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void floatToVector4(
  in float inVec,
  out vec4 outVec
) {
  outVec.x = inVec;
  outVec.y = inVec;
  outVec.z = inVec;
  outVec.w = inVec;
}
