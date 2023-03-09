<template>
  <layout navActive="config">
    <div class="auto-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="规则节点" prop="ruleNode" align="center"> </el-table-column>
        <el-table-column label="涉及企业" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template v-slot="scope">
            <el-switch
              class="tableScopeSwitch"
              v-model="scope.row.status"
              @change="whetherIntercept(scope.row)"
              active-text="启用"
              inactive-text="禁用"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作日志" prop="createTime" align="center">
          <template v-slot="scope">
            <el-button @click="handleLook(scope.row)" type="text">查看</el-button>
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

      <el-dialog title="操作日志" :visible.sync="dialogAddVisable">
        <el-table :data="handleData.data" border max-height="600">
          <el-table-column label="操作人" prop="operatorName" align="center"> </el-table-column>
          <el-table-column label="操作时间" prop="operatedTime" align="center"> </el-table-column>
          <el-table-column label="操作" prop="operatedDesc" align="center"> </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import dayjs from 'dayjs';
import utils from '@/utils/utils';
export default {
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyName: '' },
      tableData: {},
      handleData: {},
      dialogAddVisable: false,
      modifyText: ''
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/config' },
      { title: '平台账户提现拦截', path: '/balanceinterception/list' },
      { title: '自动导入名单' }
    ]);

    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.driverImportPages, options);
      this.tableData = res.data;
      this.tableData.data.forEach(el => {
        el.status = el.status === 1 ? true : false;
      });
    },
    whetherIntercept(row) {
      let status = row.status ? 1 : 0;
      this.$confirm(`${status === 0 ? '禁用后规则将失效' : '启用后规则将生效'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.driverImportUpdateStatus, { ruleId: row.id, status: status });
          this.handleSearch();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    async handleLook(row) {
      this.dialogAddVisable = true;
      let res = await axios.post(api.driverImportLogPages, { ruleId: row.id });
      this.handleData = res.data;
    }
  }
};
</script>
<style lang="postcss">
.auto-page {
  .tip-title {
    text-align: center;
    line-height: 30px;
    font-size: 15px;
  }
  .tableScopeSwitch .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  /*打开时文字位置设置*/
  .tableScopeSwitch .el-switch__label--right {
    z-index: 1;
    right: 6px; /*不同场景下可能不同，自行调整*/
  }
  /*关闭时文字位置设置*/
  .tableScopeSwitch .el-switch__label--left {
    z-index: 1;
    left: 6px; /*不同场景下可能不同，自行调整*/
  }
  /*显示文字*/
  .tableScopeSwitch .el-switch__label.is-active {
    display: block;
  }
  .tableScopeSwitch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 75px !important; /*开关按钮的宽度大小*/
  }
}
</style>
