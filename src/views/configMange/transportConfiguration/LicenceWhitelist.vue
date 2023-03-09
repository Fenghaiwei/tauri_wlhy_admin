<template>
  <layout navActive="config">
    <div class="licence-whitelist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.driverName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机手机号</span>
          <el-input v-model.trim="tableOptions.driverPhone" placeholder="请输入司机手机号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">标签类型</span>
          <el-select
            v-model="tableOptions.labelCodes"
            clearable
            multiple
            collapse-tagsclearable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="(item, idx) in configLabelWhiteDriver"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">创建时间</span>
          <el-date-picker
            :clearable="false"
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
          <span class="item-label">白名单类型</span>
          <el-select
            v-model="tableOptions.whileListType"
            clearable
            placeholder="请选择"
            style="width: 200px"
            @change="handleWhileListTypeChanged"
          >
            <el-option
              v-for="(item, idx) in whileListTypeOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:licence:whitelist:add'">添加</el-button>
          <el-button
            type="primary"
            @click="handleExport"
            v-has="'config:licence:whitelist:export'"
            :disabled="tableData.total == 0"
            >导出</el-button
          >
          <el-button
            type="primary"
            @click="handleDelBatch"
            v-has="'config:licence:whitelist:delbatch'"
            :disabled="multiDriverselect.length === 0"
            >批量移除</el-button
          >
        </div>
      </div>

      <el-table :data="tableData.data" border @selection-change="handleMultiDriverSelect">
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="白名单类型" prop="whileListTypeName" align="center"> </el-table-column>
        <el-table-column label="司机姓名" prop="driverName" align="center"> </el-table-column>
        <el-table-column label="司机手机号" prop="driverPhone" align="center"> </el-table-column>
        <el-table-column label="标签类型" prop="labelName" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="createUser" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createDate | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'config:licence:whitelist:del'"
              >移除</el-button
            >
            <el-button
              class="font-default"
              type="text"
              v-has="'config:licence:whitelist:addlabel'"
              @click="addLabel(scope.row)"
              >添加标签</el-button
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

      <el-dialog title="" :visible.sync="showDriver">
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">司机姓名</span>
            <el-input v-model.trim="addDriverOptions.driverName" clearable placeholder="请输入司机姓名"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">司机手机号</span>
            <el-input v-model.trim="addDriverOptions.driverPhone" clearable placeholder="请输入司机手机号"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">白名单类型</span>
            <el-select v-model="addDriverOptions.whileListType" placeholder="请选择" style="width: 200px">
              <el-option
                v-for="(item, idx) in whileListTypeOptions"
                :key="idx"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="toolbar-item">
            <el-button type="primary" @click="handleAddSearch">筛选</el-button>
          </div>
        </div>
        <el-table :data="driverData.data" border @selection-change="multiselect" ref="multipleTable" :max-height="400">
          <el-table-column type="selection" width="40" :selectable="isSelect"> </el-table-column>
          <el-table-column label="司机姓名" prop="driverName" align="center"> </el-table-column>
          <el-table-column label="司机手机号" prop="driverPhone" align="center"> </el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="driverPage"
            :total="driverData.total"
            @current-change="handleDriverChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="multiselectList.length === 0">确定</el-button>
          <el-button @click="showDriver = false">关闭</el-button>
        </div>
      </el-dialog>

      <!--添加标签s-->
      <el-dialog title="" :visible.sync="showLabel" custom-class="title-box">
        <el-table
          :data="configLabelWhiteDriver"
          border
          :max-height="500"
          @selection-change="handleLabelSelect"
          ref="tableRef"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column label="标签类型" prop="label" header-align="center" align="left"> </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button @click="handleSaveLabel" type="primary" :disabled="labelSelectList.length === 0">确定</el-button>
          <el-button @click="showLabel = false">关闭</el-button>
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
  name: 'LicenceWhitelist',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      createTimeRange: [],
      whileListTypeOptions: [
        { label: '提现', value: 4 },
        { label: '接单', value: 3 }
      ],
      configLabelWhiteDriver: [],
      tableOptions: { driverName: '', driverPhone: '', whileListType: null, startTime: null, endTime: null },
      tableData: {},
      showDriver: false,
      multiDriverselect: [],
      multiselectList: [],
      labelSelectList: [],
      driverData: {
        data: [],
        total: 0
      },
      driverPage: 1,
      addDriverOptions: {
        driverName: '',
        driverPhone: '',
        whileListType: null
      },
      itemNow: {},
      showLabel: false
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '司机白名单' }]);
    this.getSysDict();
    this.handleSearch();
  },
  methods: {
    // 获取字典
    async getSysDict() {
      let configLabelWhiteDriver = await utils.getSysDict('config_label_white_driver', true);
      this.configLabelWhiteDriver = configLabelWhiteDriver;
    },
    handleWhileListTypeChanged(val) {
      if (!val) this.tableOptions.whileListType = null;
    },
    async fetchData(opts) {
      console.log(this.page, opts);
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.twoLicenceWhitelist, options);
      this.tableData = res.data;
    },
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
    onReset() {
      this.tableOptions = { driverName: '', driverPhone: '', whileListType: null, startTime: null, endTime: null };
    },
    onAdd() {
      this.addDriverOptions.driverName = '';
      this.addDriverOptions.driverPhone = '';
      this.addDriverOptions.whileListType = null;
      this.showDriver = true;
      this.handleAddSearch();
    },
    handleAddSearch() {
      this.driverPage = 1;
      this.getDriverList();
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
      this.addDriverOptions.driverName = '';
      this.addDriverOptions.driverPhone = '';
    },
    handleDriverChange(val) {
      this.driverPage = val;
      this.getDriverList();
    },
    async getDriverList() {
      const options = { pageNum: this.driverPage, pageSize: this.pageSize, ...this.addDriverOptions };
      let res = await axios.post(api.driverList, options);
      this.driverData = res.data;
    },
    async handleDel(item) {
      let res = await axios.post(api.twoLicenceWhitelistDelete, { idList: [item.id] });
      this.handleSearch();
    },
    async handleSave() {
      if (!this.addDriverOptions.whileListType) {
        this.$message.error('请选择白名单类型');
        return false;
      }
      let driverList = this.multiselectList.map(el => {
        return {
          driverName: el.driverName,
          userCode: el.userCode
        };
      });
      await axios.post(api.twoLicenceWhitelistAdd, {
        driverList,
        whileListType: this.addDriverOptions.whileListType
      });
      this.showDriver = false;
      this.handleSearch();
    },
    addLabel(item) {
      if (this.$refs.tableRef) this.$refs.tableRef.clearSelection();
      this.itemNow = item;
      this.labelSelectList = [];
      this.showLabel = true;
    },
    handleLabelSelect(val) {
      this.labelSelectList = val;
    },
    async handleSaveLabel() {
      const labelCodes = this.labelSelectList.map(el => el.value);
      await axios.post(api.twoLicenceWhitelistAddLabel, { configId: this.itemNow.id, labelCodes });
      this.showLabel = false;
      this.handleSearch();
    },
    handleMultiDriverSelect(val) {
      this.multiDriverselect = val;
    },
    async handleDelBatch() {
      this.$confirm(`是否操作移除？`, '确定移除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let idList = this.multiDriverselect.map(el => el.id);
          await axios.post(api.twoLicenceWhitelistDelete, { idList });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleExport() {
      let res = await axios.post(api.twoLicenceWhitelistExport, { ...this.tableOptions });
      this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
    }
  }
};
</script>
<style lang="postcss">
.licence-whitelist-page {
  .title-box {
    width: 450px;
  }
}
</style>
