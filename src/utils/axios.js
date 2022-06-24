window.API_MAP = require('./apimap').api;
const axios = require('originAxios');
const browers = require('./browers');
const create = axios.create;

if (!window.connectWebViewJavascriptBridge) {
  window.connectWebViewJavascriptBridge = function (callback) {
    // 直播君，懂球帝此页面公用一套bridge方法，
    // 懂球帝ios客户端729版本以上更换wkwebview,直播君第一版本使用
    if ((browers.version >= 729 && browers.iOS) || (browers.iOS && browers.is_matchLiveApp)) {
      if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe); }, 0);
    } else {
      if (window.WebViewJavascriptBridge) {
        if (!WebViewJavascriptBridge._messageHandler) {
          WebViewJavascriptBridge.init(function (message, responseCallback) {});
        }
        callback(WebViewJavascriptBridge);
      } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
          if (!WebViewJavascriptBridge._messageHandler) {
            WebViewJavascriptBridge.init(function (message, responseCallback) {});
          }
          callback(WebViewJavascriptBridge);
        }, false);
      }
    }
  };
}

// 本地dev环境中，代理转发 process.env.mock == 'local'
const proxyForMock = function (config) {
  let url = config.url;
  let parser = document.createElement('a');
  parser.href = url;
  if (url.search('http') !== 0) {     // 查找请求地址带不带完整头部
    if (url.split('_/').length > 2) { // 判断在url参数中是否有转发标识符 ‘_/’为转发标识符特征前缀
      config.baseURL = ''; // url中存转发标识符 优先按照url中的转发标识符进行转发，baseURL置空，避免互相影响
      config.url = '/' + url.split('_/')[2]; // 去除第一位的转发标识符
    } else {
      if (config.url) {
        config.url = config.url.substring(1);
      }
      if (config.baseURL) {
        config.baseURL = config.baseURL.substring(1);
      }
    }
  }
  return config;
};

// 接口如果返回480，客户端强制退出登录
const interceptorSuccess = function (response) {
  if (parseInt(response.status) === 480) {
    connectWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('userKickOut', {}, function () {});
    });
  }
  return response;
};

const interceptorError = function (error) {
  if (error && error.response && parseInt(error.response.status) === 480) {
    connectWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('userKickOut', {}, function () {});
    });
  }
  return Promise.reject(error);
};

// 全局加拦截器
axios.create = function (...args) {
  const instance = create.apply(axios, args);
  instance.interceptors.response.use(interceptorSuccess, interceptorError);
  if (process.env.mock) {
    instance.interceptors.request.use(proxyForMock);
  }
  return instance;
};

// Add a response interceptor
axios.interceptors.response.use(interceptorSuccess, interceptorError);
if (process.env.mock) {
  axios.interceptors.request.use(proxyForMock);
}

export default axios;
