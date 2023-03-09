import config from '@/config/config';
const baseURL = config.baseURL;
let api = {};

// 公众号列表
api.wechatList = baseURL + '/wechat/app/list';
// 微信模板消息列表
api.wechatTemplateList = baseURL + '/wechat/msg/list';
// 模板消息样例
api.wechatTemplateSample = baseURL + '/wechat/template/sample';
//发送模板消息
api.wechatTemplateSend = baseURL + '/wechat/msg/send';
//轨迹拷贝记录查询
api.orderTrackList = baseURL + '/orderTrack/list';
//轨迹拷贝
api.orderTrackCopy = baseURL + '/orderTrack/copy';
//招标信息列表查询
api.biddingpageList = baseURL + '/bidding/logistics/pageList';
//获取招标信息详情
api.biddingDetails = baseURL + '/bidding/get';
//司机报价列表查询
api.biddingdriverOrderList = baseURL + '/bidding/driverOrderList';
// 查询海报数据
api.getPosterData = baseURL + '/bidding/getPosterData';
// 查询众树余额
api.zsBalanceQry = baseURL + '/sys/zs/balance/query';

// 账号列表数据查询
api.unmanagedAccountList = baseURL + '/unmanagedAccount/list';
// 新增非托管数据
api.unmanagedAccountAdd = baseURL + '/unmanagedAccount/addAccount';
// 运单列表数据查询
api.unmanagedOrderList = baseURL + '/unmanagedOrder/list';
// 运单列表数据导入
api.unmanagedOrderAdd = baseURL + '/unmanagedOrder/addOrder';
// 运单列表数据导出
api.unmanagedOrderExport = baseURL + '/unmanagedOrder/export';
// 运单列表数据重试
api.unmanagedOrderRetry = baseURL + '/unmanagedOrder/retry';
//分页查询货源复制记录
api.stockReplicaOperatorLogList = baseURL + '/company/stockReplicaOperatorLog/list';
//保存货源复制记录
api.stockReplicaOperatorLogSave = baseURL + '/company/stockReplicaOperatorLog/save';
//根据手机号查询企业信息
api.queryCompanyInfoByMobile = baseURL + '/company/queryCompanyInfoByMobile';

export default api;
