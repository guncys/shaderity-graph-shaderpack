// <SGSP> NodeName: Vec2 to Vec4
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector2ToVector4(
  in vec2 inVec,
  out vec4 outVec
) {
  outVec.xy = inVec;
  outVec.z = 0.0;
  outVec.w = 0.0;
}
