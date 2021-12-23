const path = require('path');

module.exports = {
  entry: './src/index.ts',

  module: {
    rules: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['json-loader'],
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              './../../loader/dist/loader/ShaderpackLoader.js'
            ),
          },
        ],
      },
      {
        test: /\.ts$/,
        include: /ShaderPack.ts/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              './../../loader/dist/loader/NodeDefinitionsImportLoader.js'
            ),
          },
        ],
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
