<template>
  <layout navActive="match">
    <div>
      <div class="detail-hander-panel flex-between">
        <div class="detail-hander-content">{{ $route.meta.title }}</div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onInit">刷新</el-button>
          <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">发票基本信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">开票申请流水</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billNo">
              {{ detailData.billInfoResponse.billNo }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票状态</div>
            <div class="segment-content" :title="detailData.billInfoResponse.invoiceStatus">
              {{ detailData.billInfoResponse.invoiceStatus }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content" :title="detailData.billInfoResponse.orgName">
              {{ detailData.billInfoResponse.orgName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票单位</div>
            <div class="segment-content" :title="detailData.billInfoResponse.taxName">
              {{ detailData.billInfoResponse.taxName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单起止时间</div>
            <div class="segment-content">
              <span>{{ detailData.billInfoResponse.orderOverBeginDate | dateFormat('YYYY-MM-DD') }}</span>
              <span> - </span>
              <span>{{ detailData.billInfoResponse.orderOverEndDate | dateFormat('YYYY-MM-DD') }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票类型</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billType">
              {{ detailData.billInfoResponse.billType }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票样式</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billCategoryName">
              {{ detailData.billInfoResponse.billCategoryName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">申请时间</div>
            <div class="segment-content">
              {{ detailData.billInfoResponse.applyOpenBillDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div class="segment-item row-width warp">
            <div class="segment-label">发票备注</div>
            <div class="segment-content">{{ detailData.billInfoResponse.remarks }}</div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">发票票面信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">发票号码</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billNum">
              {{ detailData.billInfoResponse.billNum }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票代码</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billCode">
              {{ detailData.billInfoResponse.billCode }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">价税金额</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billAmt | thousands(2)">
              {{ detailData.billInfoResponse.billAmt | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">不含税金额</div>
            <div class="segment-content" :title="detailData.billInfoResponse.exTaxAmount | thousands(2)">
              {{ detailData.billInfoResponse.exTaxAmount | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">税额</div>
            <div class="segment-content" :title="detailData.billInfoResponse.taxAmount | thousands(2)">
              {{ detailData.billInfoResponse.taxAmount | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票日期</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billTime | dateFormat('YYYY-MM-DD')">
              {{ detailData.billInfoResponse.billTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票人</div>
            <div class="segment-content" :title="detailData.billInfoResponse.billUser">
              {{ detailData.billInfoResponse.billUser }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票图片</div>
            <div class="segment-content">
              <a
                href=""
                class="font-default"
                v-if="detailData.billInfoResponse.billImage"
                @click="utils.previewImage(detailData.billInfoResponse.billImage, '发票图片')"
                >查看</a
              >
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">发票汇总金额</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">订单总数</div>
            <div class="segment-content" :title="detailData.invoiceSummaryMessageWebResponse.orderNumberCount">
              {{ detailData.invoiceSummaryMessageWebResponse.orderNumberCount }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单开票金额(元)</div>
            <div class="segment-content">
              {{ detailData.invoiceSummaryMessageWebResponse.actualPrice | thousands(2) }}
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">订单明细表</div>
        <el-table :data="orderList" border max-height="400">
          <el-table-column label="订单号" prop="orderNumber" min-width="130" show-overflow-tooltip>
            <template v-slot="scope">
              <a class="font-default" @click="$router.push(`/match/order/detail/${scope.row.orderNo}`)">
                {{ scope.row.orderNo }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="实付运费金额" prop="orderFreightRates" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.orderFreightRates | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收撮合服务费" prop="matchmakingServiceFee" min-width="120" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.matchmakingServiceFee | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收税款" prop="matchmakingTaxFee" min-width="120" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.matchmakingTaxFee | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣吨" prop="lostTons" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.lostTons | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收吨位" prop="arriveAmount" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.arriveAmount | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运费实际开票金额" prop="actualPrice" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.actualPrice | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="撮合服务费实际开票金额"
            prop="actualServicePrice"
            min-width="150"
            show-overflow-tooltip
          >
            <template v-slot="scope">
              <span>{{ scope.row.actualServicePrice | thousands(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="segment">
        <div class="segment-header">操作流水</div>
        <el-table :data="detailData.records" border max-height="400">
          <el-table-column label="操作时间" prop="operateTime" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.operateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作描述" prop="operateDes" min-width="300" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作人" prop="operateName" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
export default {
  data() {
    return {
      utils,
      detailData: {
        billInfoResponse: {}, //发票基本信息
        invoiceSummaryMessageWebResponse: {}, //发票汇总金额
        records: [] //操作流水
      },
      orderList: [] //订单明细表
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '发票列表', path: '/match/invoice/list' },
      { title: this.$route.meta.title }
    ]);
    this.onInit();
  },
  methods: {
    async fetchData() {
      const { data } = await axios.post(api.queryMatchInvoiceInfo, { orderNo: this.$route.params.id });
      if (data) {
        this.detailData = data;
        this.detailData.billInfoResponse = data.billInfoResponse || {};
        this.detailData.invoiceSummaryMessageWebResponse = data.invoiceSummaryMessageWebResponse || {};
        this.detailData.records = data.records || [];
      }
    },
    async fetchOrderList() {
      const res = await axios.post(api.queryMatchInvoiceOrderList, { orderNo: this.$route.params.id });
      this.orderList = res.data || [];
    },
    onInit() {
      this.fetchData();
      this.fetchOrderList();
    }
  }
};
</script>
