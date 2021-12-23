// <SGSP> NodeName: Vec3 to Vec2
// <SGSP> Category: Channel RemoveElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector3ToVector2(
  in vec3 inVec,
  out vec2 outVec
) {
  outVec = inVec.xy;
}
