import * as types from './types';
export default {
  //设置终端类型列表
  setDomainModuleList({ commit }, data) {
    commit(types.SET_DOMAINMODULELIST, data);
  }
};
