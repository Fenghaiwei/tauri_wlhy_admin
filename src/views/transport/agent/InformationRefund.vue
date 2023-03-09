<template>
  <layout navActive="transport">
    <div class="information-refund-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">采购订单</span>
          <el-input
            v-model.trim="tableOptions.tradeSn"
            maxlength="30"
            placeholder="请输入采购订单"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">报号码</span>
          <el-input
            v-model.trim="tableOptions.enrollCode"
            maxlength="30"
            placeholder="请输入报号码"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">经纪人</span>
          <el-input
            v-model.trim="tableOptions.agentUserName"
            maxlength="30"
            placeholder="请输入经纪人"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">经纪人手机号</span>
          <el-input
            v-model.trim="tableOptions.agentUserPhone"
            maxlength="30"
            placeholder="请输入经纪人手机号"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">支付时间</span>
          <el-date-picker
            v-model="tableOptions.payStartTime"
            type="datetime"
            style="width: 200px"
            placeholder="开始日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onSelectTime"
          ></el-date-picker>
          <span class="font-gray ml-5 mr-5">-</span>
          <el-date-picker
            v-model="tableOptions.payEndTime"
            type="datetime"
            style="width: 200px"
            placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            @change="onSelectTime"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button
            type="primary"
            @click="handleRefund"
            :disabled="tableList.length == 0"
            v-has="'transport:information:refund:refund'"
            >退款</el-button
          >
        </div>
      </div>
      <div class="toolbar-panel mb-10 font-gray">
        注：满足退款条件(未关联运单的报号码、卸货签到前已取消运单、退款时效未超过30天）
      </div>
      <el-table :data="tableData.data" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="36"></el-table-column>
        <el-table-column
          label="采购订单"
          prop="tradeSn"
          min-width="140"
          show-overflow-tooltip
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column label="报号码" prop="enrollCode" width="160" align="center"></el-table-column>
        <el-table-column
          label="经纪人"
          prop="agentUserName"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="经纪人手机号"
          prop="agentUserPhone"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="总信息费" prop="informationFee" min-width="120" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.informationFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="待付经纪人信息费"
          prop="informationDisburseFee"
          min-width="120"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.informationDisburseFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代收开票费" prop="invoiceFee" min-width="120" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.invoiceFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收取信息服务费"
          prop="informationRetentionFee"
          min-width="120"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.informationRetentionFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" prop="payTime" min-width="140" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.payTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
export default {
  name: 'InformationRefund',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      timeRange: [],
      tableList: [],
      tableOptions: {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        payEndTime: '',
        payStartTime: '',
        tradeSn: ''
      },
      tableData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= dayjs().add(1, 'day').startOf('day');
        }
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '信息费可退款列表' }]);
    this.handleSearch();
  },
  methods: {
    handleSelectionChange(val) {
      this.tableList = val;
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.refundList, options);
      this.tableData = res.data;
    },
    handleRefund() {
      this.$confirm('是否确认退款?', '退款确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const enrollNumberIds = this.tableList.map(el => el.enrollNumberId);
          await axios.post(api.refundSubmit, { enrollNumberIds });
          this.handleSearch();
        })
        .catch(() => {});
    },
    onSelectTime() {
      let { payStartTime, payEndTime } = this.tableOptions;
      if (payStartTime && payEndTime && payStartTime > payEndTime) {
        this.$message.warning('结束时间不能小于开始时间,请重新选择');
        this.tableOptions.payEndTime = '';
        return;
      }
    },
    onReset() {
      this.tableOptions = {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        payEndTime: '',
        payStartTime: '',
        tradeSn: ''
      };
    }
  }
};
</script>
<style lang="postcss">
.information-refund-page {
  .toolbar-panel .toolbar-item .el-input {
    width: 180px;
  }
}
</style>
