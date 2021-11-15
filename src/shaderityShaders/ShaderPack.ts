import {ShaderNodeData} from './../type/Type';
import sampleStandard from './samples/sampleStandard.vs.glsl';
import sampleShaderOutput from './samples/sampleShaderOutput.vs.glsl';
import samplePullDown from './samples/samplePullDown.fs.glsl';

export const ShaderPack: ShaderNodeData[] = [
  sampleStandard,
  sampleShaderOutput,
  samplePullDown,
];
