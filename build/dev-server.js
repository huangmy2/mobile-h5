require('./check-versions')()
const IP = require('ip').address()
const fs = require('fs')
let config = require('../config/index.js')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let chalk = require('chalk')
let opn = require('opn')
let webpack = require('webpack')
//var proxyMiddleware = require('http-proxy-middleware')
const proxy = require('koa-server-http-proxy')

let webpackDevMiddleware = require('koa-webpack-dev-middleware')
let webpackHotMiddleware = require('koa-webpack-hot-middleware')
let webpackConfig = require('./webpack.dev.conf.js')
const webapp = require('../routes/webapp')
//const pages = require('../routes/pages')
const commonMiddle = require('../lib/middlewares/commonMiddle')// 设置全局Authorization

const serve = require('koa-static2')
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
let autoOpenBrowser = !!config.dev.autoOpenBrowser

let path = require('path')
let Koa = require('koa')
let views = require('koa-views')
let Router = require('koa-router')
let router = new Router()
let app = new Koa()

let compiler = webpack(webpackConfig)
app.use(serve('pages', path.resolve(__dirname, '../src/pages')))
app.use(serve('common', path.resolve(__dirname, '../src/common')))

// 模版引擎
app.use(views(path.join(__dirname, '../views'), {
  map: {
    html: 'handlebars'
  },
  extension: 'html'
}))


app.use(webpackDevMiddleware(compiler, {
  watchOptions: {
    ignored: /node_modules/
  },
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))
app.use(webpackHotMiddleware(compiler, { log: false, reload: true }))

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  options.cookieDomainRewrite= {
    "*": IP
  }
  app.use(proxy(options.filter || context, options))
})

// router
router.use('/webapp', commonMiddle, webapp.routes(), webapp.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = `http://${IP}:` + port
  console.log(chalk.yellow('uri: ' + uri))

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    var uriOpen = uri + (process.env.subProjectName ? ('/webapp/' + process.env.subProjectName.split(',')[0] + '.html') : '')
    opn(uriOpen)
  }
})
