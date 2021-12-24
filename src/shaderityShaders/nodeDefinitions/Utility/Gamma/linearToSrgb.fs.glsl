// <SGSP> NodeName: Linear To Srgb
// <SGSP> Category: Utility Gamma
// <SGSP> AvailableShaderStage: Fragment

precision highp float;

// <SGSP> SocketName: linear in
// <SGSP> SocketName: srgb out
void linearToSrgb(in vec4 linear, out vec4 srgb) {
  srgb.rgb = pow(linear.rgb, vec3(1.0/2.2));
  srgb.a = linear.a;
}
