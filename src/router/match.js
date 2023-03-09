var router = [
  {
    path: '/driver/member/list',
    name: 'DriverMemberList',
    component: () => import('@/views/match/member/DriverMemberList.vue'),
    meta: {
      active: '/driver/member/list',
      title: '司机会员列表',
      permission: 'match:driver:member:list:view',
      keepAlive: true
    }
  },
  {
    path: '/driver/member/detail/:id',
    name: 'DriverMemberDetail',
    component: () => import('@/views/match/member/DriverMemberDetail.vue'),
    meta: {
      active: '/driver/member/list',
      title: '司机会员详情',
      permission: 'match:driver:member:list:view'
    }
  },
  {
    path: '/car/detail/:id',
    name: 'CarDetail',
    component: () => import('@/views/match/member/CarDetail.vue'),
    meta: {
      active: '/driver/member/list',
      title: '车辆详情',
      permission: 'match:driver:member:list:view'
    }
  },
  {
    path: '/match/order/list',
    name: 'MatchOrderList',
    component: () => import('@/views/match/order/MatchOrderList.vue'),
    meta: {
      active: '/match/order/list',
      title: '订单列表',
      permission: 'match:order:list:view',
      keepAlive: true
    }
  },
  {
    path: '/match/order/detail/:id',
    name: 'MatchOrderDetail',
    component: () => import('@/views/match/order/MatchOrderDetail.vue'),
    meta: {
      active: '/match/order/list',
      title: '订单详情',
      permission: 'match:order:list:view'
    }
  },
  {
    path: '/match/order/rail/detail/:orderNumber',
    name: 'MatchOrderRailDetail',
    component: () => import('@/views/transport/trackMonitoring/RailExceptionDtl'),
    meta: {
      active: '/rail/exceptions/list',
      title: '轨迹详情',
      permission: 'match:order:list:view'
    }
  },
  {
    path: '/order/compare/list',
    name: 'OrderCompareList',
    component: () => import('@/views/match/invoice/OrderCompareList.vue'),
    meta: {
      active: '/order/compare/list',
      title: '订单比对列表',
      permission: 'match:order:compare:list:view',
      keepAlive: true
    }
  },
  {
    path: '/match/order/compare/detail/:id',
    name: 'MatchOrderCompareDetail',
    component: () => import('@/views/match/order/MatchOrderDetail.vue'),
    meta: {
      active: '/order/compare/list',
      title: '订单比对详情',
      permission: 'match:order:compare:list:view'
    }
  },
  {
    path: '/match/invoice/list',
    name: 'MatchInvoiceList',
    component: () => import('@/views/match/invoice/MatchInvoiceList.vue'),
    meta: {
      active: '/match/invoice/list',
      title: '发票列表',
      permission: 'match:invoice:list:view',
      keepAlive: true
    }
  },
  {
    path: '/match/invoice/maintain',
    name: 'InvoiceMaintain',
    component: () => import('@/views/match/invoice/InvoiceMaintain.vue'),
    meta: {
      active: '/match/invoice/list',
      title: '维护发票进度',
      permission: 'match:invoice:list:maintainInvoice',
      keepAlive: true
    }
  },
  {
    path: '/match/invoice/detail/:id',
    name: 'MatchInvoiceDetail',
    component: () => import('@/views/match/invoice/MatchInvoiceDetail.vue'),
    meta: {
      active: '/match/invoice/list',
      title: '发票详情（运费）',
      permission: 'match:invoice:list:view'
    }
  },
  {
    path: '/match/invoicing/list',
    name: 'MatchInvoicingList',
    component: () => import('@/views/match/invoice/MatchInvoicingList.vue'),
    meta: {
      active: '/match/invoicing/list',
      title: '代开发票列表',
      permission: 'match:invoicing:list:view',
      keepAlive: true
    }
  },
  {
    path: '/match/invoicing/detail/:id',
    name: 'MatchInvoicingDetail',
    component: () => import('@/views/match/invoice/MatchInvoicingDetail.vue'),
    meta: {
      active: '/match/invoicing/list',
      title: '发票详情',
      permission: 'match:invoicing:list:view'
    }
  },
  {
    path: '/match/invoicing/order/detail/:id',
    name: 'MatchInvoicingOrderDetail',
    component: () => import('@/views/match/invoice/MatchInvoicingOrderDetail.vue'),
    meta: {
      active: '/match/invoicing/list',
      title: '订单详情',
      permission: 'match:invoicing:list:view'
    }
  }
];

export default router;
