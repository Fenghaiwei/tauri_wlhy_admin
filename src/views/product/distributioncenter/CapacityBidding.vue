<template>
  <layout navActive="product">
    <div class="layout-content-list">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">线路</span>
          <el-input placeholder="发货地" style="width: 260px" v-model.trim="filter.sendAddressName"></el-input>
          <el-input placeholder="卸货地" style="width: 260px" v-model.trim="filter.recvAddressName"></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">业务员</span>
          <el-input placeholder="输入姓名搜索" style="width: 260px" v-model.trim="filter.busiEmployeeName"></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch">筛选</el-button>
          <el-button size="small" @click="handleResetSearch">重置</el-button>
        </div>
      </div>
      <div class="btn-group-box clearfix"></div>
      <div class="table-custom-box">
        <el-table :data="tableData.data" border>
          <el-table-column prop="biddingCode" label="招标编号" min-width="120"> </el-table-column>
          <el-table-column label="招标日期" min-width="70" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.biddingDate | dateFormat('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column prop="sendRoute" label="发货线路" min-width="140" show-overflow-tooltip> </el-table-column>
          <el-table-column label="产品信息" min-width="140" show-overflow-tooltip>
            <template v-slot="scope">
              <span>产品名称:{{ scope.row.prodName ? scope.row.prodName : ' - ' }}&nbsp;</span>
              <span>规格编码:{{ scope.row.specCode ? scope.row.specCode : ' - ' }}&nbsp;</span>
              <span>长度:{{ scope.row.prodLength ? scope.row.prodLength : ' - ' }}mm&nbsp;</span>
              <span>宽度:{{ scope.row.prodWidth ? scope.row.prodWidth : ' - ' }}mm&nbsp;</span>
              <span>重量:{{ scope.row.prodWeight ? scope.row.prodWeight : ' - ' }}吨</span>
            </template>
          </el-table-column>
          <el-table-column label="产品重量" min-width="60">
            <template v-slot="scope"
              ><span v-if="scope.row.prodWeight"> {{ scope.row.prodWeight }}吨</span>
            </template>
          </el-table-column>
          <el-table-column label="参考价格" min-width="90">
            <template v-slot="scope">
              <span v-if="scope.row.refFreightPrice">
                {{ scope.row.refFreightPrice }}
                <span v-if="scope.row.refPriceType == 0">元/吨</span>
                <span v-if="scope.row.refPriceType == 1">元/车</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="信息费" min-width="80">
            <template v-slot="scope">
              <span>{{ scope.row.infoFee }}元</span>
            </template>
          </el-table-column>
          <el-table-column prop="truckNum" label="需要车数" min-width="60"> </el-table-column>
          <el-table-column prop="competeBiddingNum" label="竞标人数" min-width="60"> </el-table-column>
          <el-table-column prop="biddingRemark" label="备注说明" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="招标状态" min-width="80">
            <template v-slot="scope">
              <span v-if="scope.row.biddingType == 0">未发布</span>
              <span v-if="scope.row.biddingType == 1">竞价中</span>
              <span v-if="scope.row.biddingType == 2">待开标</span>
              <span v-if="scope.row.biddingType == 3">已开标</span>
              <span v-if="scope.row.biddingType == 5">已作废</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140" align="center">
            <template v-slot="scope">
              <el-button type="text" class="font-size12" @click="details(scope.row.biddingCode)">详情</el-button>
              <template v-if="scope.row.biddingType == 1">
                <el-button type="text" class="font-size12" @click="createposter(scope.row)">生成海报</el-button
                ><el-button type="text" class="font-size12" @click="handleCopy(scope.row)">分享链接</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="tableData.total"
          :page-sizes="[10, 50, 100]"
          @current-change="currentChange"
          @size-change="handleSizeChange"
          layout="total, sizes,prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <poster v-show="false" posterType="bid" :postData="postData" ref="poster" />
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import copy from 'clipboard-copy';
import Poster from '@/components/Poster.vue';
export default {
  name: 'CapacityBidding',
  components: {
    Poster
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      filter: {
        sendAddressName: '',
        recvAddressName: '',
        busiEmployeeName: ''
      },
      tableData: {
        data: [],
        total: 0
      },
      cache: {},
      postData: {}
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '运力招标' }]);
    this.createSearch();
  },
  methods: {
    //进入页面
    createSearch() {
      this.cache = { ...this.filter };
      this.pageNum = 1;
      this.pageSize = 10;
      this.axiosRequest();
    },
    //筛选条件
    handleSearch() {
      this.cache = { ...this.filter };
      this.pageNum = 1;
      this.axiosRequest();
    },
    //清除条件
    handleResetSearch() {
      this.filter.sendAddressName = '';
      this.filter.recvAddressName = '';
      this.filter.busiEmployeeName = '';
      this.createSearch();
    },
    //查询接口
    axiosRequest() {
      const options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.cache
      };
      axios.post(api.biddingpageList, options).then(res => {
        this.tableData.data = res.data.data || [];
        this.tableData.total = res.data.total;
      });
    },
    //详情
    details(val) {
      this.$router.push({ name: 'CapacityBiddingDetails', query: { biddingCode: val } });
    },
    //生成海报
    async createposter(item) {
      let res = await axios.get(api.getPosterData, { params: { biddingCode: item.biddingCode } });
      this.postData = res.data;
      this.$nextTick(() => {
        this.$refs.poster.createQrcode();
      });
    },
    //分享链接
    handleCopy(item) {
      copy(item.shareLinkAddress);
      this.$message.success('复制成功');
    },
    currentChange(val) {
      this.pageNum = val;
      this.axiosRequest();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.axiosRequest();
    }
  }
};
</script>

<style scoped></style>
