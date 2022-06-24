var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
var config = ''
var requestConfig = require('../bin/config')
const envNew = requestConfig.ENV_NEW || false
if (envNew) {
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  config = require('../config/st-index.js')
} else {
  config = require('../config/index.js')
}
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

var env = config.build.env
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 预编译
    new webpack.DllReferencePlugin({
      name: 'vendor_library',
      context: path.resolve(__dirname, '..'),
      manifest: require('./dll/vendor-manifest.json')
    }),
    // 这个主要是将生成的vendor.dll.js文件加上hash值插入到页面中。
    new AddAssetHtmlPlugin([{
      filepath: path.resolve(__dirname, './dll/vendor.dll.js'),
      publicPath: config.build.assetsPublicPath + 'static/dll',
      outputPath: utils.assetsPath('js'),
      includeSourcemap: false,
      hash: true
    }]),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    }),
    // 降低文件大小
    new webpack.optimize.OccurrenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      canPrint: false,
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
    }),
    new webpack.DefinePlugin({
      API_ROOT: JSON.stringify(config.build.appDomain),
      API_ROOT_PREFIXER: JSON.stringify(config.build.apiDomainPrefixer),
      ENV_DETAIL: JSON.stringify(config.build.envDetail)
    }),
   
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                (
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0 ||
                    module.resource.indexOf(
                        path.join(__dirname, '../src/pages')
                    ) < 0 || 
                      module.resource.indexOf(
                        path.join(__dirname, '../src/activities')
                    ) < 0 || 
                      module.resource.indexOf(
                        path.join(__dirname, '../src/module')
                    ) < 0
                ) &&
                count > 5
            );
        }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor']
    }),
    
    new WebpackShellPlugin({ onBuildStart: [`echo "Webpack Start to build ${process.env.spec || 'all'}"`], onBuildEnd: [envNew ? `cp -f ./bin/st-dqd_node ./bin/dqd_node.json`:`cp -f ./bin/origin-dqd_node ./bin/dqd_node.json`, 'cp -r ./build/dll ./webapp/static/dll'] })

  ]
})

for (var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], // 模板路径
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    chunksSortMode: 'dependency',
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    chunks: ['manifest','vendor', page]
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}
if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
