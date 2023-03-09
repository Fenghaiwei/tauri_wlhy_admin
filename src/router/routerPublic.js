import routerDefault from './routerDefault';
// 所有模块公用路由
const HttpError = function (resolve) {
  require(['@/components/HttpError'], resolve);
};
const publicRouter = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/error/:code',
    name: 'Error',
    meta: { title: 'Error' },
    component: HttpError
  },
  {
    path: '/mycenter',
    redirect: to => routerDefault('/mycenter')
  },
  {
    path: '/match',
    redirect: to => routerDefault('/match')
  },
  {
    path: '/rail',
    redirect: to => routerDefault('/rail')
  },
  {
    path: '/transport',
    redirect: to => routerDefault('/transport')
  },
  {
    path: '/config',
    redirect: to => routerDefault('/config')
  },
  {
    path: '/product',
    redirect: to => routerDefault('/product')
  },
  {
    path: '/user',
    redirect: to => routerDefault('/user')
  },
  { path: '*', redirect: '/error/404' }
];
export default publicRouter;
