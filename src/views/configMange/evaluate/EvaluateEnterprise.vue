<template>
  <layout navActive="config">
    <div class="evaluate-enterprise-page">
      <el-table :data="tableData.data" border>
        <el-table-column type="index" label="序号" width="160"> </el-table-column>
        <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="评价人姓名" prop="evaluatorName" align="center"> </el-table-column>
        <el-table-column label="手机号" prop="mobileNum" align="center"> </el-table-column>
        <el-table-column label="评价时间" prop="evaluateTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.evaluateTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
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
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      evaluationOptionId: null,
      tableData: {}
    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.evaluationOptionId = id;
      this.handleSearch();
    }
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '企业明细' }]);
  },
  methods: {
    async fetchData(opts) {
      const options = {
        pageNum: this.page,
        pageSize: this.pageSize,
        ...opts,
        evaluationOptionId: this.evaluationOptionId
      };
      let res = await axios.post(api.evaluationDetailList, options);
      this.tableData = res.data;
    }
  }
};
</script>
<style lang="postcss"></style>
