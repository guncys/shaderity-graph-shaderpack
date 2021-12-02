import {ShaderNodeData} from './../type/Type';
import uniformVector4 from './common/uniformVector4.glsl';
import fragmentColor from './fragment/fragmentColor.fs.glsl';
import inputPosition from './vertex/inputPosition.vs.glsl';
import vertexPosition from './vertex/vertexPosition.vs.glsl';
import uniformColor from './common/uniformColor.glsl';
import uniformTexture2D from './common/uniformTexture2D.glsl';

export const ShaderPack: ShaderNodeData[] = [
  uniformVector4,
  fragmentColor,
  inputPosition,
  vertexPosition,
  uniformColor,
  uniformTexture2D,
];
