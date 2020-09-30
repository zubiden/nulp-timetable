const config = require('./webpack.config.js')
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

config.mode = 'production'

config.optimization = {
  splitChunks: {
    chunks: 'all'
  },
  minimize: true,
  minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
}

module.exports = config
