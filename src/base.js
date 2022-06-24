import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import './common/js/flexible';// 兼容
// import { _globalParams, _getHostName, _getQuery } from 'src/utils/tool';
// import stat from 'src/utils/stat'; // 埋点
// import './utils/browers'// 浏览器属性browers
// import './common/js/brige'// 调用客户端方法

// import { setShare } from 'src/common/js/dqd.share'
// import FastClick from 'fastclick' //300毫秒延迟 FastClick.attach(document.body)

// import axios from 'axios';

// 创建axios实例
// Vue.prototype.$axios = axios.create({
//   baseURL: API_MAP['api'],
//   timeout: 5000, // 请求超时时间
// })

// 直接写px，编译后会直接转化成rem ---- 除开下面两种情况，其他长度用这个
// 在px后面添加/*no*/，不会转化px，会原样输出。 --- 一般border需用这个
// 在px后面添加/*px*/,会根据dpr的不同，生成三套代码。---- 一般字体需用这个

// polyfill Intl to resolve sentry error
if (!window.Intl) {
  const intlFomator = function () {};
  intlFomator.prototype.format = function (value) {
    console.warn('Intl format is not supported');
    return value;
  };
  window.Intl = {
    DateTimeFormat: intlFomator,
    NumberFormat: intlFomator
  };
}

if (process.env.NODE_ENV === 'production') {
  Raven
    .config('https://c09ce3ac92f1405f9c88d2608ee451b1@sentry.dongqiudi.net/57')
    .addPlugin(RavenVue, Vue)
    .install();
}
