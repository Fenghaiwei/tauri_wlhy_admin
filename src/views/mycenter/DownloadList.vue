<template>
  <layout navActive="mycenter">
    <div class="cancel_panel ms-controller">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="下载菜单" prop="fileName"></el-table-column>
        <el-table-column label="当前状态" prop="statusDesc"></el-table-column>
        <el-table-column label="下载时间" prop="startTime" min-width="150"></el-table-column>
        <el-table-column label="预计完成时间" prop="completedTime" min-width="150"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button class="font-default" v-if="scope.row.fileAddr" type="text" @click="handleDownload(scope.row)"
              >下载</el-button
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
  </layout>
</template>
<script>
import api from '@/api/api';
import axios from '@/utils/axios';
import listMixin from '@/utils/listMixin';
export default {
  name: 'DownloadList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableData: {
        total: 0,
        data: []
      }
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/download/list' }, { title: '下载中心' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...opts };
      let res = await axios.post(api.downloadList, options);
      if (res.data) this.tableData = res.data;
    },
    handleDownload(row) {
      window.location.href = row.fileAddr;
    }
  }
};
</script>
