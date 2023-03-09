<template>
  <layout navActive="transport">
    <div class="abnormal-alert-wrap">
      <div class="tab-nav-custom">
        <el-tabs v-model="tabActive" @tab-click="tabChange" class="control-tab">
          <el-tab-pane label="通用设置" name="commonset"> </el-tab-pane>
          <el-tab-pane label="通知设置" name="alertset"> </el-tab-pane>
        </el-tabs>
        <div class="segment">
          <div class="segment-header">需要开启短信通知的类型</div>
          <div class="segment-area">
            <div class="set-list-con">
              <el-checkbox-group v-model="abnormalTypeSelected">
                <el-checkbox
                  v-for="(item, index) in abnormalTypeList"
                  :key="index"
                  class="self-checkbox"
                  :label="item.val"
                  :disabled="item.key == 'appOffline'"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>

        <div class="segment">
          <div class="segment-header">通知对象设置</div>
          <div class="segment-area">
            <div class="set-list-con alert-set">
              <el-checkbox-group v-model="smsNotificationSelect" @change="handleCheckedChange">
                <el-checkbox
                  v-for="(item, index) in smsNotificationTypeList"
                  :key="index"
                  class="self-checkbox"
                  :label="item.val"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>

              <el-input
                style="margin-left: 10px; width: 500px"
                placeholder="最多支持5个，中间用逗号隔开"
                v-if="smsNotificationSelect.indexOf('4') > -1"
                v-model.trim="definedMobileNums"
                :maxlength="smsNotificationLen"
              />
            </div>
          </div>
        </div>

        <div class="segment">
          <div class="segment-header">短信通知频次设置</div>
          <div class="segment-area">
            <div class="set-list-con">
              智能追踪<el-select v-model="smsNotificationFrequencies" class="ml-5">
                <el-option v-for="item in hourList" :key="item.val" :label="item.name" :value="item.val"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="segment">
          <div class="segment-header">监控异常企业端推送</div>
          <div class="segment-area">
            <div class="set-list-con">
              <el-radio-group v-model="abnormalPushState">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="ml-20 mt-20 mb-20">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import { isPhone } from '@fe/validator';

export default {
  data() {
    return {
      companyCode: '',
      smsNotificationLen: 59, // 自定义手机号最大输入长度（5个手机号）
      tabActive: 'alertset',
      abnormalTypeSelected: [], // 需要开启短信通知的类型
      abnormalPushState: 0,
      abnormalTypeList: [
        { name: '无定位', val: '1', key: 'noLocationType' },
        { name: '中途停车', val: '2', key: 'midwayStopType' },
        { name: '运输超时', val: '4', key: 'transportTimeoutType' },
        { name: 'APP离线', val: '8', key: 'appOffline' },
        { name: '超速', val: '1024', key: 'speedingType' },
        { name: '超载', val: '2048', key: 'overloadType' },
        { name: '疲劳驾驶', val: '4096', key: 'fatigueDrivingType' },
        { name: '风险车辆', val: '8192', key: 'riskOfVehicleType' },
        { name: '风险司机', val: '16384', key: 'riskDriversType' }
      ],
      smsNotificationSelect: [], // 通知对象设置
      smsNotificationTypeList: [
        {
          name: '发货人',
          val: '1',
          key: 'delivererType'
        },
        {
          name: '收单员',
          val: '2',
          key: 'clientType'
        },
        {
          name: '自定义手机号',
          val: '4',
          key: 'extraMobileNumType'
        }
      ],
      definedMobileNums: '', // 自定义手机号
      smsNotificationFrequencies: 4, // 短信通知频次设置
      hourList: [
        {
          name: '2小时',
          val: 2
        },
        {
          name: '4小时',
          val: 4
        },
        {
          name: '6小时',
          val: 6
        },
        {
          name: '8小时',
          val: 8
        },
        {
          name: '12小时',
          val: 12
        },
        {
          name: '24小时',
          val: 24
        }
      ]
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/transport' },
      { title: '监控配置列表', path: '/monitor/set' },
      { title: '通知设置' }
    ]);
    this.companyCode = this.$route.params.key;
    this.featchData();
  },
  methods: {
    featchData() {
      const options = { companyCode: this.companyCode };
      axios.post(api.getAlertSetting, options).then(res => {
        if (res.data) {
          this.abnormalTypeSelected = res.data.abnormalType ? res.data.abnormalType.split(',') : [];
          this.smsNotificationSelect = res.data.smsNotificationType ? res.data.smsNotificationType.split(',') : [];
          this.definedMobileNums = res.data.definedMobileNums ? res.data.definedMobileNums.join(',') : '';
          this.smsNotificationFrequencies = res.data.smsNotificationFrequencies;
          this.abnormalPushState = res.data.abnormalPushState;
        }
      });
    },
    tabChange(val) {
      if (this.tabActive == 'commonset') {
        this.$router.replace({
          path: `/abnormal/common/set/${this.companyCode}`
        });
      } else {
        this.$router.replace({
          path: `/abnormal/alert/set/${this.companyCode}`
        });
      }
    },
    handleCheckedChange(val) {
      if (val.indexOf('4') == -1) {
        this.definedMobileNums = '';
      }
    },
    handleSave() {
      let abnormalTypeData = {};
      this.abnormalTypeList.map(item => {
        if (this.abnormalTypeSelected.includes(item.val)) {
          abnormalTypeData[item.key] = 1;
        } else {
          abnormalTypeData[item.key] = 0;
        }
      });
      let smsNotificationData = {};
      this.smsNotificationTypeList.map(item => {
        if (this.smsNotificationSelect.includes(item.val)) {
          smsNotificationData[item.key] = 1;
        } else {
          smsNotificationData[item.key] = 0;
        }
      });
      if (this.smsNotificationSelect.includes('4') && this.definedMobileNums == '') {
        this.$message.error('请填写自定义手机号');
        return;
      }
      if (this.definedMobileNums) {
        let definedMobileNumsArr = this.definedMobileNums.split(',');
        for (let i = 0; i < definedMobileNumsArr.length; i++) {
          if (!isPhone(definedMobileNumsArr[i])) {
            this.$message.error(`${definedMobileNumsArr[i]}手机号格式不正确`);
            return;
          }
        }
      }
      const options = {
        companyCode: this.companyCode,
        ...abnormalTypeData,
        ...smsNotificationData,
        definedMobileNums: this.definedMobileNums ? this.definedMobileNums.split(',') : [],
        smsNotificationFrequencies: this.smsNotificationFrequencies,
        abnormalPushState: this.abnormalPushState
      };
      axios.post(api.saveAlertSetting, options).then(res => {
        this.$message.success('操作成功');
        this.featchData();
      });
    },
    handleBack() {
      this.$router.push(`/monitor/set`);
    }
  }
};
</script>
<style lang="postcss">
.abnormal-alert-wrap {
  .set-list {
    margin: 0 0 14px 0;
    padding: 20px;
    background: #fff;
  }
  .set-list-title {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #778ca2;
  }
  .set-list-con {
    margin: 35px 0 15px 36px;
    color: #424b53;
  }
  .slider-box {
    width: 572px;
  }
  .alert-set {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .self-checkbox:not(:last-child) {
    margin-right: 50px;
  }
  .control-tab {
    .el-tabs__header {
      background: #fff;
      padding: 0 15px;
      margin-bottom: 14px;
    }
    .el-tabs__content {
      margin-top: 10px;
      background: #fff;
    }
  }
}
</style>
