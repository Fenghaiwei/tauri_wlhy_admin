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
            <div class="segment-label">企业名称</div>
            <div class="segment-content" :title="detailData.companyName">{{ detailData.companyName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">纳税人识别号</div>
            <div class="segment-content" :title="detailData.companyTaxNo">{{ detailData.companyTaxNo }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">注册地址</div>
            <div class="segment-content" :title="detailData.companyAddress">{{ detailData.companyAddress }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系电话</div>
            <div class="segment-content" :title="detailData.companyMobile">{{ detailData.companyMobile }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开户行</div>
            <div class="segment-content" :title="detailData.companyBank">{{ detailData.companyBank }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">账户号</div>
            <div class="segment-content" :title="detailData.companyBankNumber">{{ detailData.companyBankNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">会员名称</div>
            <div class="segment-content" :title="detailData.disparDriverName">{{ detailData.disparDriverName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">会员纳税人识别号</div>
            <div class="segment-content" :title="detailData.disparDriverTaxNo">{{ detailData.disparDriverTaxNo }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票流水号</div>
            <div class="segment-content">{{ detailData.openSerialNo }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票类型</div>
            <div class="segment-content" :title="detailData.invoiceType">{{ detailData.invoiceType }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发票样式</div>
            <div class="segment-content" :title="detailData.invoiceStyle">{{ detailData.invoiceStyle }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开票状态</div>
            <div class="segment-content" :title="detailData.invoiceStatus">{{ detailData.invoiceStatus }}</div>
          </div>
          <div class="segment-item row-width warp">
            <div class="segment-label">备注</div>
            <div class="segment-content" :title="detailData.invoiceRemark">{{ detailData.invoiceRemark }}</div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">发票汇总金额</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">订单总数</div>
            <div class="segment-content">{{ detailData.orderNum }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单开票金额</div>
            <div class="segment-content">{{ detailData.actualPrice | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实收总吨位</div>
            <div class="segment-content">{{ detailData.actualTonnage }}</div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">订单明细表</div>
        <el-table :data="orderList" border max-height="400">
          <el-table-column label="订单号" prop="orderNo" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <a class="font-default" @click="$router.push(`/match/invoicing/order/detail/${scope.row.orderNo}`)">
                {{ scope.row.orderNo }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="运费处理进度"
            prop="freightProgress"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="企业编号" prop="companyCode" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="企业名称" prop="companyName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="平台公司名称"
            prop="platformCompanyName"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="车牌" prop="carNumber" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="司机" prop="driverName" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="司机电话" prop="driverMobile" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="司机身份证号"
            prop="driverIdCode"
            min-width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="货物重量" prop="stockUnit" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="货物类型" prop="stockType" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="发货日期" prop="deliveryDate" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.deliveryDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="装货地" prop="loadArea" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="装货地址名" prop="loadName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="装货详细地址"
            prop="loadAddressDetail"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="卸货日期" prop="uploadDate" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.uploadDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="卸货地" prop="uploadArea" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="卸货地址名" prop="uploadName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="卸货详细地址"
            prop="uploadAddressDetail"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="完结日期" prop="orderFinishDate" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.orderFinishDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="现金金额" prop="orderFreightRates" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.orderFreightRates | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="油气金额" prop="oilGasPrice" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.oilGasPrice | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ETC金额" prop="etcPrice" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.etcPrice | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="扣吨" prop="lossUnit" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.lossUnit | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实装吨位" prop="originalUnit" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.originalUnit | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实卸吨位" prop="actualUnit" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.actualUnit | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收单运价" prop="receiptOrderPrice" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.receiptOrderPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运费开票总额" prop="actualFreightPrice" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.actualFreightPrice | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运费实际开票总额" prop="actualPrice" min-width="140" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.actualPrice | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="运费支付单号"
            prop="orderPayNo"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
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
      detailData: {},
      orderList: []
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '发票列表', path: '/match/invoicing/list' },
      { title: this.$route.meta.title }
    ]);
    this.onInit();
  },
  methods: {
    async fetchData() {
      const result = await axios.post(api.queryMatchOpenInvoiceInfo, { orderNo: this.$route.params.id });
      this.detailData = result.data || {};
    },
    async fetchOrderList() {
      const res = await axios.post(api.queryMatchOpenInvoiceOrderList, { orderNo: this.$route.params.id });
      this.orderList = res.data || [];
    },
    onInit() {
      this.fetchData();
      this.fetchOrderList();
    }
  }
};
</script>
