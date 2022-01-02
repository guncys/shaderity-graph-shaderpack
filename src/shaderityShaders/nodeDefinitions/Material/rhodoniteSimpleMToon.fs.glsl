// <SGSP> NodeName: Simple MToon with no outline
// <SGSP> Category: Material
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> SharingUniformVariable: u_viewPosition u_lightNumber u_cameraUp u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */]

precision highp float;

// <SGSP> SocketName: outColor linearColor
void rhodoniteSimpleMToon(
  in vec3 u_viewPosition,
  in int u_lightNumber,
  in vec3 u_cameraUp,
  in vec4 u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 positionInWorld,
  in vec3 normalInWorld,
  in vec4 litColor,
  in vec3 shadeColor,
  in float shadingShift,
  in float shadingToony,
  in float lightColorAttenuation,
  in float shadowReceiveMultiplier, // factor * texture value
  in float litAndShadowMixingMultiplier, // factor * (1.0 - texture value)
  in vec3 ambientColor, // instead of toonedGI
  in float rimFresnelPower,
  in float rimLift,
  in vec3 rimColor,
  in vec3 matCapColor,
  in vec3 emissionColor,
  in float rimLightingMix,
  in bool isAlphaBlend,
  out vec4 outColor
) {
  float EPS_COL = 0.00001;
  outColor = vec4(0.0, 0.0, 0.0, litColor.a);

  // lighting
  float shadowAttenuation = 1.0;
  // TODO: shadow map computation

  float lightAttenuation = shadowAttenuation * mix(1.0, shadowAttenuation, shadowReceiveMultiplier);
  float shadingGrade = 1.0 - litAndShadowMixingMultiplier;

  vec3 lightings[/* shaderity: @{Config.maxLightNumberInShader} */];
  for (int i = 0; i < /* shaderity: @{Config.maxLightNumberInShader} */; i++) {
    if (i >= u_lightNumber) {
      break;
    }

    // Rn_Light
    vec4 gotLightDirection = u_lightDirection[i];
    vec4 gotLightIntensity = u_lightIntensity[i]; //light color
    vec4 gotLightPosition = u_lightPosition[i];
    vec3 lightDirection = gotLightDirection.xyz;
    vec3 lightColor = gotLightIntensity.xyz;
    vec3 lightPosition = gotLightPosition.xyz;
    float lightType = gotLightPosition.w;
    float spotCosCutoff = gotLightDirection.w;
    float spotExponent = gotLightIntensity.w;

    float distanceAttenuation = 1.0;
    if (lightType > 0.75) { // is point light or spot light
      lightDirection = normalize(lightPosition.xyz - positionInWorld.xyz);

      float distance = dot(lightPosition - positionInWorld.xyz, lightPosition - positionInWorld.xyz);
      distanceAttenuation = 1.0 / pow(distance, 2.0);
    }

    float spotEffect = 1.0;
    if (lightType > 1.75) { // is spotlight
      spotEffect *= dot(gotLightDirection.xyz, lightDirection);
      if (spotEffect > spotCosCutoff) {
        spotEffect *= pow(clamp(spotEffect, 0.0, 1.0), spotExponent);
      } else {
        spotEffect = 0.0;
      }
    }

    // lightAttenuation *= distanceAttenuation * spotEffect;
    float dotNL = dot(lightDirection, normalInWorld);
    float lightIntensity = dotNL * 0.5 + 0.5; // from [-1, +1] to [0, 1]
    lightIntensity = lightIntensity * lightAttenuation; // TODO: receive shadow
    lightIntensity = lightIntensity * shadingGrade; // darker
    lightIntensity = lightIntensity * 2.0 - 1.0; // from [0, 1] to [-1, +1]

    // tooned. mapping from [minIntensityThreshold, maxIntensityThreshold] to [0, 1]
    float maxIntensityThreshold = mix(1.0, shadingShift, shadingToony);
    float minIntensityThreshold = shadingShift;
    lightIntensity = clamp((lightIntensity - minIntensityThreshold) / max(EPS_COL, (maxIntensityThreshold - minIntensityThreshold)), 0.0, 1.0);

    // Albedo color
    vec3 col = mix(shadeColor, litColor.rgb, lightIntensity);

    // Direct Light
    vec3 lighting = mix(
      lightColor,
      vec3(max(EPS_COL, max(lightColor.x, max(lightColor.y, lightColor.z)))),
      lightColorAttenuation
    ); // color attenuation


    if (i > 0) {
      lighting *= 0.5; // darken if additional light.
      lighting *= min(0.0, dotNL) + 1.0; // darken dotNL < 0 area by using half lambert
      // lighting *= shadowAttenuation; // darken if receiving shadow
      if (isAlphaBlend) {
        lighting *= step(0.0, dotNL); // darken if transparent. Because Unity's transparent material can't receive shadowAttenuation.
      }
    }

    col *= lighting;
    lightings[i] = lighting;

    outColor.rgb += col;

    lightAttenuation = 1.0;
  }

  // Indirect Light
  vec3 indirectLighting = mix(
    ambientColor,
    vec3(max(EPS_COL, max(ambientColor.x, max(ambientColor.y, ambientColor.z)))),
    lightColorAttenuation
  ); // color attenuation
  // TODO: use ShadeIrad in www.ppsloan.org/publications/StupidSH36.pdf

  outColor.rgb += indirectLighting * litColor.rgb;
  outColor.rgb = min(outColor.rgb, litColor.rgb); // comment out if you want to PBR absolutely.

  // rim
  vec3 viewVector = u_viewPosition - positionInWorld.xyz;
  vec3 viewDirection = normalize(viewVector);

  vec3 rim = pow(clamp(1.0 - dot(normalInWorld, viewDirection) + rimLift, 0.0, 1.0), rimFresnelPower) * rimColor;

  float staticRimLighting = 1.0;
  for (int i = 0; i < /* shaderity: @{Config.maxLightNumberInShader} */; i++) {
    if (i >= u_lightNumber) break;

    if(i > 0) staticRimLighting = 0.0;

    vec3 rimLighting = mix(vec3(staticRimLighting), lightings[i], vec3(rimLightingMix));
    outColor.rgb += rim * rimLighting;
  }

  // additive mat cap
  outColor.rgb += matCapColor;

  // Emission
  outColor.rgb += emissionColor;

}
