// const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',

	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',

				test: /\.js$/
			}
		]
	},

	mode: 'production',

	optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true
    })],
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: false
		}
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weissman.js',
    globalObject: 'this',
    library: 'weissman',
    libraryTarget:'umd'
  }
};
