// <SGSP> NodeName: Comparison
// <SGSP> Category: Utility Logic
// <SGSP> GUIMode: PullDown

// <SGSP> SocketName: outBool out

// <SGSP> PullDown_Description: type

// <SGSP> PullDown_DisplayName: A > B
void comparison_largerA(in float A, in float B, out bool outBool) {
  outBool = A > B;
}

// <SGSP> PullDown_DisplayName: A >= B
void comparison_largerOrEqualA(in float A, in float B, out bool outBool) {
  outBool = A >= B;
}

// <SGSP> PullDown_DisplayName: A == B
void comparison_equalA(in float A, in float B, out bool outBool) {
  outBool = A == B;
}

// <SGSP> PullDown_DisplayName: A <= B
void comparison_smallerOrEqualA(in float A, in float B, out bool outBool) {
  outBool = A <= B;
}

// <SGSP> PullDown_DisplayName: A < B
void comparison_smallerA(in float A, in float B, out bool outBool) {
  outBool = A < B;
}
