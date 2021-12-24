// <SGSP> NodeName: Or
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outBool out
void or(in bool A, in bool B, out bool outBool) {
  if (A || B) {
    outBool = true;
  } else {
    outBool = false;
  }
}
