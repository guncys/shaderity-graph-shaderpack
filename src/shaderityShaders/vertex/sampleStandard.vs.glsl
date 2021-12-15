// <SGSP> NodeName: Standard GUI Sample
// <SGSP> AvailableShaderStage: Vertex
// <SGSP> GUIMode: Standard

vec3 sampleStandard_subFuncA(in vec3 inVec3) {
  return inVec3 * 2.0;
}

vec3 sampleStandard_subFuncB(in vec3 inVec3A, in vec3 inVec3B) {
  return inVec3A + inVec3B;
}

void sampleStandard(in vec3 inVec3, in vec3 a_varyingVec3, in float u_uniformFloat, out vec3 outVec3) {
  vec3 tmp0 = inVec3 * u_uniformFloat;
  vec3 tmp1 = sampleStandard_subFuncA(tmp0);
  outVec3 = sampleStandard_subFuncB(a_varyingVec3, tmp1);
}
