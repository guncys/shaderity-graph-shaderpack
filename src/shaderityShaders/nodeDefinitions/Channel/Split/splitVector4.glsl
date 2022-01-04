// <SGSP> NodeName: Split Vector4
// <SGSP> Category: Channel Split

// <SGSP> SocketName: inVec4 in
void splitVector4(
  in vec4 inVec4,
  out float outX,
  out float outY,
  out float outZ,
  out float outW
) {
  outX = inVec4.x;
  outY = inVec4.y;
  outZ = inVec4.z;
  outW = inVec4.w;
}
