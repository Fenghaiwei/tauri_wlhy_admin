<template>
  <layout navActive="transport">
    <div class="stock-list-page">
      <div class="toolbar-panel">
        <company-search @company="handleCompanySearch" ref="companySearch" />

        <div class="toolbar-item">
          <span class="item-label">装货地址名</span>
          <!-- 自定义传参 -->
          <el-autocomplete
            v-model="tableOptions.loadAddressName"
            :fetch-suggestions="(value, cb) => querySearch(value, cb, 'load')"
            placeholder="请输入装货地址名"
            @select="item => handleSelect(item, 'load')"
            :disabled="!tableOptions.companyCodeList.length"
          ></el-autocomplete>
        </div>

        <div class="toolbar-item">
          <span class="item-label">卸货地址名</span>
          <el-autocomplete
            v-model="tableOptions.uploadAddressName"
            :fetch-suggestions="(value, cb) => querySearch(value, cb, 'upload')"
            placeholder="请输入卸货地址名"
            @select="item => handleSelect(item, 'upload')"
            :disabled="!tableOptions.companyCodeList.length"
          ></el-autocomplete>
        </div>
        <div class="toolbar-item">
          <span class="item-label">货源类型</span>
          <el-select filterable clearable v-model="tableOptions.stockType" placeholder="请选择货源类型">
            <el-option
              v-for="data in stockTypeEnum"
              :key="data.value"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <div style="display: flex; align-items: center">
            <span class="item-label">装货区域</span>
            <region style="display: inline-block" ref="regionFH" v-on:back-region="selectSourceCode"></region>
          </div>
        </div>
        <div class="toolbar-item">
          <div style="display: flex; align-items: center">
            <span class="item-label">卸货区域</span>
            <region ref="regionXH" style="display: inline-block" v-on:back-region="selectTargetCode"></region>
          </div>
        </div>
        <div class="toolbar-item">
          <span class="item-label">货源状态</span>
          <el-select filterable clearable v-model="tableOptions.stockStatus" placeholder="请选择货源状态">
            <el-option
              v-for="data in dictData.stockStatusDictList"
              :key="data.code"
              :label="data.name"
              :value="data.code"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">付款方式</span>
          <el-select filterable clearable v-model="tableOptions.payWay" placeholder="请选择付款方式">
            <el-option
              v-for="data in dictData.payWayDictList"
              :key="data.code"
              :label="data.name"
              :value="data.code"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <span class="item-label">货源ID</span>
          <el-input
            v-model.trim="tableOptions.stockCode"
            :maxlength="300"
            placeholder="请输入货源ID(多个用,隔开)"
            @keyup.enter.native="handleStockSearch"
            clearable
          ></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">增值服务</span>
          <el-select v-model="tableOptions.valueAddedServicesType" placeholder="请选择增值服务" clearable>
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleStockSearch">筛选</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="货源ID" prop="stockCode" min-width="280" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业编码" prop="companyCode" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="企业名称" prop="companyName" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="装货地址名" prop="loadAddressName" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="卸货地址名"
          prop="unloadAddressName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="货物类型" prop="stockKindName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="重量/体积" prop="unit" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="运费单价" prop="stockUnitPrice" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="运费总价(元)" prop="price" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="货源数量" prop="carNumber" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务单模式" prop="workStockDesc" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="预约模式"
          prop="allowAppointmentDesc"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="付款方式" prop="payWayDesc" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="发货人" prop="holderName" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="发货人电话" prop="holderPhone" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="货源联系人"
          prop="stockContactPhone"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="发布时间" prop="publishDate" min-width="145" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="货源截止日期"
          prop="stockDeadline"
          min-width="145"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="货源状态" prop="stockStatusDesc" min-width="80" show-overflow-tooltip>
          <template v-slot="scope">
            <span class="font-green" v-if="scope.row.stockStatusDesc == '已发布'">{{ scope.row.stockStatusDesc }}</span>
            <span class="font-red" v-else-if="scope.row.stockStatusDesc == '已删除'">
              {{ scope.row.stockStatusDesc }}
            </span>
            <span v-else>{{ scope.row.stockStatusDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="220" fixed="right">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleToDetail(scope.row)"> 货源详情 </el-button>
            <template v-if="!scope.row.agentStock">
              <el-button class="font-default" type="text" @click="handleCopy(scope.row)"> 复制链接 </el-button>
              <el-button class="font-default" type="text" @click="handleShowPoster(scope.row)"> 查看海报 </el-button>
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
    </div>
    <poster v-show="false" posterType="stock" :postData="postData" ref="poster" />
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import dayjs from 'dayjs';
import CompanySearch from '@/components/CompanySearch.vue';
import copy from 'clipboard-copy';
import Poster from '@/components/Poster.vue';
import utils from '@/utils/utils';
export default {
  name: 'StockList',
  mixins: [listMixin],
  components: {
    CompanySearch,
    Poster
  },
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        companyCodeList: [],
        loadAddressCode: '',
        loadAddressName: '',
        uploadAddressCode: '',
        uploadAddressName: '',
        stockStatus: '',
        stockType: '',
        payWay: '',
        stockCode: '',
        sourceProvinceCode: '',
        sourceCityCode: '',
        sourceCountyCode: '',
        targetProvinceCode: '',
        targetCityCode: '',
        targetCountyCode: '',
        valueAddedServicesType: ''
      },
      tableData: { data: [], total: 0 },
      dictData: [], //字典数据
      addressList: [], //地址列表
      loading: false,
      postData: {},
      productList: [],
      stockTypeEnum: [] // 货源类型
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '货源列表' }]);
    if (!this.dictData.length) this.getStockDict();
    this.getSysDict();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.tableOptions, ...opts };
      let res = await axios.post(api.getStockList, options);
      this.tableData = res.data;
    },

    handleStockSearch() {
      if (
        !this.tableOptions.companyCodeList.length &&
        !this.tableOptions.stockCode &&
        !this.tableOptions.sourceProvinceCode &&
        !this.tableOptions.targetProvinceCode &&
        !this.tableOptions.loadAddressCode &&
        !this.tableOptions.uploadAddressCode
      ) {
        this.$message.warning('请输入企业名称或货源ID或装货地址名称/卸货地址名称或装货区域/卸货区域进行查询');
      } else {
        this.handleSearch();
      }
    },

    //与企业查询组件传值
    handleCompanySearch(val) {
      this.tableOptions.companyCodeList = [];
      if (val && val.length) {
        this.handleSearch();
        val.map(item => this.tableOptions.companyCodeList.push(item.companyCode));
      } else {
        this.tableOptions.companyCodeList = [];
        this.tableOptions.loadAddressCode = '';
        this.tableOptions.loadAddressName = '';
        this.tableOptions.uploadAddressCode = '';
        this.tableOptions.uploadAddressName = '';
      }
      if (this.tableOptions.companyCodeList.length) {
        this.getCompanyAddressList(this.tableOptions.companyCodeList);
      } else {
        this.addressList = [];
        this.tableOptions.loadAddressCode = '';
        this.tableOptions.uploadAddressCode = '';
      }
    },

    //查询企业的地址列表
    async getCompanyAddressList(companyCodeList) {
      let res = await axios.post(api.getCompanyAddressList, { companyCodeList });
      this.addressList = res.data;
    },

    async querySearch(queryString, cb, type) {
      //1.先判断类型，是装货还是卸货
      if (type == 'load') {
        // this.tableOptions.loadAddressCode = queryString ? this.tableOptions.loadAddressCode : ''; //装货
        this.tableOptions.loadAddressCode = ''; //装货
      } else {
        this.tableOptions.uploadAddressCode = ''; //卸货
      }

      //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
      for (let item of this.addressList) item.value = item.addressName;

      let restaurants = this.addressList;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    //过滤匹配下拉框的值
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
      };
    },

    // 点击下拉框
    handleSelect(item, type) {
      let addressCode = item.addressCode ? item.addressCode : '';
      if (type == 'load') {
        this.tableOptions.loadAddressCode = addressCode; //装货code
      } else {
        this.tableOptions.uploadAddressCode = addressCode; //卸货code
      }
    },

    // 点击详情页
    handleToDetail(row) {
      this.$router.push({ path: `/stock/detail/${row.stockCode}` });
    },

    // 获取货源所有字典
    async getStockDict() {
      let res = await axios.post(api.getStockDict);
      this.dictData = res.data;
    },

    //点击重置按钮
    handleReset() {
      this.tableOptions = {
        companyCodeList: [],
        loadAddressCode: '',
        loadAddressName: '',
        uploadAddressCode: '',
        uploadAddressName: '',
        stockStatus: '',
        payWay: '',
        stockCode: '',
        sourceProvinceCode: '',
        sourceCityCode: '',
        sourceCountyCode: '',
        targetProvinceCode: '',
        targetCityCode: '',
        targetCountyCode: '',
        valueAddedServicesType: ''
      };
      this.$refs.companySearch.handleCompanyClose();
      this.$refs.companySearch.handleClose();
      this.$refs.regionFH.resetData();
      this.$refs.regionXH.resetData();
    },
    // 选择装货城市
    selectSourceCode(data) {
      const { province, city, region } = data;
      this.tableOptions.sourceProvinceCode = province.regionCode || '';
      this.tableOptions.sourceCityCode = city.regionCode || '';
      this.tableOptions.sourceCountyCode = region.regionCode || '';
    },
    // 选择卸货城市
    selectTargetCode(data) {
      const { province, city, region } = data;
      this.tableOptions.targetProvinceCode = province.regionCode || '';
      this.tableOptions.targetCityCode = city.regionCode || '';
      this.tableOptions.targetCountyCode = region.regionCode || '';
    },
    handleCopy(item) {
      copy(item.shareLink);
      this.$message.success('复制成功');
    },
    async handleShowPoster(item) {
      let res = await axios.get(api.getStockPosterData, { params: { stockCode: item.stockCode } });
      this.postData = res.data;
      this.$nextTick(() => {
        this.$refs.poster.createQrcode();
      });
    },
    async getSysDict() {
      let productRes = await utils.getSysDict('cargo_guarantee_type', true);
      this.productList = productRes;
      this.stockTypeEnum = await utils.getSysDict('stock_type', true);
    }
  }
};
</script>
<style lang="postcss">
.stock-list-page {
  .toolbar-panel .toolbar-item .el-select {
    width: 180px;
  }
  .el.dialog {
    max-height: 700px;
    overflow: auto;
  }
}
</style>
