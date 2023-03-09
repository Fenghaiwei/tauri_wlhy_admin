<template>
  <layout navActive="match">
    <div class="match-order-detail-page">
      <div class="detail-hander-panel flex-between">
        <div class="detail-hander-content">{{ $route.meta.title }}</div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="fetchData">刷新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">订单信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">订单号</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.orderNo">
              {{ detailData.matchmakingRelationVo.orderNo }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">订单状态</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.orderStatusName">
              {{ detailData.matchmakingRelationVo.orderStatusName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.companyName">
              {{ detailData.matchmakingRelationVo.companyName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业编码</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.companyCode">
              {{ detailData.matchmakingRelationVo.companyCode }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车牌号</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.plateNumber">
              {{ detailData.matchmakingRelationVo.plateNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单司机</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.driverName">
              {{ detailData.matchmakingRelationVo.driverName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机手机号</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.driverMobile">
              {{ detailData.matchmakingRelationVo.driverMobile }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">撮合服务协议</div>
            <div class="segment-content">
              <span
                class="link-btn"
                :title="detailData.matchmakingRelationVo.transportContractName"
                v-if="detailData.matchmakingRelationVo.transportContractName"
                @click="utils.openNewTab(detailData.matchmakingRelationVo.transportContractUrl)"
                >【{{ detailData.matchmakingRelationVo.transportContractName }}】</span
              >
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">支付状态</div>
            <div class="segment-content" :title="detailData.matchmakingRelationVo.payStatusName">
              {{ detailData.matchmakingRelationVo.payStatusName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款记录</div>
            <div class="segment-content">
              <span class="font-default pointer" @click="isPaymentShow = !isPaymentShow">
                {{ isPaymentShow ? '收起' : '展开' }}
              </span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物类型</div>
            <div class="segment-content" :title="detailData.stockInfoVO.stockKindName">
              {{ detailData.stockInfoVO.stockKindName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单运费(不含税)</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.orderTotalFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.orderTotalFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货地</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadAddressName">
              {{ detailData.stockInfoVO.loadAddressName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadAddressDetail">
              {{ detailData.stockInfoVO.loadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人姓名</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadContactName">
              {{ detailData.stockInfoVO.loadContactName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人手机号</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadContactPhone">
              {{ detailData.stockInfoVO.loadContactPhone }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">卸货地</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadAddressName">
              {{ detailData.stockInfoVO.unloadAddressName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadAddressDetail">
              {{ detailData.stockInfoVO.unloadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人姓名</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadContactName">
              {{ detailData.stockInfoVO.unloadContactName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人手机号</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadContactPhone">
              {{ detailData.stockInfoVO.unloadContactPhone }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isPaymentShow" class="segment">
        <div class="segment-header">订单支付信息</div>
        <el-table :data="detailData.paymentRecordList" border max-height="400">
          <el-table-column label="凭证号" prop="flowCode" min-width="220" show-overflow-tooltip></el-table-column>
          <el-table-column label="付款方名称" prop="userName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="付款方账号" prop="accNo" width="200" show-overflow-tooltip>
            <template v-slot="scope"> {{ scope.row.accNoType }}-{{ scope.row.accNo }} </template>
          </el-table-column>
          <el-table-column label="收款方名称" prop="toUserName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="收款方账号" prop="" width="200" show-overflow-tooltip>
            <template v-slot="scope">{{ scope.row.toAccNoType }}-{{ scope.row.toAccNo }}</template>
          </el-table-column>
          <el-table-column label="交易金额" prop="txAmt" show-overflow-tooltip>
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.txAmt | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" prop="transTypeDesc" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易成分" prop="eleTypeDesc" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易时间" prop="txDate" width="150" show-overflow-tooltip>
            <template v-slot="scope">
              <span>{{ scope.row.txDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="银行回单" prop="thirdCode" width="100" show-overflow-tooltip>
            <template v-slot="scope">
              <el-button type="text" v-if="scope.row.thirdCode" @click="handleSeeRemark(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="segment mt-15">
        <div class="segment-header">关联运单信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">运单号</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.orderNumber">
              {{ detailData.orderBaseInfoVO.orderNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运单状态</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.orderState">
              {{ detailData.orderBaseInfoVO.orderState }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.companyName">
              {{ detailData.orderBaseInfoVO.companyName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业编码</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.holderCode">
              {{ detailData.orderBaseInfoVO.holderCode }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车牌号</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.plateNumber">
              {{ detailData.orderBaseInfoVO.plateNumber }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单司机</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.driverName">
              {{ detailData.orderBaseInfoVO.driverName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机手机号</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.driverPhone">
              {{ detailData.orderBaseInfoVO.driverPhone }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">支付状态</div>
            <div class="segment-content" :title="detailData.orderBaseInfoVO.payStatus">
              {{ detailData.orderBaseInfoVO.payStatus }}
            </div>
          </div>
          <div class="segment-item" colspan="3">
            <div class="segment-label">运输合同</div>
            <div class="segment-content">
              <span
                class="link-btn"
                :title="detailData.orderBaseInfoVO.transportContractName"
                v-if="detailData.orderBaseInfoVO.transportContractName"
                @click="utils.openNewTab(detailData.orderBaseInfoVO.transportContractUrl)"
              >
                【{{ detailData.orderBaseInfoVO.transportContractName }}】
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">货物信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">货物类型</div>
            <div class="segment-content" :title="detailData.stockInfoVO.stockKindName">
              {{ detailData.stockInfoVO.stockKindName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物名称</div>
            <div class="segment-content" :title="detailData.stockInfoVO.stockName">
              {{ detailData.stockInfoVO.stockName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单重量体积</div>
            <div class="segment-content" :title="detailData.stockInfoVO.stockUnit">
              {{ detailData.stockInfoVO.stockUnit }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单运费(不含税)</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.orderTotalFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.orderTotalFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货地</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadAddressName">
              {{ detailData.stockInfoVO.loadAddressName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadAddressDetail">
              {{ detailData.stockInfoVO.loadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人姓名</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadContactName">
              {{ detailData.stockInfoVO.loadContactName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人手机号</div>
            <div class="segment-content" :title="detailData.stockInfoVO.loadContactPhone">
              {{ detailData.stockInfoVO.loadContactPhone }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">卸货地</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadAddressName">
              {{ detailData.stockInfoVO.unloadAddressName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadAddressDetail">
              {{ detailData.stockInfoVO.unloadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人姓名</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadContactName">
              {{ detailData.stockInfoVO.unloadContactName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人手机号</div>
            <div class="segment-content" :title="detailData.stockInfoVO.unloadContactPhone">
              {{ detailData.stockInfoVO.unloadContactPhone }}
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">到货信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">实发数量(吨)</div>
            <div class="segment-content" :title="detailData.stockArriveInfoVO.originalUnit | thousands(2)">
              {{ detailData.stockArriveInfoVO.originalUnit | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实收数量(吨)</div>
            <div class="segment-content" :title="detailData.stockArriveInfoVO.actualUnit | thousands(2)">
              {{ detailData.stockArriveInfoVO.actualUnit | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">亏损数量(吨)</div>
            <div class="segment-content" :title="detailData.stockArriveInfoVO.lostUnit | thousands(2)">
              {{ detailData.stockArriveInfoVO.lostUnit | thousands(2) }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单运费(不含税)</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.actuallyFreightPay + '元'">
              <span>{{ detailData.orderSettlementInfoVO.actuallyFreightPay | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单员</div>
            <div class="segment-content" :title="detailData.stockArriveInfoVO.orderReceiverName">
              {{ detailData.stockArriveInfoVO.orderReceiverName }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单员手机号</div>
            <div class="segment-content" :title="detailData.stockArriveInfoVO.orderReceiverPhone">
              {{ detailData.stockArriveInfoVO.orderReceiverPhone }}
            </div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">签收时间</div>
            <div
              class="segment-content"
              :title="detailData.stockArriveInfoVO.orderReceiveTime | dateFormat('YYYY-MM-DD HH:mm:ss')"
            >
              {{ detailData.stockArriveInfoVO.orderReceiveTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">结算信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">下单总额</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.orderTotalFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.orderTotalFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单税费</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.orderTaxFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.orderTaxFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单撮合服务费</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.orderMatchmakingServiceFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.orderMatchmakingServiceFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实付总额</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.actuallyFreightPay + '元'">
              <span>{{ detailData.orderSettlementInfoVO.actuallyFreightPay | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实付税费</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.paidTaxFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.paidTaxFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实付撮合服务费</div>
            <div class="segment-content" :title="detailData.orderSettlementInfoVO.matchmakingServiceFee + '元'">
              <span>{{ detailData.orderSettlementInfoVO.matchmakingServiceFee | thousands(2) }}</span>
              <span> 元</span>
            </div>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="日志记录" name="first">
          <el-table :data="detailData.orderBaseInfoVO.orderFlowVOList" border max-height="400">
            <el-table-column label="执行时间" prop="createDate" min-width="150" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.createDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="执行内容"
              prop="operationTypeDesc"
              min-width="350"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="凭证记录" name="second">
          <div class="flex-row">
            <div v-for="(item, idx) in detailData.imgsInfo" :key="idx" class="voucher-record-item">
              <img
                v-if="item.url"
                :src="item.url"
                class="img-preview-item"
                :alt="item.title"
                @click="utils.previewImage(item.url, item.title)"
              />
              <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
              <p>{{ item.title }}</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="支付记录" name="third">
          <el-table :data="detailData.paymentRecordList" border max-height="400">
            <el-table-column label="凭证号" prop="flowCode" min-width="220" show-overflow-tooltip></el-table-column>
            <el-table-column label="付款方名称" prop="userName" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="付款方账号" prop="" width="200" show-overflow-tooltip>
              <template v-slot="scope"> {{ scope.row.accNoType }}-{{ scope.row.accNo }} </template>
            </el-table-column>
            <el-table-column
              label="收款方姓名"
              prop="toUserName"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="收款方账号" prop="" width="200" show-overflow-tooltip>
              <template v-slot="scope"> {{ scope.row.toAccNoType }}-{{ scope.row.toAccNo }} </template>
            </el-table-column>
            <el-table-column label="交易金额" prop="txAmt" show-overflow-tooltip>
              <template v-slot="scope">
                <span class="font-orange">{{ scope.row.txAmt | thousands(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="交易类型" prop="transTypeDesc" show-overflow-tooltip></el-table-column>
            <el-table-column label="交易成分" prop="eleTypeDesc" show-overflow-tooltip> </el-table-column>
            <el-table-column label="说明" prop="remark" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="交易时间" prop="txDate" width="150" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.txDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="银行回单" prop="thirdCode" width="100" show-overflow-tooltip>
              <template v-slot="scope">
                <el-button type="text" v-if="scope.row.thirdCode" @click="handleSeeRemark(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="轨迹信息" name="fourth">
          <el-button
            class="mb-10"
            type="primary"
            @click="$router.push(`/match/order/rail/detail/${detailData.orderBaseInfoVO.orderNumber}`)"
            >高德轨迹定位图</el-button
          >
          <el-table :data="detailData.trackInfoList" border max-height="400">
            <el-table-column label="定位时间" prop="locationTime" min-width="100" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.locationTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="定位地点"
              prop="locatAddress"
              min-width="200"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
export default {
  mixins: [listMixin],
  data() {
    return {
      utils,
      isPaymentShow: false, // 是否展示付款记录
      detailData: {
        matchmakingRelationVo: {}, // 订单信息
        orderBaseInfoVO: {}, // 运单信息
        orderSettlementInfoVO: {}, // 结算信息
        stockArriveInfoVO: {}, // 到货信息
        stockInfoVO: {}, // 货物信息

        paymentRecordList: [], // 付款记录
        orderFlowVOList: [], // 订单操作日志
        trackInfoList: [], // 轨迹信息数据
        imgsInfo: [
          { title: '司机-装货磅单', value: 'driverLoadUrl', url: '' },
          { title: '司机-卸货磅单', value: 'driverUnloadUrl', url: '' },
          { title: '收单员-装货凭证', value: 'receiverLoadUrl', url: '' },
          { title: '收单员-卸货凭证', value: 'receiverUnLoadUrl', url: '' }
        ] // 凭证记录
      },
      activeName: 'first'
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '订单列表', path: '/match/order/list' },
      { title: this.$route.meta.title }
    ]);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let { data } = await axios.post(api.queryMatchOrderDetail, { orderNo: this.$route.params.id });

      if (data) {
        if (data.orderBaseInfoVO) {
          this.detailData.orderBaseInfoVO = data.orderBaseInfoVO;
          this.detailData.orderFlowVOList = data.orderBaseInfoVO.orderFlowVOList || [];
          this.detailData.paymentRecordList = data.orderBaseInfoVO.paymentRecordList || [];
          // 图片处理
          this.detailData.imgsInfo.forEach((item, index) => {
            this.$set(this.detailData.imgsInfo, index, { ...item, url: data.orderBaseInfoVO[item.value] });
          });
        }

        this.detailData.matchmakingRelationVo = data.matchmakingRelationVo || {};
        this.detailData.stockInfoVO = data.stockInfoVO || {};
        this.detailData.stockArriveInfoVO = data.stockArriveInfoVO || {};
        this.detailData.orderSettlementInfoVO = data.orderSettlementInfoVO || {};
      }
    },
    // 获取轨迹信息
    async fetchTrackInfoList() {
      const { data } = await axios.post(api.queryMatchOrderTrackPoints, {
        orderNumber: this.detailData.orderBaseInfoVO.orderNumber
      });
      if (data) {
        this.detailData.trackInfoList = data.trackPointVos || [];
      } else {
        this.detailData.trackInfoList = [];
      }
    },
    handleTabClick(tab, event) {
      if (tab.name === 'fourth') this.fetchTrackInfoList();
    },
    // 查看银行回单
    async handleSeeRemark(item) {
      let res = await axios.post(api.orderReceipt, {
        thirdCode: item.thirdCode,
        tradeType: item.txType,
        chlType: item.chlType
      });
      if (res.data) utils.openNewTab(res.data.receiptUrl);
    }
  }
};
</script>
<style lang="postcss" scoped>
.match-order-detail-page {
  :deep(.el-tabs__header) {
    border: 1px solid var(--base-border-color);
    background: #f7f9fb;
    padding-left: 15px;
    .el-tabs__item {
      font-weight: 700;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
  .voucher-record-item {
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .img-preview-item {
      display: inline-block;
      margin-right: 0;
    }
  }
}
</style>
