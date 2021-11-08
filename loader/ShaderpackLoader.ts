import {CustomNodeModule, SGSPcomment} from './ShaderpackLoaderType';
import {ShaderNodeData} from './../src/type/Type';
import {AvailableShaderStage, GUIMode} from '../src/type/Enum';

module.exports = function (source: string) {
  (this as CustomNodeModule).cacheable();

  const resultJson: ShaderNodeData = {
    shaderFunctionName: '',
    shaderFunctionCode: '',
    extensions: [],
    socketDataArray: [],
    nodeName: '',
    availableShaderStage: AvailableShaderStage.Unknown,
    guiMode: GUIMode.Unknown,
    guiOptions: {},
  };

  const splittedOriginalCode = __splitByLineFeedCode(source);
  const sGSPcomments: SGSPcomment[] =
    __getCommentsForShaderityGraphShaderPack(splittedOriginalCode);

  console.log('SGSPcomments');
  console.log(sGSPcomments);

  __setParamsFromShaderCode(resultJson, splittedOriginalCode);
  __setParamsFromSGSPcomments(resultJson, sGSPcomments);

  console.log('resultJson');
  console.log(resultJson);

  return `export default ${JSON.stringify(resultJson)}`;
};

// =========================================================================================================
// private functions
// =========================================================================================================

const regSGSP = /^[\t ]*\/\/[\t ]*<[\t ]*SGSP[\t ]*>(.*)$/;
const regExtension = /^[\t ]*#[\t ]*extension[\t ]*(.*):.*$/;

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

function __setShaderFunctionCode(
  json: ShaderNodeData,
  splittedShaderFunctionCode: string[]
) {
  json.shaderFunctionCode = __joinSplittedLine(splittedShaderFunctionCode);
}

function __setExtension(json: ShaderNodeData, splittedOriginalCode: string[]) {
  for (let i = 0; i < splittedOriginalCode.length; i++) {
    const matchedLine = splittedOriginalCode[i].match(regExtension);

    if (matchedLine != null) {
      const extensionName = matchedLine[1].trim();
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
}

function __setGUIMode(json: ShaderNodeData, sGSPcomments: SGSPcomment[]) {
  const regGUIMode = /^GUIMode[\t ]*:[\t ]*(.*)$/;
  const matchedStr = __getFirstParamFromSGSPcomment(sGSPcomments, regGUIMode);
  json.guiMode = GUIMode.fromString(matchedStr);
}

/**
 *
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
