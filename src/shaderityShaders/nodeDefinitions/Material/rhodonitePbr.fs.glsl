// <SGSP> NodeName: Rhodonite PBR
// <SGSP> Category: Material
// <SGSP> AvailableShaderStage: Fragment
// <SGSP> SharingUniformVariable: u_viewPosition u_lightNumber u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */] u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */] u_iblParameter u_hdriFormat

precision highp float;

#extension GL_EXT_shader_texture_lod: enable

float rhodonitePbr_saturateEpsilonToOne(float x) {
  return clamp(x, 0.0000001, 1.0);
}

// The Schlick Approximation to Fresnel
vec3 rhodonitePbr_fresnel(vec3 f0, float VH) {
  return vec3(f0) + (vec3(1.0) - f0) * pow(1.0 - VH, 5.0);
}

vec3 rhodonitePbr_diffuseBrdf(vec3 albedo) {
  float M_PI = 3.141592653589793;
  return albedo / M_PI;
}

// GGX NDF
float rhodonitePbr_dGgx(float NH, float alphaRoughness) {
  float M_PI = 3.141592653589793;
  float roughnessSqr = alphaRoughness * alphaRoughness;
  float f = (roughnessSqr - 1.0) * NH * NH + 1.0;
  return roughnessSqr / (M_PI * f * f);
}

// The code from https://google.github.io/filament/Filament.html#listing_approximatedspecularv
// The idea is from [Heitz14] Eric Heitz. 2014. Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs.
float rhodonitePbr_vSmithGGXCorrelated(float NL, float NV, float alphaRoughness) {
  float a2 = alphaRoughness * alphaRoughness;
  float GGXV = NL * sqrt(NV * NV * (1.0 - a2) + a2);
  float GGXL = NV * sqrt(NL * NL * (1.0 - a2) + a2);
  return 0.5 / (GGXV + GGXL);
}

vec3 rhodonitePbr_cookTorranceSpecularBrdf(float NH, float NL, float NV, vec3 F, float alphaRoughness) {
  float D = rhodonitePbr_dGgx(NH, alphaRoughness);
  float V = rhodonitePbr_vSmithGGXCorrelated(NL, NV, alphaRoughness);
  return D * V * F;
}

vec3 rhodonitePbr_fresnelSchlickRoughness(vec3 F0, float cosTheta, float roughness) {
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}

// this is from https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec3 rhodonitePbr_envBRDFApprox(vec3 F0, float Roughness, float NoV) {
  vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
  vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);
  vec4 r = Roughness * c0 + c1;
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;

  return F0 * AB.x + AB.y;
}

vec3 rhodonitePbr_IBLContribution(
  vec3 normalInWorld,
  float NV,
  vec3 viewDirection,
  vec3 albedo,
  vec3 F0,
  float userRoughness,
  vec4 iblParameter,
  ivec2 hdriFormat,
  samplerCube diffuseEnvTexture,
  samplerCube specularEnvTexture
) {
  // diffuse
  float rot = iblParameter.w + 3.1415;
  mat3 rotEnvMatrix = mat3(
    cos(rot), 0.0, -sin(rot),
    0.0,      1.0, 0.0,
    sin(rot), 0.0, cos(rot));

  vec3 normalForEnv = rotEnvMatrix * normalInWorld;
  normalForEnv.x *= -1.0;
  vec4 diffuseTexel = textureCube(diffuseEnvTexture, normalForEnv);

  vec3 diffuseLight;
  if (hdriFormat.x == 0) {
    // LDR_SRGB
    // transform srgb to linear
    diffuseLight = pow(diffuseTexel.rgb, vec3(2.2));
  } else if (hdriFormat.x == 3) {
    // RGBE
    diffuseLight = diffuseTexel.rgb * pow(2.0, diffuseTexel.a * 255.0 - 128.0);
  } else {
    diffuseLight = diffuseTexel.rgb;
  }

  // specular
  float mipCount = iblParameter.x;
  float lod = (userRoughness * (mipCount - 1.0));

  vec3 reflection = rotEnvMatrix * reflect(-viewDirection, normalInWorld);
  reflection.x *= -1.0;

  // need define directive by the Rhodonite
  #ifdef WEBGL1_EXT_SHADER_TEXTURE_LOD
    vec4 specularTexel = textureCubeLodEXT(specularEnvTexture, reflection, lod);
  #elif defined(GLSL_ES3)
    vec4 specularTexel = textureLod(specularEnvTexture, reflection, lod);
  #else
    vec4 specularTexel = textureCube(specularEnvTexture, reflection);
  #endif

  vec3 specularLight;
  if (hdriFormat.y == 0) {
    // LDR_SRGB
    // transform srgb to linear
    specularLight = pow(specularTexel.rgb, vec3(2.2));
  } else if (hdriFormat.y == 3) {
    // RGBE
    specularLight = specularTexel.rgb * pow(2.0, specularTexel.a * 255.0 - 128.0);
  } else {
    specularLight = specularTexel.rgb;
  }

  vec3 kS = rhodonitePbr_fresnelSchlickRoughness(F0, NV, userRoughness);
  vec3 kD = 1.0 - kS;
  vec3 diffuse = diffuseLight * albedo * kD;
  vec3 specular = specularLight * rhodonitePbr_envBRDFApprox(F0, userRoughness, NV);

  float IBLDiffuseContribution = iblParameter.y;
  float IBLSpecularContribution = iblParameter.z;
  diffuse *= IBLDiffuseContribution;
  specular *= IBLSpecularContribution;
  return diffuse + specular;
}

