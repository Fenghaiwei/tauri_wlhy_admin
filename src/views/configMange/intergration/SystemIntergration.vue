<template>
  <layout navActive="config">
    <div class="system-intergration-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd">新增企业</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="平台企业" prop="customerCode" align="center"> </el-table-column>
        <el-table-column label="平台企业名称" prop="customerName" align="center"> </el-table-column>
        <el-table-column label="手机号" prop="customerPhone" align="center"> </el-table-column>
        <el-table-column label="关联账号数量" prop="relationCompany" align="center">
          <template v-slot="scope">
            <template>
              <span class="pointer font-green" @click="handleRelation(scope.row)">
                {{ scope.row.relationCompany }}
              </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center" fixed="right">
          <template v-slot="scope">
            <template>
              <el-button type="text" @click="handleLink(scope.row)">关联企业账号</el-button>
              <el-button type="text" @click="handleConfig(scope.row)">订阅管理</el-button>
              <el-button type="text" @click="handleInterface(scope.row)">接口管理</el-button>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleSwitch(scope.row)">
                {{ scope.row.enabled ? '停用' : '启用' }}
              </el-button>
            </template>
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

      <!--新增开票平台-->
      <el-dialog title="添加企业" :visible.sync="dialogAddVisable" custom-class="tip-dialog">
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="130px">
          <el-form-item label="平台企业编码" prop="customerCode">
            <el-input
              v-model.trim="formAdd.customerCode"
              placeholder="请输入平台企业编码"
              maxlength="36"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="平台企业名称" prop="customerName">
            <el-input
              v-model.trim="formAdd.customerName"
              placeholder="请输入平台企业名称"
              maxlength="72"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="customerPhone">
            <el-input
              v-model.trim="formAdd.customerPhone"
              placeholder="请输入手机号"
              maxlength="12"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="App key" prop="appKey">
            <el-input
              v-model.trim="formAdd.appKey"
              placeholder="请输入App key"
              maxlength="64"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="secret key" prop="secretKey">
            <el-input
              v-model.trim="formAdd.secretKey"
              placeholder="请输入secret key"
              maxlength="64"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="App param" prop="appParam">
            <el-input
              v-model.trim="formAdd.appParam"
              placeholder="请输入App param"
              maxlength="256"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSave" type="primary">确定</el-button>
          <el-button @click="dialogAddVisable = false">关闭</el-button>
        </div>
      </el-dialog>

      <!--关联企业-->
      <el-dialog title="关联企业账号" :visible.sync="showDddCompany" :close-on-click-modal="false">
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">企业编码</span>
            <el-input v-model.trim="searchCompanyOptions.holderCode" clearable placeholder="请输入企业编码"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">企业名称</span>
            <el-input v-model.trim="searchCompanyOptions.companyName" clearable placeholder="请输入企业名称"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">社会信用统一代码</span>
            <el-input
              v-model.trim="searchCompanyOptions.licenseCode"
              clearable
              placeholder="请输入社会信用统一代码"
            ></el-input>
          </div>

          <div class="toolbar-item">
            <el-button type="primary" @click="handleSearchCompany">筛选</el-button>
            <el-button @click="handleSaveRelation" type="primary" :disabled="multiselectCompany.length === 0"
              >关联</el-button
            >
          </div>
        </div>
        <el-table
          :data="searchCompanyData.data"
          border
          @selection-change="multiRelation"
          ref="multipleTable"
          :max-height="600"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column prop="holderCode" label="企业编码"></el-table-column>
          <el-table-column prop="companyName" label="企业名称"></el-table-column>
          <el-table-column prop="licenseCode" label="社会信用统一代码"></el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="addCompanyPage"
            :total="searchCompanyData.total"
            @current-change="handleSearchCompanyChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="showDddCompany = false">关闭</el-button>
        </div>
      </el-dialog>

      <!--取消关联-->
      <el-dialog title="关联企业账号" :visible.sync="showRelationCompany" :close-on-click-modal="false">
        <el-table :data="relationCompanyData.data" border ref="multipleTable" :max-height="600">
          <el-table-column prop="holderCode" width="150" label="企业编码"></el-table-column>
          <el-table-column prop="companyName" label="企业名称"></el-table-column>
          <el-table-column prop="licenseCode" label="社会信用统一代码"></el-table-column>
          <el-table-column prop="companyPhone" width="110" label="注册手机号"></el-table-column>
          <el-table-column prop="companyCertifyStatusText" width="110" label="认证状态"></el-table-column>
          <el-table-column prop="createTimeText" label="关联时间"> </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template v-slot="scope">
              <el-button class="font-default" type="text" @click="handleCancelRelation(scope.row)">取消关联</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="relationCompanyPage"
            :total="relationCompanyData.total"
            @current-change="handleRelationCompanyChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="showRelationCompany = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import { isPhoneValid } from '@fe/form-valid';
