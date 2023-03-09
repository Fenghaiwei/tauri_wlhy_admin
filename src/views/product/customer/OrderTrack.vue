<template>
  <layout navActive="product">
    <div class="template-msg-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">装货地名称</span>
          <el-input v-model.trim="tableOptions.loadAddressName" placeholder="请输入装货地名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">卸货地名称</span>
          <el-input v-model.trim="tableOptions.unloadAddressName" placeholder="请输入卸货地名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入企业名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">参考运单号</span>
          <el-input
            v-model.trim="tableOptions.referenceOrderNumber"
            placeholder="请输入参考运单号"
            clearable
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="add" v-has="'product:order:track:add'">添加</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="企业名称" align="center" prop="companyName" width="190"> </el-table-column>
        <el-table-column label="装货地名称" align="center" prop="loadAddressName"> </el-table-column>
        <el-table-column label="卸货地名称" align="center" prop="unloadAddressName"> </el-table-column>
        <el-table-column label="开始日期" align="center" prop="title">
          <template v-slot="scope">
            {{ scope.row.orderBeginTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="结束日期" align="center" width="140">
          <template v-slot="scope">
            {{ scope.row.orderEndTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="参考运单号" align="center" prop="referenceOrderNumber"> </el-table-column>
        <el-table-column label="运单数" align="center" prop="orderCount" width="140"> </el-table-column>
        <el-table-column label="操作人" align="center" prop="operatorName" width="140"> </el-table-column>
        <el-table-column label="操作时间" align="center" prop="readNum" width="140">
          <template v-slot="scope">
            {{ scope.row.operatorTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
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
  name: 'OrderTrack',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        loadAddressName: '',
        unloadAddressName: '',
        companyName: '',
        referenceOrderNumber: ''
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },

  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '轨迹工具' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.orderTrackList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { loadAddressName: '', unloadAddressName: '', companyName: '', referenceOrderNumber: '' };
    },
    add() {
      this.$router.push(`/order/track/add`);
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
