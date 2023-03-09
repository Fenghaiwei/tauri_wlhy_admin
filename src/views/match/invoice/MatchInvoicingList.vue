<template>
  <layout navActive="match">
    <div>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label pr-0">
            <el-select
              filterable
              v-model="tableOptions.openInvoiceType"
              placeholder="请选择"
              class="pr-0"
              style="width: 130px"
            >
              <el-option
                v-for="data in dictData.openInvoiceTypeEnum"
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
          <span class="item-label">发票流水号</span>
          <el-input
            v-model.trim="tableOptions.applySerialNo"
            placeholder="请输入发票流水号"
            clearable
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">订单号</span>
          <el-input
            v-model.trim="tableOptions.matchmakingOrderNo"
            placeholder="请输入订单号"
            clearable
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">发票号码</span>
          <el-input
            v-model.trim="tableOptions.invoiceNo"
            placeholder="请输入发票号码"
            clearable
            maxlength="50"
            @keyup.enter.native="handleSearch"
          ></el-input>
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
          <span class="item-label">开票状态</span>
          <el-select filterable clearable v-model="tableOptions.invoiceStatus" placeholder="请选择开票状态">
            <el-option
              v-for="data in dictData.invoiceStatusEnum"
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
        <el-table-column label="发票申请流水号" prop="applySerialNo" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <a class="font-default" @click="$router.push(`/match/invoicing/detail/${scope.row.orderNo}`)">{{
              scope.row.applySerialNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo" min-width="110" show-overflow-tooltip>
          <template v-slot="scope">
            <a class="font-default" @click="$router.push(`/match/invoicing/detail/${scope.row.orderNo}`)">{{
              scope.row.invoiceNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" prop="companyName" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="会员名称"
          prop="disparDriverName"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="会员纳税人识别号"
          prop="disparDriverTaxNo"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="发票类型" prop="invoiceType" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票方式" prop="invoceWay" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票种类" prop="invoiceKind" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票样式" prop="invoiceStyle" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" prop="goodsName" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票状态" prop="invoiceStatus" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="快递方式" prop="expressCode" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票抬头" prop="invoiceHead" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票单位" prop="invoiceCompany" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际开票金额(元)" prop="actualPrice" min-width="130" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.actualPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票数量" prop="invoiceQuantity" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票运单总数" prop="orderNum" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请开票时间" prop="applyTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.applyTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成开票时间" prop="completeTime" min-width="150" show-overflow-tooltip>
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
  name: 'MatchInvoicingList',
  mixins: [listMixin],
  data() {
    return {
      dictData: {
        openInvoiceTypeEnum: [
          { label: '申请开票日期', value: '1' },
          { label: '完成开票日期', value: '2' }
        ], //时间筛选类型
        invoiceStatusEnum: []
      },
      pageSize: 20,
      createTimeRange: [],
      tableOptions: {
        applyEndTime: '',
        applySerialNo: '',
        applyStartTime: '',
        companyName: '',
        invoiceNo: '',
        invoiceStatus: '',
        matchmakingOrderNo: '',
        openInvoiceType: '1'
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
      this.dictData.invoiceStatusEnum = await utils.getSysDict('matchmaking_open_invoice_type', true);
    },
    initDatetime() {
      // 获取当前日期  前三个月的第一天
      let preMonth = dayjs(utils.getPreMonthDay(dayjs().format('YYYY-MM-DD'), 3))
        .startOf('month')
        .format('YYYY-MM-DD');
      this.tableOptions.applyStartTime = new Date(preMonth).getTime();
      this.tableOptions.applyEndTime = new Date().getTime();
      this.createTimeRange = [this.tableOptions.applyStartTime, this.tableOptions.applyEndTime];
    },
    handleDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.applyStartTime = val[0];
        this.tableOptions.applyEndTime = val[1];
      } else {
        this.tableOptions.applyStartTime = '';
        this.tableOptions.applyEndTime = '';
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let { data } = await axios.post(api.queryMatchOpenInvoicePage, options);
      this.tableData = data || {};
    },

    onReset() {
      Object.keys(this.tableOptions).forEach(key => {
        this.tableOptions[key] = '';
      });
      this.tableOptions.openInvoiceType = '1';
      this.initDatetime();
    }
  }
};
</script>
