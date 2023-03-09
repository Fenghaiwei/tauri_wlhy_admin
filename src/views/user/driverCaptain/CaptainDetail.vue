<template>
  <layout navActive="user">
    <div class="captain-detail-page">
      <div class="segment">
        <div class="segment-header">基本信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">姓名</div>
            <div class="segment-content">
              {{ detailData.captainName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">手机号</div>
            <div class="segment-content">
              {{ detailData.captainMobile }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证号</div>
            <div class="segment-content">
              {{ detailData.idCard | idCardSen }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册时间</div>
            <div class="segment-content">
              {{ detailData.registryDate }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">身份证验证</div>
            <div class="segment-content">
              {{ detailData.certifyDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">相关协议</div>
            <div class="segment-content">
              <span class="font-blue mr-10 pointer" @click="handleCommitmentLetter">承诺函</span>
              <span>{{ commitmentLetterData.signDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">车队管理</div>
        <el-table :data="captainData.data" border max-height="460">
          <el-table-column label="车牌号" prop="plateNumber" min-width="90"></el-table-column>
          <el-table-column label="车辆所有人" prop="vehicleOwner" min-width="90"></el-table-column>
          <el-table-column label="司机姓名" prop="driverName" min-width="100"></el-table-column>
          <el-table-column label="司机手机号" prop="driverMobile" min-width="110"></el-table-column>
          <el-table-column label="加入时间" prop="driverJoinDate" min-width="150"></el-table-column>
          <el-table-column label="退出时间" prop="driverQuitDate" min-width="150"></el-table-column>
          <el-table-column label="当前状态" prop="relationStateDesc" min-width="100"></el-table-column>
          <el-table-column label="相关资料" prop="" width="280" show-overflow-tooltip>
            <template v-slot="scope">
              <el-button type="text" v-if="!!scope.row.vehicleSheetUrl" @click="handleCaptain(scope.row, 1)"
                >车辆信息登记表</el-button
              >
              <el-button type="text" v-if="!!scope.row.entrustContractUrl" @click="handleCaptain(scope.row, 2)"
                >代收款授委托书</el-button
              >
              <el-button
                type="text"
                v-if="(scope.row.certifyFiles && scope.row.certifyFiles).length"
                @click="utils.previewImage(scope.row.certifyFiles, '证明材料')"
                >证明材料</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-fix">
          <el-pagination
            :page-size="captainPage.pageSize"
            :current-page.sync="captainPage.pageNum"
            :total="captainData.total"
            @current-change="handleCaptainChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">关联企业</div>
        <el-table :data="companyData.data" border max-height="460">
          <el-table-column label="企业名称" prop="companyName" min-width="100"></el-table-column>
          <el-table-column label="合作状态" prop="relationStatusDesc" min-width="100"></el-table-column>
          <el-table-column label="关联时间" prop="recoveryDate" min-width="150"> </el-table-column>
          <el-table-column label="解除时间" prop="relieveDate" min-width="150"></el-table-column>
          <el-table-column
            label="解除原因"
            prop="relieveReason"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="相关资料" prop="" width="280">
            <template v-slot="scope">
              <el-button
                type="text"
                v-if="scope.row.proxyFile && scope.row.proxyFile.length"
                @click="previewFiles(scope.row.proxyFile, '代收款授委托书')"
                >代收款授委托书</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.commitmentFile && scope.row.commitmentFile.length"
                @click="previewFiles(scope.row.commitmentFile, '承诺函')"
                >承诺函</el-button
              >
              <el-button
                type="text"
                v-if="scope.row.otherFile && scope.row.otherFile.length"
                @click="previewFiles(scope.row.otherFile, '其他资料')"
                >其他资料</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" width="150">
            <template v-slot="scope">
              <el-button type="text" @click="handleRelations(scope.row)">
                <!-- relationStatus: 1是合作中 0是已解除 -->
                {{ scope.row.relationStatus ? '解除关系' : '恢复关系' }}
              </el-button>
              <el-button type="text" @click="uploadData(scope.row)">上传资料</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-fix">
          <el-pagination
            :page-size="companyPage.pageSize"
            :current-page.sync="companyPage.pageNum"
            :total="companyData.total"
            @current-change="handleCompanyChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">操作日志</div>
        <el-table :data="logData.data" border max-height="460">
          <el-table-column label="时间" prop="createTime" min-width="150"></el-table-column>
          <el-table-column label="操作" prop="logTypeDesc" min-width="120"></el-table-column>
          <el-table-column label="处理人" prop="createUser" min-width="100"></el-table-column>
        </el-table>
        <div class="pagination-fix">
          <el-pagination
            :page-size="logPage.pageSize"
            :current-page.sync="logPage.pageNum"
            :total="logData.total"
            @current-change="handleLogChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>

      <el-dialog :visible.sync="relieveRelationDialog" title="解除关系" custom-class="tip-dialog">
        <div style="display: flex">
          <span style="width: 100px">解除原因：</span>
          <el-input v-model.trim="reason" :maxlength="50" type="textarea" :rows="5" placeholder="上限50个汉字" />
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!reason">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="uploadDialog" title="上传资料" width="500px" :destroy-on-close="true">
        <el-form label-width="110px">
          <el-form-item label="承诺函：">
            <fe-upload ref="cnhUploadRef" listType="text" :limit="2" :allowType="['jpg', 'pdf']">
              <template slot="uploadBtn">
                <el-button type="text">点击上传</el-button>
              </template>
            </fe-upload>
          </el-form-item>
          <el-form-item label="代收协议：">
            <fe-upload ref="dsxyUploadRef" listType="text" :limit="2" :allowType="['jpg', 'pdf']">
              <template slot="uploadBtn">
                <el-button type="text">点击上传</el-button>
              </template>
            </fe-upload>
          </el-form-item>
          <el-form-item label="其他证明资料：">
            <fe-upload ref="qtzlUploadRef" listType="text" :limit="2" :allowType="['jpg', 'pdf']">
              <template slot="uploadBtn">
                <el-button type="text">点击上传</el-button>
              </template>
            </fe-upload>
          </el-form-item>
          <el-form-item label="">
            <span style="color: #97a8be">注：支持jpg、pdf格式，每个资料上限2张</span>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleUploadSave" type="primary">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="previewDialog" :title="previewTitle" width="500px" :close-on-press-escape="false">
        <fe-image-preview :imageList="previewFilesList"></fe-image-preview>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
import FeImagePreview from '@/components/FeImagePreview.vue';
export default {
  components: { FeImagePreview },
  data() {
    return {
      utils,
      captainCode: '',
      uploadAction: api.upload,
      detailData: {},
      commitmentLetterData: {}, // 承诺函详情
      // 车队管理数据:
      captainData: {
        data: [],
        total: 0
      },
      captainPage: {
        pageNum: 1,
        pageSize: 10
      },
      // 关联企业:
      companyData: {
        data: [],
        total: 0
      },
      companyPage: {
        pageNum: 1,
        pageSize: 10
      },
      // 操作日志：
      logData: {
        data: [],
        total: 0
      },
      logPage: {
        pageNum: 1,
        pageSize: 10
      },
      relieveRelationDialog: false,
      uploadDialog: false,
      reason: '',
      operateCode: '',
      previewDialog: false,
      previewTitle: '',
      previewFilesList: []
    };
  },
  async created() {
    this.captainCode = this.$route.params.code;
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/user' },
      { title: '车队长信息列表', path: '/captain/list' },
      { title: this.$route.meta.title }
    ]);
    this.init();
  },
  methods: {
    init() {
      this.fetchBaseInfo();
      this.fetchCommitmentLetter();
      this.fetchCaptainData();
      this.fetchCompanyData();
      this.fetchLogData();
    },
    async fetchBaseInfo() {
      const { data } = await axios.post(api.captainBaseInfo, { captainCode: this.captainCode });
      this.detailData = data || {};
    },
    async fetchCommitmentLetter() {
      const { data } = await axios.post(api.captainCommitmentLetter, { userCode: this.captainCode });
      this.commitmentLetterData = data || {};
    },
    // 车队管理列表
    async fetchCaptainData() {
      const options = {
        pageNum: this.captainPage.pageNum,
        pageSize: this.captainPage.pageSize,
        captainCode: this.captainCode
      };
      let res = await axios.post(api.captainManagementList, options);
      this.captainData.data = res.data.data || [];
      this.captainData.total = res.data.total || 0;
    },
    handleCaptainChange(val) {
      this.captainPage.pageNum = val;
      this.fetchCaptainData();
    },
    // 关联企业列表
    async fetchCompanyData() {
      const options = {
        pageNum: this.companyPage.pageNum,
        pageSize: this.companyPage.pageSize,
        captainCode: this.captainCode
      };
      let res = await axios.post(api.captainCompanyList, options);
      this.companyData.data = res.data.data || [];
      this.companyData.total = res.data.total || 0;
    },
    handleCompanyChange(val) {
      this.companyPage.pageNum = val;
      this.fetchCompanyData();
    },
    // 日志列表
    async fetchLogData() {
      const options = {
        pageNum: this.logPage.pageNum,
        pageSize: this.logPage.pageSize,
        captainCode: this.captainCode
      };
      let res = await axios.post(api.captainInfoLogList, options);
      this.logData.data = res.data.data || [];
      this.logData.total = res.data.total || 0;
    },
    handleLogChange(val) {
      this.logPage.pageNum = val;
      this.fetchLogData();
    },
    // 1:车辆信息登记表 2:代收款授权委托书
    handleCaptain(row, type) {
      window.open(type === 1 ? row.vehicleSheetUrl : row.entrustContractUrl);
    },
    fetchCompanyLogData() {
      this.companyPage.pageNum = 1;
      this.fetchCompanyData();
      this.logPage.pageNum = 1;
      this.fetchLogData();
    },
    // 解除/恢复关系
    handleRelations(row) {
      // relationStatus: 1是合作中 0是已解除
      if (row.relationStatus) {
        this.relieveRelationDialog = true;
        this.operateCode = row.companyCode;
        this.reason = '';
      } else {
        this.$confirm('是否确认恢复关系', ' ', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        })
          .then(async () => {
            await axios.post(api.captainUpdateRel, {
              captainCode: this.captainCode,
              companyCode: row.companyCode,
              operateType: 2 // 恢复关系
            });
            this.$message.success('恢复关系成功');
            this.fetchCompanyLogData();
          })
          .catch(() => {});
      }
    },
    // 确定解除关系
    async handleSave() {
      await axios.post(api.captainUpdateRel, {
        captainCode: this.captainCode,
        companyCode: this.operateCode,
        relieveReason: this.reason,
        operateType: 1 // 解除关系
      });
      this.$message.success('解除关系成功');
      this.relieveRelationDialog = false;
      this.fetchCompanyLogData();
    },
    uploadData(row) {
      this.operateCode = row.companyCode;
      this.uploadDialog = true;
    },
    async handleUploadSave() {
      const cnhUploadList = this.$refs.cnhUploadRef.getUploadFiles();
      const dsxyUploadList = this.$refs.dsxyUploadRef.getUploadFiles();
      const qtzlUploadList = this.$refs.qtzlUploadRef.getUploadFiles();
      if (!cnhUploadList.length && !dsxyUploadList.length && !qtzlUploadList.length) {
        this.$message.warning('数据为空，无法提交');
        return;
      }
      await axios.post(api.captainUploadFile, {
        captainCode: this.captainCode,
        companyCode: this.operateCode,
        commitmentFile: cnhUploadList.join(),
        proxyFile: dsxyUploadList.join(),
        otherFile: qtzlUploadList.join()
      });
      this.$message.success('上传成功');
      this.uploadDialog = false;
      this.fetchCompanyLogData();
    },
    previewFiles(files, title) {
      this.previewTitle = title;
      this.previewFilesList = files;
      this.previewDialog = true;
    },
    handleCommitmentLetter() {
      if (this.commitmentLetterData.contractUrl) {
        window.open(this.commitmentLetterData.contractUrl);
      } else {
        this.$message.warning('此车队长暂未签署承诺函');
      }
    }
  }
};
</script>
