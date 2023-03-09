<template>
  <layout navActive="config">
    <div class="etc-company-page">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="CompanySearch" />

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:etc:company:add'">添加</el-button>
          <el-button
            type="primary"
            @click="onDel"
            :disabled="multiselectList.length === 0"
            v-has="'config:etc:company:del'"
            >删除</el-button
          >
        </div>
      </div>
      <el-table :data="tableData.data" border @selection-change="multiselect" ref="multipleTable">
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="企业编码" prop="companyCode" align="center"> </el-table-column>
        <el-table-column label="企业名称" prop="companyName" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="createrUserName" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
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

      <el-dialog title="" :visible.sync="addEtcCompany" custom-class="add-etc-dialog" :close-on-click-modal="false">
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">企业名称</span>
            <el-input v-model.trim="addEtcCompanyOptions.companyName" clearable placeholder="请输入企业名称"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">企业编码</span>
            <el-input v-model.trim="addEtcCompanyOptions.companyCode" clearable placeholder="请输入企业编码"></el-input>
          </div>

          <div class="toolbar-item">
            <el-button type="primary" @click="handleAddSearch">筛选</el-button>
          </div>
        </div>
        <el-table
          :data="etcCompanyData.data"
          border
          @selection-change="multiselectEtc"
          ref="multipleTable"
          :max-height="600"
        >
          <el-table-column type="selection" width="40" :selectable="isSelect"> </el-table-column>
          <el-table-column prop="companyCode" label="企业编码"></el-table-column>
          <el-table-column prop="companyName" label="企业名称"></el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="etcCompanyPage"
            :total="etcCompanyData.total"
            @current-change="handleEtcChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="multiselectEtcCompany.length === 0">确定</el-button>
          <el-button @click="addEtcCompany = false">关闭</el-button>
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
import CompanySearch from '@/components/CompanySearch.vue';
export default {
  name: 'EtcCompany',
  mixins: [listMixin],
  components: {
    CompanySearch
  },
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyCodeList: [] },
      tableData: {},
      multiselectList: [],
      addEtcCompany: false,
      addEtcCompanyOptions: {
        companyCode: '',
        companyName: ''
      },
      etcCompanyData: {
        data: [],
        total: 0
      },
      etcCompanyPage: 1,
      multiselectEtcCompany: []
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '企业黑名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.etcCompanyBlackList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { companyCodeList: [] };
      this.$refs.CompanySearch.handleCompanyClose();
    },
    isSelect(row, index) {
      if (!row.blackListFlag) {
        return 1;
      } else {
        return 0;
      }
    },
    onAdd() {
      this.addEtcCompanyOptions.companyCode = '';
      this.addEtcCompanyOptions.companyName = '';
      this.addEtcCompany = true;
      this.getEtcCompanyList();
    },
    handleAddSearch() {
      this.etcCompanyPage = 1;
      this.getEtcCompanyList();
    },
    multiselect(val) {
      this.multiselectList = val;
    },
    multiselectEtc(val) {
      this.multiselectEtcCompany = val;
    },
    handleEtcChange(val) {
      this.etcCompanyPage = val;
      this.getEtcCompanyList();
    },
    async getEtcCompanyList() {
      const options = { pageNum: this.etcCompanyPage, pageSize: this.pageSize, ...this.addEtcCompanyOptions };
      let res = await axios.post(api.companyBlackList, options);
      this.etcCompanyData = res.data;
    },
    async onDel() {
      this.$confirm(`移除黑名单后，该企业产生的运单将会自动开具ETC发票。是否确认移除？`, '确定删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let idList = this.multiselectList.map(el => el.id);
          let res = await axios.post(api.etcCompanyBlackDelete, { idList });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleSave() {
      const companyCodeList = this.multiselectEtcCompany.map(el => el.companyCode);
      let res = await axios.post(api.etcCompanyBlackAdd, { companyCodeList });
      this.addEtcCompany = false;
      this.handleSearch();
    },
    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.companyCodeList = [];
      if (val && val.length) {
        val.map(item => this.tableOptions.companyCodeList.push(item.companyCode));
        this.handleSearch();
      }
    }
  }
};
</script>
<style lang="postcss">
.etc-company-page {
  .add-etc-vehicle {
    display: flex;
    span {
      margin-top: 10px;
      width: 120px;
    }
  }
  .add-vehicle-dec {
    margin: 10px 0 0 40px;
  }
  .add-etc-dialog {
    width: 800px;
  }
}
</style>
