var router = [
  {
    path: '/collection/settings',
    name: 'CollectionSettings',
    component: () => import('@/views/user/driverCaptain/CollectionSettings.vue'),
    meta: {
      active: '/collection/settings',
      title: '收款设置查询',
      permission: 'user:collection:settings:view',
      keepAlive: true
    }
  },
  {
    path: '/captain/list',
    name: 'CaptainList',
    component: () => import('@/views/user/driverCaptain/CaptainList.vue'),
    meta: {
      active: '/captain/list',
      title: '车队长信息列表',
      permission: 'user:caption:list:view',
      keepAlive: true
    }
  },
  {
    path: '/captain/detail/:code',
    name: 'CaptainDetail',
    component: () => import('@/views/user/driverCaptain/CaptainDetail.vue'),
    meta: {
      active: '/captain/list',
      title: '车队长信息详情',
      permission: 'user:caption:list:view'
    }
  },
  {
    path: '/driver/audit/list',
    name: 'DriverAuditList',
    component: () => import('@/views/user/DriverManage/DriverAuditList.vue'),
    meta: {
      active: '/driver/audit/list',
      title: '司机资料审核',
      permission: 'user:driver:audit:view',
      keepAlive: true
    }
  },
  {
    path: '/car/audit/list',
    name: 'CarAuditList',
    component: () => import('@/views/user/DriverManage/CarAuditList.vue'),
    meta: {
      active: '/car/audit/list',
      title: '车辆资料审核',
      permission: 'user:car:audit:view',
      keepAlive: true
    }
  },
  {
    path: '/driver/info',
    name: 'DriverInfo',
    component: () => import('@/views/user/DriverManage/DriverInfo.vue'),
    meta: {
      active: '/driver/info',
      title: '司机资料库',
      permission: 'user:driver:info:view',
      keepAlive: true
    }
  },
  {
    path: '/logout/driver/list',
    name: 'LogoutDriverList',
    component: () => import('@/views/user/DriverManage/LogoutDriverList.vue'),
    meta: {
      active: '/driver/info',
      title: '司机资料库',
      permission: 'user:driver:info:view',
      keepAlive: true
    }
  },
  {
    path: '/delete/car/list',
    name: 'DeleteCarList',
    component: () => import('@/views/user/DriverManage/DeleteCarList.vue'),
    meta: {
      active: '/driver/info',
      title: '司机资料库',
      permission: 'user:driver:info:view',
      keepAlive: true
    }
  },
  {
    path: '/certification/detail/:key',
    name: 'CertificationDetail',
    component: () => import('@/views/user/DriverManage/CertificationDetail.vue'),
    meta: {
      active: '/driver/audit/list',
      title: '认证详情'
    }
  },
  {
    path: '/personaldata/audit/:userCode',
    name: 'PersonalDataAudit',
    component: () => import('@/views/user/DriverManage/PersonalDataAudit.vue'),
    meta: {
      active: '/driver/audit/list',
      title: '司机资料审核'
    }
  },
  {
    path: '/cardata/audit/:userCode/:vehicleId',
    name: 'CarDataAudit',
    component: () => import('@/views/user/DriverManage/CarDataAudit.vue'),
    meta: {
      active: '/car/audit/list',
      title: '车辆资料审核'
    }
  },
  {
    path: '/caraduit/history/:type/:userCode/:vehicleId',
    name: 'CarAduitHistory',
    component: () => import('@/views/user/DriverManage/CertificateHistory.vue'),
    meta: {
      active: '/car/audit/list',
      title: '车辆资料审核'
    }
  },
  {
    path: '/personaduit/history/:type/:userCode',
    name: 'PersonAduitHistory',
    component: () => import('@/views/user/DriverManage/CertificateHistory.vue'),
    meta: {
      active: '/driver/audit/list',
      title: '司机资料审核'
    }
  },
  {
    path: '/driver/reviewed',
    name: 'DriverReviewed',
    component: () => import('@/views/user/DriverManage/DriverReviewed.vue'),
    meta: {
      active: '/driver/reviewed',
      title: '司机复核记录',
      permission: 'user:driver:reviewed:view',
      keepAlive: true
    }
  },
  {
    path: '/car/reviewed',
    name: 'CarReviewed',
    component: () => import('@/views/user/DriverManage/CarReviewed.vue'),
    meta: {
      active: '/car/reviewed',
      title: '车辆复核记录',
      permission: 'user:car:reviewed:view',
      keepAlive: true
    }
  },
  {
    path: '/cost/config',
    name: 'CostConfig',
    component: () => import('@/views/user/CarrierCompany/CostConfig.vue'),
    meta: {
      active: '/cost/config',
      title: '服务费配置',
      permission: 'user:cost:config:view',
      keepAlive: true
    }
  }
];
export default router;
