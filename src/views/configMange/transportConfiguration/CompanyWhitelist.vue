<template>
  <layout navActive="config">
    <div class="licence-whitelist-page">
      <div class="mb-10">说明：加入白名单的企业发布的货源，司机抢单/派单时不会拦截司机五证</div>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:company:whitelist:import'">批量添加</el-button>
          <el-button
            type="primary"
            @click="handleExport"
            v-has="'config:company:whitelist:export'"
            :disabled="tableData.total == 0"
            >导出</el-button
          >
          <el-button
            type="primary"
            @click="handleDelBatch"
            v-has="'config:company:whitelist:delbatch'"
            :disabled="tableData.total == 0"
            >清空白名单</el-button
          >
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="企业编码" prop="holdCode" align="center"> </el-table-column>
        <el-table-column label="统一社会信用代码" prop="licenseCode" align="center"> </el-table-column>
        <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="白名单类型" prop="listTypeDesc" align="center"> </el-table-column>
        <el-table-column label="操作人" prop="creator" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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

      <el-dialog title="批量添加" :visible.sync="showCompany" custom-class="add-driver-dialog">
        <div class="toolbar-panel vertical-midlle">
          <div class="toolbar-item left">
            <span class="item-label mt-5">企业编码</span>
            <el-input
              v-model.trim="companyCodeStr"
              clearable
              type="textarea"
              :rows="5"
              :placeholder="`批量请换行或者用&quot;,&quot;隔开。最多支持${searchLimit}条。`"
              style="width: 400px"
            ></el-input>
          </div>
          <div class="toolbar-item">
            <el-button type="primary" @click="getCompanyList">筛选</el-button>
          </div>
        </div>
        <el-table
          :data="companyData.data"
          border
          @selection-change="multiselectCompany"
          ref="multipleTable"
          :max-height="400"
        >
          <el-table-column type="selection" width="40" :selectable="isSelect"> </el-table-column>
          <el-table-column label="企业编码" prop="holdCode" align="center"> </el-table-column>
          <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        </el-table>

        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!multiselectCompanyData.length">确定</el-button>
          <el-button @click="showCompany = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
export default {
  name: 'CompanyWhitelist',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {},
      tableData: { data: [], total: 0 },
      showCompany: false,
      companyCodeStr: '',
      multiselectCompanyData: [],
      companyData: { data: [], total: 0 },
      searchLimit: 500
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '企业白名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.companyWhiteList, options);
      this.tableData = res.data;
    },
    onAdd() {
      this.companyCodeStr = '';
      this.showCompany = true;
      this.multiselectCompanyData = [];
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
      });
      this.companyData.data = [];
      this.companyData.total = 0;
    },
    isSelect(row, index) {
      if (!row.whiteListFlag) {
        return 1;
      } else {
        return 0;
      }
    },
    async getCompanyList() {
      const holdCodeList = utils.batchSearchFilter(this.companyCodeStr);
      if (holdCodeList.length > this.searchLimit) {
        this.$message.error(`每次最多添加${this.searchLimit}条`);
        return;
      }
      const options = { pageNum: 1, pageSize: this.searchLimit, holdCodeList };
      let res = await axios.post(api.qryCompanyWhiteList, options);
      this.companyData = res.data;
    },
    multiselectCompany(val) {
      this.multiselectCompanyData = val;
    },
    async handleSave() {
      let holdCodeList = this.multiselectCompanyData.map(el => el.holdCode);
      await axios.post(api.companyWhiteListAdd, { holdCodeList });
      this.showCompany = false;
      this.handleSearch();
    },
    async handleExport() {
      await axios.post(api.companyWhiteListExport);
      this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
    },
    handleDelBatch() {
      this.$confirm(`清空后无法恢复，确定移除所有企业白名单？`, '操作提醒', {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.companyWhiteListClean);
          this.handleSearch();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="postcss">
.licence-whitelist-page {
  .title-box {
    width: 450px;
  }
  .add-driver-dialog {
    width: 720px;
  }
  .vertical-midlle {
    display: flex;
    justify-content: flex-start;
    .toolbar-item {
      &.left {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
</style>
