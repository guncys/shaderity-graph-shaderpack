// <SGSP> NodeName: Occlusion Strength
// <SGSP> Category: Artistic Occlusion

// <SGSP> SocketName: outOcclusion out
void occlusionStrength(in float occlusion, in float strength, out float outOcclusion) {
  outOcclusion = 1.0 + strength * (occlusion - 1.0);
}
