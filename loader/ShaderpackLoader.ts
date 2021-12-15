import {CustomNodeModule, SGSPcomment} from './ShaderpackLoaderType';
import {
  AttributeInputSocketData,
  PullDownItem,
  ShaderNodeData,
  ShaderPrecisionType,
  SocketDirectionEnum,
  StandardInputSocketData,
  StandardOutputSocketData,
  UniformInputSocketData,
  VaryingInputSocketData,
  VaryingOutputSocketData,
} from './../src/type/Type';
import {AvailableShaderStage, GUIMode} from '../src/type/Enum';

module.exports = function (source: string) {
  (this as CustomNodeModule).cacheable();

  const resultJson: ShaderNodeData = {
    shaderFunctionName: '',
    shaderFunctionCode: '',
    socketDataArray: [],
    nodeName: '',
    availableShaderStage: AvailableShaderStage.Unknown,
    guiMode: GUIMode.Unknown,
  };

  const splittedOriginalCode = __splitByLineFeedCode(source);
  const sGSPcomments: SGSPcomment[] =
    __getCommentsForShaderityGraphShaderPack(splittedOriginalCode);

  __setParamsFromShaderCode(resultJson, splittedOriginalCode);
  __setParamsFromSGSPcomments(resultJson, sGSPcomments);
  __setGUIOptions(resultJson, splittedOriginalCode);

  return `export default ${JSON.stringify(resultJson)}`;
};

// =========================================================================================================
// private functions
// =========================================================================================================

