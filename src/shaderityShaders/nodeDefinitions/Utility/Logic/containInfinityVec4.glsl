// <SGSP> NodeName: Contain Infinity Vec4
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec4 in
// <SGSP> SocketName: outBool out
void containInfinityVec4(in vec4 inVec4, out bool outBool) {
  outBool = ((inVec4.x != 0.0) && (inVec4.x * 2.0 == inVec4.x)) ||
            ((inVec4.y != 0.0) && (inVec4.y * 2.0 == inVec4.y)) ||
            ((inVec4.z != 0.0) && (inVec4.z * 2.0 == inVec4.z)) ||
            ((inVec4.w != 0.0) && (inVec4.w * 2.0 == inVec4.w));
}
