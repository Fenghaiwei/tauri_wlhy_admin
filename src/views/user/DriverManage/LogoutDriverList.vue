<template>
  <layout navActive="user">
    <div class="collection-settings-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机手机号</span>
          <el-input v-model.trim="tableOptions.userPhone" placeholder="请输入司机手机号" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="司机姓名" prop="userName" min-width="130"> </el-table-column>
        <el-table-column label="注册手机号" prop="userMobile" min-width="130"> </el-table-column>
        <el-table-column label="注销时间" prop="cancelTime" min-width="160">
          <template v-slot="scope">
            {{ scope.row.cancelTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="注销原因" prop="cancelReason" min-width="200"> </el-table-column>
        <el-table-column label="注册时间" min-width="160">
          <template v-slot="scope">
            {{ scope.row.registerTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="160">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleDtl(scope.row)">查看详情</el-button>
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
  name: 'LogoutDriverList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { userName: '', userPhone: '' },
      tableData: { data: [], total: 0 }
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/user' },
      { title: '司机资料库', path: '/driver/info' },
      { title: '已注销司机列表' }
    ]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.driverLogoutList, options);
      this.tableData.data = res.data.data;
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = { userName: '', userPhone: '' };
    },
    handleDtl(item) {
      this.$router.push(`/personaldata/audit/${item.userCode}?edit=false`);
    }
  }
};
</script>
<style lang="postcss"></style>
