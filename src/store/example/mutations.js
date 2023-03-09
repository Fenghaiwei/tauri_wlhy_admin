import * as types from './types';

const mutations = {
  [types.SET_DOMAINMODULELIST]: function(state, data) {
    state.domainModuleList = data;
  }
};
export default mutations;
