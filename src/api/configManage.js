import config from '@/config/config';
const baseURL = config.baseURL;
let api = {};

// 手机号列表
api.gisListPhone = baseURL + '/gis/list/phone';
// 删除手机号
api.gisDelPhone = baseURL + '/gis/del/phone';
// 启用/停用手机号
api.gisSwitchStatusPhone = baseURL + '/gis/switch/status/phone';
// 保存手机号
api.gisSavePhone = baseURL + '/gis/save/phone';
// 司机白名单列表
api.twoLicenceWhitelist = baseURL + '/config/twoLicenceWhitelist/list';

// 两证司机白名单批量删除
api.twoLicenceWhitelistDelete = baseURL + '/config/twoLicenceWhitelist/delete';
// 查询所有司机
api.driverList = baseURL + '/driver/list';

// 两证拦截开关查询
api.twoLicenceSwitchQuery = baseURL + '/config/twoLicenceSwitch/query';
// 两证拦截开关更新
api.twoLicenceSwitchUpdate = baseURL + '/config/twoLicenceSwitch/update';

// 查询承运公司黑名单列表
api.carrierCompanyBlacklist = baseURL + '/config/carrierCompanyBlacklist/list';
// 承运公司黑名单批量删除
api.carrierCompanyBlackDelete = baseURL + '/config/carrierCompanyBlacklist/delete';
// 承运公司黑名单批量添加
api.carrierCompanyBlackAdd = baseURL + '/config/carrierCompanyBlacklist/add';
// 查询所有承运公司
api.queryCarrierList = baseURL + '/carrier/list';

// ETC发票车辆黑名单查询
api.etcVehicleBlackList = baseURL + '/config/etcVehicleBlackList/list';
// ETC发票车辆黑名单添加
api.etcVehicleBlackAdd = baseURL + '/config/etcVehicleBlackList/add';
// ETC发票车辆黑名单删除
api.etcVehicleBlackDelete = baseURL + '/config/etcVehicleBlackList/delete';

// ETC发票企业黑名单查询
api.etcCompanyBlackList = baseURL + '/config/etcCompanyBlackList/list';
// ETC发票企业黑名单添加
api.etcCompanyBlackAdd = baseURL + '/config/etcCompanyBlackList/add';
// ETC发票企业黑名单删除
api.etcCompanyBlackDelete = baseURL + '/config/etcCompanyBlackList/delete';
// 查询已认证企业
api.companyBlackList = baseURL + '/company/list/blackList';

// 查询评价配置列表
api.evaluationConfigList = baseURL + '/evaluation/config/list';
// 添加评价配置
api.evaluationConfigAdd = baseURL + '/evaluation/config/add';
// 编辑评价配置
api.evaluationConfigUpdate = baseURL + '/evaluation/config/update';
// 删除评价配置
api.evaluationConfigDelete = baseURL + '/evaluation/config/delete';
// 评价配置上下线
api.evaluationConfigOnline = baseURL + '/evaluation/config/online';
// 查看结果
api.evaluationResultCollect = baseURL + '/evaluation/result/collect';
// 查看企业明细
api.evaluationDetailList = baseURL + '/evaluation/detail/list';
// 查询评价配置详情
api.evaluationConfigDetailGet = baseURL + '/evaluation/configDetail/get';
// 保存评价配置详情
api.evaluationConfigDetailAdd = baseURL + '/evaluation/configDetail/add';

//查询开放平台
api.openPlateformCustomerPage = baseURL + '/openplateform/customer/page';
//新增开放平台
api.openPlateformCustomerSave = baseURL + '/openplateform/customer/save';
//编辑开发平台
api.openPlateformCustomerUpdate = baseURL + '/openplateform/customer/update';
//开发平台启用禁用
api.openPlateformCustomerEnabled = baseURL + '/openplateform/customer/enabled';
//查询企业
api.openPlateformRelationQuery = baseURL + '/openplateform/customer/company/relation/query';
//保存企业关联
api.openPlateformRelationSave = baseURL + '/openplateform/customer/company/relation/save';
// 查询关联企业
api.openPlateformRelationPage = baseURL + '/openplateform/customer/company/relation/page';
// 取消关联
api.openPlateformRelationCancel = baseURL + '/openplateform/customer/company/relation/cancel';

