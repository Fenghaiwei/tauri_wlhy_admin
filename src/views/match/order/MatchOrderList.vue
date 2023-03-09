<template>
  <layout navActive="match">
    <div>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label pr-0">
            <el-select
              filterable
              v-model="tableOptions.timeType"
              placeholder="请选择"
              class="pr-0"
              style="width: 110px"
            >
              <el-option
                v-for="data in dictData.dateRangeEnum"
                :key="data.value"
                :label="data.label"
                :value="data.value"
              ></el-option>
            </el-select>
          </span>
          <el-date-picker
            v-model="createTimeRange"
            @change="handleDateChange"
            value-format="timestamp"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input
            v-model.trim="tableOptions.companyName"
            placeholder="请输入企业名称"
            clearable
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机查询</span>
          <el-input
            v-model.trim="tableOptions.driverName"
            placeholder="手机号/车牌号/姓名"
            clearable
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">订单状态</span>
          <el-select filterable clearable v-model="tableOptions.orderStatus" placeholder="请选择订单状态">
            <el-option
              v-for="data in dictData.orderStatusEnum"
              :key="data.value"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column
          label="订单状态"
          prop="orderStatusName"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="撮合订单号" prop="orderNo" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <a class="font-default" @click="$router.push(`/match/order/detail/${scope.row.orderNo}`)">{{
              scope.row.orderNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="税务订单号" prop="taxOrderNo" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业名称" prop="companyName" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="司机姓名" prop="driverName" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="司机手机号" prop="driverMobile" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="货物类型" prop="goodsTypeName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="下单运费(不含税)" prop="orderTotalFee" min-width="120" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.orderTotalFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单税费" prop="orderTaxFee" min-width="100" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.orderTaxFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单撮合服务费" prop="orderMatchmakingServiceFee" min-width="120" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.orderMatchmakingServiceFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付运费金额(不含税)" prop="actuallyFreightPay" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.actuallyFreightPay | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付税金(元)" prop="paidTaxFee" min-width="110" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.paidTaxFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付撮合服务费(元)" prop="matchmakingServiceFee" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.matchmakingServiceFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单日期" prop="orderTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.orderTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完结日期" prop="completeTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.completeTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
import dayjs from 'dayjs';
export default {
  name: 'MatchOrderList',
  mixins: [listMixin],
  data() {
    return {
      dictData: {
        orderStatusEnum: [],
        dateRangeEnum: [
          { label: '下单时间', value: '1' },
          { label: '完结时间', value: '2' }
        ]
      },
      pageSize: 20,
      createTimeRange: [],
      tableOptions: {
        companyName: '',
        driverMobile: '',
        driverName: '',
        orderBeginTime: '',
        orderEndTime: '',
        orderStatus: '',
        plateNumber: '',
        timeType: '1'
      },
      tableData: {}
    };
  },
  created() {
    this.initDatetime();
    this.getSysDict();
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/match' }, { title: this.$route.meta.title }]);
    this.handleSearch();
  },
  methods: {
    // 获取字典
    async getSysDict() {
      this.dictData.orderStatusEnum = await utils.getSysDict('matchmaking_order_status', true);
    },
    // 日期初始化
    initDatetime() {
      // 获取当前日期  前三个月的第一天
      let preMonth = dayjs(utils.getPreMonthDay(dayjs().format('YYYY-MM-DD'), 3))
        .startOf('month')
        .format('YYYY-MM-DD');
      this.tableOptions.orderBeginTime = new Date(preMonth).getTime();
      this.tableOptions.orderEndTime = new Date().getTime();
      this.createTimeRange = [this.tableOptions.orderBeginTime, this.tableOptions.orderEndTime];
    },
    handleDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.orderBeginTime = val[0];
        this.tableOptions.orderEndTime = val[1];
      } else {
        this.tableOptions.orderBeginTime = '';
        this.tableOptions.orderEndTime = '';
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let { data } = await axios.post(api.queryMatchOrderList, options);
      this.tableData = data || {};
    },
    // 重置
    onReset() {
      Object.keys(this.tableOptions).forEach(key => {
        this.tableOptions[key] = '';
      });
      this.tableOptions.timeType = '1';
      this.initDatetime();
    }
  }
};
</script>
