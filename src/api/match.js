import config from '@/config/config';
const baseURL = config.baseURL;
let api = {};

/*------------------------撮合会员管理 - start---------------------*/
// 司机列表（分页）
api.queryDriverList = baseURL + '/matchmaking/driver/list';
// 导入司机数据
api.matchDriverImport = baseURL + '/matchmaking/driver/import';
// 司机列表导出excel
api.matchDriverExportExcel = baseURL + '/matchmaking/driver/matchmakingDriver/exportExcelExport';
// 司机列表导出json
api.matchDriverExportJson = baseURL + '/matchmaking/driver/matchmakingDriver/exportJsonDriver';
// 查看代开协议
api.queryDriverAgreement = baseURL + '/matchmaking/driver/dk/agreement';
// 查看司机详情
api.queryDriverDetail = baseURL + '/matchmaking/driver/detail';
// 查看车辆详情
api.queryDriverVehicleDetail = baseURL + '/matchmaking/driver/driverVehicleDetail';
/*------------------------撮合会员管理 - end---------------------*/

/*------------------------撮合订单管理 - start---------------------*/
// 订单列表（分页）
api.queryMatchOrderList = baseURL + '/matchmaking/order/orderList';
// 订单详情
api.queryMatchOrderDetail = baseURL + '/matchmaking/order/orderDetail';
// 轨迹点
api.queryMatchOrderTrackPoints = baseURL + '/orderTrack/track/points';
// 订单比对列表（分页）
api.queryMatchCompareOrderList = baseURL + '/matchmaking/order/compareOrderList';
// 订单比对-导入
api.queryMatchCompareOrderImport = baseURL + '/matchmaking/invoice/compareOrderImport';
// 订单比对列表-导出json
api.queryMatchCompareOrderExportJson = baseURL + '/matchmaking/order/compareOrderExportJson';
// 订单比对列表-导出xlsx
api.queryMatchCompareOrderExportXlsx = baseURL + '/matchmaking/order/compareOrderExportXlsx';
/*------------------------撮合订单管理 - end---------------------*/

/*------------------------撮合开票管理 - start---------------------*/
// 开票列表
api.queryMatchInvoicePage = baseURL + '/matchmaking/invoice/invoicePageList';
// 发票详情-运单基本信息
api.queryMatchInvoiceInfo = baseURL + '/matchmaking/invoice/invoiceInfo';
// 发票详情-运单明细信息
api.queryMatchInvoiceOrderList = baseURL + '/matchmaking/invoice/invoiceDetail';
// 维护快递信息
api.matchMaintenanceExpress = baseURL + '/matchmaking/invoice/maintenanceExpress';
// 维护发票信息列表-勾选
api.matchMaintenanceInvoiceList = baseURL + '/matchmaking/invoice/maintenanceInvoiceList';
// 维护发票进度
api.matchMaintenanceInvoiceRateSave = baseURL + '/matchmaking/invoice/maintenanceInvoiceRate';
// 发票列表-导入
api.matchInvoiceImport = baseURL + '/matchmaking/invoice/invoiceImport';
// 代开发票列表
api.queryMatchOpenInvoicePage = baseURL + '/matchmaking/invoice/openInvoicePageList';
// 代开发票-发票基本详情
api.queryMatchOpenInvoiceInfo = baseURL + '/matchmaking/invoice/openInvoiceInfo';
// 代开发票-发票订单明细表
api.queryMatchOpenInvoiceOrderList = baseURL + '/matchmaking/invoice/openInvoiceDetail';
// 代开发票-订单详情
api.queryMatchOpenOrderInfo = baseURL + '/matchmaking/invoice/openOrderInfo';
/*------------------------撮合开票管理 - end---------------------*/
export default api;
