// <SGSP> NodeName: Discard Float
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: inFloat in
// <SGSP> SocketName: outFloat out
void discardFloat(in float inFloat, in bool boolean, out float outFloat) {
  if (boolean) {
    discard;
  } else {
    outFloat = inFloat;
  }
}
