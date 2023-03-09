<template>
  <el-drawer
    :title="!certificateData.plateNumberType ? currentCertificate.name : '临时牌照'"
    :visible.sync="certificateVisible"
    width="1000px"
    @close="closeDia"
    v-if="certificateVisible"
    direction="rtl"
    custom-class="certificate-dialog"
  >
    <div
      class="segment segment-panels"
      v-if="
        certificateParam.certificateType === 'iDcard' ||
        certificateParam.certificateType === 'driverLicense' ||
        certificateParam.certificateType === 'qualification'
      "
    >
      <div class="segment-header">{{ currentCertificate.name }}信息</div>
      <!-- 身份证 -->
      <el-form
        :model="userIdCardInfo"
        ref="userIdCardInfo"
        :rules="rules"
        v-if="certificateParam.certificateType === 'iDcard'"
      >
        <div class="segment-area flex-area height-auto" :span="1">
          <div class="segment-item" v-if="!historySource">
            <div class="segment-label">驳回次数：</div>
            <div class="segment-content font-red">{{ certificateData.rejectCount }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">姓名：</div>
            <div class="segment-content" v-if="!certificateIsEdit && certificateParam.showType == 'show'">
              <span> {{ certificateData.userName }}</span>
            </div>
            <el-form-item label="" prop="userName" v-if="certificateIsEdit">
              <el-input
                v-model.trim="userIdCardInfo.userName"
                :disabled="
                  certificateData.idCardCertifyState === 4 ||
                  certificateData.idCardCertifyState === 5 ||
                  certificateData.idCardCertifyState === 6 ||
                  certificateData.idCardCertifyState === 7
                "
                placeholder="请输入姓名"
                :maxlength="20"
              ></el-input>
            </el-form-item>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证号：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType == 'show'">
                {{ certificateData.idCode }}</span
              >
              <el-form-item label="" prop="idCode" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="userIdCardInfo.idCode"
                  placeholder="请输入身份证号"
                  :disabled="
                    certificateData.idCardCertifyState === 4 ||
                    certificateData.idCardCertifyState === 5 ||
                    certificateData.idCardCertifyState === 6 ||
                    certificateData.idCardCertifyState === 7
                  "
                  :maxlength="18"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期始：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType == 'show'">
                {{ certificateData.idCardBeginTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="idCardBeginTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="userIdCardInfo.idCardBeginTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期至：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType == 'show'">
                {{ certificateData.idCardExpireTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="idCardExpireTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="userIdCardInfo.idCardExpireTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <!-- 驾驶证 -->
      <el-form
        :model="driverLicenceInfo"
        ref="driverLicenceInfo"
        :rules="rules"
        v-if="certificateParam.certificateType === 'driverLicense'"
      >
        <div class="segment-area flex-area height-auto" :span="1">
          <div class="segment-item" v-if="!historySource">
            <div class="segment-label">驳回次数：</div>
            <div class="segment-content font-red">{{ certificateData.rejectCount }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">OCR姓名：</div>
            <div class="segment-content">
              <span> {{ certificateData.ocrName }}</span>
              <span
                v-if="
                  !historySource &&
                  certificateData.ocrName &&
                  certificateData.ocrName != certificateData.allData.idCardInfoRsp.userName
                "
              >
                <el-tooltip placement="top">
                  <div slot="content">跟身份证姓名不一致！</div>
                  <span> <i class="el-icon-warning font-orange ml-5 font-size18"></i> </span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">OCR驾驶证号：</div>
            <div class="segment-content">
              <span :title="certificateData.ocrDriverLicenceNo"> {{ certificateData.ocrDriverLicenceNo }}</span>
              <span
                v-if="
                  !historySource &&
                  certificateData.ocrDriverLicenceNo &&
                  certificateData.ocrDriverLicenceNo != certificateData.allData.idCardInfoRsp.idCode
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
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.drivingType }}</span
              >
              <el-form-item label="" prop="drivingType" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="driverLicenceInfo.drivingType"
                  placeholder="请输入准驾车型"
                  :maxlength="10"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期至：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.driverLicenceExpireTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="driverLicenceExpireTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="driverLicenceInfo.driverLicenceExpireTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <!-- 从业资格证 -->
      <el-form
        :model="qualificationCertificateInfo"
        ref="qualificationCertificateInfo"
        :rules="rules"
        v-if="certificateParam.certificateType === 'qualification'"
      >
        <div class="segment-area flex-area height-auto" :span="1">
          <div class="segment-item" v-if="!historySource">
            <div class="segment-label">驳回次数：</div>
            <div class="segment-content font-red">{{ certificateData.rejectCount }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">OCR姓名：</div>
            <div class="segment-content">
              <span>{{ certificateData.userName }}</span>
              <span
                v-if="
                  !historySource &&
                  certificateData.userName &&
                  certificateData.userName != certificateData.allData.idCardInfoRsp.userName
                "
              >
                <el-tooltip placement="top">
                  <div slot="content">跟身份证姓名不一致！</div>
                  <span><i class="el-icon-warning font-orange ml-5 font-size18"></i> </span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">从业资格证号：</div>
            <div class="segment-content">
              <template v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                <span :title="certificateData.qualificationCertificateNo">
                  {{ certificateData.qualificationCertificateNo }}</span
                >
                <span
                  v-if="
                    !historySource &&
                    certificateData.qualificationCertificateNo &&
                    certificateData.qualificationCertificateNo != certificateData.allData.idCardInfoRsp.idCode
                  "
                >
                  <el-tooltip placement="top">
                    <div slot="content">跟身份证号不一致！</div>
                    <span> <i class="el-icon-warning font-orange ml-5 font-size18"></i> </span>
                  </el-tooltip>
                </span>
              </template>
              <el-form-item label="" prop="qualificationCertificateNo" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="qualificationCertificateInfo.qualificationCertificateNo"
                  placeholder="请输入从业资格证号"
                  :maxlength="32"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">有效期至：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.qualificationCertificateExpireTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="qualificationCertificateExpireTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="qualificationCertificateInfo.qualificationCertificateExpireTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 行驶证 -->
    <el-form
      :model="drivingLicenseInfo"
      ref="drivingLicenseInfo"
      :rules="rules"
      v-if="certificateParam.certificateType === 'vehicleLicense'"
    >
      <div class="segment segment-panels">
        <div class="segment-header">{{ !certificateData.plateNumberType ? '行驶证' : '临时牌照' }}信息</div>
        <div class="segment-area flex-area height-auto" :span="1">
          <div class="segment-item" v-if="!historySource">
            <div class="segment-label">驳回次数：</div>
            <div class="segment-content font-red">{{ certificateData.needAuditDetailDto.rejectCount }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">{{ !certificateData.plateNumberType ? '车牌号：' : '临时车牌号：' }}</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.needAuditDetailDto.plateNumber }}</span
              >
              <el-form-item label="" prop="plateNumber" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="drivingLicenseInfo.plateNumber"
                  :placeholder="!certificateData.plateNumberType ? '请输入车牌号' : '请输入临时车牌号'"
                  :maxlength="20"
                  :disabled="
                    certificateData.certifyState === 4 ||
                    certificateData.certifyState === 5 ||
                    certificateData.certifyState === 6 ||
                    certificateData.certifyState === 7
                  "
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <template v-if="!certificateData.plateNumberType">
            <div class="segment-item">
              <div class="segment-label">车辆类型：</div>
              <div class="segment-content">
                <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                  {{ certificateData.needAuditDetailDto.vehicleTypeDesc }}</span
                >
                <el-form-item label="" prop="vehicleType" v-if="certificateIsEdit">
                  <el-select style="width: 100%" v-model="drivingLicenseInfo.vehicleType" placeholder="请选择车辆类型">
                    <el-option
                      v-for="item in vehicleTypeList"
                      :key="item.dictCode"
                      :label="item.dictName"
                      :value="item.dictCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="segment-item">
              <div class="segment-label">车辆所有人：</div>
              <div class="segment-content">
                <span
                  v-if="!certificateIsEdit && certificateParam.showType === 'show'"
                  :title="certificateData.needAuditDetailDto.vehicleOwner"
                >
                  {{ certificateData.needAuditDetailDto.vehicleOwner }}</span
                >
                <el-form-item label="" v-if="certificateIsEdit">
                  <el-input
                    v-model.trim="drivingLicenseInfo.vehicleOwner"
                    placeholder="请输入车辆所有人"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </template>
          <div class="segment-item">
            <div class="segment-label">有效期至：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.needAuditDetailDto.drivingLicenceExpireTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="drivingLicenceExpireTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="drivingLicenseInfo.drivingLicenceExpireTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="segment large segment-panels" v-if="!certificateData.plateNumberType">
        <div class="segment-header">OCR信息</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">住址：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.address">
              {{ certificateData.ocrDetailDto.address }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">品牌型号：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.brandModel">
              {{ certificateData.ocrDetailDto.brandModel }}
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">车辆识别代号：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.vehicleIdentificationNumber">
              {{ certificateData.ocrDetailDto.vehicleIdentificationNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发动机号码：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.engineNumber">
              {{ certificateData.ocrDetailDto.engineNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">外廓尺寸(长宽高)：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.gabarite">
              {{ certificateData.ocrDetailDto.gabarite }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">准牵引总质量：</div>
            <div class="segment-content">{{ certificateData.ocrDetailDto.tractionMass }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册日期：</div>
            <div class="segment-content">{{ certificateData.ocrDetailDto.registerTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证日期：</div>
            <div class="segment-content">{{ certificateData.ocrDetailDto.issueTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">备注：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.backNote">
              {{ certificateData.ocrDetailDto.backNote }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">使用性质：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.useCharacter">
              {{ certificateData.ocrDetailDto.useCharacter }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆所有人：</div>
            <div class="segment-content" :title="certificateData.ocrDetailDto.vehicleOwner">
              {{ certificateData.ocrDetailDto.vehicleOwner }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">年检页有效期：</div>
            <div class="segment-content">{{ certificateData.ocrDetailDto.checkExpireTime }}</div>
          </div>
        </div>
      </div>
    </el-form>

    <!-- 道路运输证 -->
    <el-form
      :model="roadLicenceInfo"
      ref="roadLicenceInfo"
      :rules="rules"
      v-if="certificateParam.certificateType === 'roadTransport'"
    >
      <div class="segment segment-panels">
        <div class="segment-header">道路运输证信息</div>
        <div class="segment-area flex-area height-auto" :span="1">
          <div class="segment-item" v-if="!historySource">
            <div class="segment-label">驳回次数：</div>
            <div class="segment-content font-red">{{ certificateData.rejectCount }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">OCR车牌号：</div>
            <div class="segment-content">
              <span> {{ certificateData.plateNumber }}</span>
              <span
                v-if="
                  !historySource &&
                  certificateData.plateNumber &&
                  certificateData.plateNumber !=
                    certificateData.allData.drivingLicenceInfoRsp.needAuditDetailDto.plateNumber
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
            <div class="segment-content">
              <span
                v-if="!certificateIsEdit && certificateParam.showType === 'show'"
                :title="certificateData.roadLicenceCode"
              >
                {{ certificateData.roadLicenceCode }}</span
              >
              <el-form-item label="" prop="roadLicenceCode" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="roadLicenceInfo.roadLicenceCode"
                  placeholder="请输入道路运输证号"
                  :maxlength="32"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">经营许可证号：</div>
            <div class="segment-content">
              <span
                v-if="!certificateIsEdit && certificateParam.showType === 'show'"
                :title="certificateData.businessLicenseCode"
              >
                {{ certificateData.businessLicenseCode }}</span
              >
              <el-form-item label="" prop="businessLicenseCode" v-if="certificateIsEdit">
                <el-input
                  v-model.trim="roadLicenceInfo.businessLicenseCode"
                  placeholder="请输入经营许可证号"
                  :maxlength="50"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">有效期至：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.roadLicenceExpireTime | dateFormat('YYYY-MM-DD') }}</span
              >
              <el-form-item label="" prop="roadLicenceExpireTime" v-if="certificateIsEdit">
                <el-date-picker
                  v-model="roadLicenceInfo.roadLicenceExpireTime"
                  type="date"
                  value-format="timestamp"
                  :clearable="false"
                  placeholder="请选择有效期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车牌颜色：</div>
            <div class="segment-content">
              <span v-if="!certificateIsEdit && certificateParam.showType === 'show'">
                {{ certificateData.vehiclePlateColorDesc }}</span
              >
              <el-form-item label="" prop="vehiclePlateColor" v-if="certificateIsEdit">
                <el-select style="width: 100%" v-model="roadLicenceInfo.vehiclePlateColor" placeholder="请选择车牌颜色">
                  <el-option
                    v-for="item in vehiclePlateColorList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="segment segment-panels">
        <div class="segment-header">OCR信息</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">发证日期：</div>
            <div class="segment-content">{{ certificateData.issueDate | dateFormat('YYYY-MM-DD') }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发证机关：</div>
            <div class="segment-content" :title="certificateData.issuingAuthority">
              {{ certificateData.issuingAuthority }}
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <div class="ml-20 mt-20">
      <template v-if="certificateIsEdit">
        <el-button type="primary" @click="certificateSave">保存</el-button>
        <el-button @click="certificateVisible = false">放弃修改</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="certificateVisible = false">关闭</el-button>
        <el-button v-if="certificateCanEdit" @click="certificateEditStatus = true">修改</el-button>
      </template>
    </div>
  </el-drawer>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import { isIdCardValid } from '@fe/form-valid';
const certificateParamMap = {
  iDcard: {
    name: '身份证',
    getDetailApi: api.userIdCardQuery,
    saveDataApi: api.userIdCardUpdate,
    dataKey: 'userIdCardInfo',
    refreshMethod: 'getIdCardInfo'
  },
  driverLicense: {
    name: '驾驶证',
    getDetailApi: api.getDriverLicence,
    saveDataApi: api.driverLicenceUpdate,
    dataKey: 'driverLicenceInfo',
    refreshMethod: 'getDriverLicence'
  },
  qualification: {
    name: '从业资格证',
    getDetailApi: api.qualificationDetail,
    saveDataApi: api.qualificationUpdate,
    dataKey: 'qualificationCertificateInfo',
    refreshMethod: 'getQualificationCertificate'
  },
  vehicleLicense: {
    name: '行驶证',
    getDetailApi: api.getDrivingLicenseDetail,
    saveDataApi: api.saveAuditedDrivingLicense,
    dataKey: 'drivingLicenseInfo',
    refreshMethod: 'getDrivingLicenceInfo'
  },
  roadTransport: {
    name: '道路运输证',
    getDetailApi: api.roadLicenceDetail,
    saveDataApi: api.saveAuditedRoadLicense,
    dataKey: 'roadLicenceInfo',
    refreshMethod: 'getRoadLicenceInfo'
  }
};
export default {
  props: {
    certificateParam: {
      type: Object,
      required: true
    },
    certificateData: {
      type: Object,
      required: true
    },
    certificateCanEdit: {
      type: Boolean,
      default: true
    },
    historySource: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 身份证
      userIdCardInfo: {
        certifyCode: '',
        userName: '', //姓名
        idCode: '', // 身份证号
        idCardBeginTime: '', //有效期起
        idCardExpireTime: '' // 有效期至
      },
      // 驾驶证
      driverLicenceInfo: {
        certifyCode: '',
        drivingType: '', //准驾车型
        driverLicenceExpireTime: '' //有效期
      },
      // 从业资格证
      qualificationCertificateInfo: {
        qualificationCertificateNo: '', //从业资格证号
        qualificationCertificateExpireTime: '' //有效期
      },
      // 行驶证
      drivingLicenseInfo: {
        plateNumber: '', //车牌号
        vehicleType: '', // 车辆类型
        vehicleOwner: '', // 车辆所有人
        drivingLicenceExpireTime: '' //有效期
      },
      // 道路运输许可证
      roadLicenceInfo: {
        roadLicenceCode: '', //道路运输证号
        businessLicenseCode: '', //经营许可证号
        roadLicenceExpireTime: '', //有效期
        vehiclePlateColor: '' // 颜色
      },
      vehicleTypeList: [], // 车辆类型
      certificateVisible: false,
      certificateEditStatus: false,
      vehiclePlateColorList: [
        { label: '蓝色', value: 1 },
        { label: '黄色', value: 2 },
        { label: '绿色', value: 3 }
      ],
      rules: {
        userName: [{ required: true, message: '请填写姓名' }],
        idCode: [
          { required: true, message: '请填写身份证号' },
          {
            validator: isIdCardValid,
            message: '身份证号格式不正确',
            trigger: 'blur'
          }
        ],
        idCardBeginTime: [{ required: true, message: '请选择身份证有效期开始时间' }],
        idCardExpireTime: [{ required: true, message: '请选择身份证有效期截止时间' }],

        drivingType: [{ required: true, message: '请选择准驾车型' }],
        driverLicenceExpireTime: [{ required: true, message: '请选择驾驶证有效期' }],
        qualificationCertificateNo: [{ required: true, message: '请填写从业资格证号' }],
        qualificationCertificateExpireTime: [{ required: true, message: '请选择从业资格证有效期' }],
        plateNumber: [{ required: true, message: '请填写车牌号' }],
        vehicleType: [{ required: true, message: '请选择车辆类型' }],
        drivingLicenceExpireTime: [{ required: true, message: '请选择行驶证证有效期' }],
        roadLicenceCode: [{ required: true, message: '请填写道路运输证号' }],
        businessLicenseCode: [{ required: true, message: '请填写经营许可证号' }],
        roadLicenceExpireTime: [{ required: true, message: '请选择道路运输证有效期' }],
        vehiclePlateColor: [{ required: true, message: '请选择颜色' }]
      }
    };
  },
  created() {
    this.userIdCardInfo.certifyCode = this.certificateData.certifyCode;
    this.driverLicenceInfo.certifyCode = this.certificateData.certifyCode;
  },
  computed: {
    certificateIsEdit() {
      return this.certificateParam.showType === 'edit' || this.certificateEditStatus;
    },
    currentCertificate() {
      return certificateParamMap[this.certificateParam.certificateType];
    }
  },
  methods: {
    async getSysDictData() {
      let res = await axios.post(api.getVehicleTypeList);
      this.vehicleTypeList = res.data;
    },
    async openDia() {
      this.certificateEditStatus = false;
      if (this.certificateParam.certificateType == 'vehicleLicense') await this.getSysDictData();
      for (let k in this[this.currentCertificate.dataKey]) {
        if (this.certificateParam.certificateType == 'vehicleLicense') {
          this[this.currentCertificate.dataKey][k] = this.certificateData.needAuditDetailDto[k];
        } else {
          this[this.currentCertificate.dataKey][k] = this.certificateData[k];
        }
      }
      this.certificateVisible = true;
    },
    closeDia() {
      this.certificateVisible = false;
    },
    async certificateSave() {
      this.$refs[this.currentCertificate.dataKey].validate(async valid => {
        if (valid) {
          if (this.certificateParam.certificateType == 'iDcard') {
            if (this.userIdCardInfo.idCardBeginTime > this.userIdCardInfo.idCardExpireTime) {
              this.$message.error('身份证有效期结束时间不能小于开始时间');
              return;
            }
          }
          let options = this[this.currentCertificate.dataKey];
          if (
            this.certificateParam.certificateType == 'vehicleLicense' ||
            this.certificateParam.certificateType == 'roadTransport'
          ) {
            options.vehicleId = this.certificateData.vehicleId;
          } else {
            options.userCode = this.certificateData.userCode;
          }
          await axios.post(this.currentCertificate.saveDataApi, options);
          this.closeDia();
          this.$emit('callback', this.currentCertificate.refreshMethod);
        }
      });
    }
  }
};
</script>
<style lang="postcss">
.certificate-dialog {
  width: 670px !important;
  .segment {
    .segment-area {
      &.height-auto {
        .segment-item {
          height: auto !important;
        }
      }
    }
    &.large {
      .segment-label {
        width: 125px;
      }
    }
  }
}
</style>
