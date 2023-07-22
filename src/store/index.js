import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from "vuex/dist/logger";
import state from './state';
import getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
