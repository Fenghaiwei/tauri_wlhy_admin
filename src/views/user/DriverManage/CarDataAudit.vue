<template>
  <layout navActive="user">
    <div class="personaldata-audit">
      <!-- 行驶证 -->
      <div class="segment segment-panels">
        <div class="segment-header">
          <span>{{ !drivingLicenceInfoRsp.plateNumberType ? '行驶证' : '临时牌照' }}</span>
          <span
            class="segment-header-status"
            :class="{
              'font-default': [4, 7].includes(drivingLicenceInfoRsp.certifyState),
              'font-orange': [2, 5].includes(drivingLicenceInfoRsp.certifyState),
              'font-red': [1, 3, 6].includes(drivingLicenceInfoRsp.certifyState)
            }"
          >
            <i class="el-icon-success font-size20" v-if="[4, 7].includes(drivingLicenceInfoRsp.certifyState)"></i>
            <i class="el-icon-remove font-size20" v-if="[2, 5].includes(drivingLicenceInfoRsp.certifyState)"></i>
            <i class="el-icon-error font-size20" v-if="[1, 3, 6].includes(drivingLicenceInfoRsp.certifyState)"></i>

            <span> {{ drivingLicenceInfoRsp.certifyStateDesc }}</span></span
          >
        </div>
        <div class="segment-audit">
          <div class="segment-audit-left">
            <fe-viewer
              v-if="drivingLicenceInfoRsp.imageUrls && drivingLicenceInfoRsp.imageUrls.length"
              :source="drivingLicenceInfoRsp.imageUrls"
              ref="idVewerRef1"
            ></fe-viewer>
            <div class="segment-audit-noimg" v-else>暂无图片</div>
          </div>
          <div class="segment-audit-right">
            <div class="mb-20">
              <template v-if="canEdit">
                <el-button
                  type="primary"
                  plain
                  @click="showCertificateData('edit', 'vehicleLicense', 'drivingLicenceInfoRsp')"
                  >修改证件信息</el-button
                >
                <el-button
                  v-if="!drivingLicenceInfoRsp.plateNumberType"
                  type="primary"
                  plain
                  @click="showCertificateHistory('vehicleLicense')"
                  >历史记录</el-button
                >
              </template>
              <el-button
                type="primary"
                plain
                v-if="!drivingLicenceInfoRsp.plateNumberType"
                @click="showCertificateData('show', 'vehicleLicense', 'drivingLicenceInfoRsp')"
                >查看更多信息</el-button
              >
            </div>
            <div class="segment-audit-main">
              <div class="segment-item">
                <div class="segment-label">驳回次数：</div>
                <div class="segment-content font-red">{{ drivingLicenceInfoRsp.needAuditDetailDto.rejectCount }}</div>
              </div>
              <div class="segment-item" v-if="drivingLicenceInfoRsp.needAuditDetailDto.rejectReason">
                <div class="segment-label font-red">末次不通过原因：</div>
                <div class="segment-content font-red">{{ drivingLicenceInfoRsp.needAuditDetailDto.rejectReason }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">
                  {{ !drivingLicenceInfoRsp.plateNumberType ? '车牌号：' : '临时车牌号：' }}
                </div>
                <div class="segment-content">{{ drivingLicenceInfoRsp.needAuditDetailDto.plateNumber }}</div>
              </div>
              <template v-if="!drivingLicenceInfoRsp.plateNumberType">
                <div class="segment-item">
                  <div class="segment-label">车辆类型：</div>
                  <div class="segment-content">{{ drivingLicenceInfoRsp.needAuditDetailDto.vehicleTypeDesc }}</div>
                </div>
                <div class="segment-item">
                  <div class="segment-label">车辆所有人：</div>
                  <div class="segment-content">{{ drivingLicenceInfoRsp.needAuditDetailDto.vehicleOwner }}</div>
                </div>
              </template>
              <div class="segment-item">
                <div class="segment-label">有效期至：</div>
                <div
                  class="segment-content"
                  :class="{ 'font-red': drivingLicenceInfoRsp.needAuditDetailDto.timeExpireFlag }"
                >
                  {{ drivingLicenceInfoRsp.needAuditDetailDto.drivingLicenceExpireTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
            </div>
            <div class="segment-audit-form" v-if="[2, 5].includes(drivingLicenceInfoRsp.certifyState) && canEdit">
              <!--行驶证-->
              <el-form :model="drivingLicenseAuditForm" ref="drivingLicenseAuditRef" :rules="rules" label-width="100px">
                <el-form-item label="审核意见" prop="drivingLicenseState">
                  <el-radio-group v-model="drivingLicenseAuditForm.drivingLicenseState">
                    <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{
                      item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="不通过原因"
                  prop="drivingLicenseStateReason"
                  v-if="drivingLicenseAuditForm.drivingLicenseState == 2"
                >
                  <el-select
                    style="width: 205px"
                    filterable
                    v-model="drivingLicenseAuditForm.drivingLicenseStateReason"
                    placeholder="请选择不通过原因"
                  >
                    <el-option
                      v-for="(item, idx) in drivingLicenseStateReasonList"
                      :key="idx"
                      :label="item.dictName"
                      :value="item.dictName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!--道路运输证-->
      <div class="segment segment-panels" v-if="!this.drivingLicenceInfoRsp.plateNumberType" id="roadLicenceTop">
        <div class="segment-header">
          <span>道路运输证</span>
          <span
            class="segment-header-status"
            :class="{
              'font-default': [4, 7].includes(roadLicenceInfoRsp.currentState),
              'font-orange': [2, 5].includes(roadLicenceInfoRsp.currentState),
              'font-red': [1, 3, 6].includes(roadLicenceInfoRsp.currentState)
            }"
          >
            <i class="el-icon-success font-size20" v-if="[4, 7].includes(roadLicenceInfoRsp.currentState)"></i>
            <i class="el-icon-remove font-size20" v-if="[2, 5].includes(roadLicenceInfoRsp.currentState)"></i>
            <i class="el-icon-error font-size20" v-if="[1, 3, 6].includes(roadLicenceInfoRsp.currentState)"></i>

            <span> {{ roadLicenceInfoRsp.currentStateDesc }}</span>
          </span>
        </div>
        <div class="segment-audit">
          <div class="segment-audit-left">
            <fe-viewer
              v-if="roadLicenceInfoRsp.roadLicencePhotoList && roadLicenceInfoRsp.roadLicencePhotoList.length"
              :source="roadLicenceInfoRsp.roadLicencePhotoList"
              ref="idVewerRef2"
            ></fe-viewer>
            <div class="segment-audit-noimg" v-else>暂无图片</div>
          </div>
          <div class="segment-audit-right">
            <div>
              <template v-if="canEdit">
                <el-button
                  type="primary"
                  plain
                  @click="showCertificateData('edit', 'roadTransport', 'roadLicenceInfoRsp')"
                  >修改证件信息</el-button
                >
                <el-button type="primary" plain @click="showCertificateHistory('roadTransport')">历史记录</el-button>
              </template>
              <el-button
                type="primary"
                plain
                @click="showCertificateData('show', 'roadTransport', 'roadLicenceInfoRsp')"
                >查看更多信息</el-button
              >
            </div>
            <div class="segment-audit-main mt-20">
              <div class="segment-item">
                <div class="segment-label">驳回次数：</div>
                <div class="segment-content font-red">{{ roadLicenceInfoRsp.rejectCount }}</div>
              </div>
              <div class="segment-item" v-if="roadLicenceInfoRsp.rejectReason">
                <div class="segment-label font-red">末次不通过原因：</div>
                <div class="segment-content font-red">{{ roadLicenceInfoRsp.rejectReason }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">OCR车牌号：</div>
                <div class="segment-content">
                  <span>{{ roadLicenceInfoRsp.plateNumber }}</span>
                  <span
                    v-if="
                      roadLicenceInfoRsp.plateNumber &&
                      roadLicenceInfoRsp.plateNumber != drivingLicenceInfoRsp.needAuditDetailDto.plateNumber
                    "
                  >
                    <el-tooltip placement="top">
                      <div slot="content">跟行驶证车牌号不一致!</div>
                      <span> <i class="el-icon-warning font-orange ml-5 font-size18"> </i> </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>

              <div class="segment-item">
                <div class="segment-label">道路运输证号：</div>
                <div class="segment-content">{{ roadLicenceInfoRsp.roadLicenceCode }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">经营许可证号：</div>
                <div class="segment-content">{{ roadLicenceInfoRsp.businessLicenseCode }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期至：</div>
                <div class="segment-content" :class="{ 'font-red': roadLicenceInfoRsp.timeExpireFlag }">
                  {{ roadLicenceInfoRsp.roadLicenceExpireTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">车牌颜色：</div>
                <div class="segment-content">{{ roadLicenceInfoRsp.vehiclePlateColorDesc }}</div>
              </div>
            </div>
            <div class="segment-audit-form" v-if="[2, 5].includes(roadLicenceInfoRsp.currentState) && canEdit">
              <!--道路运输证-->
              <el-form :model="roadLicenseAuditForm" ref="roadLicenseAuditRef" :rules="rules" label-width="100px">
                <el-form-item label="审核意见" prop="roadLicenseState">
                  <el-radio-group v-model="roadLicenseAuditForm.roadLicenseState">
                    <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{
                      item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="不通过原因"
                  prop="roadLicenseStateReason"
                  v-if="roadLicenseAuditForm.roadLicenseState == 2"
                >
                  <el-select
                    style="width: 205px"
                    filterable
                    v-model="roadLicenseAuditForm.roadLicenseStateReason"
                    placeholder="请选择不通过原因"
                  >
                    <el-option
                      v-for="(item, idx) in roadLicenseStateReasonList"
                      :key="idx"
                      :label="item.dictName"
                      :value="item.dictName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>

      <div class="personaldata-audit-footer" v-if="canEdit">
        <template v-if="getDrivingLicenceAduit || getRoadLicenceAduit">
          <el-button type="primary" v-has="'user:car:audit:power'" @click="saveAdudit" class="custom-button-large"
            >保存审核结果</el-button
          >
        </template>
        <el-button type="primary" @click="goBack" class="custom-button-large">返回上一页</el-button>
      </div>
    </div>

    <certificate-data-dialog
      v-if="showCertificateMore"
      ref="certificateDataRef"
      :certificateParam="certificateParam"
      :certificateData="certificateData"
      @callback="freshData"
      :certificateCanEdit="canEdit"
    />
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import CertificateDataDialog from './components/CertificateDataDialog';
export default {
  name: 'CarDataAudit',
  components: { CertificateDataDialog },
  data() {
    let validMemo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择不通过原因'));
      } else {
        callback();
      }
    };
    return {
      canEdit: true,
      userCode: '',
      vehicleId: '',
      drivingLicenceInfoRsp: { needAuditDetailDto: {}, ocrDetailDto: {} }, // 行驶证信息
      roadLicenceInfoRsp: {}, // 道路许可证信息
      auditList: [
        { label: '通过', value: 1 },
        { label: '不通过', value: 2 }
      ],
      drivingLicenseAuditForm: {
        drivingLicenseState: '', // 1-通过 2-不通过
        drivingLicenseStateReason: '' //行驶证不通过原因
      },
      roadLicenseAuditForm: {
        roadLicenseState: '', // 1-通过 2-不通过
        roadLicenseStateReason: '' //道路运输证不通过原因
      },
      rules: {
        drivingLicenseState: [{ required: true, message: '请选择审核意见' }],
        drivingLicenseStateReason: [{ required: true, validator: validMemo }],
        roadLicenseState: [{ required: true, message: '请选择审核意见' }],
        roadLicenseStateReason: [{ required: true, validator: validMemo }]
      },
      drivingLicenseStateReasonList: [],
      roadLicenseStateReasonList: [],
      showCertificateMore: false,
      certificateParam: {},
      certificateData: {}
    };
  },
  computed: {
    getDrivingLicenceAduit() {
      return [2, 5].includes(this.drivingLicenceInfoRsp.certifyState);
    },
    getRoadLicenceAduit() {
      return !this.drivingLicenceInfoRsp.plateNumberType && [2, 5].includes(this.roadLicenceInfoRsp.currentState);
    }
  },
  created() {
    this.userCode = this.$route.params.userCode;
    this.vehicleId = this.$route.params.vehicleId;
    this.canEdit = this.$route.query.edit === 'false' ? false : true;
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/user' },
      { title: '车辆资料审核', path: '/car/audit/list' },
      { title: '车辆资料审核详情' }
    ]);
    this.getDrivingLicenceInfo();
  },
  mounted() {
    this.getSysDictData(4, 'drivingLicenseStateReasonList');
    this.getSysDictData(5, 'roadLicenseStateReasonList');
  },
  methods: {
    // 驳回原因
    async getSysDictData(type, key) {
      let res = await axios.post(api.getCertifyRejectReason, { type });
      this[key] = res.data;
    },
    // 查询行驶证信息
    // flag标识 用于只查行驶证 不查道路许可证情况
    async getDrivingLicenceInfo(flag = true) {
      let res = await axios.post(api.getDrivingLicenseDetail, { userCode: this.userCode, vehicleId: this.vehicleId });
      this.drivingLicenceInfoRsp = res.data || {};
      this.drivingLicenceInfoRsp.needAuditDetailDto = this.drivingLicenceInfoRsp.needAuditDetailDto || {};
      this.drivingLicenceInfoRsp.ocrDetailDto = this.drivingLicenceInfoRsp.ocrDetailDto || {};
      if (res.data.imageUrls && res.data.imageUrls.length) {
        this.$nextTick(() => {
          this.$refs.idVewerRef1.show({
            inline: true,
            viewed(el) {
              el.target.viewer.zoomTo(0.9);
            }
          });
        });
      }

      if (flag && !this.drivingLicenceInfoRsp.plateNumberType) this.getRoadLicenceInfo();
    },
    // 查询道路许可证信息
    async getRoadLicenceInfo() {
      let res = await axios.post(api.roadLicenceDetail, { userCode: this.userCode, vehicleId: this.vehicleId });
      this.roadLicenceInfoRsp = res.data || {};
      if (res.data.roadLicencePhotoList && res.data.roadLicencePhotoList.length) {
        this.$nextTick(() => {
          this.$refs.idVewerRef2.show({
            inline: true,
            viewed(el) {
              el.target.viewer.zoomTo(0.9);
            }
          });
        });
      }
      setTimeout(() => {
        if (this.getDrivingLicenceAduit) {
          document.querySelector('#aduitTop').scrollIntoView({ block: 'start', inline: 'start' });
        } else if (this.getRoadLicenceAduit) {
          document.querySelector('#roadLicenceTop').scrollIntoView({ block: 'end', inline: 'end' });
        } else {
          document.querySelector('#aduitTop').scrollIntoView({ block: 'start', inline: 'start' });
        }
      }, 700);
    },
    // 审核
    async saveAdudit() {
      let flag1 = true;
      let flag2 = true;
      let options = {};
      // 行驶证校验
      if (this.drivingLicenceInfoRsp.certifyState == 2 || this.drivingLicenceInfoRsp.certifyState == 5) {
        this.$refs.drivingLicenseAuditRef.validate(async valid => {
          options = {
            ...this.drivingLicenseAuditForm,
            drivingLicenseStateReason:
              this.drivingLicenseAuditForm.drivingLicenseState == 2
                ? this.drivingLicenseAuditForm.drivingLicenseStateReason
                : ''
          };
          flag1 = valid;
        });
      }
      // 道路运输证校验
      if (
        !this.drivingLicenceInfoRsp.plateNumberType &&
        (this.roadLicenceInfoRsp.currentState === 2 || this.roadLicenceInfoRsp.currentState === 5)
      ) {
        this.$refs.roadLicenseAuditRef.validate(async valid => {
          options = {
            ...options,
            ...this.roadLicenseAuditForm,
            roadLicenseStateReason:
              this.roadLicenseAuditForm.roadLicenseState == 2 ? this.roadLicenseAuditForm.roadLicenseStateReason : ''
          };
          flag2 = valid;
        });
      }
      if (!flag1 || !flag2) return;

      let res = await axios.post(api.userAuditVehicle, {
        userCode: this.userCode,
        vehicleId: this.vehicleId,
        ...options
      });
      if (res.data && res.data.failPrompt) {
        this.$message.error(res.data.failPrompt);
        if (res.data.drivingLicenseResult === 1) {
          this.getDrivingLicenceInfo(false);
        }
        if (res.data.roadLicenseResult === 1) {
          this.getRoadLicenceInfo();
        }
      } else {
        this.$message.success('审核完成');
        this.removeAuditor();
        this.$router.push(`/car/audit/list`);
      }
    },
    showCertificateData(showType, certificateType, certificateDataMap) {
      this.certificateParam = { showType, certificateType };
      let allData = { drivingLicenceInfoRsp: this.drivingLicenceInfoRsp, roadLicenceInfoRsp: this.roadLicenceInfoRsp };
      this.certificateData = {
        ...this[certificateDataMap],
        userCode: this.userCode,
        vehicleId: this.vehicleId,
        allData
      };
      this.showCertificateMore = true;
      this.$nextTick(() => {
        this.$refs.certificateDataRef.openDia();
      });
    },
    showCertificateHistory(certificateType) {
      let jumpParams = `${certificateType}/${this.userCode}/${this.vehicleId}`;
      this.$router.push(`/caraduit/history/${jumpParams}`);
    },
    async freshData(fun) {
      await this[fun]();
    },
    goBack() {
      this.removeAuditor();
      this.$router.go(-1);
    },
    removeAuditor() {
      axios.post(api.userAuditorRemove, { type: 2, userCode: this.userCode, vehicleId: this.vehicleId });
    }
  }
};
</script>
<style lang="postcss" scoped>
.personaldata-audit {
  position: relative;
  .segment-header {
    display: flex;
  }
  .segment-header-status {
    display: flex;
    align-items: center;
    i {
      width: 20px;
      margin-right: 5px;
    }
    &.sucess {
      color: var(--base-color);
    }
    &.audit {
      color: var(--base-orange-color);
    }
    &.fail {
      color: var(--base-red-color);
    }
  }
  .segment-audit {
    display: flex;
    flex-wrap: wrap;
    margin: 20px;
  }
  .segment-audit-left {
    flex: 1;
    height: 500px;
    margin-right: 20px;
  }
  .segment-audit-right {
    width: 580px;
  }
  .segment-audit-form {
    padding-top: 10px;
    margin-top: 20px;
    border: 1px solid var(--base-color);
  }
  .personaldata-audit-footer {
    position: sticky;
    bottom: -10px;
    left: 0;
    text-align: center;
    background: var(--base-white-color);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  .segment-audit-noimg {
    width: 100%;
    height: 500px;
    line-height: 500px;
    background: #f7f8fa;
    text-align: center;
    color: #dbdee0;
    font-size: 24px;
  }
}
</style>
