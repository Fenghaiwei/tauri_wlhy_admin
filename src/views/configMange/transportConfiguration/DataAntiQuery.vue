<template>
  <div class="data-annti-page">
    <div class="toolbar-panel">
      <div class="toolbar-item">
        <el-button type="primary" @click="hanldeImport">导入反查明细</el-button>
        <el-button type="text" @click="hanldeDownLoad">下载导入模板</el-button>
        <el-button class="font-default" type="text" @click="handleSearch">刷新</el-button>
      </div>
    </div>
    <el-table :data="tableData.data" border>
      <el-table-column label="时间" prop="createTime" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="createBy" align="center"> </el-table-column>
      <el-table-column label="操作备注" prop="importMemo" align="center" min-width="200"> </el-table-column>
      <el-table-column label="反查结果" align="center" min-width="200">
        <template v-slot="scope">
          <span v-if="scope.row.dealStatus == 0">查询中，请耐心等待</span>
          <span v-else-if="scope.row.dealStatus == 2">{{ scope.row.dealMemo }}</span>
          <span v-else>反查成功{{ scope.row.successCount }}条，失败{{ scope.row.failCount }}条</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="createTime" align="center">
        <template v-slot="scope">
          <el-button class="font-default" type="text" v-if="scope.row.outputUrl" @click="handleResult(scope.row)"
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
    <el-dialog :visible.sync="importFileDia" title="导入反查数据" custom-class="tip-dialog">
      <div>请严格按照模板格式填写，单次导入的excel明细不能超过5000条</div>
      <div class="mb-20 mt-20">
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="98px">
          <el-form-item label="请选择文件" prop="fileUrl">
            <upload-excel-component
              v-if="importFileDia"
              class="mr-10"
              @succeed="handleUploadExcelSucceed"
              title="选择文件"
            />
            <span v-if="fileInfo.fileName">{{ fileInfo.fileName }}</span>
          </el-form-item>
          <el-form-item label="备注" prop="importMemo">
            <el-input
              type="textarea"
              :rows="5"
              v-model.trim="formAdd.importMemo"
              placeholder="不超过50个汉字。例如：9月15日 上报异常数据"
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

    <el-dialog title="导入成功" :visible.sync="showResultDia" custom-class="tip-dialog" @closed="closeResultDia">
      <div class="mt-10">
        <p>系统正在反查司机和车辆数据，请耐心等待</p>
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
      fileInfo: {
        fd: null,
        fileName: ''
      },
      formAdd: { fileUrl: '', importMemo: '' },
      rules: {
        fileUrl: [{ required: true, message: '请选择文件' }],
        importMemo: [{ required: true, message: '请填写备注' }]
      }
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.loginkExceptionList, options);
      this.tableData = res.data;
    },
    async hanldeDownLoad() {
      let res = await axios.post(api.loginkExceptionDownload, { modelType: 1 });
      window.location.href = res.data;
    },
    async handleResult(item) {
      window.location.href = item.outputUrl;
    },
    hanldeImport() {
      this.$refs['formAdd'] && this.$refs['formAdd'].resetFields();
      this.fileInfo.fileName = '';
      this.fileInfo.fd = null;
      this.formAdd.importMemo = '';
      this.formAdd.fileUrl = '';
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
      await axios.post(api.loginkExceptionImportException, options);
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
.data-annti-page {
  .tip-dialog {
    width: 500px;
  }
}
</style>
