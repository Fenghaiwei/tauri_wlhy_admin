var router = [
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/configMange/Account'),
    meta: {
      active: '/account',
      title: '定位工具账号管理',
      permission: 'config:account:view',
      keepAlive: true
    }
  },
  {
    path: '/licence/whitelist',
    name: 'LicenceWhitelist',
    component: () => import('@/views/configMange/transportConfiguration/LicenceWhitelist'),
    meta: {
      active: '/licence/whitelist',
      title: '司机白名单',
      permission: 'config:licence:whitelist:view',
      keepAlive: true
    }
  },
  {
    path: '/company/whitelist',
    name: 'CompanyWhitelist',
    component: () => import('@/views/configMange/transportConfiguration/CompanyWhitelist'),
    meta: {
      active: '/company/whitelist',
      title: '企业白名单',
      permission: 'config:company:whitelist:view',
      keepAlive: true
    }
  },
  {
    path: '/licence/switch',
    name: 'LicenceConfig',
    component: () => import('@/views/configMange/transportConfiguration/LicenceConfig'),
    meta: {
      active: '/licence/switch',
      title: '五证拦截',
      permission: 'config:licence:switch:view'
    }
  },
  {
    path: '/ccb/driver/whitelist',
    name: 'CcbDriverWhilteList',
    component: () => import('@/views/configMange/ccb/driverWhilteList'),
    meta: {
      active: '/ccb/driver/whitelist',
      title: '建行司机白名单',
      permission: 'config:ccb:driver:whitelist:view',
      keepAlive: true
    }
  },
  {
    path: '/carrier/company',
    name: 'CarrierCompany',
    component: () => import('@/views/configMange/transportConfiguration/CarrierCompany'),
    meta: {
      active: '/carrier/company',
      title: '自有车接单限制',
      permission: 'config:carrier:company:view',
      keepAlive: true
    }
  },
  {
    path: '/balanceinterception/list',
    name: 'BalanceInterception',
    component: () => import('@/views/configMange/transportConfiguration/BalanceInterception'),
    meta: {
      active: '/balanceinterception/list',
      title: '平台账户提现拦截',
      permission: 'config:licence:interceptionList:view',
      keepAlive: true
    }
  },

  {
    path: '/autoimport/list',
    name: 'AutoImportList',
    component: () => import('@/views/configMange/transportConfiguration/AutoImportList'),
    meta: {
      active: '/balanceinterception/list',
      title: '自动导入名单',
      permission: 'config:licence:interceptionList:view'
    }
  },
  {
    path: '/etc/vehicle',
    name: 'EtcVehicle',
    component: () => import('@/views/configMange/etc/EtcVehicle'),
    meta: {
      active: '/etc/vehicle',
      title: '车辆黑名单',
      permission: 'config:etc:vehicle:view',
      keepAlive: true
    }
  },
  {
    path: '/etc/line',
    name: 'EtcLine',
    component: () => import('@/views/configMange/etc/EtcLine'),
    meta: {
      active: '/etc/line',
      title: '线路黑名单',
      permission: 'config:etc:line:view',
      keepAlive: true
    }
  },
  {
    path: '/etc/company',
    name: 'EtcCompany',
    component: () => import('@/views/configMange/etc/EtcCompany'),
    meta: {
      active: '/etc/company',
      title: '企业黑名单',
      permission: 'config:etc:company:view',
      keepAlive: true
    }
  },
  {
    path: '/evaluate/abnormal',
    name: 'EvaluateAbnormal',
    component: () => import('@/views/configMange/evaluate/EvaluateAbnormal'),
    meta: {
      active: '/evaluate/abnormal',
      title: '评价配置',
      permission: 'config:evaluate:view',
      keepAlive: true
    }
  },
  {
    path: '/evaluate/bill',
    name: 'EvaluateBill',
    component: () => import('@/views/configMange/evaluate/EvaluateBill'),
    meta: {
      active: '/evaluate/abnormal',
      title: '评价配置',
      permission: 'config:evaluate:view',
      keepAlive: true
    }
  },
  {
    path: '/evaluate/edit/:id',
    name: 'EvaluateEdit',
    component: () => import('@/views/configMange/evaluate/EvaluateEdit'),
    meta: {
      active: '/evaluate/abnormal',
      title: '评价配置',
      permission: 'config:evaluate:view'
    }
  },
  {
    path: '/evaluate/result/:id',
    name: 'EvaluateResult',
    component: () => import('@/views/configMange/evaluate/EvaluateResult'),
    meta: {
      active: '/evaluate/abnormal',
      title: '评价配置',
      permission: 'config:evaluate:view'
    }
  },
  {
    path: '/evaluate/enterprise/:id',
    name: 'EvaluateEnterprise',
    component: () => import('@/views/configMange/evaluate/EvaluateEnterprise'),
    meta: {
      active: '/evaluate/abnormal',
      title: '评价配置',
      permission: 'config:evaluate:view'
    }
  },
  {
    path: '/system/intergration',
    name: 'SystemIntergration',
    component: () => import('@/views/configMange/intergration/SystemIntergration'),
    meta: {
      active: '/system/intergration',
      title: '系统对接列表',
      permission: 'config:system:intergration:view',
      keepAlive: true
    }
  },
  {
    path: '/interface/manage/:id',
    name: 'InterfaceManage',
    component: () => import('@/views/configMange/intergration/InterfaceManage'),
    meta: {
      active: '/system/intergration',
      title: '接口管理',
      permission: 'config:system:intergration:view'
    }
  },
  {
    path: '/subscribe/manage/:id',
    name: 'SubscribeManage',
    component: () => import('@/views/configMange/intergration/SubscribeManage'),
    meta: {
      active: '/system/intergration',
      title: '订阅管理',
      permission: 'config:system:intergration:view'
    }
  },
  {
    path: '/gross/tonnage',
    name: 'GrossTonnage',
    component: () => import('@/views/configMange/wagon/GrossTonnage'),
    meta: {
      active: '/gross/tonnage',
      title: '毛重/皮重吨位限制',
      permission: 'config:gross:tonnage:view',
      keepAlive: true
    }
  },
  {
    path: '/gross/tonnage/add',
    name: 'GrossTonnageAdd',
    component: () => import('@/views/configMange/wagon/GrossTonnageEdit'),
    meta: {
      active: '/gross/tonnage',
      title: '毛重/皮重吨位限制',
      permission: 'config:gross:tonnage:add'
    }
  },
  {
    path: '/gross/tonnage/edit/:companyCode',
    name: 'GrossTonnageEdit',
    component: () => import('@/views/configMange/wagon/GrossTonnageEdit'),
    meta: {
      active: '/gross/tonnage',
      title: '毛重/皮重吨位限制',
      permission: 'config:gross:tonnage:edit'
    }
  },
  {
    path: '/insurance/allocation',
    name: 'InsuranceAllocation',
    component: () => import('@/views/configMange/insurance/InsuranceAllocation'),
    meta: {
      active: '/insurance/allocation',
      title: '保险配置',
      permission: 'config:insurance:allocation:view'
    }
  },
  {
    path: '/product/config',
    name: 'ProductConfig',
    component: () => import('@/views/configMange/incrementService/ProductConfig'),
    meta: {
      active: '/product/config',
      title: '产品配置',
      permission: 'config:product:config:view',
      keepAlive: true
    }
  },
  {
    path: '/product/config/add',
    name: 'ProductConfigAdd',
    component: () => import('@/views/configMange/incrementService/ProductConfigAdd'),
    meta: {
      active: '/product/config',
      title: '新增产品配置',
      permission: 'config:product:config:view'
    }
  },
  {
    path: '/product/config/edit/:id',
    name: 'ProductConfigEdit',
    component: () => import('@/views/configMange/incrementService/ProductConfigAdd'),
    meta: {
      active: '/product/config',
      title: '编辑产品配置',
      permission: 'config:product:config:view'
    }
  },
  {
    path: '/enterprise/config',
    name: 'EnterpriseConfig',
    component: () => import('@/views/configMange/incrementService/EnterpriseConfig'),
    meta: {
      active: '/enterprise/config',
      title: '企业配置',
      permission: 'config:enterprise:config:view',
      keepAlive: true
    }
  },
  {
    path: '/enterprise/config/add',
    name: 'ProductEnterpriseAdd',
    component: () => import('@/views/configMange/incrementService/EnterpriseConfigAdd'),
    meta: {
      active: '/enterprise/config',
      title: '新增企业配置',
      permission: 'config:enterprise:config:view'
    }
  },
  {
    path: '/enterprise/config/edit/:id',
    name: 'ProductEnterpriseEdit',
    component: () => import('@/views/configMange/incrementService/EnterpriseConfigAdd'),
    meta: {
      active: '/enterprise/config',
      title: '编辑企业配置',
      permission: 'config:enterprise:config:view'
    }
  },
  {
    path: '/driver/blacklist',
    name: 'DriverBlacklist',
    component: () => import('@/views/configMange/transportConfiguration/DriverBlacklist.vue'),
    meta: {
      active: '/driver/blacklist',
      title: '司机黑名单',
      permission: 'config:driver:blacklist:view',
      keepAlive: true
    }
  },
  {
    path: '/owncar/whitelist',
    name: 'OwncarWhitelist',
    component: () => import('@/views/configMange/transportConfiguration/OwncarWhitelist'),
    meta: {
      active: '/owncar/whitelist',
      title: '企业自有车白名单',
      permission: 'config:owncar:whitelist:view',
      keepAlive: true
    }
  },
  {
    path: '/data/reporting',
    name: 'DataReporting',
    component: () => import('@/views/configMange/transportConfiguration/DataReporting'),
    meta: {
      active: '/data/reporting',
      title: '数据上报异常处理',
      permission: 'config:data:reporting:view',
      keepAlive: true
    }
  }
];
export default router;
