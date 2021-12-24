// <SGSP> NodeName: Branch Float
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outFloat out
void branchFloat(in float A, in float B, in bool boolean, out float outFloat) {
  if (boolean) {
    outFloat = A;
  } else {
    outFloat = B;
  }
}
