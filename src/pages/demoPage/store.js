import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  testResult: null
};
const mutations = {
  changeTestResult (state, data) {
    state.testResult = data;
  }
};
export default new Vuex.Store({
  state,
  mutations
});
