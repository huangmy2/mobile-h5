var utils = require('./utils')
var config = require('../config/index.js')
var isProduction = process.env.NODE_ENV === 'production'
var px2rem = require('postcss-px2rem-exclude')
var autoprefixer = require('autoprefixer');
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: function () {
    return [
      px2rem({
        rootValue:75,
        exclude:/src\/module|node_modules/,
      }),
      autoprefixer({
        browsers: [
          '>1%',
          'iOS >= 7',
          'Firefox >= 20',
          'Android > 4.4'
        ]
      })
    ]
  }
}
