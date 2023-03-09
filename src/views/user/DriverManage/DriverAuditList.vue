<template>
  <layout navActive="user">
    <div class="collection-settings-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">提交时间</span>
          <el-date-picker
            style="width: 380px"
            :clearable="false"
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            :default-time="[' 00:00:00', '23:59:59']"
          ></el-date-picker>
        </div>

        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">注册手机号</span>
          <el-input v-model.trim="tableOptions.userPhone" placeholder="请输入注册手机号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-checkbox v-model="isRefresh">每15秒自动刷新列表</el-checkbox>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="司机姓名" min-width="130" prop="userName">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册手机号" min-width="130" prop="userPhone">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" min-width="130" prop="idCard">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.idCard | idCardSen }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证" prop="idCardCertifyStateDesc">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.idCardCertifyState === 2 || scope.row.idCardCertifyState === 5
              }"
            >
              {{ scope.row.idCardCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="驾驶证" prop="driverCertifyStateDesc">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.driverCertifyState === 2 || scope.row.driverCertifyState === 5
              }"
            >
              {{ scope.row.driverCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="从业资格证" prop="qualificationCertifyStateDesc">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.qualificationCertifyState === 2 || scope.row.qualificationCertifyState === 5
              }"
            >
              {{ scope.row.qualificationCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="当前审核人" min-width="130" prop="currentCertifyUser"> </el-table-column>
        <el-table-column label="操作" width="110">
          <template v-slot="scope">
            <el-button type="primary" @click="handlePersonalAudit(scope.row)">审核</el-button>
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
import utils from '@/utils/utils';
const oneDay = 24 * 60 * 60 * 1000;
export default {
  name: 'DriverAuditList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        userName: '',
        userPhone: '',
        queryTimeStart: new Date(utils.getDatePre(7)).getTime(),
        queryTimeEnd: utils.getCurrentMonth().eDate + oneDay
      },
      tableData: { data: [], total: 0 },
      createTimeRange: [new Date(utils.getDatePre(7)).getTime(), utils.getCurrentMonth().eDate + oneDay],
      isRefresh: false,
      timer: null
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '司机资料审核' }]);
    this.handleSearch();
    this.setTimeMethod();
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  watch: {
    isRefresh() {
      this.setTimeMethod();
    }
  },
  methods: {
    setTimeMethod() {
      clearInterval(this.timer);
      if (this.isRefresh) {
        this.timer = setInterval(() => {
          this.handleSearch();
        }, 15000);
      }
    },
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.queryTimeStart = val[0];
        this.tableOptions.queryTimeEnd = val[1];
      } else {
        this.tableOptions.queryTimeStart = null;
        this.tableOptions.queryTimeEnd = null;
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.driverCertifyList, options);
      this.tableData.data = res.data.data;
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = {
        userName: '',
        userPhone: '',
        queryTimeStart: new Date(utils.getDatePre(7)).getTime(),
        queryTimeEnd: utils.getCurrentMonth().eDate + oneDay
      };
      this.createTimeRange = [new Date(utils.getDatePre(7)).getTime(), utils.getCurrentMonth().eDate + oneDay];
    },
    handleDtl(row) {
      this.$router.push(`/certification/detail/${row.userCode}?pagetype=1`);
    },
    async handlePersonalAudit(row) {
      await axios.post(api.userAuditorRecord, { type: 1, userCode: row.userCode });
      this.$router.push(`/personaldata/audit/${row.userCode}`);
    }
  }
};
</script>
<style lang="postcss"></style>
