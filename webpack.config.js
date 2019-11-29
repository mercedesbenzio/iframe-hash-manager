const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/',
  resolve: {
    extensions: [ '.es6', '.js' ]
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'iframeHashManager.js',
    library: 'iframeHashManager',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.es6$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
}