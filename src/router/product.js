var router = [
  {
    path: '/template/msg',
    name: 'TemplateMsg',
    component: () => import('@/views/product/wx/TemplateMsg.vue'),
    meta: {
      active: '/template/msg',
      title: '模板消息',
      permission: 'product:template:msg:view',
      keepAlive: true
    }
  },
  {
    path: '/template/msg/send',
    name: 'TemplateMsgSend',
    component: () => import('@/views/product/wx/TemplateMsgSend.vue'),
    meta: {
      active: '/template/msg',
      title: '发送模板消息',
      permission: 'product:template:msg:send'
    }
  },
  {
    path: '/order/track',
    name: 'OrderTrack',
    component: () => import('@/views/product/customer/OrderTrack.vue'),
    meta: {
      active: '/order/track',
      title: '轨迹工具',
      permission: 'product:order:track:view',
      keepAlive: true
    }
  },
  {
    path: '/order/track/add',
    name: 'OrderTrackAdd',
    component: () => import('@/views/product/customer/OrderTrackAdd.vue'),
    meta: {
      active: '/order/track',
      title: '轨迹工具',
      permission: 'product:order:track:add'
    }
  },
  {
    path: '/capacity/bidding',
    name: 'CapacityBidding',
    component: () => import('@/views/product/distributioncenter/CapacityBidding.vue'),
    meta: {
      active: '/capacity/bidding',
      title: '运力招标',
      permission: 'product:capacity:bidding:view',
      keepAlive: true
    }
  },
  {
    path: '/capacity/bidding/details',
    name: 'CapacityBiddingDetails',
    component: () => import('@/views/product/distributioncenter/CapacityBiddingDetails.vue'),
    meta: {
      active: '/capacity/bidding',
      title: '运力招标详情',
      permission: 'product:capacity:bidding:view'
    }
  },
  {
    path: '/zs/balance/search',
    name: 'ZsSearch',
    component: () => import('@/views/product/Balance/ZsSearch.vue'),
    meta: {
      active: '/zs/balance/search',
      title: '众树余额查询',
      permission: 'product:balance:zs:view'
    }
  },
  {
    path: '/unsigned/enterprise',
    name: 'UnsignedEnterprise',
    component: () => import('@/views/product/unsigned/UnsignedEnterprise.vue'),
    meta: {
      active: '/unsigned/enterprise',
      title: '企业配置',
      permission: 'product:unsigned:enterprise:view',
      keepAlive: true
    }
  },
  {
    path: '/unsigned/import',
    name: 'UnsignedImport',
    component: () => import('@/views/product/unsigned/UnsignedImport.vue'),
    meta: {
      active: '/unsigned/import',
      title: '数据导入',
      permission: 'product:unsigned:import:view'
    }
  },
  {
    path: '/stock/copy',
    name: 'StockCopy',
    component: () => import('@/views/product/customer/StockCopy.vue'),
    meta: {
      active: '/stock/copy',
      title: '货源复制',
      permission: 'product:stock:copy:view',
      keepAlive: true
    }
  }
];
export default router;
