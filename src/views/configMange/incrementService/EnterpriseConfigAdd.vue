<template>
  <layout navActive="config">
    <div class="gross-tonnage-edit">
      <div class="segment">
        <div class="segment-header">
          <span>企业配置</span>
        </div>
        <div class="segment-area flex-area" span="4">
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content">
              <el-input
                style="width: 200px"
                v-model.trim="companyName"
                placeholder="请选择企业"
                @focus="handleCompany"
                :disabled="formType == 'edit'"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area" span="4">
          <div class="segment-item">
            <div class="segment-label">产品类型</div>
            <div class="segment-content">
              <el-select v-model="formData.productType" placeholder="请选择产品类型">
                <el-option
                  v-for="item in productList"
                  :key="item.productType"
                  :label="item.productName"
                  :value="item.productType"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">货源类型</div>
            <div class="segment-content">
              <el-select
                v-model="formData.stockKind"
                placeholder="请选择货源类型"
                @change="changeStockKind"
                :disabled="formType == 'edit'"
                v-if="formData.productType"
                filterable
              >
                <el-option
                  v-for="item in stockKindList"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                ></el-option>
              </el-select>
            </div>
            <div class="segment-content">
              <el-select
                v-model="formData.stockSecondKind"
                placeholder="请选择二级货源类型"
                @change="getRuleList"
                :disabled="formType == 'edit'"
                clearable
                filterable
                v-if="formData.productType"
              >
                <el-option
                  v-for="item in stockSecondKindList"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">规则名称</div>
            <div class="segment-content">
              <el-select
                v-model="formData.ruleId"
                placeholder="请选择规则名称"
                v-if="formData.stockKind"
                filterable
                @change="handleRuleChange"
              >
                <el-option
                  v-for="item in ruleList"
                  :key="item.ruleId"
                  :label="item.ruleName"
                  :value="item.ruleId"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area" span="4">
          <div class="segment-item" style="width: 500px">
            <div class="segment-label">
              <span class="font-red">*</span>货物价值（<span class="font-red">万元</span>）
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label"><span class="font-red">*</span>价格（元）</div>
          </div>
        </div>
        <div class="segment-area flex-area" span="4" v-for="(item, idx) in productsDetailConfig" :key="idx">
          <div class="segment-item" style="width: 500px">
            <div class="segment-content">
              <el-input v-model.trim="item.goodsMinValue" disabled></el-input>
            </div>
            <div class="ml-5 mr-5">—</div>
            <div class="segment-content">
              <el-input v-model.trim="item.goodsMaxValue" disabled></el-input>
            </div>
          </div>
          <div class="segment-item" style="width: 280px">
            <div class="segment-content">
              <el-input v-model.trim="item.chargePrice" disabled></el-input>
            </div>
          </div>
        </div>

        <div class="segment-foot mt-20">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="onJumpList">返回</el-button>
        </div>
      </div>

      <el-dialog title="选择企业" :visible.sync="companyVisible">
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
            <el-button type="primary" @click="handleSearchFn">筛选</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
        <el-table
          :data="tableData.data"
          ref="companyTable"
          border
          @selection-change="handleSelectionChange"
          row-key="companyCode"
        >
          <el-table-column type="selection" width="60" reserve-selection align="center"></el-table-column>
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
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      formType: 'add',
      id: '',
      formData: {
        ruleId: '',
        productType: '',
        stockSecondKind: '',
        stockKind: ''
      },
      stockKindList: [], //货源类型下拉
      stockSecondKindList: [], //货源二级类型下拉
      ruleList: [], //规则下拉
      companyCodeList: [], // 企业集合
      productList: [], //产品类型下拉
      companyName: '',
      companyVisible: false,
      selectData: [],
      tableOptions: {
        companyCode: '',
        companyName: '',
        filterCertified: true
      },
      tableData: { data: [], total: 0 },
      productsDetailConfig: []
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/config' },
      { title: '企业配置', path: '/enterprise/config' },
      { title: `${this.$route.name == 'ProductEnterpriseEdit' ? '编辑' : '新增'}企业配置` }
    ]);
    await this.getProductList();
    await this.getStockList();

    if (this.$route.name == 'ProductEnterpriseEdit') {
      this.formType = 'edit';
      this.id = this.$route.params.id;
      await this.getDetail();
      await this.getStockList(this.formData.stockKind);
      await this.getRuleList();
      this.handleRuleChange();
    }
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
      let res = await axios.post(api.getCompanyList, options);
      this.tableData = res.data;
    },
    handleSearchFn() {
      this.$refs.companyTable.clearSelection();
      this.handleSearch();
    },
    //点击企业名称搜索
    handleCompany() {
      this.companyVisible = true;
      this.handleSearch();
    },
    // 点击dialog企业名称确定
    handleCompanyConfirm() {
      this.companyVisible = false;
      let tempArr = [];
      this.selectData.map(item => tempArr.push(item.companyName));
      this.companyName = tempArr.join(',');
      this.companyCodeList = this.selectData.map(item => item.actualCompanyCode);
    },
    handleClose() {
      this.companyVisible = false;
      if (this.companyName) this.$refs.companyTable.clearSelection();
      this.tableOptions = { companyCode: '', companyName: '', filterCertified: true };
    },
    //点击多选，获取所选数据
    handleSelectionChange(val) {
      this.selectData = val;
    },
    //点击重置按钮
    handleReset() {
      this.tableOptions = { companyCode: '', companyName: '', filterCertified: true };
      this.handleSearchFn();
    },
    async getDetail() {
      let result = await axios.post(api.cargoGuaranteeCompanySettingDetail, {
        id: this.id
      });
      this.companyName = result.data.companyName;
      this.companyCodeList = [result.data.companyCode];
      this.formData.productType = result.data.productType;
      this.formData.stockKind = result.data.stockKind;
      this.formData.stockSecondKind = result.data.stockSecondKind || '';
      this.formData.ruleId = result.data.productsId;
    },
    // 获取产品类型
    async getProductList() {
      let result = await axios.post(api.cargoGuaranteeProductList);
      this.productList = result.data || [];
      this.formData.productType = this.productList[0].productType || '';
    },
    // 获取一二级货源类型
    async getStockList(val = '') {
      let stockKindRes = await axios.get(api.findStockTypeMetaPage, val ? { params: { parentCode: val } } : {});
      if (!val) {
        this.stockKindList = stockKindRes.data || [];
      } else {
        if (this.formType != 'edit') {
          this.formData.stockSecondKind = '';
        }
        this.stockSecondKindList = stockKindRes.data || [];
      }
    },
    // 获取规则列表
    async getRuleList() {
      let res = await axios.post(api.cargoGuaranteeCompanyRuleList, {
        stockKind: this.formData.stockKind,
        stockSecondKind: this.formData.stockSecondKind || ''
      });
      this.ruleList = res.data || [];
      if (this.formType != 'edit') {
        this.formData.ruleId = '';
      }
    },
    // 改变一级货源类型时
    changeStockKind(val) {
      this.getStockList(val);
      this.getRuleList();
    },
    handleRuleChange() {
      this.formData.ruleId && this.getGuaranteeDetail();
    },
    async getGuaranteeDetail() {
      let result = await axios.post(api.getGuaranteeProductsDetail, { ruleId: this.formData.ruleId });
      this.productsDetailConfig = result.data;
    },
    onJumpList() {
      this.$router.go(-1);
    },
    hanldleValid() {
      if (this.formType == 'add' && this.companyCodeList.length === 0) {
        this.$message.error('请选择企业');
        return false;
      }
      if (!this.formData.productType) {
        this.$message.error('请选择产品类型');
        return false;
      }
      if (!this.formData.stockKind) {
        this.$message.error('请选择货物类型');
        return false;
      }
      if (!this.formData.ruleId) {
        this.$message.error('请选择规则');
        return false;
      }
      return true;
    },
    async handleSave() {
      let isValid = this.hanldleValid();
      if (isValid) {
        let options = {
          companyCodeList: this.companyCodeList,
          productType: this.formData.productType,
          productsId: this.formData.ruleId,
          stockKind: this.formData.stockKind,
          stockSecondKind: this.formData.stockSecondKind
        };
        if (this.formType == 'edit') options.id = this.id;
        this.$confirm('是否确认配置?', '提交确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            await axios.post(api.cargoGuaranteeCompanySettingEdit, {
              ...options
            });
            this.onJumpList();
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style lang="postcss">
.gross-tonnage-edit {
  .segment .segment-area {
    padding: 8px;
  }
  .segment-flex {
    display: flex;
    align-items: center;
    .el-input {
      width: 220px;
    }
  }
}
</style>
