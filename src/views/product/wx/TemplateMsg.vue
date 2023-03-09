<template>
  <layout navActive="product">
    <div class="template-msg-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">公众号</span>
          <el-select v-model="tableOptions.appId" style="width: 200px" placeholder="请选择">
            <el-option
              v-for="item in wechatList"
              :label="item.appName"
              :value="item.appId"
              :key="item.appId"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">标题</span>
          <el-input v-model.trim="tableOptions.title" placeholder="请输入标题" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">内容</span>
          <el-input v-model.trim="tableOptions.content" placeholder="请输入内容" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">模板编号</span>
          <el-input v-model.trim="tableOptions.templateId" placeholder="请输入模板编号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">发送日期</span>
          <el-date-picker
            :clearable="false"
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="[' 00:00:00', '23:59:59']"
          ></el-date-picker>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="sendTemplate">发送模板消息</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="公众号" align="center" prop="appName" width="190"> </el-table-column>
        <el-table-column label="标题" align="center" prop="title"> </el-table-column>
        <el-table-column label="内容" prop="content">
          <template v-slot="scope">
            <div class="template-content" v-html="scope.row.content"></div>
          </template>
        </el-table-column>
        <el-table-column label="模版ID" align="center" prop="templateId"> </el-table-column>
        <el-table-column label="发送时间" align="center" width="140">
          <template v-slot="scope">
            {{ scope.row.sendTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="阅读人数" align="center" prop="readNum" width="140">
          <template v-slot="scope">
            {{ scope.row.readNum | thousands(2) }}
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
  name: 'TemplateMsg',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      createTimeRange: [],
      tableOptions: { startTime: '', endTime: '', appId: '', content: '', templateId: '', title: '' },
      tableData: {
        data: [],
        total: 0
      },
      wechatList: []
    };
  },

  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '模板消息' }]);
    await this.getWechatList();
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.wechatTemplateList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { startTime: '', endTime: '', appId: '', content: '', templateId: '', title: '' };
      this.createTimeRange = [];
    },
    async getWechatList() {
      return new Promise(async (resolve, rej) => {
        let res = await axios.post(api.wechatList);
        this.wechatList = res.data;
        resolve();
      });
    },
    sendTemplate() {
      this.$router.push(`/template/msg/send`);
    }
  }
};
</script>
<style lang="postcss">
.template-msg-page {
  .template-content {
    white-space: pre-line !important;
  }
}
</style>
