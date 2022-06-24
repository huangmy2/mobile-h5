import Vue from 'vue';
import 'src/base.js';
import App from './App';
import axios from 'axios';
import 'babel-polyfill';
import 'src/common/js/brige';
import router from './router';
import wxShare from 'src/common/js/dqd.share/wxShare';
import stat from 'src/utils/stat';
import store from './store';
Vue.prototype.$stat = stat;
Vue.prototype.$wechatShare = wxShare;
window.wechatShare = wxShare;

// 创建axios实例
Vue.prototype.$axios = axios.create({
  baseURL: API_MAP['api'],
  headers: {
    'UUID': _globalParams.UUID,
    'Authorization': _globalParams.Authorization || '' // 登陆信息
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  router,
  components: {
    App
  }
});
