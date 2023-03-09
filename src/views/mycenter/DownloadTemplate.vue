<template>
  <layout navActive="mycenter">
    <div class="download-template-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">应用方法</span>
          <el-input
            v-model.trim="tableOptions.appMethod"
            placeholder="请输入应用方法"
            clearable
            style="width: 400px"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button type="primary" @click="handleImportClick" v-has="'my:download:template:upload'"
            >模板上传</el-button
          >
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column prop="appName" label="应用名称" min-width="160"></el-table-column>
        <el-table-column prop="tmplName" label="模板名称" min-width="160"></el-table-column>
        <el-table-column prop="appMethod" label="应用方法" min-width="220"></el-table-column>
        <el-table-column prop="updateTimeDesc" label="更新时间" width="160"></el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button class="font-default" v-if="scope.row.ossPath" type="text" @click="handleDownload(scope.row)"
              >下载</el-button
            >
            <el-button class="font-default" type="text" @click="handleEdit(scope.row)">编辑</el-button>
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
    </div>
    <!--导入文件-->
    <el-dialog :visible.sync="importFileDia" title="导入" custom-class="template-dialog">
      <div class="mb-20">
        <upload-excel-component
          v-if="importFileDia"
          class="mr-10"
          @succeed="handleUploadExcelSucceed"
          title="选择文件"
        />
        <span v-if="fileInfo.fileName">{{ fileInfo.fileName }}</span>
      </div>
      <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="120px">
        <el-form-item label="业务服务名称" prop="appName">
          <el-input
            v-model.trim="formAdd.appName"
            placeholder="请输入业务服务名称"
            :disabled="formType === 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务服务方法" prop="appMethod">
          <el-input
            v-model.trim="formAdd.appMethod"
            placeholder="请输入业务服务方法"
            :disabled="formType === 'edit'"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="importFileDia = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :disabled="!fileInfo.fileName">上传</el-button>
      </div>
    </el-dialog>
  </layout>
</template>
<script>
import api from '@/api/api';
import axios from '@/utils/axios';
import listMixin from '@/utils/listMixin';
import UploadExcelComponent from '@/components/UploadExcel';
export default {
  name: 'DownloadTemplate',
  mixins: [listMixin],
  components: { UploadExcelComponent },
  data() {
    return {
      pageSize: 20,
      formType: 'add',
      tableOptions: { appMethod: '' },
      tableData: {
        total: 0,
        data: []
      },
      fileInfo: {
        fd: null,
        fileName: ''
      },
      formAdd: {
        appName: '',
        appMethod: ''
      },
      importFileDia: false,
      rules: {
        fileName: [{ required: true, message: '请上传文件' }],
        appName: [{ required: true, message: '请输入业务服务名称' }],
        appMethod: [{ required: true, message: '请输入业务服务方法' }]
      },
      showMbVisible: false
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/download/template' }, { title: '下载模板' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.teplPageList, options);
      if (res.data) this.tableData = res.data;
    },
    handleDownload(row) {
      window.location.href = row.ossPath;
    },
    handleImportClick() {
      this.formType = 'add';
      this.importFileDia = true;
      this.fileInfo.fileName = '';
      this.fileInfo.fd = null;
      this.formAdd = {
        appName: '',
        appMethod: ''
      };
    },
    handleEdit(row) {
      this.formType = 'edit';
      this.importFileDia = true;
      this.fileInfo.fileName = '';
      this.fileInfo.fd = null;
      this.formAdd.appName = row.appName;
      this.formAdd.appMethod = row.appMethod;
    },
    handleUploadExcelSucceed(obj) {
      this.fileInfo = obj;
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
            this.submit(res.data.fileUri, fileName);
          });
        }
      });
    },
    async submit(ossPath, tmplName) {
      const options = { ossPath, tmplName, ...this.formAdd };
      await axios.post(api.uploadTepl, options);
      this.$message.success('导入成功');
      this.importFileDia = false;
      this.handleSearch();
    }
  }
};
</script>
<style lang="postcss">
.template-dialog {
  width: 500px;
}
</style>
