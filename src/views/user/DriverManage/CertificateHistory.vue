<template>
  <layout navActive="user">
    <div class="certificate-history">
      <div class="segment segment-panels">
        <div class="segment-header">操作日志</div>
        <div class="segment-area">
          <el-table
            ref="singleTable"
            :data="tableData.data"
            border
            @row-click="hanldeSnapshot"
            :max-height="400"
            :highlight-current-row="true"
          >
            <el-table-column label="时间" prop="operateTime" min-width="130">
              <template v-slot="scope">
                {{ scope.row.operateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="操作记录" prop="operateTypeName" min-width="100"></el-table-column>
            <el-table-column label="操作人" prop="operateName" min-width="100"></el-table-column>
            <el-table-column label="备注" prop="operateRemark" min-width="100"></el-table-column>
          </el-table>
          <div class="pagination-fix">
            <el-pagination
              :page-size="pageSize"
              :current-page.sync="page"
              :total="tableData.total"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 身份证 -->
      <audit-data-history :key="timer" v-if="snapshotData.show" :auditData="snapshotData" ref="auditHistoryRef" />
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import { dateFormat } from '@fe/filter';
import AuditDataHistory from './components/AuditDataHistory';
const certificateParamMap = {
  iDcard: {
    name: '身份证',
    getDetailApi: api.idCardQuerySnapshot,
    itemKey: 'iDcardItemList',
    viewerDataKey: 'licensePhotoList'
  },
  driverLicense: {
    name: '驾驶证',
    getDetailApi: api.driverLicenceLogDetail,
    itemKey: 'driverLicenceItemList',
    viewerDataKey: 'imgList'
  },
  qualification: {
    name: '从业资格证',
    getDetailApi: api.qualificationSnapshot,
    itemKey: 'qualificationItemList',
    viewerDataKey: 'licensePhotoList'
  },
  vehicleLicense: {
    name: '行驶证',
    getDetailApi: api.drivingLicenceLog,
    itemKey: 'drivingLicenceItemList',
    viewerDataKey: 'imageUrls'
  },
  roadTransport: {
    name: '道路运输证',
    getDetailApi: api.roadLicenceLogDetail,
    itemKey: 'roadLicenceItemList',
    viewerDataKey: 'roadLicencePhotoList'
  }
};
export default {
  name: 'CertificateHistory',
  components: { AuditDataHistory },
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { userCode: '' },
      tableData: { data: [], total: 0 },
      certificateType: '',
      snapshotData: { show: false, otherData: {} }, // 快照信息
      timer: '',
      iDcardItemList: [
        { label: '姓名', key: 'userName' },
        { label: '身份证号', key: 'idCode' },
        {
          label: '有效期始',
          key: 'idCardBeginTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD']
        },
        {
          label: '有效期至',
          key: 'idCardExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD']
        }
      ],
      driverLicenceItemList: [
        { label: 'OCR姓名', key: 'ocrName' },
        { label: 'OCR驾驶证号', key: 'ocrDriverLicenceNo' },
        { label: '准驾车型', key: 'drivingType' },
        {
          label: '有效期至',
          key: 'driverLicenceExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD']
        }
      ],
      qualificationItemList: [
        { label: 'OCR姓名', key: 'userName' },
        { label: '从业资格证号', key: 'qualificationCertificateNo' },
        {
          label: '有效期至',
          key: 'qualificationCertificateExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD']
        }
      ],
      drivingLicenceItemList: [
        { label: '车牌号', key: 'plateNumber', parentKey: 'needAuditDetailDto' },
        { label: '车辆类型', key: 'vehicleTypeDesc', parentKey: 'needAuditDetailDto' },
        { label: '车辆所有人', key: 'vehicleOwner', parentKey: 'needAuditDetailDto' },
        {
          label: '有效期至',
          key: 'drivingLicenceExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD'],
          parentKey: 'needAuditDetailDto'
        }
      ],
      roadLicenceItemList: [
        { label: 'OCR车牌号', key: 'plateNumber' },
        { label: '道路运输证号', key: 'roadLicenceCode' },
        { label: '经营许可证号', key: 'businessLicenseCode' },
        {
          label: '有效期至',
          key: 'roadLicenceExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD']
        },
        { label: '车牌颜色', key: 'vehiclePlateColorDesc' }
      ],
      roadTempItemList: [
        { label: '临时车牌号', key: 'plateNumber', parentKey: 'needAuditDetailDto' },
        {
          label: '有效期至',
          key: 'drivingLicenceExpireTime',
          filter: dateFormat,
          filterParams: ['YYYY-MM-DD'],
          parentKey: 'needAuditDetailDto'
        }
      ]
    };
  },
  computed: {
    currentCertificate() {
      return certificateParamMap[this.certificateType];
    }
  },
  created() {
    this.tableOptions.userCode = this.$route.params.userCode;
    if (this.$route.params.vehicleId) this.tableOptions.vehicleId = this.$route.params.vehicleId;
    this.certificateType = this.$route.params.type;
    if (this.certificateType == 'vehicleLicense' || this.certificateType == 'roadTransport') {
      this.$store.dispatch('setBreadcrumb', [
        { title: '首页', path: '/user' },
        { title: '车辆资料审核', path: '/car/audit/list' },
        {
          title: '车辆资料审核详情',
          path: `/cardata/audit/${this.$route.params.userCode}/${this.$route.params.vehicleId}`
        },
        { title: `${this.currentCertificate.name}-历史记录` }
      ]);
      this.$store.dispatch('changeSideAction', '/car/audit/list');
    } else {
      this.$store.dispatch('setBreadcrumb', [
        { title: '首页', path: '/user' },
        { title: '司机资料审核', path: '/driver/audit/list' },
        {
          title: '司机资料审核详情',
          path: `/personaldata/audit/${this.$route.params.userCode}`
        },
        { title: `${this.currentCertificate.name}-历史记录` }
      ]);
      this.$store.dispatch('changeSideAction', '/driver/audit/list');
    }
    this.handleSearch();
  },
  mounted() {},
  methods: {
    async fetchData(opts) {
      let apiUrl = api.driverLogList;
      if (this.certificateType === 'vehicleLicense' || this.certificateType === 'roadTransport') {
        apiUrl = api.drivingLicenceLogList;
      }
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(apiUrl, options);
      this.tableData.data = res.data.data || [];
      this.tableData.total = res.data.total || 0;
      if (this.tableData.data.length > 0) {
        this.hanldeSnapshot(this.tableData.data[0]);
        this.$refs.singleTable.setCurrentRow(this.tableData.data[0]);
      }
    },
    // 基础详情
    async hanldeSnapshot(row) {
      //  this.snapshotData.show = false;
      this.timer = new Date().getTime();
      this.snapshotData.title = this.currentCertificate.name;
      this.snapshotData.key = this.certificateType;
      this.snapshotData.auditItemList = this[this.currentCertificate.itemKey];
      let res = await axios.post(this.currentCertificate.getDetailApi, { snapshotId: row.snapshotId });
      let currentCertificateData = res.data || {};
      this.snapshotData.viewerData = currentCertificateData[this.currentCertificate.viewerDataKey] || [];
      if (this.certificateType === 'vehicleLicense') {
        this.snapshotData.otherData = {
          plateNumberType: currentCertificateData.plateNumberType,
          needAuditDetailDto: currentCertificateData.needAuditDetailDto || {},
          ocrDetailDto: currentCertificateData.ocrDetailDto || {}
        };
      } else {
        this.snapshotData.otherData = res.data || {};
      }
      this.snapshotData.show = true;
      this.$nextTick(() => {
        this.$refs.auditHistoryRef.showViewerData();
      });
    }
  }
};
</script>
<style lang="postcss" scoped>
.certificate-history {
}
</style>
