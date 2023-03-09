<template>
  <layout navActive="transport">
    <div class="monitor-order-detail">
      <!-- 基本信息 -->
      <div class="segment">
        <div class="segment-header">基本信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">运单号</div>
            <div class="segment-content">{{ orderBaseInfoVO.orderNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运单状态</div>
            <div class="segment-content">{{ orderBaseInfoVO.orderState }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content" :title="orderBaseInfoVO.companyName">{{ orderBaseInfoVO.companyName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业编码</div>
            <div class="segment-content">{{ orderBaseInfoVO.holderCode }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">车牌号</div>
            <div class="segment-content">{{ orderBaseInfoVO.plateNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">接单司机</div>
            <div class="segment-content">{{ orderBaseInfoVO.driverName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机手机号</div>
            <div class="segment-content">{{ orderBaseInfoVO.driverPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运输合同</div>
            <div class="segment-content">
              <div class="segment-content" @click="onLookUp(orderBaseInfoVO.transportContractUrl)">
                <span :class="orderBaseInfoVO.transportContractUrl ? 'font-default pointer' : 'font-default'">
                  {{ orderBaseInfoVO.transportContractName }}</span
                >
              </div>
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">车队长姓名</div>
            <div class="segment-content">{{ orderBaseInfoVO.captainDriverName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车队长手机号</div>
            <div class="segment-content">{{ orderBaseInfoVO.captainDriverPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">支付状态</div>
            <div class="segment-content">{{ orderBaseInfoVO.payStatus }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款记录</div>
            <div class="segment-content">
              <span class="font-default pointer" @click="isPaymentShow = !isPaymentShow">{{
                isPaymentShow ? '收起' : '展开'
              }}</span>
            </div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-labe">委托申请代开增值税专用发票协议</div>
            <div class="segment-content">
              <div class="segment-content" @click="onLookUp(orderBaseInfoVO.appOpenBillContractUrl)">
                <span v-if="orderBaseInfoVO.appOpenBillContractUrl" class="font-default pointer ml-10">查看</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 付款记录 -->
      <div v-if="isPaymentShow" class="segment">
        <div class="segment-header">付款记录</div>
        <el-table :data="paymentRecordList" border>
          <el-table-column label="凭证号" prop="flowCode" min-width="130"></el-table-column>
          <el-table-column label="付款方名称" prop="userName" min-width="100"></el-table-column>
          <el-table-column label="付款方账号" prop="" width="200">
            <template v-slot="scope"> {{ scope.row.accNoType }}-{{ scope.row.accNo }} </template>
          </el-table-column>
          <el-table-column label="收款方名称" prop="toUserName" min-width="100"></el-table-column>
          <el-table-column label="收款方账号" prop="" width="200">
            <template v-slot="scope"> {{ scope.row.toAccNoType }}-{{ scope.row.toAccNo }} </template>
          </el-table-column>
          <el-table-column label="交易金额" prop="txAmt">
            <template v-slot="scope">
              <span>{{ scope.row.txAmt | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" prop="transTypeDesc"></el-table-column>
          <el-table-column label="交易成分" prop="eleTypeDesc"> </el-table-column>
          <el-table-column label="说明" prop="remark" show-overflow-tooltip></el-table-column>
          <el-table-column label="交易时间" prop="txDate" width="150">
            <template v-slot="scope">
              <span>{{ scope.row.txDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="银行回单" prop="thirdCode" width="100">
            <template v-slot="scope">
              <el-button type="text" v-if="scope.row.thirdCode" @click="handleSeeRemark(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  运单日志-->
      <div class="segment">
        <div class="segment-header">运单日志</div>
        <el-table :data="orderFlowVOList" border>
          <el-table-column label="执行时间" prop="createDate"> </el-table-column>
          <el-table-column prop="operationTypeDesc" label="执行内容"></el-table-column>
        </el-table>
      </div>

      <!--  磅单凭证-->
      <div class="segment">
        <div class="segment-header">磅单凭证</div>
        <div class="upload-flex">
          <div class="upload-item" v-for="(item, idx) in imgsInfo" :key="idx">
            <img v-if="item.url" :src="item.url" class="img-preview-item" :alt="item.title" @click="showImage(item)" />
            <img v-else class="img-preview-item" src="../../../assets/img/pro-img-no.png" />
            <p>{{ item.title }}</p>
          </div>
        </div>
      </div>

      <!--  货物信息-->
      <div class="segment">
        <div class="segment-header">货物信息</div>
        <div class="segment-area flex-area" :span="4" style="margin-bottom: -30px">
          <div class="segment-item">
            <div class="segment-label">货物类型</div>
            <div class="segment-content">{{ stockInfoVO.stockKindName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物名称</div>
            <div class="segment-content">{{ stockInfoVO.stockName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单重量体积</div>
            <div class="segment-content">{{ stockInfoVO.stockUnit }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单运价</div>
            <div class="segment-content">{{ stockInfoVO.originalUnitPrice }}</div>
          </div>
        </div>

        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">运输轨迹</div>
            <div class="segment-content font-green"><span class="pointer" @click="handleRail">查看</span></div>
          </div>
          <div class="segment-item">
            <div class="segment-label">里程</div>
            <div class="segment-content">{{ stockInfoVO.distance | thousands(2) }}km</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物备注</div>
            <div class="segment-content" :title="stockInfoVO.stockDesc">{{ stockInfoVO.stockDesc }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">装货地址名</div>
            <div class="segment-content">{{ stockInfoVO.loadAddressName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货详细地址</div>
            <div class="segment-content" :title="stockInfoVO.loadAddressDetail">
              {{ stockInfoVO.loadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货联系人信息</div>
            <div class="segment-content" :title="`${stockInfoVO.loadContactName} ${stockInfoVO.loadContactPhone}`">
              {{ stockInfoVO.loadContactName }} {{ stockInfoVO.loadContactPhone }}
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">卸货地址名</div>
            <div class="segment-content">{{ stockInfoVO.unloadAddressName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">卸货详细地址</div>
            <div class="segment-content" :title="stockInfoVO.unloadAddressDetail">
              {{ stockInfoVO.unloadAddressDetail }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">卸货联系人信息</div>
            <div class="segment-content" :title="`${stockInfoVO.unloadContactName} ${stockInfoVO.unloadContactPhone}`">
              {{ stockInfoVO.unloadContactName }} {{ stockInfoVO.unloadContactPhone }}
            </div>
          </div>
        </div>
      </div>

      <!--  到货信息-->
      <div class="segment">
        <div class="segment-header">到货信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">实发数量(吨)</div>
            <div class="segment-content">{{ stockArriveInfoVO.originalUnit | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实收数量(吨)</div>
            <div class="segment-content">{{ stockArriveInfoVO.actualUnit | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">亏损数量(吨)</div>
            <div class="segment-content">{{ stockArriveInfoVO.lostUnit | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单运价</div>
            <div class="segment-content">{{ stockArriveInfoVO.actualUnitPrice | thousands(2) }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">亏扣单价(元/吨)</div>
            <div class="segment-content">{{ stockArriveInfoVO.lostUnitPrice | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">亏吨扣款(吨)</div>
            <div class="segment-content">{{ stockArriveInfoVO.lossUnitDeductionAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">其他扣款</div>
            <div class="segment-content">{{ stockArriveInfoVO.otherDeductionAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单规则名称</div>
            <div class="segment-content">{{ stockArriveInfoVO.ruleName }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">卸车费</div>
            <div class="segment-content">{{ stockArriveInfoVO.unloadingFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">对账费</div>
            <div class="segment-content">{{ stockArriveInfoVO.checkForFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">抹零费</div>
            <div class="segment-content">{{ stockArriveInfoVO.lostZeroFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">签收费</div>
            <div class="segment-content">{{ stockArriveInfoVO.cargoGuaranteePrice | thousands(2) }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">收单员</div>
            <div class="segment-content">{{ stockArriveInfoVO.orderReceiverName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单员手机号</div>
            <div class="segment-content">{{ stockArriveInfoVO.orderReceiverPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">签收时间</div>
            <div class="segment-content">{{ stockArriveInfoVO.orderReceiveTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单员备注</div>
            <div class="segment-content" :title="stockArriveInfoVO.orderReceiveRemark">
              {{ stockArriveInfoVO.orderReceiveRemark }}
            </div>
          </div>
        </div>
      </div>

      <!--  结算信息-->
      <div class="segment">
        <div class="segment-header">结算信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">下单总额</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderTotalAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单现金</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderCashAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单油费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderOilAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单调度费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderScheduleFee | thousands(2) }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">下单服务费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderServiceFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">下单服务费优惠</div>
            <div class="segment-content">{{ orderSettlementInfoVO.createOrderServiceFeeDiscount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业实付总额</div>
            <div class="segment-content">{{ orderSettlementInfoVO.companyActualPayTotalAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">实付司机现金</div>
            <div class="segment-content">{{ orderSettlementInfoVO.actualPayDriverCashAmount | thousands(2) }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">实付司机油费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.actualPayDriverOilAmount | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业实付调度费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.companyActualPayScheduleFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业实付服务费</div>
            <div class="segment-content">{{ orderSettlementInfoVO.companyActualPayServiceFee | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业退款总额</div>
            <div class="segment-content">{{ orderSettlementInfoVO.companyTotalRefundAmount | thousands(2) }}</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">货物保障服务费</div>
            <div class="segment-content">{{ stockArriveInfoVO.cargoGuaranteePrice | thousands(2) }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">付款日期</div>
            <div class="segment-content">{{ orderSettlementInfoVO.payTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
          </div>
        </div>
      </div>

      <!--  处理日志-->
      <div class="segment">
        <div class="segment-header">
          <span class="pointer" :class="{ 'font-default': active === 1 }" @click="handleLog(1)">处理日志</span>
          <span class="ml-20 pointer" :class="{ 'font-default': active === 2 }" @click="handleLog(2)">监控日志</span>
        </div>
        <el-table :data="tableData.data" border>
          <el-table-column label="操作时间">
            <template v-slot="scope">
              {{ scope.row.operationDate | dateFormat('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column prop="operationDesc" label="操作内容"></el-table-column>
          <el-table-column prop="operationUser" label="处理人"></el-table-column>
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
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'MonitorOrderDtl',
  mixins: [listMixin],
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '运单详情' }]);
    this.fetchDetail();
    this.fetchData();
  },
  computed: {
    params() {
      return this.$route.params;
    }
  },
  data() {
    return {
      isPaymentShow: false, //付款记录
      orderBaseInfoVO: {}, // 基础信息
      paymentRecordList: [], // 付款记录
      orderFlowVOList: [], // 运单日志
      tableData: {
        data: [],
        total: 0
      }, // 处理日志
      imgsInfo: [
        {
          title: '装货磅单（司机）',
          value: 'driverLoadUrl',
          url: ''
        },
        {
          title: '卸货磅单（司机）',
          value: 'driverUnloadUrl',
          url: ''
        },
        {
          title: '装货凭证',
          value: 'receiverLoadUrl',
          url: ''
        },
        {
          title: '卸货凭证',
          value: 'receiverUnLoadUrl',
          url: ''
        }
      ],
      stockInfoVO: {}, // 货物信息
      stockArriveInfoVO: {}, // 到货信息
      orderSettlementInfoVO: {}, // 结算信息
      active: 1
    };
  },
  methods: {
    // 基础详情
    async fetchDetail() {
      let { data } = await axios.post(api.orderDetail, {
        orderNumber: this.params.orderNumber
      });
      if (data) {
        if (data.orderBaseInfoVO) {
          this.orderBaseInfoVO = data.orderBaseInfoVO;
          this.orderFlowVOList = data.orderBaseInfoVO.orderFlowVOList || [];
          this.paymentRecordList = data.orderBaseInfoVO.paymentRecordList || [];
          // 图片处理
          this.imgsInfo.forEach((item, index) => {
            this.$set(this.imgsInfo, index, {
              ...item,
              url: data.orderBaseInfoVO[item.value]
            });
          });
        }

        this.stockInfoVO = data.stockInfoVO || {};
        this.stockArriveInfoVO = data.stockArriveInfoVO || {};
        this.orderSettlementInfoVO = data.orderSettlementInfoVO || {};
      }
    },
    // 操作日志数据
    async fetchData(opts) {
      const options = {
        pageNum: this.page,
        pageSize: this.pageSize,
        orderNumber: this.params.orderNumber,
        ...opts
      };
      let apiUrl = this.active == 1 ? api.orderBamsLog : api.monitorLog;
      let res = await axios.post(apiUrl, options);
      if (res.data) this.tableData = res.data;
    },
    handleLog(type) {
      this.active = type;
      this.pageNum = 1;
      this.fetchData();
    },
    // 查看合同
    onLookUp(url) {
      url && window.open(url);
    },
    // 查看照片
    showImage(item) {
      if (item.url) {
        this.$store.dispatch('showViewer', { data: [{ ...item }] });
      }
    },
    // 查看银行回单
    async handleSeeRemark(item) {
      let res = await axios.post(api.orderReceipt, {
        thirdCode: item.thirdCode,
        tradeType: item.txType,
        chlType: item.chlType
      });
      if (res.data) window.open(res.data.receiptUrl);
    },
    // 备注
    handleRemark() {
      this.$refs.remarkDialogRef.openDialog(this.params.orderNumber);
    },
    // 查看轨迹详情
    handleRail() {
      this.$router.push(`/rail/exception/detail/${this.params.orderNumber}/${this.params.companyCode}`);
    }
  }
};
</script>
<style lang="postcss" scoped>
.monitor-order-detail {
  .upload-flex {
    display: flex;
    flex-wrap: wrap;
    margin: 20px;
    .upload-item {
      margin-right: 20px;
      text-align: center;
      .img-preview-item {
        display: inline-block;
      }
    }
  }
}
</style>