// 订阅详情
api.openPlateformSubscribeDetail = baseURL + '/openplateform/customer/subscribe/detail';
// 保存订阅
api.openPlateformSubscribeSaveAll = baseURL + '/openplateform/customer/subscribe/saveAll';
// 接口详情
api.openPlateformApiDetail = baseURL + '/openplateform/customer/api/detail';
// 保存接口
api.openPlateformApiSaveAll = baseURL + '/openplateform/customer/api/saveAll';

// 运单磅单数据列表
api.orderPoundList = baseURL + '/config/orderPoundDataSet/list';
// 运单磅单数据详情
api.orderPoundDetail = baseURL + '/config/orderPoundDataSet/detail';
// 运单磅单数据设置
api.orderPoundAdd = baseURL + '/config/orderPoundDataSet/add';
// 运单磅单数据更新
api.orderPoundUpdate = baseURL + '/config/orderPoundDataSet/update';
// 运单磅单数据删除
api.orderPoundRemove = baseURL + '/config/orderPoundDataSet/remove';

// 查询建行司机白名单
api.qryWhitelist = baseURL + '/whitelist/pages';
// 查询建行司机白名单操作日志
api.qryWhitelistOperated = baseURL + '/whitelist/operated/pages';
// 接单拦截
api.WhitelistIntercept = baseURL + '/whitelist/intercept';
// 查询etc线路
api.qryEtcLine = baseURL + '/open/etc/line/list';
// 查询省市区
api.sysRegion = baseURL + '/sys/region';
// 查询提现拦截白名单
api.qryWithdrawWhitelist = baseURL + '/whitelist/withdraw/pages';
// 提现拦截修改原因
api.WhitelistWithdrawIntercept = baseURL + '/whitelist/withdraw/intercept';
// 查询提现拦截白名单操作日志
api.qryWhitelistWithdrawOperated = baseURL + '/whitelist/operated/withdraw/pages';
//导入提现白名单
api.whitelistWithdrawImport = baseURL + '/whitelist/withdraw/import';
//自动加入名单的列表
api.driverImportPages = baseURL + '/driver/import/rule/pages';
//自动加入名单的操作日志
api.driverImportLogPages = baseURL + '/driver/import/rule/log/pages';
//自动加入名单的修改状态
api.driverImportUpdateStatus = baseURL + '/driver/import/rule/updateStatus';

//货运险数据列表
api.stockInsuranceList = baseURL + '/stockInsurance/list';
//货运险数据修改
api.stockInsuranceUpdate = baseURL + '/stockInsurance/update';
//查询签署的意向协议
api.queryStockProtocolUrl = baseURL + '/stockInsurance/queryStockProtocolUrl';

