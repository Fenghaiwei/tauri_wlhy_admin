var router = [
  {
    path: '/monitor/order/list',
    name: 'MonitorOrderList',
    component: () => import('@/views/transport/trackMonitoring/MonitorOrderList'),
    meta: {
      active: '/monitor/order/list',
      title: '监控运单列表',
      permission: 'transport:monitor:order:list:view',
      keepAlive: true
    }
  },
  {
    path: '/monitor/order/detail/:orderNumber/:companyCode?',
    name: 'MonitorOrderDtl',
    component: () => import('@/views/transport/trackMonitoring/MonitorOrderDtl'),
    meta: {
      active: '/monitor/order/list',
      title: '监控运单详情',
      permission: 'transport:monitor:order:list:view'
    }
  },
  {
    path: '/rail/exceptions/list',
    name: 'RailExceptionsList',
    component: () => import('@/views/transport/trackMonitoring/RailExceptionsList'),
    meta: {
      active: '/rail/exceptions/list',
      title: '轨迹异常列表',
      permission: 'transport:rail:exceptions:list:view',
      keepAlive: true
    }
  },
  {
    path: '/rail/exception/detail/:orderNumber/:companyCode',
    name: 'RailExceptionDtl',
    component: () => import('@/views/transport/trackMonitoring/RailExceptionDtl'),
    meta: {
      active: '/rail/exceptions/list',
      title: '轨迹详情',
      permission: 'transport:rail:exceptions:list:view'
    }
  },
  {
    path: '/address/mark/list',
    name: 'AddressMarkList',
    component: () => import('@/views/transport/trackMonitoring/AddressMarkList'),
    meta: {
      active: '/address/mark/list',
      title: '地址标记列表',
      permission: 'transport:address:mark:list:view',
      keepAlive: true
    }
  },
  {
    path: '/address/mark/detail/:id',
    name: 'AddressMarkDtl',
    component: () => import('@/views/transport/trackMonitoring/AddressMarkDtl'),
    meta: {
      active: '/address/mark/list',
      title: '地址标记详情',
      permission: 'transport:address:mark:list:view'
    }
  },
  {
    path: '/address/white/list',
    name: 'AddressWhiteList',
    component: () => import('@/views/transport/trackMonitoring/AddressWhiteList'),
    meta: {
      active: '/address/white/list',
      title: '地址白名单',
      permission: 'transport:address:white:list:view',
      keepAlive: true
    }
  },
  {
    path: '/exceptionsettings/list',
    name: 'ExceptionSetting',
    component: () => import('@/views/transport/trackMonitoring/ExceptionSetting'),
    meta: {
      active: '/exceptionsettings/list',
      title: '异常等级设置',
      permission: 'transport:exceptionlevelsetting:list:view',
      keepAlive: true
    }
  },
  {
    path: '/driver/report/rate',
    name: 'DriverReportRate',
    component: () => import('@/views/transport/trackMonitoring/DriverReportRate'),
    meta: {
      active: '/driver/report/rate',
      title: '司机位置上报频次',
      permission: 'driver:report:rate:view',
      keepAlive: true
    }
  },
  {
    path: '/exceptionlevelsetting/add',
    name: 'ExceptionSettingAdd',
    component: () => import('@/views/transport/trackMonitoring/ExceptionSettingAdd'),
    meta: {
      active: '/exceptionsettings/list',
      title: '添加企业',
      permission: 'transport:exceptionlevelsetting:list:view'
    }
  },
  {
    path: '/information/refund',
    name: 'InformationRefund',
    component: () => import('@/views/transport/agent/InformationRefund'),
    meta: {
      active: '/information/refund',
      title: '信息费可退款列表',
      permission: 'transport:information:refund:view',
      keepAlive: true
    }
  },
  {
    path: '/information/rebate',
    name: 'InformationRebate',
    component: () => import('@/views/transport/agent/InformationRebate'),
    meta: {
      active: '/information/rebate',
      title: '信息费已退款列表',
      permission: 'transport:information:rebate:view',
      keepAlive: true
    }
  },
  {
    path: '/information/adjustment',
    name: 'InformationAdjustment',
    component: () => import('@/views/transport/agent/InformationAdjustment'),
    meta: {
      active: '/information/adjustment',
      title: '信息费调整比例列表',
      permission: 'transport:information:adjustment:view',
      keepAlive: true
    }
  },
  {
    path: '/information/review',
    name: 'InformationReview',
    component: () => import('@/views/transport/agent/InformationReview'),
    meta: {
      active: '/information/review',
      title: '信息费已复核列表',
      permission: 'transport:information:review:view',
      keepAlive: true
    }
  },
  {
    path: '/stock/list',
    name: 'StockList',
    component: () => import('@/views/transport/stock/StockList'),
    meta: {
      active: '/stock/list',
      title: '货源列表',
      permission: 'transport:stock:list:view',
      keepAlive: true
    }
  },
  {
    path: '/stock/detail/:id',
    name: 'StockDetail',
    component: () => import('@/views/transport/stock/StockDetail'),
    meta: {
      active: '/stock/list',
      title: '货源详情',
      permission: 'transport:stock:list:view'
    }
  },
  {
    path: '/book/plan',
    name: 'BooPlan',
    component: () => import('@/views/transport/book/BooPlan'),
    meta: {
      active: '/book/plan',
      title: '报号计划列表',
      permission: 'transport:book:plan:view',
      keepAlive: true
    }
  },
  {
    path: '/book/driver/:id?',
    name: 'BookDriver',
    component: () => import('@/views/transport/book/BookDriver'),
    meta: {
      active: '/book/driver',
      title: '报号司机列表',
      permission: 'transport:book:driver:view',
      keepAlive: true
    }
  },
  {
    path: '/monitor/set',
    name: 'MonitorSet',
    component: () => import('@/views/transport/trackMonitoring/MonitorSet'),
    meta: {
      active: '/monitor/set',
      title: '监控配置列表',
      permission: 'transport:monitor:set:view',
      keepAlive: true
    }
  },
  {
    path: '/abnormal/alert/set/:key',
    name: 'AbnormalAlertSetting',
    component: () => import('@/views/transport/trackMonitoring/AbnormalAlertSetting'),
    meta: {
      active: '/monitor/set',
      title: '通知设置',
      permission: 'transport:monitor:set:view'
    }
  },
  {
    path: '/abnormal/common/set/:key',
    name: 'AbnormalCommonSetting',
    component: () => import('@/views/transport/trackMonitoring/AbnormalCommonSetting'),
    meta: {
      active: '/monitor/set',
      title: '通用设置',
      permission: 'transport:monitor:set:view'
    }
  },
  {
    path: '/transport/timeout/config',
    name: 'TransportTimeoutConfig',
    component: () => import('@/views/transport/trackMonitoring/TransportTimeoutConfig'),
    meta: {
      active: '/transport/timeout/config',
      title: '运输超时配置列表',
      permission: 'transport:timeout:config:view',
      keepAlive: true
    }
  }
];

export default router;
