const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config.base.js');

const config = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'shaderity-graph-shaderpack.min.js',
    chunkFilename: 'shaderity-graph-shaderpack-[name].min.js',
    path: path.resolve(__dirname, './../../dist/umd'),
    library: 'ShaderityGraphShaderpack',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});

module.exports = config;
