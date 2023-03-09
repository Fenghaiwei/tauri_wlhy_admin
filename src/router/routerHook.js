import config from '@/config/config';
import permission from '@/utils/permission';
// 路由钩子判断访问地址
export const jumpMobile = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
      window.location.href = config.mobileUrl;
      next(false);
    } else {
      next();
    }
  });
};

// 按住ctrl打开新标签页
export const jumpCtrllHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (window.event && window.event.ctrlKey) {
      let routeUrl = router.resolve(to);
      window.open(routeUrl.href, '_blank');
      next(false);
    } else {
      next();
    }
  });
};

// 路由钩子 判断登录状态
export const loginStateHook = (router, store) => {
  // 不需要登录的页面
  const excludeRoutes = store.state.excludeRoutes || [];

  router.beforeEach((to, from, next) => {
    if (!excludeRoutes.includes(to.path)) {
      const Authorization = localStorage.getItem('Authorization');
      if (!Authorization) {
        next({ path: '/login' });
      }
      next();
    } else {
      next();
    }
  });
};

// 路由钩子 判断页面访问权限
export const permissionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (config.sysCtrl.tab) {
      // path为/ 或者去error的路由不添加tab 不设置侧栏选中
      if (to.name && to.name !== 'Error' && to.name !== 'Login') {
        store.dispatch('addTabView', to);
        store.dispatch('changeTabActive', to.name);
        store.dispatch('changeSideAction', to.meta.active);
      }
    }
    if (config.sysCtrl.permission) {
      if (to.meta.permission) {
        const perList = store.state.permission || [];
        if (!perList.includes(to.meta.permission)) {
          next({ path: '/error/403', replace: true });
        } else {
          next();
        }
      }
      next();
    } else {
      next();
    }
  });
};
// 路由钩子 获取权限
export const getPermission = async (router, store) => {
  router.beforeEach(async (to, from, next) => {
    const notToken = to.meta && to.meta.notToken;
    if (!notToken && !store.state.isAuth) {
      try {
        await permission.init(true);
      } catch (error) {
        if (error.code === 401) {
          logoutClear();
          next('/login');
        } else {
          next('/error/500'); // 这里可以跳转到指定的错误页面
        }
      }
    }
    next();
  });
};

// 缓存钩子 判断页面是否需要缓存
export const keepAliveHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (config.sysCtrl.keepAlive) {
      if (to.meta.keepAlive && to.meta.keepAlive === true) {
        const keepAliveRouter = store.state.keepAliveRouter || [];
        const keepAliveName = to.meta.keepAliveName || to.name;
        const idx = keepAliveRouter.findIndex(name => name === keepAliveName);
        if (idx === -1) {
          store.dispatch('addKeepAlive', keepAliveName);
        }
      }
      next();
    } else {
      next();
    }
  });
};

// 路由钩子 设置页面title
export const setTitleHook = router => {
  router.beforeEach((to, from, next) => {
    let title = to.meta && to.meta.title;
    title = '网络货运-运营管理' + (title ? '-' + title : '');
    document.title = title;
    next();
  });
};

// 路由钩子 清空页面面包屑导航
export const clearBreadcrumb = (router, store) => {
  router.beforeEach((to, from, next) => {
    store.dispatch('setBreadcrumb', []); // 清空面包屑
    next();
  });
};

// 路由钩子 设置侧栏选中菜单
export const sideActionHook = (router, store) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.active) {
      store.dispatch('changeSideAction', to.meta.active);
    }
    next();
  });
};
