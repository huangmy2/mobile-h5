const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

var path = require('path')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')

var config = ''
var requestConfig = require('../bin/config')
var webpack = require('webpack')
const envNew = requestConfig.ENV_NEW || false
if (envNew) {
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  config = require('../config/st-index.js')
} else {
  config = require('../config/index.js')
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
let entry2 = utils.compileFile('./src/pages/**/*.js')

let entry = Object.assign({}, entry2)
module.exports = {
  entry: entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'originAxios': 'axios/index.js',
      'axios$': resolve('src/utils/axios.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel',
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.mp3(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /pages\/(.*).html$/,
        loader: 'ejs-compiled-loader'
      },
      {
        test: /activities\/(.*).html$/,
        loader: 'ejs-compiled-loader'
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      // 如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true
    }),
    new webpack.DefinePlugin({
      'process.env.mock': JSON.stringify(process.env.mock || '') 
    }),
  ]
}
