import {CustomNodeModule, SGSPcomment} from './ShaderpackLoaderType';
import {
  AttributeInputSocketData,
  PullDownItem,
  ShaderityNodeData,
  ShaderPrecisionType,
  SocketData,
  SocketDirectionEnum,
  StandardInputSocketData,
  StandardOutputSocketData,
  UniformInputSocketData,
  VaryingInputSocketData,
  VaryingOutputSocketData,
} from './../src/type/Type';
import {
  AvailableShaderStage,
  AvailableShaderStageEnum,
  GUIMode,
} from '../src/type/Enum';
import SG, {SamplerTypeEnum} from 'shaderity-graph';
import {ShaderVaryingInterpolationType} from 'shaderity';

module.exports = function (source: string) {
  (this as CustomNodeModule).cacheable();

  const resultJson: ShaderityNodeData = {
    shaderFunctionName: '',
    shaderFunctionCode: '',
    socketDataArray: [],
    nodeName: '',
    category: [],
    availableShaderStage: AvailableShaderStage.Unknown,
    guiMode: GUIMode.Unknown,
  };

  const splittedOriginalCode = __splitByLineFeedCode(source);
  const sGSPcomments: SGSPcomment[] =
    __getCommentsForShaderityGraphShaderPack(splittedOriginalCode);

  __setParamsFromShaderCode(resultJson, splittedOriginalCode);
  __setParamsFromSGSPcomments(resultJson, sGSPcomments);
  __setGUIOptions(resultJson, splittedOriginalCode, sGSPcomments);

  __changeSocketName(resultJson, sGSPcomments);

  return `export default ${JSON.stringify(resultJson)}`;
};

// =========================================================================================================
// private functions
// =========================================================================================================

