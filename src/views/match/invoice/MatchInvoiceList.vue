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
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item" v-has="'match:invoice:list:betchImport'">
          <fe-upload
            listType="text"
            :showFileList="false"
            :limit="1000"
            :allowType="['xml', 'json']"
            @success="importSuccess"
          >
            <template slot="uploadBtn">
              <el-button type="primary">批量导入</el-button>
            </template>
          </fe-upload>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleMaintain('sum')" v-has="'match:invoice:list:maintainInvoice'"
            >维护发票进度</el-button
          >
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleMaintainExpress" v-has="'match:invoice:list:maintainExpress'"
            >维护快递信息</el-button
          >
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
        <el-table-column label="发票申请流水号" prop="applySerialNo" min-width="130" show-overflow-tooltip>
          <template v-slot="scope">
            <a class="font-default" @click="$router.push(`/match/invoice/detail/${scope.row.orderNo}`)">{{
              scope.row.applySerialNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderNo" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业名称" prop="companyName" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票代码" prop="invoiceCode" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="代开司机姓名"
          prop="disparDriverName"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="代开司机税号"
          prop="disparDriverTaxNo"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="发票类型" prop="invoiceType" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票方式" prop="invoceWay" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票种类" prop="invoiceKind" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="发票样式" prop="invoiceStyle" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品名称" prop="goodsName" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票状态" prop="invoiceStatus" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="快递方式" prop="expressCode" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票抬头" prop="invoiceHead" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="开票单位" prop="invoiceCompany" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际开票金额（元）" prop="actualPrice" min-width="130" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-orange">{{ scope.row.actualPrice | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="开票数量"
          prop="invoiceQuantity"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
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
        <el-table-column label="操作" min-width="120" prop="handle" fixed="right">
          <template v-slot="scope">
            <el-button type="text" @click="handleMaintain('single', scope.row)">维护发票进度</el-button>
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

      <el-dialog
        title="维护快递信息"
        :visible.sync="dialogAddVisable"
        center
        width="500px"
        @close="onDialogClose"
        destroy-on-close
      >
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="150px">
          <el-form-item label="快递方式" prop="expressValue">
            <el-select
              filterable
              clearable
              v-model="formAdd.expressValue"
              placeholder="请选择快递方式"
              style="width: 220px"
            >
              <el-option
                v-for="data in dictData.expressTypeEnum"
                :key="data.value"
                :label="data.label"
                :value="data.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="expressNo">
            <el-input
              v-model.trim="formAdd.expressNo"
              placeholder="请输入快递单号"
              maxlength="50"
              style="width: 220px"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSave" type="primary">确定</el-button>
          <el-button @click="onDialogClose">关闭</el-button>
        </div>
      </el-dialog>
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
  name: 'MatchInvoiceList',
  mixins: [listMixin],
  data() {
    return {
      dictData: {
        invoiceStatusEnum: [],
        expressTypeEnum: []
      },
      pageSize: 20,
      createTimeRange: [],
      tableOptions: {
        applySerialNo: '',
        companyName: '',
        invoiceStatus: '',
        startTime: '',
        endTime: ''
      },
      tableData: {
        data: [],
        total: 0
      },
      selectData: [],

      dialogAddVisable: false,
      formAdd: { expressValue: '', expressNo: '' },
      rules: {
        expressValue: [{ required: true, message: '请选择快递方式' }],
        expressNo: [{ required: true, message: '请输入快递单号' }]
      }
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
      this.dictData.expressTypeEnum = await utils.getSysDict('matchmaking_express_type', true);
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
      let { data } = await axios.post(api.queryMatchInvoicePage, options);
      if (data && data.data) {
        this.tableData.data = data.data || [];
        this.tableData.total = data.total || 0;
      } else {
        this.tableData.data = [];
        this.tableData.total = 0;
      }
    },
    //点击多选，获取所选数据
    handleSelectionChange(val) {
      this.selectData = val;
    },
    // 导入成功回调
    async importSuccess(file) {
      await axios.post(api.matchInvoiceImport, { fileUrl: file.resUrl });
      this.$message.success('导入成功');
      this.handleSearch();
    },
    handleMaintain(type, row) {
      let orderNos = [];
      if (type === 'sum') {
        if (!this.selectData.length) {
          this.$message.warning('请先选择数据');
          return;
        }
        orderNos = this.selectData.map(el => el.orderNo);
      } else if (type === 'single' && row && row.orderNo) {
        orderNos = [row.orderNo];
      }
      sessionStorage.setItem('orderNos', JSON.stringify(orderNos));
      this.$router.push(`/match/invoice/maintain`);
    },
    // 维护快递信息
    handleMaintainExpress() {
      if (!this.selectData.length) {
        this.$message.warning('请先选择数据');
        return;
      }
      this.dialogAddVisable = true;
    },
    // 维护快递信息 - 保存
    async handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          let orderNos = this.selectData.map(el => el.orderNo);
          await axios.post(api.matchMaintenanceExpress, { ...this.formAdd, orderNos });
          this.$message.success('操作成功');
          this.dialogAddVisable = false;
          this.$refs.tableRef.clearSelection();
          this.handleSearch();
        }
      });
    },
    onDialogClose() {
      this.$refs.formAdd.resetFields();
      this.dialogAddVisable = false;
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
