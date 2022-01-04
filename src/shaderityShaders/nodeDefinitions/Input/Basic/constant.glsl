// <SGSP> NodeName: Constant
// <SGSP> Category: Input Basic
// <SGSP> GUIMode: PullDown
// <SGSP> SocketName: outConstant out

// <SGSP> PullDown_Description: type

// <SGSP> PullDown_DisplayName: PI
void constant_PI(out float outConstant) {
  outConstant = 3.1415926535;
}

// <SGSP> PullDown_DisplayName: Epsilon
void uniformConstant_Epsilon(out float outConstant) {
  outConstant = 0.0000001;
}

// <SGSP> PullDown_DisplayName: E
void uniformConstant_E(out float outConstant) {
  outConstant = 2.7182818284;
}
