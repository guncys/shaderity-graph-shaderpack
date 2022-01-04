// <SGSP> NodeName: Vec2 to Vec3
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector2ToVector3(
  in vec2 inVec,
  out vec3 outVec
) {
  outVec.xy = inVec;
  outVec.z = 0.0;
}
