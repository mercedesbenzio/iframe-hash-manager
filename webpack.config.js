const path = require('path')

module.exports = {
  entry: './src/',
  resolve: {
    extensions: [ '.es6', '.js' ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'iframeHashManager.js',
    library: 'iframeHashManager',
    libraryTarget: "umd2"
  },
  module: {
    rules: [
      {
        test: /\.es6$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              ["env", {
                "targets": {
                  "browsers": ["last 2 versions", "ie >= 11"]
                }
              }]
            ],
            "plugins": ["add-module-exports"]
          }
        }
      }
    ]
  }
}