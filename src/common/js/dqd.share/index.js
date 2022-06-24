import { setAppShare } from './appShare';
if (browers.wechat || browers.wx) {
  var wechatShare = require('./wxShare').default;
}

function setShare (config) {
  if (browers.wechat || browers.wx) {
    wechatShare(config);
  }
  if (browers.inApp || browers.appUA) {
    setAppShare(config);
  }
}

export {
  setShare
};
