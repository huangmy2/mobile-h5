// 根据userAgent获取浏览器属性
var browers = window.browers = {};
var ua = navigator.userAgent.toLowerCase();
var version;
var isGoogleApp;
browers.Android = ua.match(/android/);
browers.iOS = ua.match(/ipad|iphone|ios/);
browers.ie = ua.match(/iemobile/);
browers.isWifi = ua.match(/nettype\/wifi|technology\/wifi/);
browers.force_ssl = ua.match(/Android (5|6)/i);
browers.is_ios_6 = ua.match(/iOS 6/i);
browers.is_liveapp = ua.match(/LiveApp/i);
browers.is_matchLiveApp = ua.match(/MatchLive/i);
browers.is_vip = ua.match(/videoApp/i);
browers.is_vip_741 = ua.match(/videoApp\/7\.4\.1/i);
browers.appUA = ua.match(/NewsApp\/([\d.]+)/i);
browers.iphoneX = /iphone/gi.test(ua) && (screen.height === 812 && screen.width === 375);
browers.iphoneXMax = /iphone/gi.test(ua) && (screen.height === 896 && screen.width === 414);
browers.googleUA = ua.match(/googleApp\/([\d.]+)/i);

browers.wx = !!ua.match(/micromessenger/);
browers.MQQBrowser = navigator.userAgent.indexOf('MQQBrowser') > -1;
browers.qq = ua.match(/QQ/i) === 'qq';
browers.weibo = ua.match(/WeiBo/i) === 'weibo';

if (browers.appUA && browers.appUA.length && browers.appUA.length > 1) {
  var v = browers.appUA[1].replace(/\./ig, '');
  version = parseInt(v);
  browers.version = version;
}
if (browers.googleUA && browers.googleUA.length && browers.googleUA.length > 0) {
  isGoogleApp = true;
  browers.isGoogleApp = isGoogleApp;
}
module.exports = browers;
