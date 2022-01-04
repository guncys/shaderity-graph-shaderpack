// <SGSP> NodeName: Float to Vec3
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void floatToVector3(
  in float inVec,
  out vec3 outVec
) {
  outVec.x = inVec;
  outVec.y = inVec;
  outVec.z = inVec;
}
