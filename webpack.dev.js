const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      HOST_URL: "'http://localhost:8080/'",
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
})
