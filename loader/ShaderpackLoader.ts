import {CustomNodeModule} from './ShaderpackLoaderType';
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

  console.log('splittedCode');
  console.log(splittedCode);

  return `export default ${JSON.stringify(resultJson)}`;
};

// =========================================================================================================
// private functions
// =========================================================================================================

function __splitByLineFeedCode(str: string) {
  return str.split(/\r\n|\n/);
}
