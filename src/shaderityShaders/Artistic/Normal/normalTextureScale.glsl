// <SGSP> NodeName: Normal Texture Scale
// <SGSP> Category: Artistic Normal

// <SGSP> SocketName: normalTex tex
// <SGSP> SocketName: outNormalTex out
void normalTextureScale(in vec3 normalTex, in float scale, out vec3 outNormalTex) {
  outNormalTex = normalize(normalTex * vec3(scale, scale, 1.0));
}