const regSGSP = /^[\t ]*\/\/[\t ]*<[\t ]*SGSP[\t ]*>(.*)$/;
const regExtension = /^[\t ]*#[\t ]*extension[\t ]*(.*):.*$/;
const regVoidFuncStart = /^[\t ]*void[\t ]*(\w+)\(/;

/**
 * @private
 * Split a string into an array by line feeds
 */
function __splitByLineFeedCode(str: string) {
  return str.split(/\r\n|\n/);
}

/**
 * @private
 * Join strings with a linefeed character in between
 */
function __joinSplittedLine(splittedLine: string[]) {
  return splittedLine.join('\n');
}

/**
 * @private
 * Extract comments beginning with "// <SGSP>"
 */
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

/**
 * @private
 * Set parameters to the ShaderNodeData json from the shader code except for the comments.
 * @param json The object of the json output by this loader
 * @param splittedOriginalCode The shader code written in the glsl file
 */
function __setParamsFromShaderCode(
  json: ShaderityNodeData,
  splittedOriginalCode: string[]
) {
  const splittedShaderFunctionCode =
    __createSplittedShaderFunctionCode(splittedOriginalCode);

  __setShaderFunctionNameAndSocketData(json, splittedShaderFunctionCode);
  __setShaderFunctionCode(json, splittedShaderFunctionCode);
  __setExtension(json, splittedOriginalCode);
}

/**
 * @private
 * Create a splitted shader function code by removing unnecessary
 * lines from the original splitted code.
 * The lines to be deleted satisfies one of the following conditions
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

/**
 * @private
 * Set the function name and the socket data to ShaderNodeData json.
 */
function __setShaderFunctionNameAndSocketData(
  json: ShaderityNodeData,
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

  // TODO: support overload of the entry shader function
  __setSocketData(json, shaderFuncArgs);
}

/**
 * @private
 * Detect the entry shader function of this node and set the function name to ShaderNodeData json.
 * The entry shader function is the first function with a return value of void.
 */
function __setShaderFunctionNameAndGetShaderFunctionLineNumber(
  json: ShaderityNodeData,
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

/**
 * @private
 * Set the socketData corresponding to the argument of
 * the shader function to ShaderNodeData json.
 * If the argument variable name begins with 'a_', 'v_', or 'u_',
 * it becomes the input/output socket for attribute, varying,
 * or uniform variables, respectively.
 *
 * Note: ShaderOutputSocket is not created by this method.
 *       Call the __convertToShaderOutputSocket method after calling
 *       this method to replace the corresponding socket with a ShaderOutputSocket.
 */
function __setSocketData(json: ShaderityNodeData, shaderFuncArgs: string[]) {
  const regArg =
    /^[\t ]*(in|out)[\t ]*(highp|mediump|lowp|)[\t ]+(\w+)[\t ]+(.+)$/;

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

    const isSamplerInputSocket = type.match(/sampler/) != null;
    if (isSamplerInputSocket) {
      __setSamplerInputSocketData(json, argName, direction, type);
      continue;
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

/**
 * @private
 * Get the argument of the first function in the line after lineNumberVoidFunction.
 */
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
    // remove comment (start from '//' only)
    voidFunc += splittedShaderFunctionCode[i].split('//')[0];

    matchedFuncArgument = voidFunc.match(regVoidFuncArgument);
    if (matchedFuncArgument != null) {
      return matchedFuncArgument[1].split(',');
    }
  }

  return [];
}

/**
 * @private
 * Get the argument of the first function in the line after lineNumberVoidFunction.
 */
function __setSamplerInputSocketData(
  json: ShaderityNodeData,
  argName: string,
  direction: SocketDirectionEnum,
  samplerType: string
) {
  if (direction === SG.SocketDirection.Output) {
    throw new Error(
      'ShaderPackLoader.__setSamplerInputSocketData: This loader does not support sampler output socket'
    );
  }

  const samplerInputSocketData = {
    socketName: argName,
    direction,
    samplerType: samplerType as SamplerTypeEnum,
  };

  json.socketDataArray.push(samplerInputSocketData);
}

/**
 * @private
 * Set attribute input socket data to ShaderNodeData json.
 */
function __setAttributeSocketData(
  json: ShaderityNodeData,
  argName: string,
  direction: SocketDirectionEnum,
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const attributeInputSocketData = {
    socketName: argName,
    direction: direction,
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

/**
 * @private
 * Set uniform input socket data to ShaderNodeData json.
 */
function __setUniformSocketData(
  json: ShaderityNodeData,
  argName: string,
  direction: SocketDirectionEnum,
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const uniformInputSocketData = {
    socketName: argName,
    direction,
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

/**
 * @private
 * Set varying input/output socket data to ShaderNodeData json.
 */
function __setVaryingSocketData(
  json: ShaderityNodeData,
  argName: string,
  direction: SocketDirectionEnum,
  type: string,
  precision: ShaderPrecisionType | ''
) {
  const varyingSocketData = {
    socketName: argName,
    direction,
    varyingData: {
      type,
    },
  } as VaryingInputSocketData | VaryingOutputSocketData;

  if (direction === SG.SocketDirection.Output && precision !== '') {
    const varyingOutputSocketData =
      varyingSocketData as VaryingOutputSocketData;
    varyingOutputSocketData.varyingData.precision = precision;
  }

  json.socketDataArray.push(varyingSocketData);
}

/**
 * @private
 * Set standard input/output socket data to ShaderNodeData json.
 */
function __setStandardSocketData(
  json: ShaderityNodeData,
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

  if (direction === SG.SocketDirection.Output && precision !== '') {
    const standardOutputSocketData =
      standardSocketData as StandardOutputSocketData;
    standardOutputSocketData.shaderData.precision = precision;
  }

  json.socketDataArray.push(standardSocketData);
}

/**
 * @private
 * Set shaderFunctionCode to ShaderNodeData json.
 *
 * To eliminate unnecessary data, the splittedShaderFunctionCode is
 * filled with the result of the __createSplittedShaderFunctionCode method.
 */
function __setShaderFunctionCode(
  json: ShaderityNodeData,
  splittedShaderFunctionCode: string[]
) {
  json.shaderFunctionCode = __joinSplittedLine(splittedShaderFunctionCode);
}

/**
 * @private
 * Set required shader extension in the shader function to ShaderNodeData json.
 */
function __setExtension(
  json: ShaderityNodeData,
  splittedOriginalCode: string[]
) {
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

/**
 * @private
 * Set parameters to the ShaderNodeData json from specified format comment
 * @param json The object of the json output by this loader
 * @param sGSPcomments comments beginning with "// <SGSP>"
 */
function __setParamsFromSGSPcomments(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  __setNodeName(json, sGSPcomments);
  __setCategory(json, sGSPcomments);
  __setAvailableShaderStage(json, sGSPcomments);
  __setGUIMode(json, sGSPcomments);
  __setVaryingInterpolation(json, sGSPcomments);
  __convertToShaderOutputSocket(json, sGSPcomments);
  __removeNonSharingUniformVariableName(json, sGSPcomments);
}

/**
 * @private
 * Set node name to ShaderNodeData json.
 *
 * You can specify the node name by writing the following comment somewhere in the glsl file:
 * // <SGSP> NodeName: sample node name
 *
 * In the above case, the node name is 'sample node name'.
 */
function __setNodeName(json: ShaderityNodeData, sGSPcomments: SGSPcomment[]) {
  const regNodeName = /^NodeName[\t ]*:[\t ]*(.*)$/;
  json.nodeName = __getFirstParamFromSGSPcomment(sGSPcomments, regNodeName);
}

/**
 * @private
 * Set category to ShaderNodeData json.
 *
 * You can specify the category by writing the following comment somewhere in the glsl file:
 * // <SGSP> Category: category subCategory
 *
 * In the above case, the category is [`category`, `subCategory`].
 */
function __setCategory(json: ShaderityNodeData, sGSPcomments: SGSPcomment[]) {
  const regCategory = /^Category[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(sGSPcomments, regCategory);
  json.category = matchedStr.split(/[\t ]+/);
}

/**
 * @private
 * Set available shader stage to ShaderNodeData json.
 *
 * You can specify the available shader stage by writing the following comment
 * somewhere in the glsl file:
 * // <SGSP> AvailableShaderStage: Vertex
 *
 * The allowed values are 'Vertex', 'Fragment', and 'VertexAndFragment'.
 * The default value is 'VertexAndFragment'.
 */
function __setAvailableShaderStage(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regAvailableShaderStage = /^AvailableShaderStage[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regAvailableShaderStage
  );
  json.availableShaderStage = AvailableShaderStage.fromString(matchedStr);

  __checkSetCorrectAvailableShaderStage(
    json.availableShaderStage,
    json.socketDataArray
  );

  // default value
  if (json.availableShaderStage === AvailableShaderStage.Unknown) {
    json.availableShaderStage = AvailableShaderStage.VertexAndFragment;
  }
}

/**
 * @private
 * Verify that there are no unusable sockets on the node.
 * The attribute input socket and varying output socket cannot be used
 * in the fragment shader.
 */
function __checkSetCorrectAvailableShaderStage(
  availableShaderStage: AvailableShaderStageEnum,
  socketDataArray: SocketData[]
) {
  if (availableShaderStage !== AvailableShaderStage.Vertex) {
    for (const socketData of socketDataArray) {
      const vSocketData = socketData as
        | VaryingInputSocketData
        | VaryingOutputSocketData;
      if (
        vSocketData.varyingData != null &&
        vSocketData.direction === SG.SocketDirection.Output
      ) {
        console.error(
          'ShaderpackLoader.__checkSetCorrectAvailableShaderStage: VaryingOutputSocket can be set to vertex shader only'
        );
        throw new Error();
      }

      const aSocketData = socketData as AttributeInputSocketData;
      if (aSocketData.attributeData != null) {
        console.error(
          'ShaderpackLoader.__checkSetCorrectAvailableShaderStage: AttributeInputSocket can be set to vertex shader only'
        );
        throw new Error();
      }
    }
  }
}

/**
 * @private
 * Set gui mode to ShaderNodeData json.
 *
 * You can specify the gui mode by writing the following comment
 * somewhere in the glsl file:
 * // <SGSP> GUIMode: Standard
 *
 * The allowed values are 'Standard', 'PullDown', 'SetVector', 'SetMatrix' and 'SetTexture'.
 * The default value is 'Standard'.
 */
function __setGUIMode(json: ShaderityNodeData, sGSPcomments: SGSPcomment[]) {
  const regGUIMode = /^GUIMode[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(sGSPcomments, regGUIMode);
  json.guiMode = GUIMode.fromString(matchedStr);

  // default value
  if (json.guiMode === GUIMode.Unknown) {
    json.guiMode = GUIMode.Standard;
  }
}

/**
 * @private
 * Set varying interpolation type to varying output socket.
 *
 * You can specify the varying interpolation type by writing the following comment
 * somewhere in the glsl file:
 * // <SGSP> VaryingInterpolation: v_variableName flat
 *
 * In the above case, the interpolation type of the varying output socket
 * corresponding to the argument of the shader function whose variable name
 * is 'v_variableName' is set to 'flat'.
 *
 * The valid interpolation type values are 'flat'and 'smooth'.
 */
function __setVaryingInterpolation(
  json: ShaderityNodeData,
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
      if (
        socketData.direction !== SG.SocketDirection.Output ||
        socketData.varyingData == null
      ) {
        continue;
      }

      if (socketData.socketName === variableName) {
        socketData.varyingData.interpolationType =
          interpolationType as ShaderVaryingInterpolationType;
        break;
      }
    }
  }
}

/**
 * @private
 * Convert a socketData to shader output socket.
 * The __setSocketData method must be called prior to this method.
 *
 * You can convert a socket to shader output socket by writing
 * the following comment somewhere in the glsl file:
 * // <SGSP> ShaderOutputSocket: outVec4
 *
 * In the above case, the socket corresponding to the argument of
 * the shader function whose variable name is 'outVec4' is converted
 * to the shader output socket.
 */
function __convertToShaderOutputSocket(
  json: ShaderityNodeData,
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
      if (socket.direction === SG.SocketDirection.Output) {
        sockets[i] = {
          socketName: shaderOutputSocketVariableName,
          direction: SG.SocketDirection.Output,
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

/**
 * @private
 * Remove variable name property from uniform input socket data
 * not to share the uniform variable.
 */
function __removeNonSharingUniformVariableName(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regSharingUniformVariable = /^SharingUniformVariable[\t ]*:[\t ]*(.*)$/;
  const sharingUniformVariable = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regSharingUniformVariable
  ).trim();

  const sharingUniformVariableNames =
    sharingUniformVariable.split(/[\t ]+(?=u_.+)/);

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

/**
 * Extract the value of the parameter from the comment for this loader,
 * starting with '// <SGSP>'.
 * Return the value of the first matched line.
 * @param sGSPcomments Array of comments for this loader.
 *                     Note that '// <SGSP>' is already removed.
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
 * Extract the values of the parameter from the comment for this loader,
 * starting with '// <SGSP>'.
 * Return the values of the all matched lines.
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

/**
 * @private
 * Set GUIOption parameters to the ShaderNodeData json
 * The __setGUIMode method must be called prior to this method
 */
function __setGUIOptions(
  json: ShaderityNodeData,
  splittedOriginalCode: string[],
  sGSPcomments: SGSPcomment[]
) {
  if (json.guiMode === GUIMode.PullDown) {
    __setGUIPullDownOptions(json, splittedOriginalCode);
  } else if (json.guiMode === GUIMode.SetVector) {
    __setGUISetVectorOptions(json, sGSPcomments);
  } else if (json.guiMode === GUIMode.SetMatrix) {
    __setGUISetMatrixOptions(json, sGSPcomments);
  }
}

/**
 * @private
 * Set GUIOption parameters for pull down mode to the ShaderNodeData json.
 * You can set two options 'PullDown_Description' and 'PullDown_DisplayName'.
 *
 * To set 'PullDown_Description', write the following comment somewhere in the glsl file:
 * // <SGSP> PullDown_Description: position mode
 *
 * To set 'PullDown_DisplayName', write the comment
 * directly above the corresponding shader function with a void return value.
 * The following is the example:
 * // <SGSP> PullDown_DisplayName: view
 * void inputPosition_view(
 */
function __setGUIPullDownOptions(
  json: ShaderityNodeData,
  splittedOriginalCode: string[]
) {
  json.guiOptions = json.guiOptions ?? {};
  json.guiOptions.pullDown = {
    description: '',
    items: [],
  };

  const regPullDownDescription = /^PullDown_Description[\t ]*:[\t ]*(.*)$/;
  const regPullDownDisplayName = /^PullDown_DisplayName[\t ]*:[\t ]*(.*)$/;

  const functionNames: string[] = [];

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
      const duplicateFunctionName = functionNames.some(
        name => name === functionName
      );

      if (duplicateFunctionName) {
        throw new Error(
          'ShaderpackLoader.__setGUIPullDownOptions: found duplicate function name'
        );
      }
      functionNames.push(functionName);

      const item: PullDownItem = {functionName};
      if (displayName != null) {
        item.displayName = displayName;
        displayName = undefined;
      }
      json.guiOptions.pullDown.items.push(item);
    }
  }
}

/**
 * @private
 * Set GUIOption parameters for set vector mode to the ShaderNodeData json.
 * You can set three options 'SetVector_Descriptions', 'SetVector_DefaultValues' and 'SetVector_Step'.
 *
 * To set 'SetVector_Descriptions', write the following comment somewhere in the glsl file:
 * // <SGSP> SetVector_Descriptions: u_uniformSocketName r g b a
 *
 * To set 'SetVector_DefaultValues', write the following comment somewhere in the glsl file:
 * // <SGSP> SetVector_DefaultValues: u_uniformSocketName 1 1 1 1
 *
 * To set 'SetVector_Step', write the following comment somewhere in the glsl file:
 * // <SGSP> SetVector_Step: u_uniformSocketName 1
 */
function __setGUISetVectorOptions(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regSetVectorDescriptions = /^SetVector_Descriptions[\t ]*:[\t ]*(.*)$/;
  const regSetVectorDefaultValues =
    /^SetVector_DefaultValues[\t ]*:[\t ]*(.*)$/;
  const regSetVectorStep = /^SetVector_Step[\t ]*:[\t ]*(.*)$/;

  const matchedDescriptionsArray = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regSetVectorDescriptions
  );
  const matchedDefaultValuesArray = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regSetVectorDefaultValues
  );
  const matchedStepArray = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regSetVectorStep
  );

  if (
    matchedDescriptionsArray.length === 0 &&
    matchedDefaultValuesArray.length === 0
  ) {
    return;
  }

  json.guiOptions = json.guiOptions ?? {};
  json.guiOptions.setVector = {};

  for (let i = 0; i < matchedDescriptionsArray.length; i++) {
    const matchedDescriptions = matchedDescriptionsArray[i];
    const params = matchedDescriptions.split(/[\t ]+/);
    const socketName = params.shift() as string;
    const descriptions = params;

    json.guiOptions.setVector[socketName] = {
      descriptions,
    };
  }

  for (let i = 0; i < matchedDefaultValuesArray.length; i++) {
    const matchedDefaultValues = matchedDefaultValuesArray[i];
    const params = matchedDefaultValues.split(/[\t ]+/);
    const socketName = params.shift() as string;
    const defaultValues = params.map(str => Number(str));
    json.guiOptions.setVector[socketName] =
      json.guiOptions.setVector[socketName] ?? {};
    json.guiOptions.setVector[socketName].defaultValues = defaultValues;
  }

  for (let i = 0; i < matchedStepArray.length; i++) {
    const matchedStep = matchedStepArray[i];
    const params = matchedStep.split(/[\t ]+/);
    const socketName = params.shift() as string;
    const step = Number(params[0]);
    json.guiOptions.setVector[socketName] =
      json.guiOptions.setVector[socketName] ?? {};
    json.guiOptions.setVector[socketName].step = step;
  }
}

/**
 * @private
 * Set GUIOption parameters for set matrix mode to the ShaderNodeData json.
 * You can set 'SetMatrix_DefaultValues'.
 * We don't need to specify the socket in this option since
 * the set matrix node can have only one input socket.
 *
 * To set 'SetMatrix_DefaultValues', write the following comment somewhere in the glsl file:
 * // <SGSP> SetMatrix_DefaultValues: 1 0 0 0   0 1 0 0   0 0 1 0   0 0 0 1
 */
function __setGUISetMatrixOptions(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regSetMatrixDefaultValues =
    /^SetMatrix_DefaultValues[\t ]*:[\t ]*(.*)$/;

  const matchedDefaultValuesArray = __getFirstParamFromSGSPcomment(
    sGSPcomments,
    regSetMatrixDefaultValues
  );

  if (matchedDefaultValuesArray.length === 0) {
    return;
  }

  const defaultValues = matchedDefaultValuesArray.split(/[\t ]+/);

  json.guiOptions = json.guiOptions ?? {};
  json.guiOptions.setMatrix = {
    defaultValues: defaultValues.map(str => Number(str)),
  };
}

/**
 * @private
 * Changes the socket name from the argument name of the shader function to the specified value.
 * However, the name of the uniform input socket cannot be changed
 * because it is used when the GUIMode is setVector.
 *
 * This method should be called at the end of the loader,
 * since the argument of the shader function will be used for other options.
 *
 * You can set a socket name by writing the following comment somewhere in the glsl file:
 * // <SGSP> SocketName: outVec4 vector4
 *
 * In the above case, the name of the socket corresponding to the argument of
 * the shader function whose variable name is 'outVec4' is set to 'vector4'
 */

function __changeSocketName(
  json: ShaderityNodeData,
  sGSPcomments: SGSPcomment[]
) {
  const regSocketName = /^SocketName[\t ]*:[\t ]*(.*)$/;
  const socketNames = __getAllParamsFromSGSPcomment(
    sGSPcomments,
    regSocketName
  );

  for (let i = 0; i < socketNames.length; i++) {
    const [, variableName, socketName] = socketNames[i].match(
      /^(\w+)[\t ]+(.*)$/
    ) as RegExpExecArray;

    const isUniformVariable = variableName.match(/^u_/) != null;
    if (isUniformVariable) {
      continue;
    }

    for (let j = 0; j < json.socketDataArray.length; j++) {
      const socketData = json.socketDataArray[j];

      if (socketData.socketName === variableName) {
        socketData.socketName = socketName;
        break;
      }
    }
  }
}
