const path = require('path');
const webpack = require('webpack');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var config = '';
var request_config = require('../bin/config');
const envNew = request_config.ENV_NEW || false
if(envNew){
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  config = require('../config/st-index.js')
}else{
  config = require('../config/index.js')
}

module.exports = {
  entry: {
    vendor: ['vue','vue-router','vuex', 'babel-polyfill','axios']
  },
  output: {
    path: path.join(__dirname, './dll'),
    filename: 'vendor.dll.js',
    library: 'vendor_library'       // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, './dll', '[name]-manifest.json'),
      name: 'vendor_library'
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS:{
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    })

  ]
};
