<template>
  <layout navActive="user">
    <div class="caption-list-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">车队长姓名</span>
          <el-input
            style="width: 300px"
            maxlenght="50"
            v-model.trim="tableOptions.captainName"
            placeholder="请输入车队长姓名"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车队长手机号</span>
          <el-input
            style="width: 300px"
            maxlenght="11"
            v-model.trim="tableOptions.captainMobile"
            placeholder="请输入车队长手机号"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="车队长姓名" align="center" prop="captainName">
          <template v-slot="scope">
            <span class="font-default pointer" @click="$router.push(`/captain/detail/${scope.row.captainCode}`)">{{
              scope.row.captainName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="captainMobile"> </el-table-column>
        <el-table-column label="当前车队人数" align="center" prop="teamNum"> </el-table-column>
        <el-table-column label="已退出车队人数" align="center" prop="teamOutNum"></el-table-column>
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
  name: 'CaptainList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { captainName: '', captainMobile: '' },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '车队长信息列表' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.captainInfoList, options);
      this.tableData.data = res.data.data || [];
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = { captainName: '', captainMobile: '' };
    }
  }
};
</script>
<style lang="postcss"></style>
