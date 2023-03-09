var router = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/mycenter/Welcome'),
    meta: {
      active: '/welcome',
      title: '欢迎页'
    }
  },
  {
    path: '/download/list',
    name: 'DownloadList',
    component: () => import('@/views/mycenter/DownloadList'),
    meta: {
      active: '/download/list',
      title: '下载中心'
    }
  },
  {
    path: '/download/list/new',
    name: 'DownloadListNew',
    component: () => import('@/views/mycenter/DownloadListNew'),
    meta: {
      active: '/download/list/new',
      title: '下载中心新',
      permission: 'my:download:listnew:view'
    }
  },
  {
    path: '/download/template',
    name: 'DownloadTemplate',
    component: () => import('@/views/mycenter/DownloadTemplate'),
    meta: {
      active: '/download/template',
      title: '下载模板',
      permission: 'my:download:template:view'
    }
  }
];
export default router;
