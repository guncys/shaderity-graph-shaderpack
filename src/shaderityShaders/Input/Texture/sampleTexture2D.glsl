// <SGSP> NodeName: Sample Texture 2D
// <SGSP> Category: Input Texture
// <SGSP> GUIMode: PullDown

// <SGSP> SocketName: tex texture2D
// <SGSP> SocketName: outVec4 vector4

// <SGSP> PullDown_Description: Type

// <SGSP> PullDown_DisplayName: Standard
void sampleTexture2D_standard(in sampler2D tex, in vec2 uv, out vec4 outVec4) {
  outVec4 = texture(tex, uv);
}

// <SGSP> PullDown_DisplayName: Normal
void sampleTexture2D_normal(in sampler2D tex, in vec2 uv, out vec4 outVec4) {
  vec4 raw = texture(tex, uv);
  outVec4 = raw * 2.0 - 1.0;
}
