const config = require('./webpack.config.js');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

config.mode = 'production'

config.optimization = {
  splitChunks: {
    chunks: 'all'
  },
  minimize: true,
  minimizer: [new CssMinimizerPlugin()],
}

module.exports = config
