/**
 * Created by liuhui on 2017/3/22.
 */
(function (window, undefined) {
  var dqd = {};

  var _ua = navigator.userAgent.toLowerCase();
  var _connectWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(WebViewJavascriptBridge)
      }, false)
    }
  };
  /*app类型判断*/
  var browser = {
    isIpad: _ua.match(/ipad/),
    isIphone: _ua.match(/iphone/),
    isAndroid: _ua.match(/android/),
    isIOS: _ua.match(/ipad|iphone|ios/),
    isIE: _ua.match(/iemobile/),
    isDqdApp: _ua.match(/NewsApp\/([\d\.]+)/i),
    appVersion: parseInt(browser.isDqdApp[1].replace(eval('/\\./ig'), '')) * 10
  };
  /*get参数*/
  var getUrlParam = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  };
  var bridge = {
    type: browser.isIOS ? "ios" : "android",
    call:function () {

    },
    register:function () {

    }
  };
  var callBridge = function (funcName, data, array) {
    if (browser.isAndroid) {
      dqd.bridge = Android;
      if (array.length === 1) {
        dqd.bridge[funcName](array[0]);
      } else if (array.length === 2) {
        dqd.bridge[funcName](array[0], array[1]);
      } else if (array.length === 3) {
        dqd.bridge[funcName](array[0], array[1], array[2]);
      }
    } else if (!dqd.bridge) {
      _connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
        });
        dqd.bridge = bridge;
        dqd.bridge.callHandler(funcName, data);
      });
    } else {
      dqd.bridge.callHandler(funcName, data);
    }
  };
  var registerBridge = function (funcName) {
    if (browser.isAndroid) {
      dqd.bridge = Android;
      return dqd.bridge[funcName]();

    } else if (!dqd.bridge) {
      _connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
        });
        dqd.bridge = bridge;
        dqd.bridge.registerHandler(funcName, function (data) {
          console.log(data)
        });
      });
    } else {
      dqd.bridge.registerHandler(funcName, function (data) {
        console.log(data)
      });
    }
  };


  dqd.browser = browser;
  dqd.callBridge = callBridge;
  dqd.registerBridge = registerBridge;
  dqd.getUrlParam = getUrlParam;
  window.dqd = dqd;
})(window);
