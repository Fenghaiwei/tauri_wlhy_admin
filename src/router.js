import Vue from 'vue';
import VueRouter from 'vue-router';

// 重写路由的push方法 解决当前路由跳转当前路由报错
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

import store from './store';
import * as routerHook from '@/router/routerHook';

import routerPublic from '@/router/routerPublic';
import index from '@/router/index';
import mycenter from '@/router/mycenter';
import configManage from '@/router/configManage';
import transport from '@/router/transport';
import product from '@/router/product';
import user from '@/router/user';
import match from '@/router/match';
Vue.use(VueRouter);

const routes = [...index, ...mycenter, ...transport, ...configManage, ...routerPublic, ...product, ...user, ...match];

// 初始化一个空路由对象 当权限获取完成后 动态添加路由地址
const router = new VueRouter({ routes: routes });

// 路由钩子 按住ctrl打开新标签页
routerHook.jumpCtrllHook(router, store);
// 路由钩子 判断登录状态
routerHook.loginStateHook(router, store);
// 路由钩子 获取用户权限
routerHook.getPermission(router, store);
// 路由钩子 判断页面访问权限
routerHook.permissionHook(router, store);
// 路由钩子 判断页面是否需要缓存
routerHook.keepAliveHook(router, store);
// 路由钩子 设置页面title
routerHook.setTitleHook(router);
// 路由钩子 清空面包屑导航
routerHook.clearBreadcrumb(router, store);
// 路由钩子 设置侧栏选中
routerHook.sideActionHook(router, store);

export { router, routes };
