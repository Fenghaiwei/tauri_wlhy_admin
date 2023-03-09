import config from '@/config/config';
const baseURL = config.baseURL;
let api = {};

// 车队长列表（分页）
api.captainList = baseURL + '/captain/list';
// 车队长收款设置日志列表（分页）
api.captainLogList = baseURL + '/captain/tranSet/log/list';

// 车队长信息列表分页
api.captainInfoList = baseURL + '/captain/info/findCaptainInfoPage';
// 车队长详情基础信息查询
api.captainBaseInfo = baseURL + '/captain/info/selectCaptainBaseInfo';
// 车队长详情-查看承诺函
api.captainCommitmentLetter = baseURL + '/captain/commitmentLetter/show';
// 车队长详情车队管理列表分页查询
api.captainManagementList = baseURL + '/captain/info/findCaptainManagementPage';
// 车队长详情车队企业关联列表分页查询
api.captainCompanyList = baseURL + '/captain/info/findCaptainCompanyPage';
// 车队长关联企业-解除/恢复关系
api.captainUpdateRel = baseURL + '/captain/updateRel';
// 车队长关联企业-上传资料
api.captainUploadFile = baseURL + '/captain/uploadFile';
// 车队长详情操作日志列表分页查询
api.captainInfoLogList = baseURL + '/captain/info/findOperationLogPage';

// 下载列表
api.downloadList = baseURL + '/mypanel/downloadList';
// 模板上传
api.uploadTepl = baseURL + '/mypanel/export/uploadTepl';
// 查询下载列表
api.exportPageList = baseURL + '/mypanel/export/pageList';
// 下载列表重试
api.exportRetry = baseURL + '/mypanel/export/retry';
// 导出模板列表
api.teplPageList = baseURL + '/mypanel/export/teplPageList';

//司机资料审核列表
api.driverCertifyList = baseURL + '/user/driver/certify/list';
//车辆资料审核列表
api.vehicleCertifyList = baseURL + '/user/vehicle/certify/list';
//司机资料库
api.userList = baseURL + '/user/list';
//已注销司机列表
api.driverLogoutList = baseURL + '/user/driver/logout/list';
//已删除车辆列表
api.vehicleDeleteList = baseURL + '/user/vehicle/delete/list';

// 认证详情页查询
api.queryCertificationDetails = baseURL + '/user/driver/queryCertificationDetails';
// 审核--个人资料
api.userAuditDdriver = baseURL + '/user/auditDriver';
// 审核--车辆资料
api.userAuditVehicle = baseURL + '/user/auditVehicle';

// 身份证--查询详情
api.userIdCardQuery = baseURL + '/user/idCard/query';
// 驾驶证--查询详情
api.getDriverLicence = baseURL + '/user/driverLicence/get';
// 从业资格证--查询详情
api.qualificationDetail = baseURL + '/user/qualification/detail';
// 行驶证--查询详情
api.getDrivingLicenseDetail = baseURL + '/user/getDrivingLicenseDetail';
// 道路运输许可证--查询详情
api.roadLicenceDetail = baseURL + '/user/vehicle/roadLicence/detail';

// 身份证--修改证件
api.userIdCardUpdate = baseURL + '/user/idCard/update';
// 驾驶证--修改证件
api.driverLicenceUpdate = baseURL + '/user/driverLicence/update';
// 从业资格证--修改证件
api.qualificationUpdate = baseURL + '/user/qualification/update';
// 行驶证--修改证件
api.saveAuditedDrivingLicense = baseURL + '/user/vehicle/saveAuditedDrivingLicense';
// 道路运输许可证--修改证件
api.saveAuditedRoadLicense = baseURL + '/user/vehicle/saveAuditedRoadLicense';

// 司机资料-更改记录列表
api.driverLogList = baseURL + '/user/driver/log/list';
// 车辆资料 - 更改记录列表
api.drivingLicenceLogList = baseURL + '/user/vehcile/log/list';
// 查询身份证快照信息
api.idCardQuerySnapshot = baseURL + '/user/idCard/querySnapshot';
// 司机驾照资料-单条更改记录详情
api.driverLicenceLogDetail = baseURL + '/user/driverLicence/log/detail';
//从业资格证 - 历史快照查询
api.qualificationSnapshot = baseURL + '/user/qualification/snapshot';
// 司机行驶证-单条更改记录详情
api.drivingLicenceLog = baseURL + '/user/drivingLicence/log/detail';
// 道路运输证-单条更改记录详情
api.roadLicenceLogDetail = baseURL + '/user/roadLicence/log/detail';
//司机复核记录
api.pageDriverCarrierReviewed = baseURL + '/user/pageDriverCarrierReviewed';
//车辆复核记录
api.pageVehicleCarrierReviewed = baseURL + '/user/pageVehicleCarrierReviewed';
//查询所有承运公司（分页）
api.carrierList = baseURL + '/user/carrierCompany/list';
// 查询审核拒绝原因
api.getCertifyRejectReason = baseURL + '/user/getCertifyRejectReason';
//查询车辆类型
api.getVehicleTypeList = baseURL + '/user/getVehicleTypeList';
//添加当前审核人
api.userAuditorRecord = baseURL + '/user/auditor/record';
//移除当前审核人
api.userAuditorRemove = baseURL + '/user/auditor/remove';
//注销账号
api.userDestroy = baseURL + '/user/destroy';
//用户禁用/启用
api.userStateAble = baseURL + '/user/userStateAble';
//用户剩余资产查询-用于用户注销
api.findUserDestroyBeforeData = baseURL + '/user/findUserDestroyBeforeData';

// 承运公司配置列表分页查询
api.carrierConfigList = baseURL + '/carrier/config/page';
// 承运公司操作日志列表查询
api.carrierConfigLog = baseURL + '/carrier/config/log';
// 承运公司配置修改
api.carrierConfigUpdate = baseURL + '/carrier/config/update';
export default api;
