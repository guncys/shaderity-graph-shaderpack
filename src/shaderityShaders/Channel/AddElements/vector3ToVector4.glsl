// <SGSP> NodeName: Vec3 to Vec4
// <SGSP> Category: Channel AddElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector3ToVector4(
  in vec3 inVec,
  out vec4 outVec
) {
  outVec.xyz = inVec;
  outVec.w = 0.0;
}