const regSGSP = /^[\t ]*\/\/[\t ]*<[\t ]*SGSP[\t ]*>(.*)$/;
const regExtension = /^[\t ]*#[\t ]*extension[\t ]*(.*):.*$/;
const regVoidFuncStart = /^[\t ]*void[\t ]*(\w+)\(/;

function __splitByLineFeedCode(str: string) {
  return str.split(/\r\n|\n/);
}

function __joinSplittedLine(splittedLine: string[]) {
  return splittedLine.join('\n');
}

function __getCommentsForShaderityGraphShaderPack(
  shaderCodeLines: string[]
): SGSPcomment[] {
  const sGSPcomments: SGSPcomment[] = [];

  for (let i = 0; i < shaderCodeLines.length; i++) {
    const line = shaderCodeLines[i];

    const matchedLine = line.match(regSGSP);
    if (matchedLine != null) {
      sGSPcomments.push({
        lineNumber: i,
        content: matchedLine[1].trim(),
      });
    }
  }

  return sGSPcomments;
}

function __setParamsFromShaderCode(
  json: ShaderNodeData,
  splittedOriginalCode: string[]
) {
  const splittedShaderFunctionCode =
    __createSplittedShaderFunctionCode(splittedOriginalCode);

  __setShaderFunctionNameAndSocketData(json, splittedShaderFunctionCode);
  __setShaderFunctionCode(json, splittedShaderFunctionCode);
  __setExtension(json, splittedOriginalCode);
}

/**
 * Create a splitted shader function code by removing unnecessary
 * lines from the original splitted code.
 * The splitted shader function code does not need the following:
 * 1. comment for this library ('// <SGSP>~')
 * 2. global precision (This may be necessary to enable the use of Linter in the fragment shader)
 * 3. extension
 */
function __createSplittedShaderFunctionCode(splittedOriginalCode: string[]) {
  const splittedShaderCode = [];
  const regPrecision = /^[\t ]*precision/;

  for (let i = 0; i < splittedOriginalCode.length; i++) {
    if (
      splittedOriginalCode[i].match(regSGSP) != null ||
      splittedOriginalCode[i].match(regPrecision) != null ||
      splittedOriginalCode[i].match(regExtension) != null
    ) {
      continue;
    }

    const prevLine = splittedShaderCode?.[splittedShaderCode.length - 1] ?? '';

    if (prevLine === '' && splittedOriginalCode[i] === '') {
      continue;
    }

    splittedShaderCode.push(splittedOriginalCode[i]);
  }

  return splittedShaderCode;
}

function __setShaderFunctionNameAndSocketData(
  json: ShaderNodeData,
  splittedShaderFunctionCode: string[]
) {
  const shaderFunctionLineNumber =
    __setShaderFunctionNameAndGetShaderFunctionLineNumber(
      json,
      splittedShaderFunctionCode
    );

  const shaderFuncArgs = __getShaderFuncArgs(
    splittedShaderFunctionCode,
    shaderFunctionLineNumber
  );
  __setSocketData(json, shaderFuncArgs);
}

function __setShaderFunctionNameAndGetShaderFunctionLineNumber(
  json: ShaderNodeData,
  splittedShaderFunctionCode: string[]
): number {
  for (let i = 0; i < splittedShaderFunctionCode.length; i++) {
    const line = splittedShaderFunctionCode[i];
    const matchedLine = line.match(regVoidFuncStart);
    if (matchedLine != null) {
      json.shaderFunctionName = matchedLine[1].trim();
      return i;
    }
  }

  console.error(
    'ShaderpackLoader.__setShaderFunctionNameAndGetLineNumberOfShaderFunction: Cannot find a function with return value of void'
  );
  throw new Error();
}

function __setSocketData(json: ShaderNodeData, shaderFuncArgs: string[]) {
  const regArg =
    /^[\t ]*(in|out)[\t ]*(highp|mediump|lowp|)[\t ]+(\w+)[\t ]+(\w+)$/;

  for (let i = 0; i < shaderFuncArgs.length; i++) {
    const argString = shaderFuncArgs[i];

    const matchArg = argString.match(regArg);
    const direction = matchArg?.[1].trim() as SocketDirectionEnum;
    const precision = matchArg?.[2].trim() as ShaderPrecisionType | '';
    const type = matchArg?.[3].trim() as string;
    const argName = matchArg?.[4].trim() as string;

    if (matchArg == null || type === '' || argName === '') {
      console.error(
        `ShaderpackLoader.__setSocketData: The argument of ${json.shaderFunctionName} is invalid.`
      );
      throw new Error();
    }

    const isAttributeInputSocket = argName.match(/^a_/) != null;
    if (isAttributeInputSocket) {
      __setAttributeSocketData(json, argName, direction, type, precision);
      continue;
    }

    const isUniformInputSocket = argName.match(/^u_/) != null;
    if (isUniformInputSocket) {
      __setUniformSocketData(json, argName, direction, type, precision);
      continue;
    }

    const isVaryingSocket = argName.match(/^v_/) != null;
    if (isVaryingSocket) {
      __setVaryingSocketData(json, argName, direction, type, precision);
      continue;
    }

    __setStandardSocketData(json, argName, direction, type, precision);
  }
}

function __getShaderFuncArgs(
  splittedShaderFunctionCode: string[],
  lineNumberVoidFunction: number
) {
  const regVoidFuncArgument = /^.*\((.*)\).*$/;

  let voidFunc = '';
  let matchedFuncArgument;
  for (
    let i = lineNumberVoidFunction;
    i < splittedShaderFunctionCode.length;
    i++
  ) {
    voidFunc += splittedShaderFunctionCode[i];

    matchedFuncArgument = voidFunc.match(regVoidFuncArgument);
    if (matchedFuncArgument != null) {
      return matchedFuncArgument[1].split(',');
    }
  }

  return [];
}

function __setAttributeSocketData(
  json: ShaderNodeData,
  argName: string,
  direction: 'in' | 'out',
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const attributeInputSocketData = {
    socketName: argName,
    direction: direction as 'in',
    attributeData: {
      variableName: argName,
      type,
    },
  } as AttributeInputSocketData;

  if (precision !== '') {
    attributeInputSocketData.attributeData.precision = precision;
  }

  json.socketDataArray.push(attributeInputSocketData);
}

function __setUniformSocketData(
  json: ShaderNodeData,
  argName: string,
  direction: 'in' | 'out',
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const uniformInputSocketData = {
    socketName: argName,
    direction: direction as 'in',
    uniformData: {
      variableName: argName,
      type,
    },
  } as UniformInputSocketData;

  if (precision !== '') {
    uniformInputSocketData.uniformData.precision = precision;
  }

  json.socketDataArray.push(uniformInputSocketData);
}

function __setVaryingSocketData(
  json: ShaderNodeData,
  argName: string,
  direction: 'in' | 'out',
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const varyingSocketData = {
    socketName: argName,
    direction: direction,
    varyingData: {
      type,
    },
  } as VaryingInputSocketData | VaryingOutputSocketData;

  if (direction === 'out' && precision !== '') {
    const varyingOutputSocketData =
      varyingSocketData as VaryingOutputSocketData;
    varyingOutputSocketData.varyingData.precision = precision;
  }

  json.socketDataArray.push(varyingSocketData);
}

function __setStandardSocketData(
  json: ShaderNodeData,
  argName: string,
  direction: SocketDirectionEnum,
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const standardSocketData = {
    socketName: argName,
    direction,
    shaderData: {
      type,
    },
  } as StandardInputSocketData | StandardOutputSocketData;

  if (direction === 'out' && precision !== '') {
    const standardOutputSocketData =
      standardSocketData as StandardOutputSocketData;
    standardOutputSocketData.shaderData.precision = precision;
  }

  json.socketDataArray.push(standardSocketData);
}

function __setShaderFunctionCode(
  json: ShaderNodeData,
  splittedShaderFunctionCode: string[]
) {
  json.shaderFunctionCode = __joinSplittedLine(splittedShaderFunctionCode);
}

function __setExtension(json: ShaderNodeData, splittedOriginalCode: string[]) {
  if (splittedOriginalCode.length === 0) {
    return;
  }

  for (let i = 0; i < splittedOriginalCode.length; i++) {
    const matchedLine = splittedOriginalCode[i].match(regExtension);

    if (matchedLine != null) {
      const extensionName = matchedLine[1].trim();
      json.extensions = json.extensions ?? [];
      json.extensions.push(extensionName);
    }
  }
}

function __setParamsFromSGSPcomments(
  json: ShaderNodeData,
  sGSPcomments: SGSPcomment[]
) {
  __setNodeName(json, sGSPcomments);
  __setAvailableShaderStage(json, sGSPcomments);
  __setGUIMode(json, sGSPcomments);
  __setVaryingInterpolation(json, sGSPcomments);
  __convertToShaderOutputSocket(json, sGSPcomments);
  __removeNonSharingUniformVariableName(json, sGSPcomments);
  __setSocketName(json, sGSPcomments);
}

function __setNodeName(json: ShaderNodeData, sGSPcomments: SGSPcomment[]) {
  const regNodeName = /^NodeName[\t ]*:[\t ]*(.*)$/;
  json.nodeName = __getFirstParamFromSGSPcomment(sGSPcomments, regNodeName);
}

function __setAvailableShaderStage(
  json: ShaderNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regAvailableShaderStage = /^AvailableShaderStage[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regAvailableShaderStage
  );
  json.availableShaderStage = AvailableShaderStage.fromString(matchedStr);

  // default value
  if (json.availableShaderStage === AvailableShaderStage.Unknown) {
    json.availableShaderStage = AvailableShaderStage.VertexAndFragment;
  }
}

function __setGUIMode(json: ShaderNodeData, sGSPcomments: SGSPcomment[]) {
  const regGUIMode = /^GUIMode[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(sGSPcomments, regGUIMode);
  json.guiMode = GUIMode.fromString(matchedStr);

  // default value
  if (json.guiMode === GUIMode.Unknown) {
    json.guiMode = GUIMode.Standard;
  }
}

function __setVaryingInterpolation(
  json: ShaderNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regVaryingInterpolation = /^VaryingInterpolation[\t ]*:[\t ]*(.*)$/;
  const interpolations = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regVaryingInterpolation
  );

  for (let i = 0; i < interpolations.length; i++) {
    const [variableName, interpolationType] = interpolations[i].split(
      /[\t ]+/,
      2
    );

    for (let j = 0; j < json.socketDataArray.length; j++) {
      const socketData = json.socketDataArray[j] as VaryingOutputSocketData;
      if (socketData.direction !== 'out' || socketData.varyingData == null) {
        continue;
      }

      if (socketData.socketName === variableName) {
        socketData.varyingData.interpolationType = interpolationType as
          | 'flat'
          | 'smooth';
        break;
      }
    }
  }
}

// The __setSocketData method must be executed prior to this method
function __convertToShaderOutputSocket(
  json: ShaderNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regShaderOutputSocket = /^ShaderOutputSocket[\t ]*:[\t ]*(.*)$/;
  const shaderOutputSocketVariableName = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regShaderOutputSocket
  );

  if (shaderOutputSocketVariableName === '') {
    return;
  }

  const sockets = json.socketDataArray;
  for (let i = 0; i < sockets.length; i++) {
    const socket = sockets[i];
    if (socket.socketName === shaderOutputSocketVariableName) {
      if (socket.direction === 'out') {
        sockets[i] = {
          socketName: shaderOutputSocketVariableName,
          direction: 'out',
        };
      } else {
        console.error(
          'ShaderpackLoader.__convertToShaderOutputSocket: Cannot convert input socket to shader output socket'
        );
        throw new Error();
      }
      return;
    }
  }
}

