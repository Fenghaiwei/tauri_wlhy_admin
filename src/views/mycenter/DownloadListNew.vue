<template>
  <layout navActive="mycenter">
    <div class="download-listnew-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">状态</span>
          <el-select v-model="tableOptions.statusList" style="width: 300px" placeholder="请选择" multiple>
            <el-option :label="item.label" :value="item.val" v-for="item in statusList" :key="item.val"></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" class="mr-10" @click="handleSearch">筛选</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="任务编码" prop="taskCode"></el-table-column>
        <el-table-column label="文件名" prop="fileName" min-width="200"></el-table-column>
        <el-table-column label="状态" prop="statusDesc"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" min-width="150"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" min-width="150"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button class="font-default" v-if="scope.row.filePath" type="text" @click="handleDownload(scope.row)"
              >下载</el-button
            >
            <el-button
              class="font-default"
              v-if="scope.row.status == 3 && scope.row.retryCount < 3"
              type="text"
              @click="handleRetry(scope.row)"
              >重试</el-button
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
  name: 'DownloadListNew',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { statusList: [] },
      tableData: {
        total: 0,
        data: []
      },
      statusList: [
        { label: '新建', val: 0 },
        { label: '执行中', val: 1 },
        { label: '执行成功', val: 2 },
        { label: '执行失败', val: 3 }
      ]
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/download/list' }, { title: '下载中心新' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.exportPageList, options);
      if (res.data) this.tableData = res.data;
    },
    handleDownload(row) {
      window.location.href = row.filePath;
    },
    // 重试
    async handleRetry(row) {
      await axios.get(api.exportRetry, { params: { taskCode: row.taskCode } });
      this.$message.success('操作成功');
      this.handleSearch();
    }
  }
};
</script>
