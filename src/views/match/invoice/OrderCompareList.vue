<template>
  <layout navActive="match">
    <div>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建时间</span>
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
            @keyup.enter.native="search"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机手机号</span>
          <el-input
            v-model.trim="tableOptions.driverMobile"
            placeholder="请输入司机手机号"
            clearable
            maxlength="50"
            @keyup.enter.native="search"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">比对状态</span>
          <el-select filterable clearable v-model="tableOptions.compareStatus" placeholder="请选择比对状态">
            <el-option
              v-for="data in dictData.compareStatusEnum"
              :key="data.value"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item" v-has="'match:order:compare:list:betchExport'">
          <el-dropdown>
            <el-button type="primary">批量导出</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleExport(el.value)"
                v-for="el in dictData.exportTypeEnum"
                :key="el.value"
                >{{ el.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="toolbar-item" v-has="'match:order:compare:list:betchImport'">
          <fe-upload listType="text" :showFileList="false" :limit="9999" :allowType="['json']" @success="importSuccess">
            <template slot="uploadBtn">
              <el-button type="primary">批量导入</el-button>
            </template>
          </fe-upload>
        </div>
      </div>

      <el-table
        :data="tableData.data"
        border
        ref="tableRef"
        @selection-change="handleSelectionChange"
        row-key="orderNo"
      >
        <el-table-column type="selection" width="55" reserve-selection align="center" fixed="left"></el-table-column>
        <el-table-column label="比对状态" prop="compareStatus" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="比对说明" prop="compareExplain" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单号" prop="orderNo" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <a class="font-default" @click="$router.push(`/match/order/compare/detail/${scope.row.orderNo}`)">{{
              scope.row.orderNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" prop="companyName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="司机姓名" prop="driverName" min-width="80" show-overflow-tooltip></el-table-column>
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
        <el-table-column label="实付税金(元)" prop="paidTaxFee" min-width="120" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.paidTaxFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付撮合服务费(元)" prop="matchmakingServiceFee" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.matchmakingServiceFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createdTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.createdTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完结日期" prop="completeTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.completeTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="比对更新日期" prop="compareUpdateTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.compareUpdateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
  name: 'OrderCompareList',
  mixins: [listMixin],
  data() {
    return {
      dictData: {
        compareStatusEnum: [
          { label: '成功', value: '1' },
          { label: '失败', value: '2' },
          { label: '未比对', value: '3' }
        ],
        exportTypeEnum: [
          { label: 'xlsx格式', value: 'xlsx' },
          { label: 'json格式', value: 'json' }
        ] // 导出类型
      },
      pageSize: 20,
      createTimeRange: [],
      tableOptions: {
        companyName: '',
        compareStatus: '',
        driverMobile: '',
        endTime: '',
        startTime: ''
      },
      tableData: {},
      selectData: [] // 多选数据
    };
  },
  created() {
    this.initDatetime();
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/match' }, { title: this.$route.meta.title }]);
    this.handleSearch();
  },
  methods: {
    search() {
      this.$refs.tableRef.clearSelection(); // 清空多选
      this.handleSearch();
    },
    // 日期初始化
    initDatetime() {
      // 获取当前日期  前三个月的第一天
      let preMonth = dayjs(utils.getPreMonthDay(dayjs().format('YYYY-MM-DD'), 3))
        .startOf('month')
        .format('YYYY-MM-DD');
      this.tableOptions.startTime = new Date(preMonth).getTime();
      this.tableOptions.endTime = new Date().getTime();
      this.createTimeRange = [this.tableOptions.startTime, this.tableOptions.endTime];
    },
    handleDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let { data } = await axios.post(api.queryMatchCompareOrderList, options);

      this.tableData = data || {};
    },
    //点击多选，获取所选数据
    handleSelectionChange(val) {
      this.selectData = val;
    },
    // 导入成功回调
    async importSuccess(file) {
      await axios.post(api.queryMatchCompareOrderImport, { fileUrlPrefix: file.resUrl });
      this.$message.success('导入成功');
      this.search();
    },
    // 导出
    async handleExport(type) {
      if (this.selectData && this.selectData.length > 0) {
        let orderNos = this.selectData.map(el => el.orderNo);
        if (type === 'xlsx') {
          await axios.post(api.queryMatchCompareOrderExportXlsx, { orderNos });
          this.$refs.tableRef.clearSelection(); // 清空多选
          this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
        } else if (type === 'json') {
          this.$refs.tableRef.clearSelection(); // 清空多选
          utils.openNewTab(`${api.queryMatchCompareOrderExportJson}?orderNos=${orderNos}`);
        }
      } else {
        this.$message.warning('请先勾选数据，再执行导出');
      }
    },
    // 重置
    onReset() {
      Object.keys(this.tableOptions).forEach(key => {
        this.tableOptions[key] = '';
      });
      this.initDatetime();
    }
  }
};
</script>
