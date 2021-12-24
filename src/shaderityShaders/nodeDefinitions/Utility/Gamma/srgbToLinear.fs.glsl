// <SGSP> NodeName: Srgb To Linear
// <SGSP> Category: Utility Gamma
// <SGSP> AvailableShaderStage: Fragment

precision highp float;

// <SGSP> SocketName: srgb in
// <SGSP> SocketName: linear out
void srgbToLinear(in vec4 srgb, out vec4 linear) {
  linear.rgb = pow(srgb.rgb, vec3(2.2));
  linear.a = srgb.a;
}
