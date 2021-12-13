import {GUIModeEnum, AvailableShaderStageEnum} from './Enum';
import {
  SocketData as _SocketData,
  StandardInputSocketData as _StandardInputSocketData,
  StandardOutputSocketData as _StandardOutputSocketData,
  AttributeInputSocketData as _AttributeInputSocketData,
  VaryingInputSocketData as _VaryingInputSocketData,
  VaryingOutputSocketData as _VaryingOutputSocketData,
  UniformInputSocketData as _UniformInputSocketData,
  SocketDirectionEnum as _SocketDirectionEnum,
  ShaderPrecisionType as _ShaderPrecisionType,
  NodeTypeEnum as _NodeTypeEnum,
} from 'shaderity-graph';

export type SocketData = _SocketData;
export type StandardInputSocketData = _StandardInputSocketData;
export type StandardOutputSocketData = _StandardOutputSocketData;
export type AttributeInputSocketData = _AttributeInputSocketData;
export type VaryingInputSocketData = _VaryingInputSocketData;
export type VaryingOutputSocketData = _VaryingOutputSocketData;
export type UniformInputSocketData = _UniformInputSocketData;
export type SocketDirectionEnum = _SocketDirectionEnum;
export type ShaderPrecisionType = _ShaderPrecisionType;
export type NodeTypeEnum = _NodeTypeEnum;

export interface PullDownItem {
  functionName: string;
  displayName?: string;
}

export interface PullDownOption {
  description: string;
  items: PullDownItem[];
}

export interface VectorOption {
  descriptions?: string[];
  defaultValues?: number[];
}

export interface SetVectorOption {
  [uniformVariableName: string]: VectorOption;
}

export interface AbstractNodeData {
  socketDataArray: Array<SocketData>;

  // defined by comments in a shader function code file
  nodeName: string;
  category: string[];
  availableShaderStage: AvailableShaderStageEnum;
  guiMode: GUIModeEnum;
  nodeType?: NodeTypeEnum;
}

export interface ShaderityNodeData extends AbstractNodeData {
  nodeType?: 'shaderityNode';

  shaderFunctionName: string;
  shaderFunctionCode: string;
  extensions?: Array<string>;
  guiOptions?: {
    pullDown?: PullDownOption;
    setVector?: SetVectorOption;
  };
}

export interface SamplerInputNodeData extends AbstractNodeData {
  nodeType: 'samplerInputNode';
  guiMode: 'settexture';
}