function __removeNonSharingUniformVariableName(
  json: ShaderNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regSharingUniformVariable = /^SharingUniformVariable[\t ]*:[\t ]*(.*)$/;
  const sharingUniformVariable = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regSharingUniformVariable
  ).trim();

  const sharingUniformVariableNames = sharingUniformVariable.split(/[\t ]+/);

  for (const socketData of json.socketDataArray) {
    const uniformSocketData = socketData as UniformInputSocketData;
    if (uniformSocketData.uniformData != null) {
      const isSharingName = sharingUniformVariableNames.some(
        name => name === uniformSocketData.uniformData.variableName
      );

      if (!isSharingName) {
        delete uniformSocketData.uniformData.variableName;
      }
    }
  }
}

// Methods that uses argument name(e.g. __setVaryingInterpolation) must be executed prior to this method
function __setSocketName(json: ShaderNodeData, sGSPcomments: SGSPcomment[]) {
  const regSocketName = /^SocketName[\t ]*:[\t ]*(.*)$/;
  const socketNames = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regSocketName
  );

  for (let i = 0; i < socketNames.length; i++) {
    const [variableName, socketName] = socketNames[i].split(/[\t ]+/, 2);

    for (let j = 0; j < json.socketDataArray.length; j++) {
      const socketData = json.socketDataArray[j];

      if (socketData.socketName === variableName) {
        socketData.socketName = socketName;
        break;
      }
    }
  }
}

