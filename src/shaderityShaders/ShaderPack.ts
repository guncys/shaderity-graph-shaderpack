import {ShaderNodeData} from './../type/Type';
import sampleStandard from './vertex/sampleStandard.vs.glsl';
import sampleShaderOutput from './vertex/sampleShaderOutput.vs.glsl';
import samplePullDown from './fragment/samplePullDown.fs.glsl';

export const ShaderPack: ShaderNodeData[] = [
  sampleStandard,
  sampleShaderOutput,
  samplePullDown,
];
