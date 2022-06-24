var path = require('path')
var glob = require('glob')
var config = require('../config/index.js')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var excludeFile = require('../bin/exclude-file') // 已经下掉的活动不参与构建

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
exports.getEntries = function (globPath) {
  var entries = {}
  /**
   * 读取src目录,并进行路径裁剪
   */
  glob.sync(globPath).forEach(function (entry) {
    if (/assets/ig.test(entry)) return
    /**
     * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
     * path.extname 获取文件后缀
     */
    var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
    entries[basename] = entry
  })
  // console.log(entries);
  // 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/test.js' }
  return entries
}
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  const px2remLoader = {
      loader: 'px2rem-loader',
      options: {
          remUnit: 75,
          remPrecision: 6
      }
  };
  
  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // 配置less
  function lessResourceLoader () {
    var loaders = [
      cssLoader,
      'less-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/common/style/base.less')
          ]
        }
      }
    ]
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    //var loaders = options.usePostCSS ? [cssLoader, px2remLoader, postcssLoader] : [cssLoader, px2remLoader]
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: lessResourceLoader(),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

let appFiles = excludeFile || {}
let appFilesName = Object.keys(appFiles)
let currentTimestamp = new Date().getTime()

// 构建入口文件
exports.compileFile = function (option, type) {
  let compileFile = {}
  let files = exports.getEntries(option)
  Object.keys(files).forEach(key => {
    if (appFilesName.indexOf(key) === -1) {
      compileFile[key] = type === 'js' ? [files[key], './src/utils/performance.js'] : files[key]
    } else {
      let dateString = appFiles[key]['logoutTime']
      let pattern = /(\d{4})(\d{2})(\d{2})/
      let formatedDate = dateString.replace(pattern, '$1-$2-$3')
      let timestamp = new Date(formatedDate).getTime()
      if (timestamp > currentTimestamp) {
        compileFile[key] = type === 'js' ? [files[key], './src/utils/performance.js'] : files[key]
      }
    }
  })
  return compileFile
}
