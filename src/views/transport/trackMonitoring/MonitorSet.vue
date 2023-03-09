<template>
  <layout navActive="transport">
    <div class="product-config-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入企业名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">企业编码</span>
          <el-input
            v-model.trim="tableOptions.companyCode"
            placeholder="请输入企业编码(多个用,隔开)"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="companyName" label="企业名称">
          <template v-slot="scope">
            <span @click="handleSet(scope.row)" class="font-default pointer">{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyCode" label="企业编码"></el-table-column>
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
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
export default {
  name: 'MonitorSet',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyName: '', companyCode: '' },
      tableData: { data: [], total: 0 }
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '监控配置列表' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.getCompanyList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions.companyName = '';
      this.tableOptions.companyCode = '';
    },
    handleSet(item) {
      this.$router.push(`/abnormal/common/set/${item.actualCompanyCode}`);
    }
  }
};
</script>
<style lang="postcss">
.product-config-page {
  .el-select {
    width: 200px !important;
  }
}
</style>
