<template>
  <layout navActive="transport">
    <div class="abnormal-common-wrap">
      <div class="tab-nav-custom">
        <el-tabs v-model="tabActive" @tab-click="tabChange" class="control-tab">
          <el-tab-pane label="通用设置" name="commonset"></el-tab-pane>
          <el-tab-pane label="通知设置" name="alertset"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="segment">
        <div class="segment-header">
          <span
            >监控类型设置
            <svg class="svgfont font-blue pointer font-size16" aria-hidden="true" v-popover:popover1>
              <use xlink:href="#icon-tishi"></use>
            </svg>
            <el-popover
              ref="popover1"
              placement="right"
              trigger="hover"
              content="监控类型取消选中后，接单司机列表和异常明细列表不会展示已取消的异常类型的监控（历史数据不受影响）"
            >
            </el-popover
          ></span>
        </div>
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
        <div class="segment-header">
          <span
            >监控里程设置
            <svg class="svgfont font-blue pointer font-size16" aria-hidden="true" v-popover:popover2>
              <use xlink:href="#icon-tishi"></use>
            </svg>
            <el-popover
              ref="popover2"
              placement="right"
              trigger="hover"
              content="里程为装货地址到卸货地址直线距离，设置后会针对设定范围将进行监控"
            >
            </el-popover
          ></span>
        </div>
        <div class="segment-area">
          <div class="set-list-con monitDistance-box">
            <vue-slider
              class="ml-20 mb-10"
              v-model="monitDistance"
              :min="min"
              :max="max"
              :marks="marks"
              tooltip="always"
              :process-style="{ background: '#1CC466' }"
              :dot-style="{ border: '2px solid #1CC466' }"
              :stepActiveStyle="{ width: 0, height: 0, boxShadow: 'none' }"
              :stepStyle="{ width: 0, height: 0, boxShadow: 'none' }"
              :tooltip-formatter="formatter"
            ></vue-slider>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">
          <span>中途停车设置 </span>
        </div>
        <div class="segment-area">
          <div class="set-list-con">
            智能追踪停车<el-select filterable allow-create v-model="trackTime" class="ml-5">
              <el-option v-for="item in timeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
            </el-select>
            分钟以上，移动距离小于
            <el-select filterable allow-create v-model="movingDistance" class="mr-5">
              <el-option
                v-for="item in distanceList"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              ></el-option> </el-select
            >米的停止点
          </div>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">
          <span>黑名单停车设置 </span>
        </div>
        <div class="segment-area">
          <div class="set-list-con">
            智能追踪停车<el-select filterable allow-create v-model="blacklistTrackTime" class="ml-5">
              <el-option v-for="item in blackTimeList" :key="item.val" :label="item.name" :value="item.val"></el-option>
            </el-select>
            分钟以上，移动距离小于
            <el-select filterable allow-create v-model="blacklistMovingDistance" class="mr-5">
              <el-option
                v-for="item in blackDistanceList"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              ></el-option> </el-select
            >米的停止点
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">
          <span>中途停车排除以下地址 </span>
        </div>
        <div class="segment-area">
          <div class="set-list-con">
            <el-checkbox-group v-model="whiteListNames">
              <template v-for="(item, index) in whiteListNameList">
                <el-checkbox :key="index" :label="item">{{ item }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="ml-20 mt-20 mb-20">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleBack">返回</el-button>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import { isInt, isRangeNumber } from '@fe/validator';
export default {
  components: {
    VueSlider
  },
  data() {
    return {
      companyCode: '',
      tabActive: 'commonset',
      abnormalTypeSelected: [], // 监控类型设置
      abnormalTypeList: [
        { name: '无定位', val: '1', key: 'noLocationType' },
        { name: '中途停车', val: '2', key: 'midwayStopType' },
        { name: '运输超时', val: '4', key: 'transportTimeoutType' },
        { name: 'APP离线', val: '8', key: 'appOffline' },
        { name: '超速', val: '1024', key: 'speedingType' },
        { name: '超载', val: '2048', key: 'overloadType' },
        { name: '疲劳驾驶', val: '4096', key: 'fatigueDrivingType' },
        { name: '风险车辆', val: '8192', key: 'riskOfVehicleType' },
        { name: '风险司机', val: '16384', key: 'riskDriversType' },
        { name: '严重运输超时', val: '32768', key: 'upgradeTimeoutType' },
        { name: '严重无定位', val: '65536', key: 'upgradeNolocationType' }
      ],
      min: 0,
      max: 10000,
      formatter: '{value}km',
      marks: {
        0: {
          label: '0km',
          labelStyle: {
            fontSize: '14px'
          }
        },
        10000: {
          label: '10000km',
          labelStyle: {
            fontSize: '14px'
          }
        }
      },
      monitDistance: 50, // 监控里程设置
      trackTime: 30, // 中途停车设置：智能追踪时间
      movingDistance: 500, // 中途停车设置：移动距离
      timeList: [
        { name: '30', val: 30 },
        { name: '60', val: 60 },
        { name: '120', val: 120 }
      ],
      distanceList: [
        { name: '500', val: 500 },
        { name: '1000', val: 1000 },
        { name: '2000', val: 2000 },
        { name: '3000', val: 3000 }
      ],
      blacklistTrackTime: 10,
      blacklistMovingDistance: 500,
      blackTimeList: [
        { name: '10', val: 10 },
        { name: '20', val: 20 },
        { name: '30', val: 30 },
        { name: '60', val: 60 }
      ],
      blackDistanceList: [
        { name: '500', val: 500 },
        { name: '1000', val: 1000 },
        { name: '1500', val: 1500 }
      ],
      whiteListNames: [],
      whiteListNameList: []
    };
  },
  computed: {},
  created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/transport' },
      { title: '监控配置列表', path: '/monitor/set' },
      { title: '通用设置' }
    ]);
    this.companyCode = this.$route.params.key;
    this.getAddressWhiteList();
    this.featchData();
  },
  methods: {
    featchData() {
      const options = { companyCode: this.companyCode };
      axios.post(api.getCommonSetting, options).then(res => {
        let monitorCommonSettingDTO = res.data.monitorCommonSettingDTO;
        if (monitorCommonSettingDTO) {
          let abnormalTypeArr = monitorCommonSettingDTO.abnormalType
            ? monitorCommonSettingDTO.abnormalType.split(',')
            : [];
          this.abnormalTypeSelected = abnormalTypeArr;
          this.monitDistance = monitorCommonSettingDTO.monitDistance / 1000;
          this.trackTime = monitorCommonSettingDTO.trackTime;
          this.movingDistance = monitorCommonSettingDTO.movingDistance;
          this.blacklistTrackTime = monitorCommonSettingDTO.blacklistTrackTime;
          this.blacklistMovingDistance = monitorCommonSettingDTO.blacklistMovingDistance;
          this.whiteListNames = res.data.whiteListNames || [];
        }
      });
    },
    getAddressWhiteList() {
      axios.post(api.getAddressWhiteList).then(res => {
        this.whiteListNameList = res.data;
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
    checkNumberVali(val) {
      if (isInt(val, false) && isRangeNumber(val, 1, 9999)) {
        return true;
      }
      return false;
    },
    handleSave() {
      if (!this.checkNumberVali(this.trackTime)) {
        this.$message.error('中途停车设置智能追踪停车时常填写格式不正确');
        return;
      }
      if (!this.checkNumberVali(this.movingDistance)) {
        this.$message.error('中途停车设置移动距离填写格式不正确');
        return;
      }
      if (!this.checkNumberVali(this.blacklistTrackTime)) {
        this.$message.error('黑名单停车设置智能追踪停车时常填写格式不正确');
        return;
      }
      if (!this.checkNumberVali(this.blacklistMovingDistance)) {
        this.$message.error('黑名单停车设置移动距离填写格式不正确');
        return;
      }
      let abnormalTypeData = {};
      this.abnormalTypeList.map(item => {
        if (this.abnormalTypeSelected.includes(item.val)) {
          abnormalTypeData[item.key] = 1;
        } else {
          abnormalTypeData[item.key] = 0;
        }
      });
      const options = {
        companyCode: this.companyCode,
        ...abnormalTypeData,
        monitDistance: this.monitDistance * 1000,
        trackTime: this.trackTime,
        movingDistance: this.movingDistance,
        blacklistTrackTime: this.blacklistTrackTime,
        blacklistMovingDistance: this.blacklistMovingDistance,
        whiteListNames: this.whiteListNames
      };
      axios.post(api.saveCommonSetting, options).then(res => {
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
.abnormal-common-wrap {
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
  .monitDistance-wrap {
    padding-bottom: 30px;
  }
  .slider-box {
    width: 820px;
  }
  .alert-set {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .monitDistance-box {
    width: 820px;
    position: relative;
    .el-input__inner {
      border-radius: 0 !important;
    }
  }
  .monitDistance-text {
    position: absolute;
    bottom: -16px;
  }
  .monitDistance-text.min {
    left: 0;
  }
  .monitDistance-text.max {
    right: 137px;
  }
  .self-checkbox:not(:last-child) {
    margin-right: 50px;
  }
  .self-radio:not(:last-child) {
    margin-right: 200px;
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
