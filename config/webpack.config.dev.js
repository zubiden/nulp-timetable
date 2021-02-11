const path = require('path')
const config = require('./webpack.config.js')

config.devServer = {
  historyApiFallback: true,
  contentBase: path.join(__dirname, '../build'),
  port: 8070,
  host: "0.0.0.0",
  disableHostCheck: true //ngrok
}

config.devtool = 'inline-source-map'

module.exports = config
