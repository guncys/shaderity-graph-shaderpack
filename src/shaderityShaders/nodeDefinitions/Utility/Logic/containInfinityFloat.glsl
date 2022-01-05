// <SGSP> NodeName: Contain Infinity Float
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inFloat in
// <SGSP> SocketName: outBool out
void containInfinityFloat(in float inFloat, out bool outBool) {
  outBool = (inFloat != 0.0) && (inFloat * 2.0 == inFloat);
}
