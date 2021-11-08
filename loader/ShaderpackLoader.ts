import {CustomNodeModule, SGSPcomment} from './ShaderpackLoaderType';
import {ShaderNodeData} from './../src/type/Type';
import {AvailableShaderStage, GUIMode} from '../src/type/Enum';

module.exports = function (source: string) {
  (this as CustomNodeModule).cacheable();

  const resultJson: ShaderNodeData = {
    shaderFunctionName: '',
    shaderFunctionCode: source,
    extensions: [],
    socketDataArray: [],
    nodeName: '',
    availableShaderStage: AvailableShaderStage.Unknown,
    guiMode: GUIMode.Unknown,
    guiOptions: {},
  };

  const splittedCode = __splitByLineFeedCode(source);
  const sGSPcomments: SGSPcomment[] =
    __getCommentsForShaderityGraphShaderPack(splittedCode);

  console.log('SGSPcomments');
  console.log(sGSPcomments);

  return `export default ${JSON.stringify(resultJson)}`;
};

// =========================================================================================================
// private functions
// =========================================================================================================

function __splitByLineFeedCode(str: string) {
  return str.split(/\r\n|\n/);
}

function __getCommentsForShaderityGraphShaderPack(
  shaderCodeLines: string[]
): SGSPcomment[] {
  const sGSPcomments: SGSPcomment[] = [];

  const regSGSP = /^[\t ]*\/\/[\t ]*<[\t ]*SGSP[\t ]*>(.*)$/;

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
