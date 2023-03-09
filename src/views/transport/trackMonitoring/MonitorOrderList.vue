<template>
  <layout navActive="transport">
    <div class="monitor-order-page">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="companySearch" />
        <div class="toolbar-item">
          <span class="item-label">运单编号</span>
          <el-input v-model.trim="orderNumber" placeholder="请输入(多个用,或换行隔开)" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">运单状态</span>
          <el-select
            v-model="tableOptions.orderStateList"
            multiple
            collapse-tags
            clearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, idx) in dictData.orderStatus"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机电话</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.driverMobile"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车牌号</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.plateNumber"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">线路</span>
          <el-input
            style="width: 90px"
            v-model.trim="tableOptions.loadAddress"
            placeholder="发货地"
            clearable
          ></el-input>
          -
          <el-input
            style="width: 90px"
            v-model.trim="tableOptions.unloadAddress"
            placeholder="卸货地"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">增值服务</span>
          <el-select v-model="tableOptions.valueAddedServicesType" clearable placeholder="请选择" style="width: 200px">
            <el-option
              v-for="(item, idx) in dictData.addedServicesType"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">异常类型</span>
          <el-select
            v-model="tableOptions.abnormalTypeList"
            clearable
            multiple
            collapse-tags
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, idx) in dictData.abnormalTypeOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">处理状态</span>
          <el-select v-model="tableOptions.processingStatus" clearable placeholder="请选择" style="width: 200px">
            <el-option
              v-for="(item, idx) in dictData.handleStatusOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">优先级</span>
          <el-select
            v-model="tableOptions.abnormalLevelList"
            multiple
            collapse-tags
            clearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, idx) in levelList"
              :key="idx"
              :label="item.firstAbnormalLevel"
              :value="item.firstAbnormalLevel"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">下单时间</span>
          <el-date-picker
            v-model="timeRange.orderTimeRange"
            @change="val => onTimeChange(val, 'create')"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">卸货时间</span>
          <el-date-picker
            v-model="timeRange.unloadTimeRange"
            @change="val => onTimeChange(val, 'unload')"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">签收时间</span>
          <el-date-picker
            v-model="timeRange.signTimeRange"
            @change="val => onTimeChange(val, 'signIn')"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">预警时间</span>
          <el-date-picker
            v-model="timeRange.newestWarnTime"
            @change="val => onTimeChange(val, 'newestWarn')"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleExport" :disabled="!tableData.data.length">导出</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border @sort-change="sortChange">
        <el-table-column label="操作" min-width="140" align="center">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleRail(scope.row)">查看轨迹</el-button>
            <el-button
              class="font-default"
              type="text"
              v-if="scope.row.subscribeStatus == 0"
              @click="handleAppointment(scope.row)"
              >预约</el-button
            >
            <el-button
              class="font-default"
              type="text"
              v-if="scope.row.subscribeStatus == 1"
              @click="cancelReserveHand(scope.row)"
              >取消预约</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="异常类型" align="center" min-width="150">
          <template v-slot="scope">
            <div class="abnormal-types">
              <span
                v-for="(item, idx) in scope.row.abnormalTypeList || []"
                :key="idx"
                :class="`abnormal-tag abnormal-tag-id${item.value}`"
                >{{ item.desc }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常等级" align="center" prop="abnormalLevelDesc" min-width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="当前操作人" align="center" prop="currentHandler" min-width="140"> </el-table-column>
        <el-table-column label="处理状态" align="center" prop="processingStatusDesc" min-width="100"></el-table-column>
        <el-table-column
          label="运单状态"
          align="center"
          min-width="130"
          prop="orderStateDesc"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="运单号" align="center" min-width="140">
          <template v-slot="scope">
            <span @click="handleOrderDtl(scope.row)" class="font-default pointer">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称"
          align="center"
          prop="companyName"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="司机车牌号" align="center" prop="plateNumber" min-width="100"></el-table-column>
        <el-table-column label="司机姓名" align="center" prop="driverName"></el-table-column>
        <el-table-column label="司机电话" align="center" prop="driverMobile" min-width="100"></el-table-column>
        <el-table-column
          label="装货地址名称"
          align="center"
          prop="loadAddress"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="卸货地址名称"
          align="center"
          prop="unloadAddress"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="下单时间"
          align="center"
          prop="createTime"
          sortable="custom"
          min-width="140"
        ></el-table-column>
        <el-table-column
          label="卸货时间"
          align="center"
          prop="unloadTime"
          sortable="custom"
          min-width="140"
        ></el-table-column>
        <el-table-column
          label="签收时间"
          align="center"
          prop="signInTime"
          sortable="custom"
          min-width="140"
        ></el-table-column>
        <el-table-column label="最新预警时间" align="center" prop="newestWarnTime" sortable="custom" min-width="140">
        </el-table-column>
        <el-table-column label="最新处理时间" align="center" prop="latestProcessingTime" min-width="140">
        </el-table-column>
        <el-table-column label="最新处理人" align="center" prop="latestProcessingPeople" min-width="140">
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

      <appointment-hand ref="appointmentHandRef" @appointFinish="handleSearchCustom"></appointment-hand>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import CompanySearch from '@/components/CompanySearch.vue';
import AppointmentHand from './components/AppointmentHand';

export default {
  name: 'MonitorOrderList',
  mixins: [listMixin],
  components: { CompanySearch, AppointmentHand },
  data() {
    return {
      pageSize: 20,
      // 字典数据
      dictData: {
        abnormalTypeOptions: [],
        addedServicesType: [],
        orderStatus: [],
        handleStatusOptions: []
      },
      // 时间选择框
      timeRange: {
        orderTimeRange: [],
        unloadTimeRange: [],
        signTimeRange: [],
        newestWarnTime: []
      },
      orderNumber: '',
      // 筛选项
      tableOptions: {
        companyCodeList: [], // 企业编号
        orderNumberList: [], // 运单编号
        orderStateList: [], // 运单状态
        driverMobile: '',
        plateNumber: '',
        loadAddress: '',
        unloadAddress: '',
        valueAddedServicesType: null, // 增值服务
        abnormalTypeList: [], // 异常类型
        processingStatus: null, // 处理状态
        createTimeStart: null,
        createTimeEnd: null,
        unloadTimeStart: null,
        unloadTimeEnd: null,
        signInTimeStart: null,
        signInTimeEnd: null,
        newestWarnTimeStart: null,
        newestWarnTimeEnd: null,
        orderBy: null, // 排序字段 1下单时间 2卸货时间 3签收时间 4最新预警时间
        sortType: 0, // 排序规则 0降序 1升序 默认0
        abnormalLevelList: [] // 优先级
      },
      tableData: {
        data: [],
        total: 0
      },
      levelList: []
    };
  },
  created() {
    this.getSysDict();
    this.getLevelData();
    this.handleSearch();
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '监控运单列表' }]);
  },
  methods: {
    // 获取字典
    async getSysDict() {
      let abnormalTypeOptions = await utils.getSysDict('abnormal_type', true);
      let addedServicesType = await utils.getSysDict('value_added_services_type', true);
      let orderStatus = await utils.getSysDict('es_order_state', true);
      let processingStatus = await utils.getSysDict('processing_status', true);
      this.dictData.abnormalTypeOptions = abnormalTypeOptions;
      this.dictData.addedServicesType = addedServicesType;
      this.dictData.orderStatus = orderStatus;
      this.dictData.handleStatusOptions = processingStatus;
    },
    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.companyCodeList = [];
      if (val && val.length) {
        val.forEach(item => this.tableOptions.companyCodeList.push(item.actualCompanyCode));
      }
      this.handleSearch();
    },
    // 选择时间范围回调
    onTimeChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions[`${type}TimeStart`] = new Date(val[0]).getTime();
        this.tableOptions[`${type}TimeEnd`] = new Date(val[1]).getTime();
      } else {
        this.tableOptions[`${type}TimeStart`] = null;
        this.tableOptions[`${type}TimeEnd`] = null;
      }
    },
    async fetchData(opts) {
      this.tableOptions.orderNumberList = utils.batchSearchFilter(this.orderNumber);
      if (this.tableOptions.orderNumberList.length > 1000) {
        this.$message.warning('查询运单数不能超过1000条');
      } else {
        const options = { pageNum: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        let res = await axios.post(api.orderMonitorList, options);
        if (res.data) this.tableData = res.data;
      }
    },
    // 排序
    sortChange({ prop, order }) {
      this.tableOptions.orderBy = this.getOrderByNum(prop);
      this.tableOptions.sortType = order === 'descending' ? 0 : 1; // 降序0 升序1
      this.handleSearch();
    },
    getOrderByNum(prop) {
      // 排序字段 1下单时间 2卸货时间 3签收时间 4最新预警时间
      switch (prop) {
        case 'createTime':
          return 1;
        case 'unloadTime':
          return 2;
        case 'signInTime':
          return 3;
        case 'newestWarnTime':
          return 4;
        default:
          return null;
      }
    },
    // 导出
    async handleExport() {
      await axios.post(api.orderMonitorExport, { ...this.tableOptions });
      this.$message.success('添加导出任务成功，请在个人中心-下载列表查看');
    },
    // 重置
    onReset() {
      this.tableOptions = {
        companyCodeList: [], // 企业编号
        orderNumberList: [], // 运单编号
        orderStateList: [], // 运单状态
        driverMobile: '',
        plateNumber: '',
        loadAddress: '',
        unloadAddress: '',
        valueAddedServicesType: '', // 增值服务
        abnormalTypeList: [], // 异常类型
        createTimeStart: null,
        createTimeEnd: null,
        unloadTimeStart: null,
        unloadTimeEnd: null,
        signInTimeStart: null,
        signInTimeEnd: null,
        newestWarnTimeStart: null,
        newestWarnTimeEnd: null,
        orderBy: null, // 排序字段 1下单时间 2卸货时间 3签收时间 4最新预警时间
        sortType: 0, // 排序规则 0降序 1升序 默认0
        abnormalLevelList: []
      };
      Object.keys(this.timeRange).forEach(key => {
        this.timeRange[key] = [];
      });
      this.orderNumber = '';
      this.$refs.companySearch.handleCompanyClose();
      this.$refs.companySearch.handleClose();
    },
    // 运单详情
    handleOrderDtl(row) {
      this.$router.push(`/monitor/order/detail/${row.orderNumber}/${row.companyCode}`);
    },
    // 查看轨迹详情
    handleRail(row) {
      axios.post(api.handlerEnters, { orderNumber: row.orderNumber });
      this.$router.push(`/rail/exception/detail/${row.orderNumber}/${row.companyCode}`);
    },
    // 预约
    handleAppointment(item) {
      this.$refs.appointmentHandRef.openDialog(item.orderNumber);
    },
    // 取消预约
    cancelReserveHand(row) {
      this.$confirm(`确定取消预约 ？`, '取消预约', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.cancelAbnormalReserveHandling, {
            orderNumber: row.orderNumber
          });
          this.handleSearchCustom();
        })
        .catch(() => {});
    },
    handleSearchCustom() {
      setTimeout(() => {
        this.handleSearch();
      }, 1100);
    },
    async getLevelData() {
      let res = await axios.post(api.dropDownBoxAbnormalLevel);
      this.levelList = res.data || [];
    }
  }
};
</script>
<style lang="postcss" scoped>
.monitor-order-page {
  .abnormal-types {
    display: flex;
    flex-wrap: wrap;
    .abnormal-tag {
      line-height: 22px;
      padding: 0 4px;
      margin: 3px;
      border-radius: 5px;
      border: 1px solid #fdf1e8;
      color: #fff;
      background-color: #ccc;
      &.abnormal-tag-id1 {
        border: 1px solid #fdf1e8;
        background-color: #f9dcc9;
        color: #ff6600;
      }
      &.abnormal-tag-id2 {
        border: 1px solid #fdf1e8;
        background-color: #d4372c;
        color: #fff;
      }
      &.abnormal-tag-id4 {
        border: 1px solid #fdf1e8;
        background-color: #fdf6ec;
        color: #ff9900;
      }
      &.abnormal-tag-id8 {
        border: 1px solid #d9ebff;
        background-color: #ecf5ff;
        color: #3399ff;
      }
      &.abnormal-tag-id32 {
        border: 1px solid #d9ebff;
        background-color: #000;
        color: #fff;
      }
      &.abnormal-tag-id128 {
        border: 1px solid #d9ebff;
        background-color: #ffa66b;
        color: #fff;
      }
      &.abnormal-tag-id512 {
        border: 1px solid #d9ebff;
        background-color: #4c4c4c;
        color: #fff;
      }
    }
  }
}
</style>
