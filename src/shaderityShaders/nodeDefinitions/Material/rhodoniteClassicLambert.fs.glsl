// <SGSP> NodeName: Rhodonite Classic Lambert Model
// <SGSP> Category: Material
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> SharingUniformVariable: u_viewPosition u_lightNumber u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */]

precision highp float;

// <SGSP> SocketName: outColor out
void rhodoniteClassicLambert(
  in vec3 u_viewPosition,
  in int u_lightNumber,
  in vec4 u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 positionInWorld,
  in vec3 normalInWorld,
  in vec4 diffuseColor,
  in float shininess,
  out vec4 outColor
) {
  // Lighting
  vec3 diffuse = vec3(0.0, 0.0, 0.0);
  for (int i = 0; i < /* shaderity: @{Config.maxLightNumberInShader} */ ; i++) {
    if (i >= u_lightNumber) {
      break;
    }

    vec4 gotLightDirection = u_lightDirection[i];
    vec4 gotLightPosition = u_lightPosition[i];
    vec4 gotLightIntensity = u_lightIntensity[i];
    vec3 lightDirection = gotLightDirection.xyz;
    vec3 lightIntensity = gotLightIntensity.xyz;
    vec3 lightPosition = gotLightPosition.xyz;
    float lightType = gotLightPosition.w;
    float spotCosCutoff = gotLightDirection.w;
    float spotExponent = gotLightIntensity.w;

    if (0.75 < lightType) { // is pointlight or spotlight
      lightDirection = normalize(lightPosition - positionInWorld.xyz);
    }
    float spotEffect = 1.0;
    if (lightType > 1.75) { // is spotlight
      spotEffect = dot(gotLightDirection.xyz, lightDirection);
      if (spotEffect > spotCosCutoff) {
        spotEffect = pow(spotEffect, spotExponent);
      } else {
        spotEffect = 0.0;
      }
    }

    vec3 incidentLight = spotEffect * lightIntensity;

    diffuse += diffuseColor.rgb * max(0.0, dot(normalInWorld, lightDirection)) * incidentLight;
  }

  outColor = vec4(diffuse, diffuseColor.a);
}
