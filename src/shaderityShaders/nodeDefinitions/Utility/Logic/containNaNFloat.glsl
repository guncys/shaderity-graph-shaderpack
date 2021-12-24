// <SGSP> NodeName: Contain NaN Float
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inFloat in
// <SGSP> SocketName: outBool out
void containNaNFloat(in float inFloat, out bool outBool) {
  outBool = !( inFloat < 0.0 || 0.0 < inFloat || inFloat == 0.0 );
}
