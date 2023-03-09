<template>
  <layout navActive="transport">
    <div class="information-review-page">
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
          <span class="item-label">运单</span>
          <el-input
            v-model.trim="tableOptions.orderNumber"
            maxlength="30"
            placeholder="请输入运单"
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
          <!-- <el-select
            filterable
            clearable
            v-model="timeType"
            @change="changeTimeType"
            placeholder="请选择时间"
            style="width: 160px"
          >
            <el-option label="提交复核时间" value="1"></el-option>
            <el-option label="运单完结时间" value="2"></el-option>
          </el-select>-->
          <span class="item-label">提交复核时间</span>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="开始日期"
            style="width: 200px"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onSelectStartTime"
          ></el-date-picker>
          <span class="font-gray ml-5 mr-5">-</span>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="结束日期"
            style="width: 200px"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            @change="onSelectEndTime"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column
          label="收取信息服务费留存比例"
          prop="informationRetentionRate"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="采购订单"
          prop="tradeSn"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="报号码" prop="enrollCode" width="120" align="center"></el-table-column>
        <el-table-column
          label="运单"
          prop="orderNumber"
          min-width="150"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="经纪人"
          prop="agentUserName"
          min-width="115"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="经纪人手机号"
          prop="agentUserPhone"
          min-width="115"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="是否封签" prop="seal" width="120" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.seal ? '是' : '否' }}</span>
          </template>
        </el-table-column>
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

        <el-table-column
          label="调整原因"
          prop="changeReason"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          label="运单完结时间"
          prop="finishDeadTime"
          min-width="140"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.finishDeadTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="提交复核时间" prop="reviewTime" min-width="140" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.reviewTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
  name: 'InformationReview',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      timeType: '1',
      tableList: [],
      startTime: '',
      endTime: '',
      tableOptions: {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        finishEndTime: '',
        finishStartTime: '',
        reviewEndTime: '',
        reviewStartTime: '',
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
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '信息费已复核列表' }]);
    this.handleSearch();
  },
  methods: {
    changeTimeType() {
      this.startTime = '';
      this.endTime = '';
      this.tableOptions.finishEndTime = '';
      this.tableOptions.finishStartTime = '';
      this.tableOptions.reviewEndTime = '';
      this.tableOptions.reviewStartTime = '';
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.reviewedList, options);
      this.tableData = res.data;
    },
    onSelectStartTime(val) {
      this.selTime();
      if (val) {
        if (this.timeType === '1') {
          this.tableOptions.reviewStartTime = val;
        } else {
          this.tableOptions.finishStartTime = val;
        }
      } else {
        this.tableOptions.finishStartTime = '';
        this.tableOptions.reviewStartTime = '';
      }
    },
    onSelectEndTime(val) {
      this.selTime();
      if (val) {
        if (this.timeType === '1') {
          this.tableOptions.reviewEndTime = val;
        } else {
          this.tableOptions.finishEndTime = val;
        }
      } else {
        this.tableOptions.reviewEndTime = '';
        this.tableOptions.finishEndTime = '';
      }
    },
    selTime() {
      if (this.startTime && this.endTime && this.startTime > this.endTime) {
        this.$message.warning('结束时间不能小于开始时间,请重新选择');
        this.endTime = '';
        return;
      }
    },
    onReset() {
      this.tableOptions = {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        finishEndTime: '',
        finishStartTime: '',
        reviewEndTime: '',
        reviewStartTime: '',
        tradeSn: ''
      };
      this.startTime = '';
      this.endTime = '';
    }
  }
};
</script>
<style lang="postcss">
.information-review-page {
  .el-dialog__body {
    text-align: center;
  }
}
</style>
