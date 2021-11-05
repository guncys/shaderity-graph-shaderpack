declare module '*.glsl' {
  const shaderFunctionName: string;
  const shaderFunctionCode: string;
  const socketDataArray: [];
  const nodeName: string;
  const availableShaderStage: 'vertex' | 'fragment' | 'vertexandfragment';
  const guiMode:
    | 'standard'
    | 'pulldown'
    | 'setvector'
    | 'setmatrix'
    | 'settexture';
}
