const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = function (options) {
  options = options || {}
  return {
    mode: 'development',
    entry: {
      'extractRoutes.spec': './src/extractRoutes.spec',
      'fp.spec': './src/fp.spec',
      'logic.spec': './src/logic.spec'
    },
    resolve: {
      extensions: [ '.es6', '.js' ]
    },
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'src'),
      filename: '[name].js'
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  }
}
