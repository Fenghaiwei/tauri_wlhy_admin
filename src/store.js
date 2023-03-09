import Vue from 'vue';
import Vuex from 'vuex';

import global from '@/store/global/index';
import example from '@/store/example/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...global.state,
    ...example.state
  },
  mutations: {
    ...global.mutations,
    ...example.mutations
  },
  actions: {
    ...global.actions,
    ...example.actions
  }
});