export default {
  name: 'SystemIntergration',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      id: '',
      showDddCompany: false,
      addCompanyPage: 1,
      multiselectCompany: [],
      searchCompanyOptions: {
        companyName: '',
        holderCode: '',
        licenseCode: ''
      },
      searchCompanyData: {
        data: [],
        total: 0
      },
      relationCompanyPage: 1,
      showRelationCompany: false,
      relationCompanyData: {
        data: [],
        total: 0
      },
      tableData: {
        data: [],
        total: 0
      },
      dialogAddVisable: false,
      formAdd: {
        customerCode: '', // 平台企业编码
        customerName: '', // 平台企业名称
        customerPhone: '', // 手机号
        appKey: '', // appKey
        secretKey: '', // secretKey
        appParam: '' //appParam
      },
      rules: {
        customerCode: [{ required: true, message: '请输入台企业编码' }],
        customerName: [{ required: true, message: '请输入平台企业名称' }],
        customerPhone: [{ validator: isPhoneValid, message: '手机号格式不正确', trigger: 'blur' }],
        appKey: [{ required: true, message: '请输入appKey' }],
        secretKey: [{ required: true, message: '请输入secretKey' }],
        appParam: [{ required: true, message: '请输入appParam' }]
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: ' 系统对接' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...opts };
      let res = await axios.post(api.openPlateformCustomerPage, options);
      this.tableData = res.data;
    },
    onAdd() {
      if (this.$refs['formAdd']) {
        this.$refs['formAdd'].resetFields();
      }
      this.id = '';
      this.formAdd = {
        customerCode: '',
        customerName: '',
        customerPhone: '',
        appKey: '',
        secretKey: '',
        appParam: ''
      };
      this.dialogAddVisable = true;
    },
    handleEdit(item) {
      this.dialogAddVisable = true;
      this.id = item.id;
      this.formAdd = item;
    },
    handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          let url = api.openPlateformCustomerSave;
          let options = { ...this.formAdd };
          if (this.id) {
            options.id = this.id;
            url = api.openPlateformCustomerUpdate;
          }
          let res = await axios.post(url, options);
          this.dialogAddVisable = false;
          this.handleSearch();
        }
      });
    },
    async handleSwitch(item) {
      const options = {
        id: item.id,
        enabled: item.enabled ? false : true
      };
      let title = item.enabled ? '停用' : '启用';
      this.$confirm(`确定${title}吗？`, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.openPlateformCustomerEnabled, { ...options });
          this.handleSearch();
        })
        .catch(() => {});
    },
    handleRelation(item) {
      this.id = item.id;
      this.showRelationCompany = true;
      this.getRelationCompanyList();
    },
    handleRelationCompanyChange(val) {
      this.relationCompanyPage = val;
      this.getRelationCompanyList();
    },
    async getRelationCompanyList() {
      const options = { pageNum: this.relationCompanyPage, pageSize: this.pageSize, customerId: this.id };
      let res = await axios.post(api.openPlateformRelationPage, options);
      this.relationCompanyData = res.data;
    },
    async handleCancelRelation(item) {
      let res = await axios.post(api.openPlateformRelationCancel, { id: item.id });
      this.showRelationCompany = false;
      this.handleSearch();
    },
    handleLink(item) {
      this.searchCompanyOptions.companyName = '';
      this.searchCompanyOptions.holderCode = '';
      this.id = item.id;
      this.showDddCompany = true;
      this.searchCompanyData.data = [];
      this.searchCompanyData.total = 0;
    },
    handleSearchCompany() {
      this.addCompanyPage = 1;
      this.getCompanyList();
    },
    handleSearchCompanyChange(val) {
      this.addCompanyPage = val;
      this.getCompanyList();
    },
    async getCompanyList() {
      const options = {
        pageNum: this.addCompanyPage,
        pageSize: this.pageSize,
        ...this.searchCompanyOptions,
        customerId: this.id
      };
      let res = await axios.post(api.openPlateformRelationQuery, options);
      this.searchCompanyData = res.data || [];
    },
    multiRelation(val) {
      this.multiselectCompany = val;
    },
    async handleSaveRelation() {
      const options = {
        customerId: this.id,
        companyCodes: this.multiselectCompany.map(el => el.companyCode)
      };
      await axios.post(api.openPlateformRelationSave, { ...options });
      this.multiselectCompany = [];
      this.handleSearch();
    },
    handleConfig(item) {
      this.$router.push(`/subscribe/manage/${item.id}`);
    },
    handleInterface(item) {
      this.$router.push(`/interface/manage/${item.id}`);
    }
  }
};
</script>
<style lang="postcss">
.system-intergration-page {
  .tip-dialog {
    width: 500px;
  }
}
</style>
