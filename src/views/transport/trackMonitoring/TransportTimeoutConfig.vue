<template>
  <layout navActive="transport">
    <div class="transport-timeout-config">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="CompanySearch" />

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearchFn">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="handleBatch" :disabled="multiselectList.length == 0">批量操作</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border @selection-change="multiselect" ref="companyTable" row-key="id">
        <el-table-column type="selection" width="55" reserve-selection align="center" fixed="left"></el-table-column>
        <el-table-column prop="companyName" label="企业名称"> </el-table-column>
        <el-table-column prop="line" label="线路"></el-table-column>
        <el-table-column prop="transTimeout" label="运输超时（h）"></el-table-column>
        <el-table-column prop="upgradeTransTimeout" label="升级策略（h）"></el-table-column>
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

      <el-dialog :visible.sync="timeConfigDialog" title="升级策略" custom-class="tip-dialog">
        <el-form :model="timeConfigForm" ref="timeConfigRef" :rules="rules" label-width="140px">
          <el-form-item label="升级策略（h）：" prop="upgradeTransTimeout">
            <el-input
              v-model.trim="timeConfigForm.upgradeTransTimeout"
              placeholder="请输入升级策略"
              :maxlength="32"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSaveTimeConfig" type="primary">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import CompanySearch from '@/components/CompanySearch.vue';
import { isNumberValid, validatorFn } from '@fe/form-valid';
import { isRangeNumber } from '@fe/validator';
export default {
  name: 'TransportTimeoutConfig',
  mixins: [listMixin],
  components: {
    CompanySearch
  },
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyCodes: [] },
      tableData: { data: [], total: 0 },
      timeConfigDialog: false,
      multiselectList: [],
      timeConfigForm: { upgradeTransTimeout: '' },
      rules: {
        upgradeTransTimeout: [
          { required: true, message: '请输入升级策略' },
          {
            validator: isNumberValid,
            params: [false, 2],
            message: '请输入大于0小于等于9999.99的数字，最大支持2位小数',
            trigger: ['blur', 'change']
          },
          {
            validator: validatorFn(isRangeNumber, 0, 10000, false, false),
            message: '请输入大于0小于等于9999.99的数字，最大支持2位小数',
            trigger: ['blur', 'change']
          }
        ]
      }
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '运输超时配置列表' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.transportTimeoutConfigPage, options);
      this.tableData.data = res.data.data || [];
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = { companyCodes: [] };
      this.$refs.CompanySearch.handleCompanyClose();
    },
    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.companyCodes = [];
      if (val && val.length) {
        val.map(item => this.tableOptions.companyCodes.push(item.actualCompanyCode));
        this.handleSearchFn();
      }
    },
    handleSearchFn() {
      this.$refs.companyTable.clearSelection();
      this.handleSearch();
    },
    multiselect(val) {
      this.multiselectList = val;
    },
    handleBatch() {
      this.$refs['timeConfigRef'] && this.$refs['timeConfigRef'].resetFields();
      this.timeConfigForm.upgradeTransTimeout = '';
      this.timeConfigDialog = true;
    },
    async handleSaveTimeConfig() {
      this.$refs.timeConfigRef.validate(async valid => {
        if (valid) {
          const { upgradeTransTimeout } = this.timeConfigForm;
          let ids = this.multiselectList.map(el => el.id);
          await axios.post(api.transportTimeoutConfigEdit, { ids, upgradeTransTimeout });
          this.timeConfigDialog = false;
          this.handleSearchFn();
        }
      });
    }
  }
};
</script>
<style lang="postcss"></style>
