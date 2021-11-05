module.exports = function (source) {
  this.cacheable();

  const resultJson = {
    shaderFunctionName: '',
    shaderFunctionCode: source,
    extensions: [],
    socketDataArray: [],
    nodeName: '',
    availableShaderStage: 'vertexandfragment',
    guiMode: 'standard',
    guiOptions: {},
  };

  return `export default ${JSON.stringify(resultJson)}`;
};
