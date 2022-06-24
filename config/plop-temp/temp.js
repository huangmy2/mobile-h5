import Vue from 'vue';
import 'src/base.js';
import App from './App';
import axios from 'axios';
import 'babel-polyfill';
import 'src/common/js/brige';
import wxShare from 'src/common/js/dqd.share/wxShare';
import stat from 'src/utils/stat';
import browers from 'src/utils/browers.js';

Vue.prototype.$stat = stat;
Vue.prototype.$wechatShare = wxShare;
Vue.prototype.$browers = browers;
window.wechatShare = wxShare;

// 创建axios实例
Vue.prototype.$axios = axios.create({
  baseURL: API_MAP['api-stock'],
  headers: {
    'UUID': _globalParams.UUID,
    'Authorization': _globalParams.Authorization || '' // 登陆信息
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
});
