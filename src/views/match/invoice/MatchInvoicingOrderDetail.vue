<template>
  <layout navActive="match">
    <div>
      <div class="detail-hander-panel flex-between">
        <div class="detail-hander-content">{{ $route.meta.title }}</div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="fetchData">刷新</el-button>
          <el-button type="primary" @click="$router.back()">返回</el-button>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">订单信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">订单号</div>
            <div class="segment-content" :title="detailData.assureOrdersResponse.orderNo">
              {{ detailData.assureOrdersResponse.orderNo }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">托运物品</div>
            <div class="segment-content" :title="detailData.assureOrdersResponse.stockKindName">
              {{ detailData.assureOrdersResponse.stockKindName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">线路</div>
            <div class="segment-content" :title="detailData.assureOrdersResponse.lineName">
              {{ detailData.assureOrdersResponse.lineName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单状态</div>
            <div class="segment-content" :title="detailData.assureOrdersResponse.orderStatus">
              {{ detailData.assureOrdersResponse.orderStatus }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发货日期</div>
            <div
              class="segment-content"
              :title="detailData.assureOrdersResponse.loadingSignTime | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.assureOrdersResponse.loadingSignTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单日期</div>
            <div
              class="segment-content"
              :title="detailData.assureOrdersResponse.orderCreateTime | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.assureOrdersResponse.orderCreateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>

          <div class="segment-item" colspan="2">
            <div class="segment-label">接单司机</div>
            <div class="segment-content">
              <span>{{ detailData.assureOrdersResponse.carPerson }}</span>
              <span class="link-btn" @click="handleViewIdCard">【身份证】</span>
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.driverEmploymentCredentialsUrl"
                @click="
                  utils.previewImage(detailData.assureOrdersResponse.driverEmploymentCredentialsUrl, '从业资格证')
                "
                >【从业资格证】</span
              >
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机手机号</div>
            <div class="segment-content" :title="detailData.assureOrdersResponse.carAccount">
              {{ detailData.assureOrdersResponse.carAccount }}
            </div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">接单车牌</div>
            <div class="segment-content">
              <span>{{ detailData.assureOrdersResponse.carNumber }}</span>
              <span
                class="link-btn"
                v-if="detailData.assureOrdersResponse.driverLicenceUrl"
                @click="utils.previewImage(detailData.assureOrdersResponse.driverLicenceUrl, '驾驶证')"
                >【驾驶证】</span
              >
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.runLicenceUrl"
                @click="utils.previewImage(detailData.assureOrdersResponse.runLicenceUrl, '行驶证')"
                >【行驶证】</span
              >
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.driverDelegationContractUrl"
                @click="
                  utils.previewImage(detailData.assureOrdersResponse.driverDelegationContractUrl, '道路运输许可证')
                "
                >【道路运输许可证】</span
              >
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机代办授权协议</div>
            <div class="segment-content">
              <span
                class="link-btn"
                v-if="detailData.assureOrdersResponse.driverOpenContractUrl"
                @click="utils.openNewTab(detailData.assureOrdersResponse.driverOpenContractUrl, '司机代办授权协议')"
                >【查看】</span
              >
            </div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">撮合服务协议</div>
            <div class="segment-content">
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.driverMatchmakingServiceUrl"
                @click="
                  utils.openNewTab(detailData.assureOrdersResponse.driverMatchmakingServiceUrl, '司机撮合服务协议')
                "
                >【司机撮合服务协议】</span
              >
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.companyMatchmakingServiceUrl"
                @click="
                  utils.openNewTab(detailData.assureOrdersResponse.companyMatchmakingServiceUrl, '企业撮合服务协议')
                "
                >【企业撮合服务协议】</span
              >
              <span
                class="link-btn ml-0"
                v-if="detailData.assureOrdersResponse.orderMatchmakingUrl"
                @click="utils.openNewTab(detailData.assureOrdersResponse.orderMatchmakingUrl, '运单撮合协议')"
                >【运单撮合协议】</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mb-15">
        <el-table :data="detailData.ordersTrackResponseList" border max-height="400">
          <el-table-column label="执行时间" prop="createDateFmt" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.createDateFmt | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行内容" prop="memo" min-width="300" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="80" prop="handle" fixed="right">
            <template v-slot="scope">
              <el-button type="text" @click="utils.previewImage(scope.row.recordCodes, '凭证集合')">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mb-15">
        <el-table :data="detailData.stockPffQueryResponseList" border max-height="400">
          <el-table-column label="凭证号" prop="flowCode" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="付款方名称" prop="userName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="收款方名称" prop="toUserName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易金额" prop="txAmt" min-width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.txAmt | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" prop="txType" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易成份" prop="eleType" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="说明" prop="remark" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" prop="transDesc" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="支付方式" prop="payMethod" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易时间" prop="txDate" min-width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.txDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
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
      detailData: {
        assureOrdersResponse: {},
        ordersTrackResponseList: [],
        stockPffQueryResponseList: []
      },
      utils
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '发票列表', path: '/match/invoicing/list' },
      { title: this.$route.meta.title }
    ]);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await axios.post(api.queryMatchOpenOrderInfo, { orderNo: this.$route.params.id });
      if (data) {
        this.detailData = data;
        this.detailData.assureOrdersResponse = data.assureOrdersResponse || {};
        this.detailData.ordersTrackResponseList = data.ordersTrackResponseList || [];
        this.detailData.stockPffQueryResponseList = data.stockPffQueryResponseList || [];
      }
    },
    handleViewIdCard() {
      let urls = [];
      if (this.detailData.assureOrdersResponse.idCardFrontPhotoUrl) {
        urls.push(this.detailData.assureOrdersResponse.idCardFrontPhotoUrl);
      }
      if (this.detailData.assureOrdersResponse.idCardBackPhotoUrl) {
        urls.push(this.detailData.assureOrdersResponse.idCardBackPhotoUrl);
      }
      utils.previewImage(urls, '身份证');
    }
  }
};
</script>
