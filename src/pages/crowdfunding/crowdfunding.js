import Vue from 'vue';
import 'src/base.js';
import App from './App';
import axios from 'axios';
import qs from 'qs';
import store from './store';
import 'babel-polyfill';
import 'src/common/js/brige';
import router from './router';
import Stat from 'src/utils/stat';
import browers from '../../utils/browers';
import wxShare from 'src/common/js/dqd.share/wxShare';
import VueCookie from 'vue-cookie';
import VueClipboard from 'vue-clipboard2';

import { Tab, Tabs, Sticky, List, Search, Popup, PullRefresh, Swipe, SwipeItem, ImagePreview, ActionSheet, Dialog, Toast, Field, Uploader, Picker, DatetimePicker, Area, RadioGroup, Radio, Badge, Icon, Checkbox, Cell, Loading, CheckboxGroup, Stepper, CountDown } from 'vant';

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(VueClipboard);
Vue.use(Sticky);
Vue.use(List);
Vue.use(Search);
Vue.use(Popup);
Vue.use(PullRefresh);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(ImagePreview);
Vue.use(ActionSheet);
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Field);
Vue.use(Uploader);
Vue.use(Picker);
Vue.use(DatetimePicker);
Vue.use(Area);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Badge);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.use(Cell);
Vue.use(Loading);
Vue.use(CheckboxGroup);
Vue.use(Stepper);
Vue.use(CountDown);
axios.defaults.withCredentials = true;
// 微信分享
Vue.prototype.$wechatShare = wxShare;
window.wechatShare = wxShare;

Vue.prototype.$cookie = VueCookie;
Vue.prototype.$stat = Stat;
Vue.prototype.$browers = browers;
Vue.prototype.$qs = qs;
// 携带auth
window.auth = sessionStorage.getItem('openid') || '';

function getAuthFromApp() {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('openid') && sessionStorage.getItem('openid') !== 'undefined') {
      return false;
    }
    var code = getUrlParam('code'); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
    var local = window.location.href;
    var APPID = getAppId();
    if (code == null || code === '') {
      window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=#wechat_redirect');
    } else {
      let origin = API_MAP['qxk-passport'];
      axios.get(`${origin}/user/getUserInfoByOpenId?code=${code}&channel_type=1`).then((res) => {
        let data = res.data;
        if (data.code === 0) {
          sessionStorage.setItem('userinfo', JSON.stringify(data.data.user));
          sessionStorage.setItem('openid', data.data.user.openid);
          if (data.data.user.openid) {
            window.auth = data.data.user.openid;
            createAppFn();
            resolve();
          }
        }
      });
    }
  });
};

// 通过不同环境，设置不同的appid
function getAppId() {
  let appid;
  if (location.hostname.indexOf('test') > -1 || location.hostname.indexOf('192.168') > -1 || location.hostname.indexOf('10.18') > -1) {
    appid = 'wxd310655463f46282';
  } else {
    appid = 'wx067aae02e7ed4185';
  }
  return appid;
};

// 获取地址栏的参数
function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
};

async function getAuth() {
  // 开发环境登录假数据
  if (location.hostname.indexOf('10.18') > -1 || location.hostname.indexOf('192.168') > -1) {
    let userInfo = {
      'name': 'ʎɯɥ',
      'avatar': 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJSoHRiasmEsSM4guEypibjic2tp7nSX1ibYdj2RQ9Izn9Tqniawicezic1icT6JM1kEdYdCN2LKuQCG23Jqg/132',
      'user_no': '2022053117361200010001',
    // 'openid': 'osfjzngjsabhjjwqkeqktwnetwetiew',
      'openid': 'osV1pwZFql8oxMgbYei_B22llZbw',
      'union_user_id': 'oyNXZ53cOFZDR1tXljPSUbTsOP1U',
      'is_has_phone': 1
    };
    sessionStorage.setItem('userinfo', JSON.stringify(userInfo));
    sessionStorage.setItem('openid', JSON.stringify(userInfo.openid));
  }
  if (sessionStorage.getItem('openid') && sessionStorage.getItem('openid') !== 'undefined') {
    createAppFn();
  } else {
    await getAuthFromApp();
  }
};
getAuth();

function createAppFn() {
  // 创建axios实例
  Vue.prototype.$axios_search = axios.create({
    baseURL: API_MAP['qxk-search'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_goods = axios.create({
    baseURL: API_MAP['qxk-goods'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_orders = axios.create({
    baseURL: API_MAP['qxk-orders'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_medias = axios.create({
    baseURL: API_MAP['qxk-medias'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_passport = axios.create({
    baseURL: API_MAP['qxk-passport'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_notice = axios.create({
    baseURL: API_MAP['qxk-notice'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  Vue.prototype.$axios_database = axios.create({
    baseURL: API_MAP['qxk-database'],
    headers: {
      'UUID': _globalParams.UUID,
      'Authorization': window.auth || '' // 登陆信息
    }
  });
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
      App
    }
  });
}
