import config from '@/config/config';

import transport from './transport';
import configManage from './configManage';
import product from './product';
import user from './user';
import match from './match';
const baseURL = config.baseURL;
const menuUrl = config.menuUrl;

/* ----------公共接口---------- */
let baseApi = {};
baseApi.baseURL = baseURL;
// 图片上传
baseApi.upload = config.uploadURL + '/common/api/file/upload';
// 图片前缀
baseApi.getPrefix = config.uploadURL + '/common/api/file/prefix/new';
// 费用字典
baseApi.getCostDict = baseURL + '/dict/rail/cost';
// 获取登录人权限
baseApi.getUserMenu = baseURL + '/sys/permisson';
// 登出
baseApi.login = baseURL + '/login';
// 登出
baseApi.logout = baseURL + '/logout';
// 个人信息
baseApi.userQuery = baseURL + '/sys/user';

// 获取字典
baseApi.getSysDictByType = baseURL + '/sys/getSysDict';
// 导出全部api
let api = { ...baseApi, ...transport, ...configManage, ...product, ...user, ...match };

export default api;
