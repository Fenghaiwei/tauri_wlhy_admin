import config from '@/config/config';
const baseURL = config.baseURL;
let api = {};

// 标记点地址列表
api.markAddress = baseURL + '/gis/list/markaddress/v1';
// 标记点删除
api.markAddressDel = baseURL + '/gis/del';
// 标记点详情
api.markAddressDetail = baseURL + '/gis/detail/v1';

api.addressLabel = baseURL + '/open/gis/adddress/label'; // 标记点地址类型字典

// 信息费退款列表
api.refundList = baseURL + '/information/refund/list';
// 信息费已退款列表
api.refundedList = baseURL + '/information/refunded/list';
// 信息费返利调整列表
api.reviewList = baseURL + '/information/review/list';
// 信息费已复核列表
api.reviewedList = baseURL + '/information/reviewed/list';
// 批量退款
api.refundSubmit = baseURL + '/information/refund/submit';
// 批量提交复核
api.reviewSubmit = baseURL + '/information/review/submit';
// 批量调整比例
api.rateChange = baseURL + '/information/rate/change';

// 货源列表
api.getStockList = baseURL + '/stock/list';
// 查询货源字典
api.getStockDict = baseURL + '/dict/stock/all';
// 查询所有企业（分页）
api.getCompanyList = baseURL + '/company/list';
// 查询企业的地址列表
api.getCompanyAddressList = baseURL + '/company/address/list';
// 查询企业关联承运公司调度费率
api.queryCarrierScheduleRate = baseURL + '/company/queryCarrierScheduleRate';
// 查询货源详情
api.getStockDetail = baseURL + '/stock/detail';
// 分页查询操作日志列表
api.getStockLogList = baseURL + '/stock/operateLogList';
// 查询日志明细
api.logDetail = baseURL + '/stock/logDetail';

// 查询货源发布对象详情
api.releaseDetail = baseURL + '/stock/detail/releaseDetail';

// 地址白名单列表（分页）
api.addressWhiteList = baseURL + '/monitor/addressWhiteList/list';
// 地址白名单列表-删除
api.addressWhiteListDelete = baseURL + '/monitor/addressWhiteList/delete';
// 地址白名单列表-添加
api.addressWhiteListAdd = baseURL + '/monitor/addressWhiteList/add';

//司机位置上报频率列表
api.driverReportRateConfig = baseURL + '/config/driverReportRateConfig/query';
//司机位置上报频率数据提交
api.driverReportRateSubmit = baseURL + '/config/driverReportRateConfig/submit';

// 异常等级设置-企业异常监控列表
api.configListTrack = baseURL + '/config/list/abnormal/track';
// 异常等级设置-异常等级列表
api.configListLevel = baseURL + '/config/list/abnormal/level';
// 异常等级设置-删除异常等级
api.configDelLevel = baseURL + '/config/del/abnormal/level';

// 异常等级设置-删除配置企业异常监控
api.configListTracklDel = baseURL + '/config/del/abnormal/track';

// 异常等级设置-配置异常等级
api.configListLevelAdd = baseURL + '/config/add/abnormal/level';
// 异常等级设置-配置异常等级异常类型
api.configListLevelType = baseURL + '/config/list/abnormal/type';

// 异常等级设置-配置企业异常监控
api.configListTracklAdd = baseURL + '/config/add/abnormal/track';
// 异常等级设置-配置企业异常监控
api.dropDownBoxAbnormalLevel = baseURL + '/config/dropDownBox/abnormal/level';

// 运输超时配置列表查询
api.transportTimeoutConfigPage = baseURL + '/config/transportTimeoutConfig/page';
// 运输超时配置列表批量编辑
api.transportTimeoutConfigEdit = baseURL + '/config/transportTimeoutConfig/edit';

// 报号计划列表
api.bookScheduleList = baseURL + '/book/schedule/list';
// 报号司机列表
api.bookDriverList = baseURL + '/book/driver/list';
// 调价历史
api.bookPriceHis = baseURL + '/book/schedule/price/his';
// 查询海报数据
api.getStockPosterData = baseURL + '/stock/getPosterData';

// 监控运单列表
api.orderMonitorList = baseURL + '/order/monitor/list';
// 监控列表导出
api.orderMonitorExport = baseURL + '/order/monitor/export';
// 新增修改备注
api.orderMonitorRemark = baseURL + '/order/monitor/remark';

// 异常列表
api.orderAbnormalList = baseURL + '/order/abnormal/list';
// 异常列表导出
api.orderAbnormalExport = baseURL + '/order/abnormal/export';
// 轨迹详情
api.orderTrackDtl = baseURL + '/orderTrack/track/abnormal';
// 添加黄名单
api.billmanagerAdd = baseURL + '/order/addCompanyBillRecord';

// 运单详情
api.orderDetail = baseURL + '/order/detail';
// 运单操作日志
api.orderBamsLog = baseURL + '/order/detail/bamsLog';
// 查询电子回单
api.orderReceipt = baseURL + '/order/receiptUrl';
// 异常处理
api.abnormalHandling = baseURL + '/order/abnormal/abnormalHandling';
// 预约处理
api.abnormalReserveHandling = baseURL + '/order/abnormal/abnormalReserveHandling';
// 取消预约
api.cancelAbnormalReserveHandling = baseURL + '/order/abnormal/cancelAbnormalReserveHandling';
// 运单监控日志
api.monitorLog = baseURL + '/order/detail/monitorLog';
// 当前处理人进入
api.handlerEnters = baseURL + '/order/abnormal/handlerEnters';
// 处理人离开
api.handlerLeaves = baseURL + '/order/abnormal/handlerLeaves';
// 批量异常处理
api.abnormalHandleBatch = baseURL + '/order/abnormal/abnormalHandleBatch';
export default api;
