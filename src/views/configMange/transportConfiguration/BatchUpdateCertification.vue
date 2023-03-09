<template>
  <div class="batch-update-certification">
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <el-button type="primary" @click="hanldeImport">导入明细</el-button>
        <el-button type="text" @click="hanldeDownLoad">下载导入模板</el-button>
        <el-button class="font-default" type="text" @click="handleSearch">刷新</el-button>
      </div>
    </div>
    <el-table :data="tableData.data" border>
      <el-table-column label="时间" prop="createTime" align="center"> </el-table-column>
      <el-table-column label="操作人" prop="creatorName" align="center"> </el-table-column>
      <el-table-column label="修改的证件" prop="certTypeName" align="center"> </el-table-column>
      <el-table-column label="修改后的证件状态" prop="certStatusName" align="center"> </el-table-column>
      <el-table-column label="操作备注" prop="importRemark" align="center" min-width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="导入结果" prop="importResult" align="center" min-width="200"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button class="font-default" type="text" v-if="scope.row.detailFileUrl" @click="handleResult(scope.row)"
            >下载明细</el-button
          >
        </template>
      </el-table-column>
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
    <!--导入文件-->
    <el-dialog :visible.sync="importFileDia" title="导入明细" custom-class="tip-dialog">
      <div>请严格按照模板格式填写，单次导入的excel明细不能超过5000条</div>
      <div class="mb-20 mt-20">
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="200px">
          <el-form-item label="请选择证件类型" prop="certType">
            <el-select
              v-model="formAdd.certType"
              placeholder="请选择证件类型"
              style="width: 400px"
              @change="handleCertTypeChange"
            >
              <el-option
                v-for="(item, idx) in certTypeOptions"
                :key="idx"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择修改后的证件状态" prop="certStatus">
            <el-select
              v-model="formAdd.certStatus"
              placeholder="请选择修改后的证件状态"
              style="width: 400px"
              prop="certType"
            >
              <el-option
                v-for="(item, idx) in certStatusOptions"
                :key="idx"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="请选择修改原因" prop="updateReason">
            <el-select v-model="formAdd.updateReason" placeholder="请选择请选择修改原因" style="width: 400px">
              <el-option
                v-for="(item, idx) in updateReasonOptions"
                :key="idx"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择文件" prop="fileUrl">
            <upload-excel-component
              v-if="importFileDia"
              class="mr-10"
              @succeed="handleUploadExcelSucceed"
              title="选择文件"
            />
            <span v-if="fileInfo.fileName">{{ fileInfo.fileName }}</span>
          </el-form-item>
          <el-form-item label="备注" prop="updateRemark">
            <el-input
              type="textarea"
              :rows="5"
              v-model.trim="formAdd.updateRemark"
              placeholder="不超过50个汉字"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleSave">确定导入</el-button>
        <el-button @click="importFileDia = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入成功" :visible.sync="showResultDia" custom-class="result-dialog" @closed="closeResultDia">
      <div class="mt-10">
        <p>系统正在修改认证状态，请耐心等待</p>
      </div>
      <div slot="footer">
        <el-button @click="closeResultDia" type="primary">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import UploadExcelComponent from '@/components/UploadExcel';
export default {
  mixins: [listMixin],
  components: { UploadExcelComponent },
  data() {
    return {
      pageSize: 20,
      tableOptions: {},
      tableData: {},
      importFileDia: false,
      showResultDia: false,
      certTypeOptions: [
        { label: '从业资格证', value: 11 },
        { label: '道路运输证', value: 21 }
      ],
      certStatusOptions: [],
      updateReasonOptions: [{ label: '证件不合格，请重新上传证件图片' }],
      fileInfo: {
        fd: null,
        fileName: ''
      },
      formAdd: { fileUrl: '', certType: '', certStatus: '', updateReason: '', updateRemark: '' },
      rules: {
        certType: [{ required: true, message: '请选择证件类型' }],
        certStatus: [{ required: true, message: '请选择修改后的证件状态' }],
        updateReason: [{ required: true, message: '请选择修改原因' }],
        fileUrl: [{ required: true, message: '请选择文件' }],
        updateRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.loginkExceptionAuthModifyList, options);
      this.tableData = res.data;
    },
    handleCertTypeChange() {
      this.formAdd.certStatus = '';
      if (this.formAdd.certType) {
        if (this.formAdd.certType == 11) {
          this.certStatusOptions = [{ label: '审核未通过', value: 3 }];
        } else {
          this.certStatusOptions = [{ label: '更新失败', value: 7 }];
        }
      } else {
        this.certStatusOptions = [];
      }
    },
    async hanldeDownLoad() {
      let res = await axios.post(api.loginkExceptionDownload, { modelType: 2 });
      window.location.href = res.data;
    },
    async handleResult(item) {
      window.location.href = item.detailFileUrl;
    },
    hanldeImport() {
      this.$refs['formAdd'] && this.$refs['formAdd'].resetFields();
      this.fileInfo.fileName = '';
      this.fileInfo.fd = null;
      this.formAdd.remark = '';
      this.formAdd = {
        fileUrl: '',
        certType: '',
        certStatus: '',
        updateReason: '',
        updateRemark: ''
      };
      this.importFileDia = true;
    },
    handleUploadExcelSucceed(obj) {
      this.fileInfo = obj;
      this.formAdd.fileUrl = obj.fileName;
      this.$refs.formAdd.clearValidate(['fileUrl']);
    },
    handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          const { fd, fileName } = this.fileInfo;
          axios({
            url: api.upload,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: fd
          }).then(async res => {
            this.formAdd.fileUrl = res.data.fileUri;
            this.submit();
          });
        }
      });
    },
    async submit() {
      const options = { ...this.formAdd };
      await axios.post(api.loginkExceptionAuthModifyImport, options);
      this.importFileDia = false;
      this.showResultDia = true;
    },
    closeResultDia() {
      this.showResultDia = false;
      this.handleSearch();
    }
  }
};
</script>
<style lang="postcss">
.batch-update-certification {
  .tip-dialog {
    width: 640px;
  }
  .result-dialog {
    width: 500px;
  }
}
</style>
