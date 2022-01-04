import fs from 'fs';
import {CustomNodeModule} from './ShaderpackLoaderType';

const nodeDefExtensionReg = /\.(glsl|ts)$/;
const nodeDefFileNameReg = /\/(\w+)\.((|vs\.|fs\.)glsl|ts)$/;
const pathCorrectionReg = /^\.\/src\/shaderityShaders/;

module.exports = function () {
  (this as CustomNodeModule).cacheable();

  const nodeDefinitionRoot = './src/shaderityShaders/nodeDefinitions';

  const nodeDefinitionPathList: string[] = [];

  __addNodeDefinitionPathRecursivelyTo(
    nodeDefinitionPathList,
    nodeDefinitionRoot
  );

  return __createStringInShaderPackFile(nodeDefinitionPathList);
};

function __addNodeDefinitionPathRecursivelyTo(
  nodeDefPathList: string[],
  path: string
) {
  const fileAndDirNameList = fs.readdirSync(path);
  for (const fileAndDirName of fileAndDirNameList) {
    const childPath = path + '/' + fileAndDirName;

    if (fs.statSync(childPath).isDirectory()) {
      __addNodeDefinitionPathRecursivelyTo(nodeDefPathList, childPath);
      continue;
    }

    if (childPath.match(nodeDefExtensionReg)) {
      nodeDefPathList.push(childPath);
    }
  }
}

function __createStringInShaderPackFile(nodeDefPathList: string[]) {
  let importModulesStr = `import {AbstractNodeData} from '../type/Type';\n`;
  let exportStr = 'export const ShaderPack: AbstractNodeData[] = [\n';

  for (const nodeDefPath of nodeDefPathList) {
    const fileName = nodeDefPath.match(nodeDefFileNameReg)?.[1];

    if (fileName == null) {
      console.error(
        'NodeDefinitionsImportLoader.__createImportModulesString: Under the src/shaderityShaders/nodeDefinitions folder, the files must be ts, glsl, vs.glsl, or fs.glsl file.'
      );
      throw new Error(
        `NodeDefinitionsImportLoader.__createImportModulesString: ${nodeDefPath} is the invalid node definition file.`
      );
    }

    let nodeDefPathFromNodeDefinitionRoot = nodeDefPath.replace(
      pathCorrectionReg,
      '.'
    );

    nodeDefPathFromNodeDefinitionRoot =
      nodeDefPathFromNodeDefinitionRoot.replace(/\.ts$/, '');

    importModulesStr += `import ${fileName} from '${nodeDefPathFromNodeDefinitionRoot}';\n`;

    exportStr += `  ${fileName},\n`;
  }

  exportStr += '];\n';

  return importModulesStr + '\n\n' + exportStr;
}
