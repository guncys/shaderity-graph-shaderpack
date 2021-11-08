export const _AvailableShaderStage = {
  Vertex: 'vertex',
  Fragment: 'fragment',
  VertexAndFragment: 'vertexandfragment',
  Unknown: 'unknown',
} as const;

export const AvailableShaderStage = {
  ..._AvailableShaderStage,
  fromString: (str: string) => {
    for (const shaderStage of Object.values(_AvailableShaderStage)) {
      if (shaderStage.toLowerCase() === str.toLowerCase()) {
        return shaderStage as AvailableShaderStageEnum;
      }
    }
    return AvailableShaderStage.Unknown;
  },
} as const;

export type AvailableShaderStageEnum =
  typeof AvailableShaderStage[keyof typeof _AvailableShaderStage];

export const _GUIMode = {
  Standard: 'standard',
  PullDown: 'pulldown',
  SetVector: 'setvector',
  SetMatrix: 'setmatrix',
  SetTexture: 'settexture',
  Unknown: 'unknown',
} as const;

export const GUIMode = {
  ..._GUIMode,
  fromString: (str: string) => {
    for (const mode of Object.values(_GUIMode)) {
      if (mode.toLowerCase() === str.toLowerCase()) {
        return mode as GUIModeEnum;
      }
    }
    return GUIMode.Unknown;
  },
} as const;

export type GUIModeEnum = typeof GUIMode[keyof typeof _GUIMode];
