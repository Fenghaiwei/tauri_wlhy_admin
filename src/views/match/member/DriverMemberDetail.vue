<template>
  <layout navActive="match">
    <div>
      <div class="detail-hander-panel flex-between">
        <div class="detail-hander-content">{{ $route.meta.title }}</div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="fetchData()">刷新</el-button>
          <el-button type="primary" @click="$router.push('/driver/member/list')">返回</el-button>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">基本信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">司机姓名</div>
            <div class="segment-content" :title="detailData.driverInfo.userName">
              {{ detailData.driverInfo.userName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册手机号</div>
            <div class="segment-content" :title="detailData.driverInfo.userMobile">
              {{ detailData.driverInfo.userMobile }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">认证状态</div>
            <div class="segment-content" :title="detailData.driverInfo.certifyStateDesc">
              {{ detailData.driverInfo.certifyStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证号</div>
            <div class="segment-content" :title="detailData.driverInfo.idCard">
              {{ detailData.driverInfo.idCard }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证验证</div>
            <div class="segment-content" :title="detailData.driverInfo.idCardStateDesc">
              {{ detailData.driverInfo.idCardStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册时间</div>
            <div
              class="segment-content"
              :title="detailData.driverInfo.registerTime | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.driverInfo.registerTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证有效期开始</div>
            <div
              class="segment-content"
              :title="detailData.driverInfo.idCardEffectiveStartTime | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.driverInfo.idCardEffectiveStartTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证到期日</div>
            <div
              class="segment-content"
              :title="detailData.driverInfo.idCardEffectiveEndTime | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.driverInfo.idCardEffectiveEndTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">临时税务登记状态</div>
            <div class="segment-content" :title="detailData.driverInfo.taxRegisterStatusName">
              {{ detailData.driverInfo.taxRegisterStatusName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">税务登记说明</div>
            <div class="segment-content" :title="detailData.driverInfo.taxRegisterExplain">
              {{ detailData.driverInfo.taxRegisterExplain }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">临时税务登记号</div>
            <div class="segment-content" :title="detailData.driverInfo.taxRegisterNo">
              {{ detailData.driverInfo.taxRegisterNo }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">协议</div>
            <div class="segment-content">
              <span
                class="link-btn"
                v-if="detailData.driverInfo.dkAgreementName"
                :title="detailData.driverInfo.dkAgreementName"
                @click="utils.openNewTab(detailData.driverInfo.dkAgreementUrl)"
                >【{{ detailData.driverInfo.dkAgreementName }}】</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">身份认证信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">身份证照</div>
            <div class="segment-content">{{ detailData.idInfo.qualified ? '合格' : '不合格' }}</div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">认证说明</div>
            <div class="segment-content" :title="detailData.idInfo.auditDesc">{{ detailData.idInfo.auditDesc }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证正面</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.idInfo.idCardFrontUrl"
                :src="detailData.idInfo.idCardFrontUrl"
                alt="身份证正面"
                @click="utils.previewImage(detailData.idInfo.idCardFrontUrl, '身份证正面')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证反面</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.idInfo.idCardBackUrl"
                :src="detailData.idInfo.idCardBackUrl"
                alt="身份证反面"
                @click="utils.previewImage(detailData.idInfo.idCardBackUrl, '身份证反面')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">驾驶证认证信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">姓名</div>
            <div class="segment-content" :title="detailData.driverLicence.driverName">
              {{ detailData.driverLicence.driverName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">认证状态</div>
            <div class="segment-content" :title="detailData.driverLicence.certifyStateDesc">
              {{ detailData.driverLicence.certifyStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">准驾车型</div>
            <div class="segment-content" :title="detailData.driverLicence.drivingType">
              {{ detailData.driverLicence.drivingType }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">证号</div>
            <div class="segment-content" :title="detailData.driverLicence.driverLicenceNo">
              {{ detailData.driverLicence.driverLicenceNo }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证机构</div>
            <div class="segment-content" :title="detailData.driverLicence.authority">
              {{ detailData.driverLicence.authority }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">初次领证日期</div>
            <div class="segment-content" :title="detailData.driverLicence.issueDate | dateFormat('YYYY-MM-DD')">
              {{ detailData.driverLicence.issueDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期开始日期</div>
            <div
              class="segment-content"
              :title="detailData.driverLicence.effectiveStartDate | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.driverLicence.effectiveStartDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期结束日期</div>
            <div class="segment-content" :title="detailData.driverLicence.effectiveEndDate | dateFormat('YYYY-MM-DD')">
              {{ detailData.driverLicence.effectiveEndDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">驾驶证照片</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.driverLicence.driverLicenceUrl"
                :src="detailData.driverLicence.driverLicenceUrl"
                alt="驾驶证照片"
                @click="utils.previewImage(detailData.driverLicence.driverLicenceUrl, '驾驶证照片')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">从业资格证认证信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">从业资格证号</div>
            <div class="segment-content" :title="detailData.qualifyCertify.qualificationCertificate">
              {{ detailData.qualifyCertify.qualificationCertificate }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">认证状态</div>
            <div class="segment-content" :title="detailData.qualifyCertify.certifyStateDesc">
              {{ detailData.qualifyCertify.certifyStateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证机构</div>
            <div class="segment-content" :title="detailData.qualifyCertify.qualificationAuthority">
              {{ detailData.qualifyCertify.qualificationAuthority }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">初次领证日期</div>
            <div class="segment-content" :title="detailData.qualifyCertify.qualifyIssueDate | dateFormat('YYYY-MM-DD')">
              {{ detailData.qualifyCertify.qualifyIssueDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期开始日期</div>
            <div
              class="segment-content"
              :title="detailData.qualifyCertify.qualifyEffectiveStartDate | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.qualifyCertify.qualifyEffectiveStartDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期结束日期</div>
            <div
              class="segment-content"
              :title="detailData.qualifyCertify.qualifyEffectiveEndDate | dateFormat('YYYY-MM-DD')"
            >
              {{ detailData.qualifyCertify.qualifyEffectiveEndDate | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">从业资格证照片</div>
            <div class="segment-content">
              <img
                class="img-preview-item"
                v-if="detailData.qualifyCertify.qualificationCertificateUrl"
                :src="detailData.qualifyCertify.qualificationCertificateUrl"
                alt="从业资格证照片"
                @click="utils.previewImage(detailData.qualifyCertify.qualificationCertificateUrl, '从业资格证照片')"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">车辆认证信息</div>
        <el-table :data="detailData.vehicleInfoList" border max-height="400">
          <el-table-column label="车牌号" prop="plateNumber" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <a
                class="font-default"
                @click="$router.push(`/car/detail/${scope.row.plateNumber}?userCode=${detailData.driverInfo.userCode}`)"
                >{{ scope.row.plateNumber }}</a
              >
            </template>
          </el-table-column>
          <el-table-column
            label="车辆认证"
            prop="vehicleCertifyStateDesc"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="道路运输许可证认证"
            prop="roadLicenceCertifyDesc"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="车辆照片认证"
            prop="vehiclePhotoCertifyDesc"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="行驶证资料完整度"
            prop="drivingLicenceDataRatioDesc"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
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
        driverInfo: {},
        driverLicence: {},
        idInfo: {},
        qualifyCertify: {},
        vehicleInfoList: []
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
      const { data } = await axios.post(api.queryDriverDetail, { driverCode: this.$route.params.id });
      if (data) {
        this.detailData = data;
        this.detailData.driverInfo = data.driverInfo || {};
        this.detailData.driverLicence = data.driverLicence || {};
        this.detailData.idInfo = data.idInfo || {};
        this.detailData.qualifyCertify = data.qualifyCertify || {};
        this.detailData.vehicleInfoList = data.vehicleInfoList || [];
      }
    }
  }
};
</script>
