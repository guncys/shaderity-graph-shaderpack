// <SGSP> NodeName: And
// <SGSP> Category: Utility Logic

// <SGSP> SocketName: outBoolean out
void and(in bool A, in bool B, out bool outBoolean) {
  if (A && B) {
    outBoolean = true;
  } else {
    outBoolean = false;
  }
}
