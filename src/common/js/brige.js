import Vue from 'vue';
import browers from 'src/utils/browers';
window.connectWebViewJavascriptBridge = function (callback) {
  if (browers.version >= 729 && browers.iOS) {
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

const bridge = Vue.prototype.$bridge = {
  callHandler (bridgeName, sendData, callbackFn, successFn, errFn) {
    var agencyCallback;
    if (callbackFn) {
      agencyCallback = function agencyFn (cdata) {  // 代理一层回调
        callbackFn(cdata);
        // 做统一处理时代码书写处 successFn errFn
      };
    }
    connectWebViewJavascriptBridge(bridge => {
      bridge.callHandler(bridgeName, sendData, agencyCallback);
    });
  },
  registerHandler (...args) {
    connectWebViewJavascriptBridge(bridge => {
      bridge.registerHandler(...args);
    });
  }
};

export default bridge;
