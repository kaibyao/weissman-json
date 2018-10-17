const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',

        test: /\.js$/,
      },
    ],
  },

  mode: 'production',

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          comments: true,
          compress: false, // compressing seems to cause errors within ServiceNow’s JS parser
          ecma: 5,
          mangle: true,
          output: {
            ascii_only: true,
            quote_keys: true,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weissman.js',
    globalObject: 'this',
    library: 'weissman',
    libraryTarget: 'umd',
  },
};
