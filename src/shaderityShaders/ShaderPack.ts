import {ShaderNodeData} from './../type/Type';
import uniformVector4 from './common/uniformVector4.glsl';
import fragmentColor from './fragment/fragmentColor.fs.glsl';
import inputPosition from './vertex/inputPosition.vs.glsl';
import vertexPosition from './vertex/vertexPosition.vs.glsl';

export const ShaderPack: ShaderNodeData[] = [
  uniformVector4,
  fragmentColor,
  inputPosition,
  vertexPosition,
];