/**
 * @param sGSPcomments array of comments for this loader
 * @param reg Regular expression for the parameter to be extracted.
 *            The format is '/^paramName[\t ]*:[\t ]*(.*)$/'
 */
function __getFirstParamFromSGSPcomment(
  sGSPcomments: SGSPcomment[],
  reg: RegExp
): string {
  for (let i = 0; i < sGSPcomments.length; i++) {
    const sGSPcontent = sGSPcomments[i].content;

    const matchedParam = sGSPcontent.match(reg);
    if (matchedParam != null) {
      return matchedParam[1];
    }
  }

  return '';
}

/**
 * @param sGSPcomments array of comments for this loader
 * @param reg Regular expression for the parameter to be extracted.
 *            The format is '/^paramName[\t ]*:[\t ]*(.*)$/'
 */
function __getAllParamsFromSGSPcomment(
  sGSPcomments: SGSPcomment[],
  reg: RegExp
): string[] {
  const sGSPParams: string[] = [];

  for (let i = 0; i < sGSPcomments.length; i++) {
    const sGSPcontent = sGSPcomments[i].content;

    const matchedParam = sGSPcontent.match(reg);
    if (matchedParam != null) {
      sGSPParams.push(matchedParam[1].trim());
    }
  }

  return sGSPParams;
}

// The __setGUIMode method must be executed prior to this method
function __setGUIOptions(json: ShaderNodeData, splittedOriginalCode: string[]) {
  if (json.guiMode === GUIMode.PullDown) {
    __setGUIPullDownOptions(json, splittedOriginalCode);
  }
}

function __setGUIPullDownOptions(
  json: ShaderNodeData,
  splittedOriginalCode: string[]
) {
  json.guiOptions = json.guiOptions ?? {};
  json.guiOptions.pullDown = {
    description: '',
    items: [],
  };

  const regPullDownDescription = /^PullDown_Description[\t ]*:[\t ]*(.*)$/;
  const regPullDownDisplayName = /^PullDown_DisplayName[\t ]*:[\t ]*(.*)$/;

  let displayName: string | undefined;
  for (let i = 0; i < splittedOriginalCode.length; i++) {
    const line = splittedOriginalCode[i];

    const matchedLineSGSP = line.match(regSGSP);
    if (matchedLineSGSP != null) {
      const sGSPcomment = matchedLineSGSP[1].trim();

      const matchedDescription = sGSPcomment.match(regPullDownDescription);
      if (matchedDescription != null) {
        json.guiOptions.pullDown.description = matchedDescription[1].trim();
        continue;
      }

      const matchedDisplayName = sGSPcomment.match(regPullDownDisplayName);
      if (matchedDisplayName != null) {
        displayName = matchedDisplayName[1].trim();
        continue;
      }
    }

    const matchedLineVoidFunc = line.match(regVoidFuncStart);
    if (matchedLineVoidFunc != null) {
      const functionName = matchedLineVoidFunc[1].trim();

      const item: PullDownItem = {functionName};
      if (displayName != null) {
        item.displayName = displayName;
        displayName = undefined;
      }
      json.guiOptions.pullDown.items.push(item);
    }
  }
}
