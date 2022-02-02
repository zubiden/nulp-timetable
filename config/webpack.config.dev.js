const path = require('path')
const config = require('./webpack.config.js')

config.devServer = {
  historyApiFallback: true,
  port: 8070,
  host: "0.0.0.0",
  allowedHosts: "all",
  static: [
    {
      directory: path.join(__dirname, '../build'),
    },
  ],
  client: {
    overlay: false,
  }
}

config.devtool = 'inline-source-map'

module.exports = config
