import {AbstractNodeData} from '../type/Type';

import normalTextureScale from './nodeDefinitions/Artistic/Normal/normalTextureScale.glsl';
import perturbNormal from './nodeDefinitions/Artistic/Normal/perturbNormal.fs.glsl';
import occlusionStrength from './nodeDefinitions/Artistic/Occlusion/occlusionStrength.glsl';

import floatToVector2 from './nodeDefinitions/Channel/AddElements/floatToVector2.glsl';
import floatToVector3 from './nodeDefinitions/Channel/AddElements/floatToVector3.glsl';
import floatToVector4 from './nodeDefinitions/Channel/AddElements/floatToVector4.glsl';
import mat2ToMat3 from './nodeDefinitions/Channel/AddElements/mat2ToMat3.glsl';
import mat2ToMat4 from './nodeDefinitions/Channel/AddElements/mat2ToMat4.glsl';
import mat3ToMat4 from './nodeDefinitions/Channel/AddElements/mat3ToMat4.glsl';

import vector2ToVector3 from './nodeDefinitions/Channel/AddElements/vector2ToVector3.glsl';
import vector2ToVector4 from './nodeDefinitions/Channel/AddElements/vector2ToVector4.glsl';
import vector3ToVector4 from './nodeDefinitions/Channel/AddElements/vector3ToVector4.glsl';
import combineVector2 from './nodeDefinitions/Channel/Combine/combineVector2.glsl';
import combineVector3 from './nodeDefinitions/Channel/Combine/combineVector3.glsl';
import combineVector4 from './nodeDefinitions/Channel/Combine/combineVector4.glsl';

import mat3ToMat2 from './nodeDefinitions/Channel/RemoveElements/mat3ToMat2.glsl';
import mat4ToMat2 from './nodeDefinitions/Channel/RemoveElements/mat4ToMat2.glsl';
import mat4ToMat3 from './nodeDefinitions/Channel/RemoveElements/mat4ToMat3.glsl';
import vector3ToVector2 from './nodeDefinitions/Channel/RemoveElements/vector3ToVector2.glsl';
import vector4ToVector2 from './nodeDefinitions/Channel/RemoveElements/vector4ToVector2.glsl';
import vector4ToVector3 from './nodeDefinitions/Channel/RemoveElements/vector4ToVector3.glsl';

import splitVector2 from './nodeDefinitions/Channel/Split/splitVector2.glsl';
import splitVector3 from './nodeDefinitions/Channel/Split/splitVector3.glsl';
import splitVector4 from './nodeDefinitions/Channel/Split/splitVector4.glsl';

import boolean from './nodeDefinitions/Input/Basic/boolean.glsl';
import constant from './nodeDefinitions/Input/Basic/constant.glsl';
import uniformInt from './nodeDefinitions/Input/Basic/uniformInt.glsl';
import uniformFloat from './nodeDefinitions/Input/Basic/uniformFloat.glsl';
import uniformVector2 from './nodeDefinitions/Input/Basic/uniformVector2.glsl';
import uniformVector3 from './nodeDefinitions/Input/Basic/uniformVector3.glsl';
import uniformVector4 from './nodeDefinitions/Input/Basic/uniformVector4.glsl';

import inputPosition from './nodeDefinitions/Input/Geometry/inputPosition.vs.glsl';
import texcoord from './nodeDefinitions/Input/Geometry/texcoord.glsl';

import uniformMatrix44 from './nodeDefinitions/Input/Matrix/uniformMatrix44.glsl';

import sampleTexture2D from './nodeDefinitions/Input/Texture/sampleTexture2D.glsl';
import uniformTexture2D from './nodeDefinitions/Input/Texture/uniformTexture2D';

import fragmentColor from './nodeDefinitions/Utility/Output/fragmentColor.fs.glsl';
import vertexPosition from './nodeDefinitions/Utility/Output/vertexPosition.vs.glsl';

export const ShaderPack: AbstractNodeData[] = [
  normalTextureScale,
  perturbNormal,
  occlusionStrength,
  floatToVector2,
  floatToVector3,
  floatToVector4,
  mat2ToMat3,
  mat2ToMat4,
  mat3ToMat4,
  vector2ToVector3,
  vector2ToVector4,
  vector3ToVector4,
  combineVector2,
  combineVector3,
  combineVector4,
  mat3ToMat2,
  mat4ToMat2,
  mat4ToMat3,
  vector3ToVector2,
  vector4ToVector2,
  vector4ToVector3,
  splitVector2,
  splitVector3,
  splitVector4,
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
