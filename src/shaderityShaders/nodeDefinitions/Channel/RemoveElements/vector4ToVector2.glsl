// <SGSP> NodeName: Vec4 to Vec2
// <SGSP> Category: Channel RemoveElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector4ToVector2(
  in vec4 inVec,
  out vec2 outVec
) {
  outVec = inVec.xy;
}
