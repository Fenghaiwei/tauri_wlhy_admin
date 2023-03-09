<template>
  <layout navActive="product">
    <div class="stock-copy-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="tableOptions.companyName" placeholder="请输入企业名称" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">企业手机号</span>
          <el-input v-model.trim="tableOptions.mobile" placeholder="请输入企业手机号" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="add">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="原企业名称" align="center" prop="sourceCompanyName" min-width="190"> </el-table-column>
        <el-table-column label="原企业手机号" align="center" prop="sourceMobile" width="150"> </el-table-column>
        <el-table-column label="新企业名称" align="center" prop="targetCompanyName" min-width="190"> </el-table-column>
        <el-table-column label="新企业手机号" align="center" prop="targetMobile" width="150"> </el-table-column>
        <el-table-column label="操作人" align="center" prop="operatorName" width="150"> </el-table-column>
        <el-table-column label="操作时间" align="center" prop="operatorTime" width="150">
          <template v-slot="scope">
            {{ scope.row.operatorTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
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

    <el-dialog title="货源复制" :visible.sync="formAddVisible" custom-class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="120px">
        <el-form-item label="原企业手机号" prop="sourceMobile">
          <el-input v-model.trim="formAdd.sourceMobile" placeholder="请输入原企业手机号" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="原企业名称" prop="sourceCompanyName">
          <el-input v-model.trim="formAdd.sourceCompanyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="新企业手机号" prop="targetMobile">
          <el-input v-model.trim="formAdd.targetMobile" placeholder="请输入新企业手机号" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="新企业名称" prop="targetCompanyName">
          <el-input v-model.trim="formAdd.targetCompanyName" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleSave" type="primary">开始复制</el-button>
        <el-button @click="formAddVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import { isPhoneValid } from '@fe/form-valid';
import { isPhone } from '@fe/validator';
export default {
  name: 'StockCopy',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        companyName: '',
        mobile: ''
      },
      tableData: {
        data: [],
        total: 0
      },
      formAddVisible: false,
      formAdd: {
        sourceMobile: '', //原企业手机号
        sourceCompanyName: '', // 原企业名称
        sourceCompanyCode: '', //原企业编码
        targetMobile: '', // 新企业手机号
        targetCompanyName: '', //新企业名称
        targetCompanyCode: '' // 新企业编码
      },
      rules: {
        sourceMobile: [
          { required: true, message: '请输入原企业手机号' },
          { validator: isPhoneValid, message: '手机号格式不正确', trigger: 'blur' }
        ],
        sourceCompanyName: [{ required: true, message: '原企业名称不能为空' }],
        targetMobile: [
          { required: true, message: '请输入新企业手机号' },
          { validator: isPhoneValid, message: '手机号格式不正确', trigger: 'blur' }
        ],
        targetCompanyName: [{ required: true, message: '新企业名称不能为空' }]
      }
    };
  },

  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '货源复制' }]);
    this.handleSearch();
  },
  watch: {
    'formAdd.sourceMobile'(val) {
      this.formAdd.sourceCompanyName = '';
      this.formAdd.sourceCompanyCode = '';
      if (val.length === 11 && isPhone(val)) {
        this.getCompanyInfo(val, 1);
      }
    },
    'formAdd.targetMobile'(val) {
      this.formAdd.targetCompanyName = '';
      this.formAdd.targetCompanyCode = '';
      if (val.length === 11 && isPhone(val)) {
        this.getCompanyInfo(val, 2);
      }
    }
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.stockReplicaOperatorLogList, options);
      this.tableData = res.data;
    },
    async getCompanyInfo(val, type) {
      let res = await axios.post(api.queryCompanyInfoByMobile, { userMobile: val });
      if (type == 1) {
        this.formAdd.sourceCompanyName = res.data?.companyName;
        this.formAdd.sourceCompanyCode = res.data?.companyCode;
      } else {
        this.formAdd.targetCompanyName = res.data?.companyName;
        this.formAdd.targetCompanyCode = res.data?.companyCode;
      }
    },
    onReset() {
      this.tableOptions = { companyName: '', mobile: '' };
    },
    add() {
      if (this.$refs['formAdd']) {
        this.$refs['formAdd'].resetFields();
      }
      for (let k in this.formAdd) this.formAdd[k] = '';
      this.formAddVisible = true;
    },
    async handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          await axios.post(api.stockReplicaOperatorLogSave, { ...this.formAdd });
          this.formAddVisible = false;
          this.$message.success('操作成功');
          this.handleSearch();
        }
      });
    }
  }
};
</script>
<style lang="postcss"></style>
