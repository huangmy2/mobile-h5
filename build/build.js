require('./check-versions')()
process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf.js')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()

var config = ''
var request_config = require('../bin/config')
const envNew = request_config.ENV_NEW || false

if(envNew){
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  config = require('../config/st-index.js')
}else{
  config = require('../config/index.js')
}

var spinner = ora('building for production...')
spinner.start()


//webpack(smp.wrap(webpackConfig), function (err, stats) {
webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  var date = new Date(stats.endTime - stats.startTime);
  console.log(chalk.cyan(`  Build complete.\n  Total time:${date.getMinutes()}m${date.getSeconds()}s\n`));
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})
