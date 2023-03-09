<template>
  <div class="company-search-page toolbar-item">
    <span class="item-label">企业名称</span>
    <el-input v-model.trim="companyName" :maxlength="20" placeholder="请输入企业名称" @focus="handleCompany"></el-input>
    <el-button icon="el-icon-close" @click="handleCompanyClose"></el-button>

    <el-dialog title="选择查询企业" :visible.sync="companyVisible">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入企业名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">企业编码</span>
          <el-input
            v-model.trim="tableOptions.companyCode"
            placeholder="请输入企业编码(多个用,隔开)"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" ref="companyTable" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column prop="companyCode" label="企业编码"></el-table-column>
        <el-table-column prop="companyName" label="企业名称"></el-table-column>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleCompanyConfirm" :disabled="selectData.length === 0">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  mixins: [listMixin],
  data: function () {
    return {
      pageSize: 10,
      companyName: '',
      companyVisible: false,
      selectData: [],
      tableOptions: {
        companyCode: '',
        companyName: ''
      },
      tableData: { data: [], total: 0 }
    };
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
      let res = await axios.post(api.getCompanyList, options);
      this.tableData = res.data;
    },
    //点击企业名称搜索
    handleCompany() {
      this.companyVisible = true;
      // this.tableOptions.companyCode = '';
      // this.tableOptions.companyName = '';
      // this.tableData.data = [];
      // this.tableData.total = 0;
    },

    //点击企业名称关闭
    handleCompanyClose() {
      if (this.companyName) {
        this.$refs.companyTable.clearSelection();
        this.companyName = '';
        this.tableOptions.companyCode = '';
        this.tableOptions.companyName = '';
        this.tableData.data = [];
        this.tableData.total = 0;
        this.$emit('company', '');
      }
    },

    // 点击dialog企业名称确定
    handleCompanyConfirm() {
      this.companyVisible = false;
      let tempArr = [];
      this.selectData.map(item => tempArr.push(item.companyName));
      this.companyName = tempArr.join(',');
      this.$emit('company', this.selectData);
    },

    handleClose() {
      this.companyVisible = false;
      if (this.companyName) {
        this.$refs.companyTable.clearSelection();
      }
      this.tableOptions = { companyCode: '', companyName: '' };
    },

    //点击多选，获取所选数据
    handleSelectionChange(val) {
      this.selectData = val;
    },
    //点击重置按钮
    handleReset() {
      this.tableOptions = { companyCode: '', companyName: '' };
      this.handleSearch();
    }
  }
};
</script>
<style lang='postcss'>
.company-search-page {
  .el-pagination__editor.el-input {
    width: 50px !important;
  }
  .el-dialog {
    max-height: 700px;
    overflow: auto;
  }
}
</style>