//查询增值服务产品列表
api.cargoGuaranteeSelectPage = baseURL + '/cargoGuarantee/selectPageList';
//查询增值服务产品新增
api.cargoGuaranteeAdd = baseURL + '/cargoGuarantee/add';
//查询增值服务产品编辑
api.cargoGuaranteeEdit = baseURL + '/cargoGuarantee/edit';
//查询增值服务产品详情
api.cargoGuaranteeDetail = baseURL + '/cargoGuarantee/get';
//查询增值产品企业配置列表
api.cargoGuaranteeCompanySetting = baseURL + '/cargoGuaranteeCompanySetting/selectPageList';
//查询企业配置产品类型下拉框
api.cargoGuaranteeProductList = baseURL + '/cargoGuaranteeCompanySetting/findProductList';
// 编辑或新增增值产品企业配置
api.cargoGuaranteeCompanySettingEdit = baseURL + '/cargoGuaranteeCompanySetting/addAndEdit';
//增值产品企业配置详情
api.cargoGuaranteeCompanySettingDetail = baseURL + '/cargoGuaranteeCompanySetting/get';
//司机黑名单新增
api.addDriverToBlacklist = baseURL + '/freightLoanBlackList/add';
//查询司机列表
api.getDriverList = baseURL + '/freightLoanBlackList/driver/search';
//运费贷司机黑名单列表
api.getDriverBlacklist = baseURL + '/freightLoanBlackList/list';
//司机黑名单移除
api.delDriverFromBlacklist = baseURL + '/freightLoanBlackList/remove';
//获取黑名单原因选项
api.getBlacklistReasons = baseURL + '/freightLoanBlackList/freightLoanBlackList/reason';
//司机黑名单编辑
api.editDriverToBlacklist = baseURL + '/freightLoanBlackList/edit';
// 开关企业货保配置
api.updateCargoGuaranteeConfig = baseURL + '/company/updateCargoGuaranteeConfig';
//查询企业通用配置
api.getCommonSetting = baseURL + '/companyMonitorRuleSetting/getCommonSetting';
//保存企业通用配置
api.saveCommonSetting = baseURL + '/companyMonitorRuleSetting/saveCommonSetting';
//查询企业警告配置
api.getAlertSetting = baseURL + '/companyMonitorRuleSetting/getAlertSetting';
//保存企业警告配置
api.saveAlertSetting = baseURL + '/companyMonitorRuleSetting/saveAlertSetting';
//获取全局配置的白名单地址
api.getAddressWhiteList = baseURL + '/monitor/addressWhiteList/getAllNames';
// 查询产品配置明细
api.getGuaranteeProductsDetail = baseURL + '/cargoGuarantee/selectCargoGuaranteeProductsDetailList';
// 司机白名单-添加标签
api.twoLicenceWhitelistAddLabel = baseURL + '/config/twoLicenceWhitelist/addLabel';
// 司机白名单-导出
api.twoLicenceWhitelistExport = baseURL + '/config/twoLicenceWhitelist/export';
// 企业配置导出
api.cargoGuaranteeCompanySettingExport = baseURL + '/cargoGuaranteeCompanySetting/export';
// 自有车企业白名单列表分页查询
api.ownerCarCompanyList = baseURL + '/ownerCar/company/list';
// 自有车企业白名单新增
api.ownerCarCompanyAdd = baseURL + '/ownerCar/company/add';
// 自有车企业白名单移除
api.ownerCarCompanyDelete = baseURL + '/ownerCar/company/delete';
// 货源类型下拉查询
api.findStockTypeMetaPage = baseURL + '/stock/findStockTypeMetaPage';
// 企业配置规则下拉框
api.cargoGuaranteeCompanyRuleList = baseURL + '/cargoGuaranteeCompanySetting/findRuleList';
// 五证拦截开关总查询
api.fiveLicenceSwitchQuery = baseURL + '/config/fiveLicenceSwitch/query';
// 五证司机认证拦截操作
api.fiveLicenceSwitchDriverCertify = baseURL + '/config/fiveLicenceSwitch/driverCertify/update';
// 五证抢单拦截操作
api.fiveLicenceSwitchOrder = baseURL + '/config/fiveLicenceSwitch/order/update';
//五证提现拦截操作
api.fiveLicenceSwitchWithdraw = baseURL + '/config/fiveLicenceSwitch/withdraw/update';

// 司机白名单-添加
api.twoLicenceWhitelistAdd = baseURL + '/config/twoLicenceWhitelist/addV2';
// 企业白名单-列表查询
api.companyWhiteList = baseURL + '/config/companyWhiteList/query';
// 企业白名单-添加
api.companyWhiteListAdd = baseURL + '/config/companyWhiteList/add';
// 企业白名单-移除
api.companyWhiteListClean = baseURL + '/config/companyWhiteList/clean';
// 企业白名单-导出
api.companyWhiteListExport = baseURL + '/config/companyWhiteList/export';
//查询已认证企业（分页）-企业白名单
api.qryCompanyWhiteList = baseURL + '/company/list/companyWhiteList';

// 省平台异常数据反查列表
api.loginkExceptionList = baseURL + '/loginkException/list';
// 省平台异常数据反查导出结果
api.loginkExceptionExportResult = baseURL + '/loginkException/exportResult';
// 省平台异常数据反查导入异常数据
api.loginkExceptionImportException = baseURL + '/loginkException/importException';
// 数据上报异常处理下载模板
api.loginkExceptionDownload = baseURL + '/loginkException/downloadModel';
// 认证修改数据列表
api.loginkExceptionAuthModifyList = baseURL + '/loginkException/authModify/list';
// 认证修改数据导入
api.loginkExceptionAuthModifyImport = baseURL + '/loginkException/authModify/import';
// 导出认证修改数据结果
api.loginkExceptionAuthModifyExport = baseURL + '/loginkException/authModify/export';
export default api;
