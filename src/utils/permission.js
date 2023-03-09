// 获取权限
import axios from '@/utils/axios';
import api from '@/api/api';
import store from '../store';

let permission = {
  init(isEntry) {
    return new Promise(async (resolve, reject) => {
      const options = { silence: true, backRes: true };
      let result;
      try {
        result = await axios.get(api.getUserMenu, {}, isEntry && options);
        result = result.data || [];
      } catch (error) {
        isEntry ? resolve(error) : reject({ error: true, message: error });
      }
      let perList = []; // 权限集合
      function loopTree(list) {
        list.forEach((item, idx) => {
          item.children = item.children || [];
          if (item.menuType === 1 && item.menuPermission) {
            perList.push(item.menuPermission);
          } else {
            if (item.children.length > 0) loopTree(item.children);
          }
        });
      }
      if (result.length > 0) {
        loopTree(result); // 递归循环 获取权限集合
      }
      await store.dispatch('changeMenuTree', result);
      await store.dispatch('changePermission', perList);
      await store.dispatch('setAuth', true); // 设置身份权限已获取
      resolve(result);
    });
  }
};
export default permission;
