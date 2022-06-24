var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config/index.js')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// subProjectName=demo1,demo2,demo3 npm run dev 带参数 则只build 指定的文件夹
var pages = {}
if (process.env.subProjectName) {
  baseWebpackConfig.entry = {}
  process.env.subProjectName.split(',').forEach(element => {
    Object.assign(baseWebpackConfig.entry, utils.getEntries(`./src/**/${element}/*.js`))
    Object.assign(pages, utils.getEntries(`./src/**/${element}/*.html`))
  })
} else {
  var pages2 = utils.compileFile('./src/pages/**/*.html')
  pages = Object.assign({}, pages2)
}
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

let webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      API_ROOT: JSON.stringify(config.dev.appDomain),
      API_ROOT_PREFIXER: JSON.stringify(config.dev.apiDomainPrefixer),
      ENV_DETAIL: JSON.stringify(config.dev.envDetail)
    }),
    new FriendlyErrorsPlugin()
  ]
})
for (var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page],
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    chunks: ['vendor', page]
  }

  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
module.exports = webpackConfig
