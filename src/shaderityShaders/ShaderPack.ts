import {AbstractNodeData} from './../type/Type';

import uniformVector4 from './Input/Basic/uniformVector4.glsl';

import inputPosition from './Input/Geometry/inputPosition.vs.glsl';
import texcoord from './Input/Geometry/texcoord.glsl';

import uniformMatrix44 from './Input/Matrix/uniformMatrix44.glsl';

import sampleTexture2D from './Input/Texture/sampleTexture2D.glsl';
import uniformTexture2D from './Input/Texture/uniformTexture2D';

import fragmentColor from './Utility/Output/fragmentColor.fs.glsl';
import vertexPosition from './Utility/Output/vertexPosition.vs.glsl';

export const ShaderPack: AbstractNodeData[] = [
  uniformTexture2D,
  uniformVector4,
  uniformMatrix44,
  sampleTexture2D,
  inputPosition,
  vertexPosition,
  texcoord,
  fragmentColor,
];
