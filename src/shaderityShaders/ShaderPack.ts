import {AbstractNodeData} from './../type/Type';

import boolean from './Input/Basic/boolean.glsl';
import constant from './Input/Basic/constant.glsl';
import uniformInt from './Input/Basic/uniformInt.glsl';
import uniformFloat from './Input/Basic/uniformFloat.glsl';
import uniformVector2 from './Input/Basic/uniformVector2.glsl';
import uniformVector3 from './Input/Basic/uniformVector3.glsl';
import uniformVector4 from './Input/Basic/uniformVector4.glsl';

import inputPosition from './Input/Geometry/inputPosition.vs.glsl';
import texcoord from './Input/Geometry/texcoord.glsl';

import uniformMatrix44 from './Input/Matrix/uniformMatrix44.glsl';

import sampleTexture2D from './Input/Texture/sampleTexture2D.glsl';
import uniformTexture2D from './Input/Texture/uniformTexture2D';

import fragmentColor from './Utility/Output/fragmentColor.fs.glsl';
import vertexPosition from './Utility/Output/vertexPosition.vs.glsl';

export const ShaderPack: AbstractNodeData[] = [
  boolean,
  uniformInt,
  uniformFloat,
  uniformVector2,
  uniformVector3,
  uniformVector4,
  constant,
  inputPosition,
  texcoord,
  uniformMatrix44,
  sampleTexture2D,
  uniformTexture2D,
  fragmentColor,
  vertexPosition,
];
