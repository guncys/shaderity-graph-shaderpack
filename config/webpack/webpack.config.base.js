const path = require('path');

module.exports = {
  entry: './src/index.ts',

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: path.resolve(
          __dirname,
          './../../loader/dist/loader/ShaderpackLoader.js'
        ),
      },
      {
        test: /\.ts$/,
        include: /ShaderPack.ts/,
        loader: path.resolve(
          __dirname,
          './../../loader/dist/loader/NodeDefinitionsImportLoader.js'
        ),
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules'],
  },
  output: {
    publicPath: './../../dist/', // Change the path to load splitted code chunks according to your wish.
  },
  optimization: {
    chunkIds: 'named',
  },
};
