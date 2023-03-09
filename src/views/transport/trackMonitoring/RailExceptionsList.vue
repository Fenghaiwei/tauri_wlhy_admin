<template>
  <layout navActive="transport">
    <div class="rail-exception-page">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="companySearch" />
        <div class="toolbar-item">
          <span class="item-label">下单时间</span>
          <el-date-picker
            v-model="createTimeRange"
            @change="onTimeChange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.driverName"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">手机号码</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.driverMobile"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车牌号码</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.plateNumber"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">异常类型</span>
          <el-select
            v-model="tableOptions.abnormalTypeList"
            multiple
            collapse-tags
            clearable
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
          <span class="item-label">装货地址</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.loadAddress"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">卸货地址</span>
          <el-input
            style="width: 200px"
            v-model.trim="tableOptions.unloadAddress"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">运输模式</span>
          <el-select v-model="tableOptions.transportationModel" clearable placeholder="请选择" style="width: 200px">
            <el-option
              v-for="(item, idx) in dictData.transportationModelOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">运单编号</span>
          <el-input
            style="width: 200px"
            v-model.trim="orderNumber"
            placeholder="请输入(多个用,隔开)"
            clearable
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="onSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-dropdown trigger="click">
            <el-button type="primary" :disabled="!tableData.data.length">导出 </el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="handleExport(1)">全部</el-dropdown-item> -->
              <el-dropdown-item @click.native="handleExport(1)">运单明细</el-dropdown-item>
              <el-dropdown-item @click.native="handleExport(2)">异常明细</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="操作" min-width="90" align="center">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleRail(scope.row)">查看轨迹</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称"
          align="center"
          prop="companyName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="运单号" align="center" min-width="150">
          <template v-slot="scope">
            <span @click="handleOrderDtl(scope.row)" class="font-default pointer">{{ scope.row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="异常次数" align="center" prop="abnormalCount"></el-table-column>
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
        <el-table-column label="车牌号" align="center" prop="plateNumber"></el-table-column>
        <el-table-column label="司机姓名" align="center" prop="driverName"></el-table-column>
        <el-table-column label="手机号码" align="center" prop="driverMobile" min-width="100"></el-table-column>
        <el-table-column
          label="装货地址"
          align="center"
          prop="loadAddress"
          show-overflow-tooltip
          min-width="130"
        ></el-table-column>
        <el-table-column
          label="卸货地址"
          align="center"
          prop="unloadAddress"
          show-overflow-tooltip
          min-width="130"
        ></el-table-column>
        <el-table-column label="装货签到时间" align="center" prop="loadTime" min-width="140"></el-table-column>
        <el-table-column label="卸货签到时间" align="center" prop="unloadTime" min-width="140"></el-table-column>
        <el-table-column label="在途时长" align="center" prop="onTheWayTime"></el-table-column>
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
import CompanySearch from '@/components/CompanySearch.vue';
export default {
  name: 'RailExceptionsList',
  mixins: [listMixin],
  components: { CompanySearch },
  data() {
    return {
      pageSize: 20,
      orderNumber: '',
      // 字典数据
      dictData: {
        abnormalTypeOptions: [], // 异常类型
        transportationModelOptions: [
          {
            value: 0,
            label: '全部运单'
          },
          {
            value: 1,
            label: '普通运单'
          },
          {
            value: 2,
            label: '任务单'
          }
        ]
      },
      // 时间选择框
      createTimeRange: [],
      // 筛选项
      tableOptions: {
        companyCodeList: [],
        createTimeStart: null,
        createTimeEnd: null,
        transportationModel: 0, // 运单类型
        driverName: '',
        driverMobile: '',
        plateNumber: '',
        abnormalTypeList: [],
        loadAddress: '',
        unloadAddress: '',
        orderNumberList: []
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '轨迹异常列表' }]);
    this.getSysDict();
  },
  methods: {
    // 获取字典
    async getSysDict() {
      let abnormalTypeOptions = await utils.getSysDict('abnormal_type', true);
      this.dictData.abnormalTypeOptions = abnormalTypeOptions;
    },
    onSearch() {
      this.tableOptions.orderNumberList = this.orderNumber ? this.orderNumber.split(',') : [];
      let { companyCodeList, createTimeStart, createTimeEnd, driverMobile, plateNumber, orderNumberList } =
        this.tableOptions;
      if (
        !companyCodeList.length &&
        !createTimeStart &&
        !createTimeEnd &&
        !driverMobile &&
        !plateNumber &&
        !orderNumberList.length
      ) {
        this.$message.warning('企业名称、下单时间、司机手机号、车牌号、运单号最少选择一个做为筛选项');
      } else {
        this.handleSearch();
      }
    },
    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.companyCodeList = [];
      if (val && val.length) {
        val.forEach(item => this.tableOptions.companyCodeList.push(item.actualCompanyCode));
        this.handleSearch();
      }
    },
    // 选择时间范围回调
    onTimeChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.createTimeStart = new Date(val[0]).getTime();
        this.tableOptions.createTimeEnd = new Date(val[1]).getTime();
      } else {
        this.tableOptions.createTimeStart = null;
        this.tableOptions.createTimeEnd = null;
      }
    },
    async fetchData(opts) {
      this.tableOptions.orderNumberList = this.orderNumber ? this.orderNumber.split(',') : [];
      if (this.tableOptions.orderNumberList.length > 1000) {
        this.$message.warning('查询运单数不能超过1000条');
      } else {
        const options = { pageNum: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
        let res = await axios.post(api.orderAbnormalList, options);
        if (res.data) this.tableData = res.data;
      }
    },
    // 导出
    async handleExport(type) {
      await axios.post(api.orderAbnormalExport, { ...this.tableOptions, exportType: type });
      this.$message.success('添加导出任务成功，请在个人中心-下载列表查看');
    },
    // 重置
    onReset() {
      this.tableOptions = {
        companyCodeList: [],
        createTimeStart: null,
        createTimeEnd: null,
        transportationModel: 0, // 运单类型
        driverName: '',
        driverMobile: '',
        plateNumber: '',
        abnormalTypeList: [],
        loadAddress: '',
        unloadAddress: '',
        orderNumberList: []
      };
      this.orderNumber = '';
      this.createTimeRange = [];
      this.$refs.companySearch.handleCompanyClose();
      this.$refs.companySearch.handleClose();
    },
    // 运单详情
    handleOrderDtl(row) {
      this.$router.push(`/monitor/order/detail/${row.orderNumber}/${row.companyCode}`);
    },
    // 查看轨迹详情
    handleRail(row) {
      this.$router.push(`/rail/exception/detail/${row.orderNumber}/${row.companyCode}`);
    }
  }
};
</script>
<style lang="postcss" scoped>
.rail-exception-page {
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
