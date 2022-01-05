// <SGSP> NodeName: Contain Infinity Vec2
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inVec2 in
// <SGSP> SocketName: outBool out
void containInfinityVec2(in vec2 inVec2, out bool outBool) {
  outBool = ((inVec2.x != 0.0) && (inVec2.x * 2.0 == inVec2.x)) ||
            ((inVec2.y != 0.0) && (inVec2.y * 2.0 == inVec2.y));
}
