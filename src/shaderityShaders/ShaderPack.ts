import {ShaderNodeData} from './../type/Type';
import uniformVector4 from './common/uniformVector4.glsl';
import fragmentColor from './fragment/fragmentColor.fs.glsl';
import vertexPosition from './vertex/vertexPosition.vs.glsl';

export const ShaderPack: ShaderNodeData[] = [
  uniformVector4,
  fragmentColor,
  vertexPosition,
];
