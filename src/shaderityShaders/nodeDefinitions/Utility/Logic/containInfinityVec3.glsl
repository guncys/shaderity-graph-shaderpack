// <SGSP> NodeName: Contain Infinity Vec3
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec3 in
// <SGSP> SocketName: outBool out
void containInfinityVec3(in vec3 inVec3, out bool outBool) {
  outBool = ((inVec3.x != 0.0) && (inVec3.x * 2.0 == inVec3.x)) ||
            ((inVec3.y != 0.0) && (inVec3.y * 2.0 == inVec3.y)) ||
            ((inVec3.z != 0.0) && (inVec3.z * 2.0 == inVec3.z));
}
