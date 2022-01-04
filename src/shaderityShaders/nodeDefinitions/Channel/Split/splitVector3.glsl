// <SGSP> NodeName: Split Vector3
// <SGSP> Category: Channel Split

// <SGSP> SocketName: inVec3 in
void splitVector3(
  in vec3 inVec3,
  out float outX,
  out float outY,
  out float outZ
) {
  outX = inVec3.x;
  outY = inVec3.y;
  outZ = inVec3.z;
}
