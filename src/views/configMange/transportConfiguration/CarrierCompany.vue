<template>
  <layout navActive="config">
    <div class="carrier-company-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">承运公司名称</span>
          <el-input v-model.trim="tableOptions.carrierName" placeholder="请输入承运公司名称" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:carrier:company:add'">添加</el-button>
        </div>
      </div>
      <div class="toolbar-panel mb-10 font-gray">
        选择限制承运公司，则该承运公司会拦截自有车。自有车拦截，即司机使用车辆的车辆所有人与所接货源的开票主体及其分公司一致，则无法接该货源。
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="承运公司" prop="carrierName" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="createDate" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createDate | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建用户" prop="createUser" align="center"> </el-table-column>
        <el-table-column label="操作" min-width="110" prop="state" align="center" fixed="right">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'config:carrier:company:del'"
              >移除</el-button
            >
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

      <el-dialog title="" :visible.sync="showCarrier">
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">承运公司名称</span>
            <el-input
              v-model.trim="addCarrierOptions.carrierName"
              clearable
              placeholder="请输入承运公司名称"
            ></el-input>
          </div>

          <div class="toolbar-item">
            <el-button type="primary" @click="handleAddSearch">筛选</el-button>
          </div>
        </div>
        <el-table :data="carrierData.data" border @selection-change="multiselect" ref="multipleTable" :max-height="600">
          <el-table-column type="selection" width="40" :selectable="isSelect"> </el-table-column>
          <el-table-column label="承运公司" prop="carrierName" align="center"> </el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="carrierPage"
            :total="carrierData.total"
            @current-change="handleCarrierChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="multiselectList.length === 0">确定</el-button>
          <el-button @click="showCarrier = false">关闭</el-button>
        </div>
      </el-dialog>
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
  name: 'CarrierCompany',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      createTimeRange: [],
      tableOptions: { carrierName: '' },
      tableData: {},
      showCarrier: false,
      multiselectList: [],
      carrierData: {
        data: [],
        total: 0
      },
      carrierPage: 1,
      addCarrierOptions: {
        carrierName: ''
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '自有车接单限制' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.carrierCompanyBlacklist, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { carrierName: '' };
    },
    onAdd() {
      this.showCarrier = true;
      this.addCarrierOptions.carrierName = '';
      this.handleAddSearch();
    },
    handleAddSearch() {
      this.carrierPage = 1;
      this.getCarrierList();
    },
    isSelect(row, index) {
      if (!row.exist) {
        return 1;
      } else {
        return 0;
      }
    },
    multiselect(val) {
      this.multiselectList = val;
    },
    handleCarrierChange(val) {
      this.carrierPage = val;
      this.getCarrierList();
    },
    async getCarrierList() {
      const options = { pageNum: this.carrierPage, pageSize: this.pageSize, ...this.addCarrierOptions };
      let res = await axios.post(api.queryCarrierList, options);
      this.carrierData = res.data;
    },
    async handleDel(item) {
      let res = await axios.post(api.carrierCompanyBlackDelete, { idList: [item.id] });
      this.handleSearch();
    },
    async handleSave() {
      let arr = this.multiselectList.map(el => {
        return {
          carrierCode: el.carrierCode,
          carrierName: el.carrierName
        };
      });
      let res = await axios.post(api.carrierCompanyBlackAdd, [...arr]);
      this.showCarrier = false;
      this.handleSearch();
    }
  }
};
</script>
<style lang="postcss">
.carrier-company-page {
}
</style>
