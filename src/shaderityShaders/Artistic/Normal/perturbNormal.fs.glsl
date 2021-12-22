// <SGSP> NodeName: Perturb Normal
// <SGSP> Category: Artistic Normal
// <SGSP> AvailableShaderStage: Fragment

#extension GL_OES_standard_derivatives: enable

precision highp float;

// <SGSP> SocketName: outNormalTex out

  // This is based on http://www.thetenthplanet.de/archives/1180
mat3 perturbNormal_cotangentFrame(vec3 normalInWorld, vec3 position, vec2 uv) {
  uv = gl_FrontFacing ? uv : -uv;

  // get edge vectors of the pixel triangle
  vec3 dp1 = dFdx(position);
  vec3 dp2 = dFdy(position);
  vec2 duv1 = dFdx(uv);
  vec2 duv2 = dFdy(uv);

  // solve the linear system
  vec3 dp2perp = cross(dp2, normalInWorld);
  vec3 dp1perp = cross(normalInWorld, dp1);
  vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
  vec3 bitangent = dp2perp * duv1.y + dp1perp * duv2.y;
  bitangent *= -1.0;

  // construct a scale-invariant frame
  float invMat = inversesqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));
  return mat3(tangent * invMat, bitangent * invMat, normalInWorld);
}

// <SGSP> SocketName: normalInWorld normal in world
// <SGSP> SocketName: normalTex tex
// <SGSP> SocketName: viewVector view vector
// <SGSP> SocketName: normalUv uv
// <SGSP> SocketName: outNormalInWorld out
void perturbNormal(
  in vec3 normalInWorld,
  in vec3 normalTex,
  in vec3 viewVector,
  in vec2 normalUv,
  out vec3 outNormalInWorld
) {
  mat3 tbnMatTangentToWorld = perturbNormal_cotangentFrame(normalInWorld, -viewVector, normalUv);
  outNormalInWorld = normalize(tbnMatTangentToWorld * normalTex);
}
