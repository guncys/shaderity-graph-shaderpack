// <SGSP> NodeName: Front Facing
// <SGSP> Category: Utility Logic

precision highp float;

// <SGSP> SocketName: outBool out
void frontFacing(out bool outBool) {
  outBool = gl_FrontFacing;
}
