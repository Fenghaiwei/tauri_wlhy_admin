<template>
  <layout navActive="match">
    <div>
      <div class="detail-hander-panel flex-between">
        <div class="detail-hander-content">{{ $route.meta.title }}</div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="fetchData">刷新</el-button>
          <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">行驶证信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">车牌号</div>
            <div class="segment-content" :title="detailData.vehicleLicense.plateNumber">
              {{ detailData.vehicleLicense.plateNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">认证状态</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleStateDesc">
              {{ detailData.vehicleLicense.vehicleStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机姓名</div>
            <div class="segment-content" :title="detailData.vehicleLicense.driverName">
              {{ detailData.vehicleLicense.driverName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册手机号</div>
            <div class="segment-content" :title="detailData.vehicleLicense.driverPhone">
              {{ detailData.vehicleLicense.driverPhone }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆类型</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleType">
              {{ detailData.vehicleLicense.vehicleType }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆所有人</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleOwner">
              {{ detailData.vehicleLicense.vehicleOwner }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">住址</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleAddress">
              {{ detailData.vehicleLicense.vehicleAddress }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">使用性质</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleUseDesc">
              {{ detailData.vehicleLicense.vehicleUseDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发动机号码</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleEngineNumber">
              {{ detailData.vehicleLicense.vehicleEngineNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆识别代码</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleIdentify">
              {{ detailData.vehicleLicense.vehicleIdentify }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册日期</div>
            <div
              class="segment-content"
              :title="detailData.vehicleLicense.vehicleRegisterTime | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.vehicleLicense.vehicleRegisterTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证日期</div>
            <div class="segment-content" :title="detailData.vehicleLicense.vehicleIssueTime | dateFormat('YYYY-MM-DD')">
              {{ detailData.vehicleLicense.vehicleIssueTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">行驶证照片</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.vehicleLicense.drivingLicence"
                :src="detailData.vehicleLicense.drivingLicence"
                alt="行驶证照片"
                @click="utils.previewImage(detailData.vehicleLicense.drivingLicence, '行驶证照片')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">行驶证副页</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.vehicleLicense.drivingLicenceAttached"
                :src="detailData.vehicleLicense.drivingLicenceAttached"
                alt="行驶证副页"
                @click="utils.previewImage(detailData.vehicleLicense.drivingLicenceAttached, '行驶证副页')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">行驶证年审页</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.vehicleLicense.drivingLicenceCheckUrl"
                :src="detailData.vehicleLicense.drivingLicenceCheckUrl"
                alt="行驶证年审页"
                @click="utils.previewImage(detailData.vehicleLicense.drivingLicenceCheckUrl, '行驶证年审页')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">道路运输许可证信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">道路运输许可证号</div>
            <div class="segment-content" :title="detailData.roadLicence.roadLicenceStandard">
              {{ detailData.roadLicence.roadLicenceStandard }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">认证状态</div>
            <div class="segment-content" :title="detailData.roadLicence.roadLicenceStateDesc">
              {{ detailData.roadLicence.roadLicenceStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">经营许可证号</div>
            <div class="segment-content" :title="detailData.roadLicence.roadLicenceCode">
              {{ detailData.roadLicence.roadLicenceCode }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证机构</div>
            <div class="segment-content" :title="detailData.roadLicence.roadLicenceAuthority">
              {{ detailData.roadLicence.roadLicenceAuthority }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车牌颜色</div>
            <div class="segment-content" :title="detailData.roadLicence.vehiclePlateColorDesc">
              {{ detailData.roadLicence.vehiclePlateColorDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期开始日期</div>
            <div
              class="segment-content"
              :title="detailData.roadLicence.roadLicenceEffectiveStartDate | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.roadLicence.roadLicenceEffectiveStartDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期结束日期</div>
            <div
              class="segment-content"
              :title="detailData.roadLicence.roadPermiteExpirationDate | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.roadLicence.roadPermiteExpirationDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">证件页</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.roadLicence.roadLicenceUrl"
                :src="detailData.roadLicence.roadLicenceUrl"
                alt="证件页"
                @click="utils.previewImage(detailData.roadLicence.roadLicenceUrl, '证件页')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">年审页</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.roadLicence.roadAnnualCheckUrl"
                :src="detailData.roadLicence.roadAnnualCheckUrl"
                alt="年审页"
                @click="utils.previewImage(detailData.roadLicence.roadAnnualCheckUrl, '年审页')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
export default {
  data() {
    return {
      utils,
      detailData: {
        roadLicence: {},
        vehicleLicense: {}
      }
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '司机会员列表', path: '/driver/member/list' },
      { title: this.$route.meta.title }
    ]);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await axios.post(api.queryDriverVehicleDetail, {
        plateNumber: this.$route.params.id,
        userCode: this.$route.query.userCode
      });

      if (data) {
        this.detailData = data;
        this.detailData.roadLicence = data.roadLicence || {};
        this.detailData.vehicleLicense = data.vehicleLicense || {};
      }
    }
  }
};
</script>
