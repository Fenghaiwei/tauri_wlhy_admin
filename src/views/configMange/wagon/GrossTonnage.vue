<template>
  <layout navActive="config">
    <div class="gross-tonnage-page">
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
          <el-button type="primary" @click="hanldeAdd" v-has="'config:gross:tonnage:add'">新增</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="operateUserName" align="center" width="220"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="220"> </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template v-slot="scope">
            <template>
              <el-button
                class="font-default"
                type="text"
                @click="handleDetail(scope.row)"
                v-has="'config:gross:tonnage:edit'"
                >查看详情</el-button
              >
              <el-button class="font-red" type="text" @click="handleDel(scope.row)" v-has="'config:gross:tonnage:del'"
                >移除</el-button
              >
            </template>
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
import dayjs from 'dayjs';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
export default {
  name: 'GrossTonnage',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyName: '' },
      tableData: {}
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '毛重/皮重吨位限制' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.orderPoundList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { companyName: '' };
    },
    async handleDel(item) {
      this.$confirm(`确定移除该企业配置？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.orderPoundRemove, { companyCode: item.companyCode });
          this.handleSearch();
        })
        .catch(() => {});
    },
    hanldeAdd() {
      this.$router.push(`/gross/tonnage/add`);
    },
    handleDetail(item) {
      this.$router.push(`/gross/tonnage/edit/${item.companyCode}`);
    }
  }
};
</script>
<style lang="postcss"></style>
