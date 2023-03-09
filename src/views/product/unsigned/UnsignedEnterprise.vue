<template>
  <layout navActive="product">
    <div class="layout-content-list">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="companySearch" />
        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch">筛选</el-button>
          <el-button size="small" @click="handleResetSearch">重置</el-button>
          <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="企业编码" prop="holderCode" align="center"> </el-table-column>
        <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="账号体系" prop="accountName" align="center"> </el-table-column>
        <el-table-column label="操作时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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

    <el-dialog
      title="添加企业配置"
      :visible.sync="formAddVisible"
      custom-class="tip-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="120px">
        <el-form-item label="企业编码" prop="holderCode">
          <el-input v-model.trim="formAdd.holderCode" placeholder="请输入企业编码" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="总账户体系" prop="accountValue">
          <el-select v-model="formAdd.accountValue" placeholder="请选择总账户体系" style="width: 100%">
            <el-option
              v-for="(item, idx) in accountTypeOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleSave" type="primary">确定</el-button>
        <el-button @click="formAddVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
import listMixin from '@/utils/listMixin';
import CompanySearch from '@/components/CompanySearch.vue';
export default {
  name: 'UnsignedEnterprise',
  mixins: [listMixin],
  components: {
    CompanySearch
  },
  data() {
    return {
      pageSize: 20,
      tableOptions: { holderCodeList: [] }, // 企业编号
      tableData: { data: [], total: 0 },
      formAddVisible: false,
      accountTypeOptions: [],
      formAdd: {
        holderCode: '',
        accountValue: ''
      },
      rules: {
        holderCode: [{ required: true, message: '请输入企业编码' }],
        accountValue: [{ required: true, message: '请选择总账户体系' }]
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '企业配置' }]);
    this.handleSearch();
  },
  methods: {
    // 获取字典
    async getSysDictData() {
      this.accountTypeOptions = await utils.getSysDict('account_sign_channel_type', true);
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.unmanagedAccountList, options);
      this.tableData = res.data;
    },
    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.holderCodeList = [];
      if (val && val.length) {
        val.map(item => this.tableOptions.holderCodeList.push(item.companyCode));
        this.handleSearch();
      }
    },
    handleResetSearch() {
      this.tableOptions.holderCodeList = [];
      this.$refs.companySearch.handleCompanyClose();
      this.$refs.companySearch.handleClose();
    },
    async handleAdd() {
      this.$refs['formAdd'] && this.$refs['formAdd'].resetFields();
      await this.getSysDictData();
      this.formAdd.holderCode = '';
      this.formAdd.accountValue = this.accountTypeOptions.length > 0 ? this.accountTypeOptions[0].value : '';
      this.formAddVisible = true;
    },
    handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          let res = await axios.post(api.unmanagedAccountAdd, { ...this.formAdd });
          this.formAddVisible = false;
          this.handleSearch();
        }
      });
    }
  }
};
</script>

<style scoped></style>
