// <SGSP> NodeName: Contain NaN Vec3
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec3 in
// <SGSP> SocketName: outBool out
void containNaNVec3(in vec3 inVec3, out bool outBool) {
  outBool = !( inVec3.x < 0.0 || 0.0 < inVec3.x || inVec3.x == 0.0 ) ||
            !( inVec3.y < 0.0 || 0.0 < inVec3.y || inVec3.y == 0.0 ) ||
            !( inVec3.z < 0.0 || 0.0 < inVec3.z || inVec3.z == 0.0 );
}
