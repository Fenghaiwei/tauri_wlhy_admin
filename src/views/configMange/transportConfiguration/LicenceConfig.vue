<template>
  <layout navActive="config">
    <div class="licence-config-page">
      <div class="segment">
        <div class="segment-header">
          <span>司机认证强制拦截</span>
        </div>
        <div class="segment-area">
          <div class="toolbar-panel">
            <div class="toolbar-item">
              <el-button type="primary" v-if="!certifyEdit" @click="certifyEdit = true">修改</el-button>
              <template v-else>
                <el-button type="primary" @click="handleSaveSwitchDriverCertify">保存</el-button>
                <el-button @click="hanldeRest('driverCertifyConfig', 'certifyEdit')">放弃修改</el-button>
              </template>
            </div>
          </div>
          <div class="segment-item">
            <table class="tb-custom" cellspacing="0" cellpadding="0">
              <thead>
                <th width="50%">两证</th>
                <th width="50%">
                  <div>
                    认证状态拦截
                    <el-tooltip placement="top">
                      <div slot="content">开启后，司机认证时必填</div>
                      <span>
                        <svg class="svgfont font-green font-size16" aria-hidden="true">
                          <use xlink:href="#icon-tishi1"></use>
                        </svg>
                      </span>
                    </el-tooltip>
                  </div>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td class="bd-left-none">从业资格证</td>
                  <td>
                    <span v-if="!certifyEdit">{{
                      driverCertifyConfig.driverCertifyQualificationSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio v-model="driverCertifyConfig.driverCertifyQualificationSwitch" :label="1"
                        >开启</el-radio
                      >
                      <el-radio v-model="driverCertifyConfig.driverCertifyQualificationSwitch" :label="0"
                        >关闭</el-radio
                      >
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">道路运输证</td>
                  <td>
                    <span v-if="!certifyEdit">{{
                      driverCertifyConfig.driverCertifyRoadLicenceSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio v-model="driverCertifyConfig.driverCertifyRoadLicenceSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="driverCertifyConfig.driverCertifyRoadLicenceSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">
          <span>提现拦截</span>
        </div>
        <div class="segment-area">
          <div class="toolbar-panel">
            <div class="toolbar-item">
              <el-button type="primary" v-if="!withdrawEdit" @click="withdrawEdit = true">修改</el-button>
              <template v-else>
                <el-button type="primary" @click="handleSavehSwitchWithdraw">保存</el-button>
                <el-button @click="hanldeRest('withdrawConfig', 'withdrawEdit')">放弃修改</el-button>
              </template>
            </div>
          </div>
          <div class="segment-item">
            <table class="tb-custom" cellspacing="0" cellpadding="0">
              <thead>
                <th width="30%">五证</th>
                <th width="35%">
                  <div>
                    认证状态拦截
                    <el-tooltip placement="top">
                      <div slot="content">开启后，如果证件不是【审核通过】或【更新成功】，则会被拦截</div>
                      <svg class="svgfont font-green font-size16" aria-hidden="true">
                        <use xlink:href="#icon-tishi1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </th>
                <th width="35%">
                  <div>
                    有效期拦截
                    <el-tooltip placement="top">
                      <div slot="content">开启后，如果证件有效期缺失或过期，则会被拦截</div>
                      <svg class="svgfont font-green font-size16" aria-hidden="true">
                        <use xlink:href="#icon-tishi1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td class="bd-left-none">身份证</td>
                  <td>
                    <span>{{ withdrawConfig.withdrawIdCardSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!withdrawEdit">{{ withdrawConfig.withdrawIdCardExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="withdrawConfig.withdrawIdCardExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="withdrawConfig.withdrawIdCardExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">驾驶证</td>
                  <td>
                    <span>{{ withdrawConfig.withdrawDriverLicenseSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!withdrawEdit">{{
                      withdrawConfig.withdrawDriverLicenseExpireSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio v-model="withdrawConfig.withdrawDriverLicenseExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="withdrawConfig.withdrawDriverLicenseExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">行驶证</td>
                  <td>
                    <span>{{ withdrawConfig.withdrawDrivingLicenseSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!withdrawEdit">{{
                      withdrawConfig.withdrawDrivingLicenseExpireSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio v-model="withdrawConfig.withdrawDrivingLicenseExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="withdrawConfig.withdrawDrivingLicenseExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">从业资格证</td>
                  <td>
                    <span v-if="!withdrawEdit">{{ withdrawConfig.withdrawQualificationSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="withdrawConfig.withdrawQualificationSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="withdrawConfig.withdrawQualificationSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                  <td>
                    <span v-if="!withdrawEdit">{{
                      withdrawConfig.withdrawQualificationExpireSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio
                        v-if="withdrawConfig.withdrawQualificationSwitch"
                        v-model="withdrawConfig.withdrawQualificationExpireSwitch"
                        :label="1"
                        >开启</el-radio
                      >
                      <el-radio v-model="withdrawConfig.withdrawQualificationExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>

                <tr>
                  <td class="bd-left-none">道路运输证</td>
                  <td>
                    <span v-if="!withdrawEdit">{{ withdrawConfig.withdrawRoadLicenceSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="withdrawConfig.withdrawRoadLicenceSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="withdrawConfig.withdrawRoadLicenceSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                  <td>
                    <span v-if="!withdrawEdit">{{
                      withdrawConfig.withdrawRoadLicenceExpireSwitch ? '开启' : '关闭'
                    }}</span>
                    <template v-else>
                      <el-radio
                        v-if="withdrawConfig.withdrawRoadLicenceSwitch"
                        v-model="withdrawConfig.withdrawRoadLicenceExpireSwitch"
                        :label="1"
                        >开启</el-radio
                      >
                      <el-radio v-model="withdrawConfig.withdrawRoadLicenceExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">
          <span>抢单拦截</span>
        </div>
        <div class="segment-area">
          <div class="toolbar-panel">
            <div class="toolbar-item">
              <el-button type="primary" v-if="!orderEdit" @click="orderEdit = true">修改</el-button>
              <template v-else>
                <el-button type="primary" @click="handleSaveSwitchOrdery">保存</el-button>
                <el-button @click="hanldeRest('orderConfig', 'orderEdit')">放弃修改</el-button>
              </template>
            </div>
          </div>
          <div class="segment-item">
            <table class="tb-custom" cellspacing="0" cellpadding="0">
              <thead>
                <th width="30%">五证</th>
                <th width="35%">
                  <div>
                    认证状态拦截
                    <el-tooltip placement="top">
                      <div slot="content">开启后，如果证件不是【审核通过】或【更新成功】，则会被拦截</div>
                      <svg class="svgfont font-green font-size16" aria-hidden="true">
                        <use xlink:href="#icon-tishi1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </th>
                <th width="35%">
                  <div>
                    有效期拦截
                    <el-tooltip placement="top">
                      <div slot="content">开启后，如果证件有效期缺失或过期，则会被拦截</div>
                      <svg class="svgfont font-green font-size16" aria-hidden="true">
                        <use xlink:href="#icon-tishi1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td class="bd-left-none">身份证</td>
                  <td>
                    <span>{{ orderConfig.orderIdCardSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderIdCardExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="orderConfig.orderIdCardExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="orderConfig.orderIdCardExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">驾驶证</td>
                  <td>
                    <span>{{ orderConfig.orderDriverLicenseSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderDriverLicenseExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="orderConfig.orderDriverLicenseExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="orderConfig.orderDriverLicenseExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">行驶证</td>
                  <td>
                    <span>{{ orderConfig.orderDrivingLicenseSwitch ? '开启' : '关闭' }}</span>
                  </td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderDrivingLicenseExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="orderConfig.orderDrivingLicenseExpireSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="orderConfig.orderDrivingLicenseExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bd-left-none">从业资格证</td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderQualificationSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="orderConfig.orderQualificationSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="orderConfig.orderQualificationSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderQualificationExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio
                        v-if="orderConfig.orderQualificationSwitch"
                        v-model="orderConfig.orderQualificationExpireSwitch"
                        :label="1"
                        >开启</el-radio
                      >
                      <el-radio v-model="orderConfig.orderQualificationExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>

                <tr>
                  <td class="bd-left-none">道路运输证</td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderRoadLicenceSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio v-model="orderConfig.orderRoadLicenceSwitch" :label="1">开启</el-radio>
                      <el-radio v-model="orderConfig.orderRoadLicenceSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                  <td>
                    <span v-if="!orderEdit">{{ orderConfig.orderRoadLicenceExpireSwitch ? '开启' : '关闭' }}</span>
                    <template v-else>
                      <el-radio
                        v-if="orderConfig.orderRoadLicenceSwitch"
                        v-model="orderConfig.orderRoadLicenceExpireSwitch"
                        :label="1"
                        >开启</el-radio
                      >
                      <el-radio v-model="orderConfig.orderRoadLicenceExpireSwitch" :label="0">关闭</el-radio>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';

export default {
  data() {
    return {
      allConfigData: {},
      certifyEdit: false, //司机认证强制拦截编辑状态
      withdrawEdit: false, //提现拦截编辑状态
      orderEdit: false, // 抢单拦截编辑状态
      driverCertifyConfig: {
        driverCertifyQualificationSwitch: 0, //司机认证-从业资格证开关，0关，1开
        driverCertifyRoadLicenceSwitch: 0 //司机认证-道路许可证开关，0关，1开
      },
      withdrawConfig: {
        withdrawIdCardSwitch: 0, //提现拦截-身份证开关，0关，1开
        withdrawIdCardExpireSwitch: 0, // 提现拦截-身份证有效期开关，0关，1开
        withdrawDriverLicenseSwitch: 0, //提现拦截-驾驶证开关，0关，1开
        withdrawDriverLicenseExpireSwitch: 0, //提现拦截-驾驶证有效期开关，0关，1开
        withdrawDrivingLicenseSwitch: 0, //提现拦截-行驶证开关，0关，1开
        withdrawDrivingLicenseExpireSwitch: 0, //提现拦截-行驶证有效期开关，0关，1开
        withdrawQualificationSwitch: 0, //提现拦截-从业资格证开关，0关，1开
        withdrawQualificationExpireSwitch: 0, //提现拦截-从业资格证有效期开关，0关，1开
        withdrawRoadLicenceSwitch: 0, // 提现拦截-道路许可证开关，0关，1开
        withdrawRoadLicenceExpireSwitch: 0 // 提现拦截-道路许可证有效期开关，0关，1开
      },
      orderConfig: {
        orderIdCardSwitch: 0, //接单拦截-身份证开关，0→关，1→开
        orderIdCardExpireSwitch: 0, // 接单拦截-身份证有效期开关，0→关，1→开"
        orderDriverLicenseSwitch: 0, //接单拦截-驾驶证开关，0→关，1→开
        orderDriverLicenseExpireSwitch: 0, //接单拦截-驾驶证有效期开关，0→关，1→开
        orderDrivingLicenseSwitch: 0, //接单拦截-行驶证开关，0→关，1→开
        orderDrivingLicenseExpireSwitch: 0, //接单拦截-行驶证有效期开关，0→关，1→开
        orderQualificationSwitch: 0, //接单拦截-从业资格证开关，0→关，1→开
        orderQualificationExpireSwitch: 0, //接单拦截-从业资格证有效期开关，0→关，1→开
        orderRoadLicenceSwitch: 0, // 接单拦截-道路许可证开关，0→关，1→开
        orderRoadLicenceExpireSwitch: 0 // 接单拦截-道路许可证有效期开关，0→关，1→开
      }
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '五证拦截' }]);
    this.querySwitch();
  },
  watch: {
    'withdrawConfig.withdrawQualificationSwitch'(val) {
      if (!val) this.withdrawConfig.withdrawQualificationExpireSwitch = 0;
    },
    'withdrawConfig.withdrawRoadLicenceSwitch'(val) {
      if (!val) this.withdrawConfig.withdrawRoadLicenceExpireSwitch = 0;
    },
    'orderConfig.orderQualificationSwitch'(val) {
      if (!val) this.orderConfig.orderQualificationExpireSwitch = 0;
    },
    'orderConfig.orderRoadLicenceSwitch'(val) {
      if (!val) this.orderConfig.orderRoadLicenceExpireSwitch = 0;
    }
  },
  methods: {
    async querySwitch() {
      let res = await axios.post(api.fiveLicenceSwitchQuery);
      let result = res.data || {};
      this.allConfigData = JSON.parse(JSON.stringify(result));
      for (let k in this.driverCertifyConfig) this.driverCertifyConfig[k] = result[k] || 0;
      for (let k in this.withdrawConfig) this.withdrawConfig[k] = result[k] || 0;
      for (let k in this.orderConfig) this.orderConfig[k] = result[k] || 0;
    },
    hanldeRest(configData, editData) {
      this[editData] = false;
      for (let k in this[configData]) this[configData][k] = this.allConfigData[k] || 0;
    },
    async handleSaveSwitchDriverCertify() {
      await axios.post(api.fiveLicenceSwitchDriverCertify, { ...this.driverCertifyConfig });
      this.certifyEdit = false;
      this.querySwitch();
    },
    async handleSavehSwitchWithdraw() {
      await axios.post(api.fiveLicenceSwitchWithdraw, { ...this.withdrawConfig });
      this.withdrawEdit = false;
      this.querySwitch();
    },
    async handleSaveSwitchOrdery() {
      await axios.post(api.fiveLicenceSwitchOrder, { ...this.orderConfig });
      this.orderEdit = false;
      this.querySwitch();
    }
  }
};
</script>
<style lang="postcss">
.licence-config-page {
  .toolbar-panel .toolbar-item .el-input {
    width: 140px;
  }

  .el-dialog__body {
    text-align: center;
  }
  .tb-custom {
    margin: 20px 0;
    width: 100%;
    border: 1px solid #ebeef5;
    text-align: center;
    th {
      background: #f7f9fb;
      height: 40px;
      border-right: none;
      border-bottom: none;
    }
    td {
      height: 40px;
      border: 1px solid #ebeef5;
      border-right: none;
      border-bottom: none;
    }
    .bd-left-none {
      border-left: none;
    }
  }
}
</style>
