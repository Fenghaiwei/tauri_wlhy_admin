<template>
  <layout navActive="user">
    <div class="personaldata-audit">
      <!-- 身份证 -->
      <div class="segment segment-panels" id="idCardTop">
        <div class="segment-header">
          <span>身份证</span>
          <span
            class="segment-header-status"
            :class="{
              'font-default': [4, 7].includes(idCardInfoRsp.idCardCertifyState),
              'font-orange': [2, 5].includes(idCardInfoRsp.idCardCertifyState),
              'font-red': [1, 3, 6].includes(idCardInfoRsp.idCardCertifyState)
            }"
          >
            <i class="el-icon-success font-size20" v-if="[4, 7].includes(idCardInfoRsp.idCardCertifyState)"></i>
            <i class="el-icon-remove font-size20" v-if="[2, 5].includes(idCardInfoRsp.idCardCertifyState)"></i>
            <i class="el-icon-error font-size20" v-if="[1, 3, 6].includes(idCardInfoRsp.idCardCertifyState)"></i>
            <span> {{ idCardInfoRsp.idCardCertifyStateDesc }}</span></span
          >
        </div>
        <div class="segment-audit">
          <div class="segment-audit-left">
            <fe-viewer
              v-if="idCardInfoRsp.licensePhotoList && idCardInfoRsp.licensePhotoList.length"
              :source="idCardInfoRsp.licensePhotoList"
              ref="idVewerRef1"
            ></fe-viewer>
            <div class="segment-audit-noimg" v-else>暂无图片</div>
          </div>
          <div class="segment-audit-right">
            <div class="mb-20">
              <template v-if="canEdit">
                <el-button type="primary" plain @click="showCertificateData('edit', 'iDcard', 'idCardInfoRsp')"
                  >修改证件信息</el-button
                >
                <el-button type="primary" plain @click="showCertificateHistory('iDcard')">历史记录</el-button>
              </template>
              <el-button type="primary" plain @click="showCertificateData('show', 'iDcard', 'idCardInfoRsp')"
                >查看更多信息</el-button
              >
            </div>
            <div class="segment-audit-main">
              <div class="segment-item">
                <div class="segment-label">驳回次数：</div>
                <div class="segment-content font-red">{{ idCardInfoRsp.rejectCount }}</div>
              </div>
              <div class="segment-item" v-if="idCardInfoRsp.rejectReason">
                <div class="segment-label font-red">末次不通过原因：</div>
                <div class="segment-content font-red">{{ idCardInfoRsp.rejectReason }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">姓名：</div>
                <div class="segment-content">{{ idCardInfoRsp.userName }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">身份证号：</div>
                <div class="segment-content">{{ idCardInfoRsp.idCode }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期始：</div>
                <div class="segment-content">
                  {{ idCardInfoRsp.idCardBeginTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期至：</div>
                <div class="segment-content" :class="{ 'font-red': idCardInfoRsp.timeExpireFlag }">
                  {{ idCardInfoRsp.idCardExpireTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
            </div>
            <div class="segment-audit-form" v-if="[2, 5].includes(idCardInfoRsp.idCardCertifyState) && canEdit">
              <!--身份证-->
              <el-form :model="idCardAuditForm" ref="idCardAuditRef" :rules="rules" label-width="100px">
                <el-form-item label="审核意见" prop="idCardAudit">
                  <el-radio-group v-model="idCardAuditForm.idCardAudit">
                    <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{
                      item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="不通过原因" prop="idCardMemo" v-if="idCardAuditForm.idCardAudit == 2">
                  <el-select
                    style="width: 205px"
                    filterable
                    v-model="idCardAuditForm.idCardMemo"
                    placeholder="请选择不通过原因"
                  >
                    <el-option
                      v-for="(item, idx) in idCardMemoList"
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
      <!--驾驶证-->
      <div class="segment segment-panels" id="driverLicenceTop">
        <div class="segment-header">
          <span>驾驶证</span>
          <span
            class="segment-header-status"
            :class="{
              'font-default': [4, 7].includes(driverLicencelInfoRsp.driverLicenceCertifyState),

              'font-orange': [2, 5].includes(driverLicencelInfoRsp.driverLicenceCertifyState),
              'font-red': [1, 3, 6].includes(driverLicencelInfoRsp.driverLicenceCertifyState)
            }"
            ><i
              class="el-icon-success font-size20"
              v-if="[4, 7].includes(driverLicencelInfoRsp.driverLicenceCertifyState)"
            ></i>
            <i
              class="el-icon-remove font-size20"
              v-if="[2, 5].includes(driverLicencelInfoRsp.driverLicenceCertifyState)"
            ></i>
            <i
              class="el-icon-error font-size20"
              v-if="[1, 3, 6].includes(driverLicencelInfoRsp.driverLicenceCertifyState)"
            ></i>

            <span> {{ driverLicencelInfoRsp.driverLicenceCertifyStateDesc }} </span></span
          >
        </div>
        <div class="segment-audit">
          <div class="segment-audit-left">
            <fe-viewer
              v-if="driverLicencelInfoRsp.imgList && driverLicencelInfoRsp.imgList.length"
              :source="driverLicencelInfoRsp.imgList"
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
                  @click="showCertificateData('edit', 'driverLicense', 'driverLicencelInfoRsp')"
                  >修改证件信息</el-button
                >
                <el-button type="primary" plain @click="showCertificateHistory('driverLicense')">历史记录</el-button>
              </template>
              <el-button
                type="primary"
                plain
                @click="showCertificateData('show', 'driverLicense', 'driverLicencelInfoRsp')"
                >查看更多信息</el-button
              >
            </div>
            <div class="segment-audit-main mt-20">
              <div class="segment-item">
                <div class="segment-label">驳回次数：</div>
                <div class="segment-content font-red">{{ driverLicencelInfoRsp.rejectCount }}</div>
              </div>
              <div class="segment-item" v-if="driverLicencelInfoRsp.rejectReason">
                <div class="segment-label font-red">末次不通过原因：</div>
                <div class="segment-content font-red">{{ driverLicencelInfoRsp.rejectReason }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">OCR姓名：</div>
                <div class="segment-content">
                  <span> {{ driverLicencelInfoRsp.ocrName }}</span>
                  <span v-if="driverLicencelInfoRsp.ocrName && driverLicencelInfoRsp.ocrName != idCardInfoRsp.userName">
                    <el-tooltip placement="top">
                      <div slot="content">跟身份证姓名不一致！</div>
                      <span> <i class="el-icon-warning font-orange ml-5 font-size18"> </i> </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">OCR驾驶证号：</div>
                <div class="segment-content">
                  <span> {{ driverLicencelInfoRsp.ocrDriverLicenceNo }}</span>
                  <span
                    v-if="
                      driverLicencelInfoRsp.ocrDriverLicenceNo &&
                      driverLicencelInfoRsp.ocrDriverLicenceNo != idCardInfoRsp.idCode
                    "
                  >
                    <el-tooltip placement="top">
                      <div slot="content">跟身份证号不一致！</div>
                      <span> <i class="el-icon-warning font-orange ml-5 font-size18"> </i> </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">准驾车型：</div>
                <div class="segment-content">{{ driverLicencelInfoRsp.drivingType }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期至：</div>
                <div class="segment-content" :class="{ 'font-red': driverLicencelInfoRsp.timeExpireFlag }">
                  {{ driverLicencelInfoRsp.driverLicenceExpireTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
            </div>
            <div
              class="segment-audit-form"
              v-if="[2, 5].includes(driverLicencelInfoRsp.driverLicenceCertifyState) && canEdit"
            >
              <!--驾驶证-->
              <el-form :model="driverAuditForm" ref="driverAuditRef" :rules="rules" label-width="100px">
                <el-form-item label="审核意见" prop="driverAudit">
                  <el-radio-group v-model="driverAuditForm.driverAudit">
                    <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{
                      item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="不通过原因" prop="driverMemo" v-if="driverAuditForm.driverAudit == 2">
                  <el-select
                    style="width: 205px"
                    filterable
                    v-model="driverAuditForm.driverMemo"
                    placeholder="请选择不通过原因"
                  >
                    <el-option
                      v-for="(item, idx) in driverMemoList"
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
      <!--从业资格证-->
      <div class="segment segment-panels" id="qualificationTop">
        <div class="segment-header">
          <span>从业资格证</span>
          <span
            class="segment-header-status"
            :class="{
              'font-default': [4, 7].includes(qualificationCertificateInfoRsp.certifyState),

              'font-orange': [2, 5].includes(qualificationCertificateInfoRsp.certifyState),
              'font-red': [1, 3, 6].includes(qualificationCertificateInfoRsp.certifyState)
            }"
          >
            <i
              class="el-icon-success font-size20"
              v-if="[4, 7].includes(qualificationCertificateInfoRsp.certifyState)"
            ></i>
            <i
              class="el-icon-remove font-size20"
              v-if="[2, 5].includes(qualificationCertificateInfoRsp.certifyState)"
            ></i>
            <i
              class="el-icon-error font-size20"
              v-if="[1, 3, 6].includes(qualificationCertificateInfoRsp.certifyState)"
            ></i>

            <span> {{ qualificationCertificateInfoRsp.certifyStateDesc }}</span></span
          >
        </div>
        <div class="segment-audit">
          <div class="segment-audit-left">
            <fe-viewer
              v-if="
                qualificationCertificateInfoRsp.licensePhotoList &&
                qualificationCertificateInfoRsp.licensePhotoList.length
              "
              :source="qualificationCertificateInfoRsp.licensePhotoList"
              ref="idVewerRef3"
            ></fe-viewer>
            <div class="segment-audit-noimg" v-else>暂无图片</div>
          </div>
          <div class="segment-audit-right">
            <div>
              <template v-if="canEdit">
                <el-button
                  type="primary"
                  plain
                  @click="showCertificateData('edit', 'qualification', 'qualificationCertificateInfoRsp')"
                  >修改证件信息</el-button
                >
                <el-button type="primary" plain @click="showCertificateHistory('qualification')">历史记录</el-button>
              </template>
              <el-button
                type="primary"
                plain
                @click="showCertificateData('show', 'qualification', 'qualificationCertificateInfoRsp')"
                >查看更多信息</el-button
              >
            </div>
            <div class="segment-audit-main mt-20">
              <div class="segment-item">
                <div class="segment-label">驳回次数：</div>
                <div class="segment-content font-red">{{ qualificationCertificateInfoRsp.rejectCount }}</div>
              </div>
              <div class="segment-item" v-if="qualificationCertificateInfoRsp.rejectReason">
                <div class="segment-label font-red">末次不通过原因：</div>
                <div class="segment-content font-red">{{ qualificationCertificateInfoRsp.rejectReason }}</div>
              </div>
              <div class="segment-item">
                <div class="segment-label">OCR姓名：</div>
                <div class="segment-content">
                  <span>{{ qualificationCertificateInfoRsp.userName }}</span>
                  <span
                    v-if="
                      qualificationCertificateInfoRsp.userName &&
                      qualificationCertificateInfoRsp.userName != idCardInfoRsp.userName
                    "
                  >
                    <el-tooltip placement="top">
                      <div slot="content">跟身份证姓名不一致！</div>
                      <span> <i class="el-icon-warning font-orange ml-5 font-size18"> </i> </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">从业资格证号：</div>
                <div class="segment-content">
                  <span>{{ qualificationCertificateInfoRsp.qualificationCertificateNo }}</span>
                  <span
                    v-if="
                      qualificationCertificateInfoRsp.qualificationCertificateNo &&
                      qualificationCertificateInfoRsp.qualificationCertificateNo != idCardInfoRsp.idCode
                    "
                  >
                    <el-tooltip placement="top">
                      <div slot="content">跟身份证号不一致！</div>
                      <span> <i class="el-icon-warning font-orange ml-5 font-size18"> </i> </span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
              <div class="segment-item">
                <div class="segment-label">有效期至：</div>
                <div class="segment-content" :class="{ 'font-red': qualificationCertificateInfoRsp.timeExpireFlag }">
                  {{ qualificationCertificateInfoRsp.qualificationCertificateExpireTime | dateFormat('YYYY-MM-DD') }}
                </div>
              </div>
            </div>
            <div
              class="segment-audit-form"
              v-if="[2, 5].includes(qualificationCertificateInfoRsp.certifyState) && canEdit"
            >
              <el-form :model="qualificationAuditForm" ref="qualificationAuditRef" :rules="rules" label-width="100px">
                <el-form-item label="审核意见" prop="qualificationAudit">
                  <el-radio-group v-model="qualificationAuditForm.qualificationAudit">
                    <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{
                      item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="不通过原因"
                  prop="qualificationMemo"
                  v-if="qualificationAuditForm.qualificationAudit == 2"
                >
                  <el-select
                    style="width: 205px"
                    filterable
                    v-model="qualificationAuditForm.qualificationMemo"
                    placeholder="请选择不通过原因"
                  >
                    <el-option
                      v-for="(item, idx) in qualificationMemoList"
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
        <template v-if="getIdCardAuit || getDriverLicenceAuit || getQualificationAuit">
          <el-button type="primary" v-has="'user:driver:audit:power'" @click="saveAdudit" class="custom-button-large"
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
  name: 'PersonalDataAudit',
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
      idCardInfoRsp: {}, // 身份证信息
      driverLicencelInfoRsp: {}, // 驾驶证信息
      qualificationCertificateInfoRsp: {}, // 从业资格证信息
      auditList: [
        { label: '通过', value: 1 },
        { label: '不通过', value: 2 }
      ],
      idCardAuditForm: {
        idCardAudit: '', // 1-通过 2-不通过
        idCardMemo: '' //身份证不通过原因
      },
      driverAuditForm: {
        driverAudit: '', // 1-通过 2-不通过
        driverMemo: '' //驾驶证不通过原因
      },
      qualificationAuditForm: {
        qualificationAudit: '', // 1-通过 2-不通过
        qualificationMemo: '' //从业资格证不通过原因
      },
      rules: {
        idCardAudit: [{ required: true, message: '请选择审核意见' }],
        idCardMemo: [{ required: true, validator: validMemo }],
        driverAudit: [{ required: true, message: '请选择审核意见' }],
        driverMemo: [{ required: true, validator: validMemo }],
        qualificationAudit: [{ required: true, message: '请选择审核意见' }],
        qualificationMemo: [{ required: true, validator: validMemo }]
      },
      idCardMemoList: [], // 身份证审核原因
      driverMemoList: [], // 驾驶证审核原因
      qualificationMemoList: [], // 从业资格证审核原因
      showCertificateMore: false,
      certificateParam: {},
      certificateData: {}
    };
  },
  computed: {
    getIdCardAuit() {
      return [2, 5].includes(this.idCardInfoRsp.idCardCertifyState);
    },
    getDriverLicenceAuit() {
      return [2, 5].includes(this.driverLicencelInfoRsp.driverLicenceCertifyState);
    },
    getQualificationAuit() {
      return [2, 5].includes(this.qualificationCertificateInfoRsp.certifyState);
    }
  },
  created() {
    this.userCode = this.$route.params.userCode;
    this.canEdit = this.$route.query.edit === 'false' ? false : true;
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/user' },
      { title: '司机资料审核', path: '/driver/audit/list' },
      { title: '司机资料审核详情' }
    ]);
    this.fetchDetail();
  },
  mounted() {
    this.getSysDictData(1, 'idCardMemoList');
    this.getSysDictData(2, 'driverMemoList');
    this.getSysDictData(3, 'qualificationMemoList');
  },
  methods: {
    // 驳回原因
    async getSysDictData(type, key) {
      let res = await axios.post(api.getCertifyRejectReason, { type });
      this[key] = res.data;
    },
    // 详情
    async fetchDetail() {
      await this.getIdCardInfo();
      await this.getDriverLicence();
      await this.getQualificationCertificate();
      setTimeout(() => {
        if (this.getIdCardAuit) {
          document.querySelector('#aduitTop').scrollIntoView({ block: 'start', inline: 'start' });
        } else if (this.getDriverLicenceAuit) {
          document.querySelector('#driverLicenceTop').scrollIntoView({ block: 'end', inline: 'end' });
        } else if (this.getQualificationAuit) {
          document.querySelector('#qualificationTop').scrollIntoView({ block: 'end', inline: 'end' });
        } else {
          document.querySelector('#aduitTop').scrollIntoView({ block: 'start', inline: 'start' });
        }
      }, 700);
    },
    // 查询身份证信息
    async getIdCardInfo() {
      let res = await axios.post(api.userIdCardQuery, { userCode: this.userCode, deleted: this.canEdit ? 0 : 1 });
      this.idCardInfoRsp = res.data || {};
      if (res.data.licensePhotoList && res.data.licensePhotoList.length) {
        this.$nextTick(() => {
          this.$refs.idVewerRef1.show({
            inline: true,
            viewed(el) {
              el.target.viewer.zoomTo(0.9);
            }
          });
        });
      }
    },
    // 查询驾驶证信息
    async getDriverLicence() {
      let res = await axios.post(api.getDriverLicence, { userCode: this.userCode, deleted: this.canEdit ? 0 : 1 });
      this.driverLicencelInfoRsp = res.data || {};
      if (res.data.imgList && res.data.imgList.length) {
        this.$nextTick(() => {
          this.$refs.idVewerRef2.show({
            inline: true,
            viewed(el) {
              el.target.viewer.zoomTo(0.9);
            }
          });
        });
      }
    },
    // 查询从业资格证信息
    async getQualificationCertificate() {
      let res = await axios.post(api.qualificationDetail, { userCode: this.userCode, deleted: this.canEdit ? 0 : 1 });
      this.qualificationCertificateInfoRsp = res.data || {};
      if (res.data.licensePhotoList && res.data.licensePhotoList.length) {
        this.$nextTick(() => {
          this.$refs.idVewerRef3.show({
            inline: true,
            viewed(el) {
              el.target.viewer.zoomTo(0.9);
            }
          });
        });
      }
    },
    // 审核
    async saveAdudit() {
      let flag1 = true;
      let flag2 = true;
      let flag3 = true;
      let options = {};
      // 身份证校验
      if (this.idCardInfoRsp.idCardCertifyState == 2 || this.idCardInfoRsp.idCardCertifyState == 5) {
        this.$refs.idCardAuditRef.validate(async valid => {
          options = {
            ...this.idCardAuditForm,
            idCardMemo: this.idCardAuditForm.idCardAudit == 2 ? this.idCardAuditForm.idCardMemo : ''
          };
          flag1 = valid;
        });
      }
      // 驾驶证校验
      if (
        this.driverLicencelInfoRsp.driverLicenceCertifyState == 2 ||
        this.driverLicencelInfoRsp.driverLicenceCertifyState == 5
      ) {
        this.$refs.driverAuditRef.validate(async valid => {
          options = {
            ...options,
            ...this.driverAuditForm,
            driverMemo: this.driverAuditForm.driverAudit == 2 ? this.driverAuditForm.driverMemo : ''
          };
          flag2 = valid;
        });
      }
      // 从业资格证校验
      if (
        this.qualificationCertificateInfoRsp.certifyState == 2 ||
        this.qualificationCertificateInfoRsp.certifyState == 5
      ) {
        this.$refs.qualificationAuditRef.validate(async valid => {
          options = {
            ...options,
            ...this.qualificationAuditForm,
            qualificationMemo:
              this.qualificationAuditForm.qualificationAudit == 2 ? this.qualificationAuditForm.qualificationMemo : ''
          };
          flag3 = valid;
        });
      }
      if (!flag1 || !flag2 || !flag3) return;
      await axios.post(api.userAuditDdriver, {
        userCode: this.userCode,
        ...options
      });
      this.$message.success('审核完成');
      this.removeAuditor();
      this.$router.push(`/driver/audit/list`);
    },
    async freshData(fun) {
      await this[fun]();
    },
    // 查看更多/修改证件
    showCertificateData(showType, certificateType, certificateDataMap) {
      this.certificateParam = { showType, certificateType };
      let allData = {
        idCardInfoRsp: this.idCardInfoRsp,
        driverLicencelInfoRsp: this.driverLicencelInfoRsp,
        qualificationCertificateInfoRsp: this.qualificationCertificateInfoRsp
      };
      this.certificateData = {
        ...this[certificateDataMap],
        userCode: this.userCode,
        allData
      };
      this.showCertificateMore = true;
      this.$nextTick(() => {
        this.$refs.certificateDataRef.openDia();
      });
    },
    showCertificateHistory(certificateType) {
      let jumpParams = `${certificateType}/${this.userCode}`;
      this.$router.push(`/personaduit/history/${jumpParams}`);
    },
    goBack() {
      this.removeAuditor();
      this.$router.go(-1);
    },
    removeAuditor() {
      axios.post(api.userAuditorRemove, { type: 1, userCode: this.userCode });
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
