const path = require('path');

module.exports = {
  entry: './src/index.ts',

  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              './../../loader/shaderpackLoader.js'
            ),
          },
        ],
      },
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
