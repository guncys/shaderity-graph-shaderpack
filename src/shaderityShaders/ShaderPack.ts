import {ShaderNodeData} from './../type/Type';
import fragmentColor from './fragment/fragmentColor.fs.glsl';
import vertexPosition from './vertex/vertexPosition.vs.glsl';

export const ShaderPack: ShaderNodeData[] = [fragmentColor, vertexPosition];
