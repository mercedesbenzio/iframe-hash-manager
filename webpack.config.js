var webpack = require('webpack')
var path = require('path')

module.exports = function (options) {
  options = options || {}
  return {
    entry: './index',
    resolve: {
      extensions: [ '.es6', '.js' ]
    },
    output: {
      filename: 'iframeHashManager.js',
      path: path.resolve(__dirname, 'dist'),
      library: "iframeHashManager",
      libraryTarget: "umd"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['babel-loader']
        }
      ]
    }
  }
}
