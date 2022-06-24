// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var request_config = require('../bin/config');
var merge = require('webpack-merge');

const envDetail = request_config.ENV_DETAIL;
console.log('config/st-index.js');
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  return fmt;
};
const build_default = {
    // prod - master分支
  env: require('./prod.env'),
  envDetail: envDetail,
  index: path.resolve(__dirname, '../webapp/index.html'),
  assetsRoot: path.resolve(__dirname, '../webapp'),
  assetsSubDirectory: 'static',
  assetsPublicPath: 'https://static1.dongqiudi.com/dqd-node/', // 正式 静态资源目录 staticDomain
  appDomain: '//api.dongqiudi.com', // api域名
  apiDomainPrefixer: '',
  productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
};
const build_detail = {
  prod: {
      // prod - master分支
    assetsPublicPath: 'https://crowdfunding-cardmall.dongqiudi.com/', // 正式 静态资源目录 staticDomain
    appDomain: '//crowdfunding-cardmall.dongqiudi.com', // api域名
    apiDomainPrefixer: ''
  },
  beta: {
    // beta - beta 分支
    assetsPublicPath: 'https://beta-crowdfunding-cardmall.dongqiudi.com/', // beta 静态资源目录 staticDomain
    appDomain: '//beta-crowdfunding-cardmall.dongqiudi.com', // api域名
    apiDomainPrefixer: ''
  },

  test: {
      // test - develop分支
    assetsPublicPath: 'http://test-crowdfunding-cardmall.dongqiudi.com/', // 静态资源目录 staticDomain
    appDomain: '//test-crowdfunding-cardmall.dongqiudi.com', // api域名
    apiDomainPrefixer: 'test1-'
  },
  dev: {
        // test - develop分支
    assetsPublicPath: 'http://test-crowdfunding-cardmall.dongqiudi.com/', // 静态资源目录 staticDomain
    appDomain: '//test-crowdfunding-cardmall.dongqiudi.com', // api域名
    apiDomainPrefixer: 'test1-'
  }
};
console.log('envDetail:' + envDetail);
module.exports = {
  build: merge(build_default, build_detail[envDetail]),  // 确定环境
  dev: {
    // dev - 本地分支
    env: require('./dev.env'),
    envDetail: '',
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/webapp/',
    appDomain: '',
    apiDomainPrefixer: '',
    proxyTable: {
      '/hgn': {
        target: 'http://10.18.7.108:7777'
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
