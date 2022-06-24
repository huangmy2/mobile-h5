var browers = window.browers = {};
var ua = navigator.userAgent.toLowerCase();
var version;
browers.Android = ua.match(/android/);
browers.iOS = ua.match(/ipad|iphone|ios/);
browers.appUA = ua.match(/newsapp\/([\d.]+)/i);
if (browers.appUA && browers.appUA.length && browers.appUA.length > 1) {
  version = parseInt(browers.appUA[1].replace(/\./ig, ''));
  browers.version = version;
}
module.exports = browers;
