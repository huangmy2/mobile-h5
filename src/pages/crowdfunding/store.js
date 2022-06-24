import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  userInfo: null
};
const mutations = {
  getUserInfo (state, data) {
    state.userInfo = data;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
