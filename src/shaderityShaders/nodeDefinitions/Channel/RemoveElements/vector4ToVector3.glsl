// <SGSP> NodeName: Vec4 to Vec3
// <SGSP> Category: Channel RemoveElements

// <SGSP> SocketName: inVec in
// <SGSP> SocketName: outVec out
void vector4ToVector3(
  in vec4 inVec,
  out vec3 outVec
) {
  outVec = inVec.xyz;
}
