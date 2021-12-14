import uniformTexture2D from './common/uniformTexture2D';

import {AbstractNodeData} from './../type/Type';
import uniformVector4 from './common/uniformVector4.glsl';
import uniformColor from './common/uniformColor.glsl';
import uniformMatrix44 from './common/uniformMatrix44.glsl';
import sampleTexture2D from './common/sampleTexture2D.glsl';

import inputPosition from './vertex/inputPosition.vs.glsl';
import vertexPosition from './vertex/vertexPosition.vs.glsl';
import texcoord from './vertex/texcoord.glsl';

import fragmentColor from './fragment/fragmentColor.fs.glsl';

export const ShaderPack: AbstractNodeData[] = [
  uniformTexture2D,
  uniformVector4,
  uniformColor,
  uniformMatrix44,
  sampleTexture2D,
  inputPosition,
  vertexPosition,
  texcoord,
  fragmentColor,
];
