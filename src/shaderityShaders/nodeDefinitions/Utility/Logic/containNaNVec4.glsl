// <SGSP> NodeName: Contain NaN Vec4
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec4 in
// <SGSP> SocketName: outBool out
void containNaNVec4(in vec4 inVec4, out bool outBool) {
  outBool = !( inVec4.x < 0.0 || 0.0 < inVec4.x || inVec4.x == 0.0 ) ||
            !( inVec4.y < 0.0 || 0.0 < inVec4.y || inVec4.y == 0.0 ) ||
            !( inVec4.z < 0.0 || 0.0 < inVec4.z || inVec4.z == 0.0 ) ||
            !( inVec4.w < 0.0 || 0.0 < inVec4.w || inVec4.w == 0.0 );
}
