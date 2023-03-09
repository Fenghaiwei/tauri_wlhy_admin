import mutations from './mutations';
import actions from './actions';
// 导出全局配置
import g_config from './global';

// 定义vuex
const state = {
  g_config: g_config, // 全局布局配置
  noticeData: [], // 消息数据
  menuTree: [], // 导航菜单树结构
  permission: [], // 用户权限
  excludeRoutes: ['/', '/login', '/error/403', '/error/404'], // 不需要登录的路由
  sideAction: '', // 侧栏选中项
  tabViewsList: [], // 标签页数据
  tabActive: '', // 选中的标签页
  viewerData: [], // 图片查看数据源
  keepAliveRouter: [], // 缓存的组件
  breadcrumb: [], // 面包屑导航
  regionData: [],
  isAuth: false // 是否已获取用户身份权限
};

export default {
  state,
  mutations,
  actions
};
