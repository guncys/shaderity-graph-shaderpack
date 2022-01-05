// <SGSP> NodeName: Contain NaN Vec2
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec2 in
// <SGSP> SocketName: outBool out
void containNaNVec2(in vec2 inVec2, out bool outBool) {
  outBool = !( inVec2.x < 0.0 || 0.0 < inVec2.x || inVec2.x == 0.0 ) ||
            !( inVec2.y < 0.0 || 0.0 < inVec2.y || inVec2.y == 0.0 );
}
