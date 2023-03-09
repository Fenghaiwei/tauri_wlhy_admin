var router = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/index/Login'),
    meta: {
      title: '用户登录',
      notToken: true
    }
  }
];

export default router;
