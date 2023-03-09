<template>
  <layout navActive="config">
    <div class="product-config-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">产品类型</span>
          <el-select v-model="tableOptions.productType" placeholder="请选择产品类型">
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">货源类型</span>
          <el-select v-model="tableOptions.stockKind" filterable clearable placeholder="请选择货源类型">
            <el-option
              v-for="item in stockKindList"
              :key="item.typeCode"
              :label="item.typeName"
              :value="item.typeCode"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">规则名称</span>
          <el-input v-model.trim="tableOptions.ruleName" placeholder="请输入规则名称" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="规则名称" prop="ruleName" align="center">
          <template v-slot="scope">
            <span @click="handleEdit(scope.row)" class="font-default pointer">{{ scope.row.ruleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品类型" prop="productName" align="center"> </el-table-column>
        <el-table-column label="货源类型" prop="stockKindName" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.updateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
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
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
export default {
  name: 'ProductConfig',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { productType: '', ruleName: '', stockKind: '' },
      tableData: { data: [], total: 0 },
      productList: [],
      stockKindList: []
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '产品配置' }]);
    await this.getSysDict();
    await this.getStockList();
    this.handleSearch();
  },
  methods: {
    async getSysDict() {
      let productRes = await utils.getSysDict('cargo_guarantee_type', true);
      this.productList = productRes;
      this.tableOptions.productType = this.productList[0].value;
    },
    async getStockList() {
      let stockKindRes = await axios.get(api.findStockTypeMetaPage);
      this.stockKindList = stockKindRes.data || [];
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.cargoGuaranteeSelectPage, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions.ruleName = '';
      this.tableOptions.stockKind = '';
    },
    handleAdd() {
      this.$router.push(`/product/config/add`);
    },
    handleEdit(item) {
      this.$router.push(`/product/config/edit/${item.productsId}`);
    }
  }
};
</script>
<style lang="postcss">
.product-config-page {
  .el-select {
    width: 200px !important;
  }
}
</style>
