<template>
  <layout navActive="config">
    <div class="enterprise-config">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入企业名称" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="primary" @click="handleExport" :disabled="tableData.total == 0">导出</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="企业编码" prop="companyCode" align="center"> </el-table-column>
        <el-table-column label="企业名称" prop="companyName" align="center">
          <template v-slot="scope">
            <span class="font-default pointer" @click="handleEdit(scope.row)">{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" prop="productName" align="center"> </el-table-column>
        <el-table-column label="货源类型" prop="stockKindName" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.updateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template v-slot="scope">
            <span>{{ scope.row.status ? '已开启' : '已关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <span @click="hanldeUpdateStatus(scope.row)" class="pointer font-default">{{
              scope.row.status ? '关闭' : '开启'
            }}</span>
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
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'EnterpriseConfig',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyName: '' },
      tableData: { data: [], total: 0 }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '企业配置' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.cargoGuaranteeCompanySetting, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { companyName: '' };
    },
    handleAdd() {
      this.$router.push(`/enterprise/config/add`);
    },
    handleEdit(item) {
      this.$router.push(`/enterprise/config/edit/${item.id}`);
    },
    hanldeUpdateStatus(item) {
      this.$confirm(`确认是否${item.status ? '关闭' : '开启'}配置`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.updateCargoGuaranteeConfig, {
            id: item.id,
            status: item.status ? 0 : 1
          });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleExport() {
      let res = await axios.post(api.cargoGuaranteeCompanySettingExport, { ...this.tableOptions });
      this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
    }
  }
};
</script>
<style lang="postcss"></style>
