// <SGSP> NodeName: And
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outBool out
void and(in bool A, in bool B, out bool outBool) {
  if (A && B) {
    outBool = true;
  } else {
    outBool = false;
  }
}
