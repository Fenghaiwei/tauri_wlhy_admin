<template>
  <layout navActive="user">
    <div class="collection-settings-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">车队长姓名</span>
          <el-input
            style="width: 300px"
            v-model.trim="tableOptions.captainName"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车队长手机号</span>
          <el-input
            style="width: 300px"
            v-model.trim="tableOptions.captainMobile"
            placeholder="请输入"
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
        <el-table-column label="车队长姓名" align="center" prop="captainName"> </el-table-column>
        <el-table-column label="车队长手机号" align="center" prop="captainMobile"> </el-table-column>
        <el-table-column label="收款设置" align="center" prop="tranSetDesc"> </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDtl(scope.row)"
              v-has="'transport:address:mark:list:detail'"
              >查看日志</el-button
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
    </div>

    <el-dialog title="日志" :visible.sync="dialogVisible">
      <el-table :data="logList.data" border>
        <el-table-column label="时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="operationDesc"> </el-table-column>
      </el-table>

      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="logPage"
          :total="logList.total"
          @current-change="logCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'CollectionSettings',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      logPage: 1,
      logList: { data: [], total: 0 },
      tableOptions: { captainName: '', captainMobile: '' },
      tableData: { data: [], total: 0 },
      dialogVisible: false,
      userCode: ''
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '收款设置查询' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.captainList, options);
      this.tableData.data = res.data.data;
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = { captainName: '', captainMobile: '' };
    },
    handleDtl(row) {
      this.userCode = row.userCode;
      this.dialogVisible = true;
      this.logCurrentChange();
    },
    async logCurrentChange(val = 1) {
      this.logPage = val;
      const options = { pageNum: this.logPage, pageSize: this.pageSize, userCode: this.userCode };
      let res = await axios.post(api.captainLogList, options);
      this.logList.data = res.data.data;
      this.logList.total = res.data.total;
    }
  }
};
</script>
<style lang="postcss"></style>
