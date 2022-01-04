// <SGSP> NodeName: Combine Vector4
// <SGSP> Category: Channel Combine

// <SGSP> SocketName: outVec4 out
void combineVector4(
  in float x,
  in float y,
  in float z,
  in float w,
  out vec4 outVec4
) {
  outVec4.x = x;
  outVec4.y = y;
  outVec4.z = z;
  outVec4.w = w;
}