// <SGSP> SocketName: outColor out
void rhodonitePbr(
  in vec3 u_viewPosition,
  in int u_lightNumber,
  in vec4 u_lightDirection[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightPosition[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_lightIntensity[/* shaderity: @{Config.maxLightNumberInShader} */],
  in vec4 u_iblParameter,
  in ivec2 u_hdriFormat,
  in vec4 positionInWorld,
  in vec3 normalInWorld,
  in vec4 baseColor,
  in float metallic,
  in float roughness,
  in float occlusion,
  in vec3 emissive,
  in samplerCube diffuseEnvTexture,
  in samplerCube specularEnvTexture,
  out vec4 outColor
) {
  vec3 diffuseMatAverageF0 = vec3(0.04);
  float c_MinRoughness = 0.04;
  float M_PI = 3.141592653589793;

  // f0
  vec3 F0 = mix(diffuseMatAverageF0, baseColor.rgb, metallic);

  // Albedo
  vec3 albedo = baseColor.rgb * (vec3(1.0) - diffuseMatAverageF0);
  albedo *= (1.0 - metallic);

  // view direction
  vec3 viewVector = u_viewPosition - positionInWorld.xyz;
  vec3 viewDirection = normalize(viewVector);

  // NV
  float NV = dot(normalInWorld, viewDirection);
  float satNV = rhodonitePbr_saturateEpsilonToOne(NV);

  // metallic & roughness
  metallic = clamp(metallic, 0.0, 1.0);
  roughness = clamp(roughness, c_MinRoughness, 1.0);
  float alphaRoughness = roughness * roughness;

  // out color
  outColor = vec4(0.0, 0.0, 0.0, baseColor.a);

  // lighting
  for (int i = 0; i < /* shaderity: @{Config.maxLightNumberInShader} */; i++) {
    if (i >= u_lightNumber) {
      break;
    }

    // light
    vec4 gotLightDirection = u_lightDirection[i];
    vec4 gotLightPosition = u_lightPosition[i];
    vec4 gotLightIntensity = u_lightIntensity[i];
    vec3 lightDirection = gotLightDirection.xyz;
    vec3 lightIntensity = gotLightIntensity.xyz;
    vec3 lightPosition = gotLightPosition.xyz;
    float lightType = gotLightPosition.w;
    float spotCosCutoff = gotLightDirection.w;
    float spotExponent = gotLightIntensity.w;

    if (0.75 < lightType) { // is point light or spot light
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

    // incident light
    vec3 incidentLight = spotEffect * lightIntensity;
    incidentLight *= M_PI;

    // fresnel
    vec3 halfVector = normalize(lightDirection + viewDirection);
    float VH = dot(viewDirection, halfVector);
    vec3 F = rhodonitePbr_fresnel(F0, VH);

    // Diffuse
    vec3 diffuseContrib = (vec3(1.0) - F) * rhodonitePbr_diffuseBrdf(albedo);

    // Specular
    float NH = dot(normalInWorld, halfVector);
    float satNH = rhodonitePbr_saturateEpsilonToOne(NH);
    float NL = dot(normalInWorld, lightDirection);
    float satNL = rhodonitePbr_saturateEpsilonToOne(NL);

    vec3 specularContrib = rhodonitePbr_cookTorranceSpecularBrdf(satNH, satNL, satNV, F, alphaRoughness);
    vec3 diffuseAndSpecular = (diffuseContrib + specularContrib) * vec3(satNL) * incidentLight;

    outColor.rgb += diffuseAndSpecular;
  }

  vec3 ibl = rhodonitePbr_IBLContribution(
    normalInWorld,
    satNV,
    viewDirection,
    albedo,
    F0,
    roughness,
    u_iblParameter,
    u_hdriFormat,
    diffuseEnvTexture,
    specularEnvTexture
  );

  // Occlusion to Indirect Lights
  outColor.rgb += ibl * occlusion;

  // emissive
  outColor.rgb += emissive;
}
