<template>
  <layout navActive="product">
    <div class="unsigned-import-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">运单查询</span>
          <el-input
            placeholder="请输入运单"
            style="width: 260px"
            v-model.trim="tableOptions.orderNumber"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">状态查询</span>
          <el-select v-model="tableOptions.sendState" clearable placeholder="请选择状态" style="width: 200px">
            <el-option
              v-for="(item, idx) in sendStateOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">操作时间</span>
          <el-date-picker
            clearable
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="[' 00:00:00', '23:59:59']"
          ></el-date-picker>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch">筛选</el-button>
          <el-button size="small" @click="handleResetSearch">重置</el-button>
          <el-button type="primary" size="small" @click="onAdd">添加</el-button>
          <el-button type="primary" size="small" @click="handleRetry" :disabled="tableData.total === 0">重试</el-button>
          <el-button type="primary" size="small" @click="handleExport" :disabled="tableData.total === 0"
            >导出</el-button
          >
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="运单号" prop="orderNumber" align="center"> </el-table-column>
        <el-table-column label="承运公司" prop="carrierCompanyName" align="center"> </el-table-column>
        <el-table-column label="状态" prop="sendStateStr" align="center"> </el-table-column>
        <el-table-column label="原因" prop="failReason" align="center"> </el-table-column>
        <el-table-column label="操作人" prop="operaterUsername" align="center"> </el-table-column>
        <el-table-column label="操作时间" prop="operationTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.operationTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
        title="添加运单操作"
        :visible.sync="addOrderVisible"
        custom-class="tip-dialog"
        :close-on-click-modal="false"
      >
        <div class="add-order-input">
          <span>添加运单：</span>
          <el-input
            v-model.trim="orderData"
            type="textarea"
            :rows="5"
            placeholder="支持批量添加，信息用'，'或换行隔开；每次最多添加1000条运单"
          />
        </div>
        <div class="add-order-desc font-red">注：运单范围：1.货保业务运单 2.资金已完结 3.可开票运单</div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!orderData">确定</el-button>
          <el-button @click="addOrderVisible = false">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="" :visible.sync="addResultDia" custom-class="tip-dialog" :close-on-click-modal="false">
        <div class="add-order-input">
          <p>{{ addResultTip }}</p>
        </div>
        <div slot="footer">
          <el-button @click="addResultDia = false" type="primary">确定</el-button>
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
export default {
  mixins: [listMixin],
  name: 'UnsignedInport',
  data() {
    return {
      pageSize: 10,
      tableOptions: { orderNumber: '', sendState: '', startTime: null, endTime: null },
      tableData: { data: [], total: 0 },
      sendStateOptions: [],
      addOrderVisible: false,
      orderData: '',
      addResultDia: false,
      addResultTip: '',
      createTimeRange: []
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '数据导入' }]);
    this.getSysDictData();
    this.handleSearch();
  },
  methods: {
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = null;
        this.tableOptions.endTime = null;
      }
    },
    // 获取字典
    async getSysDictData() {
      this.sendStateOptions = await utils.getSysDict('unmanaged_send_state', true);
    },
    async fetchData(opts) {
      const options = {
        pageNum: this.page,
        pageSize: this.pageSize,
        ...this.sendOptions,
        ...opts
      };
      let res = await axios.post(api.unmanagedOrderList, options);
      this.tableData = res.data;
    },
    handleResetSearch() {
      this.tableOptions.orderNumber = '';
      this.tableOptions.sendState = '';
      this.tableOptions.startTime = null;
      this.tableOptions.endTime = null;
      this.createTimeRange = [];
    },
    onAdd() {
      this.orderData = '';
      this.addOrderVisible = true;
    },
    async handleSave() {
      const orderList = utils.batchSearchFilter(this.orderData);
      if (orderList.length > 1000) {
        this.$message.error('每次最多添加1000条运单');
        return;
      }
      let res = await axios.post(api.unmanagedOrderAdd, { orderList });
      this.addOrderVisible = false;
      this.handleSearch();
      // 如果res.data有值，则需要弹出错误展示
      if (res.data) {
        this.addResultTip = res.data;
        this.addResultDia = true;
      } else {
        this.$message.success('操作成功');
      }
    },
    async handleRetry() {
      await axios.post(api.unmanagedOrderRetry);
      this.$message.success('操作成功');
      this.handleSearch();
    },
    async handleExport() {
      await axios.post(api.unmanagedOrderExport, { ...this.sendOptions });
      this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
    }
  }
};
</script>

<style lang="postcss">
.unsigned-import-page {
  .el-dialog__body {
    text-align: center;
  }
  .add-order-input {
    display: flex;
    span {
      margin-top: 10px;
      width: 120px;
    }
  }
  .add-order-desc {
    margin: 15px 0 0 20px;
    line-height: 24px;
    text-align: left;
  }
  .tip-dialog {
    width: 530px;
  }
}
</style>
