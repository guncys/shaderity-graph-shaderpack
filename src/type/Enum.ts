export const AvailableShaderStage = {
  Vertex: 'vertex',
  Fragment: 'fragment',
  VertexAndFragment: 'vertexandfragment',
  Unknown: 'unknown',
} as const;

export type AvailableShaderStageEnum =
  typeof AvailableShaderStage[keyof typeof AvailableShaderStage];

export const GUIMode = {
  Standard: 'standard',
  PullDown: 'pulldown',
  SetVector: 'setvector',
  SetMatrix: 'setmatrix',
  SetTexture: 'settexture',
  Unknown: 'unknown',
} as const;

export type GUIModeEnum = typeof GUIMode[keyof typeof GUIMode];
