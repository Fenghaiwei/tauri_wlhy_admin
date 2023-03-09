<template>
  <layout navActive="transport">
    <div class="stock-detail-page">
      <div class="detail-hander-panel">
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="$router.push('/stock/list')">返回</el-button>
          <template v-if="!detailData.agentStock">
            <el-button type="primary" @click="handleCopy"> 复制链接 </el-button>
            <el-button type="primary" @click="handleShowPoster"> 查看海报 </el-button>
          </template>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">基本信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">货源ID</div>
            <div class="segment-content" :title="detailData.stockCode">{{ detailData.stockCode }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货源状态</div>
            <div class="segment-content font-green" v-if="detailData.stockStatusDesc == '已发布'">
              {{ detailData.stockStatusDesc }}
            </div>
            <div class="segment-content font-red" v-else-if="detailData.stockStatusDesc == '已删除'">
              {{ detailData.stockStatusDesc }}
            </div>
            <div class="segment-content" v-else>
              {{ detailData.stockStatusDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发货企业</div>
            <div class="segment-content" :title="detailData.companyName">{{ detailData.companyName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业编码</div>
            <div class="segment-content">{{ detailData.companyCode }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发货人</div>
            <div class="segment-content">{{ detailData.holderName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发货人电话</div>
            <div class="segment-content">{{ detailData.holderPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发布时间</div>
            <div class="segment-content">{{ detailData.publishDate }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">发布对象</div>
            <div class="segment-content" v-if="detailData.publishLocationDescType > 0" @click="publishDtl">
              <span class="pointer"> {{ detailData.publishLocationDesc }} <i class="el-icon-arrow-right"></i></span>
            </div>
            <div class="segment-content" v-else>
              {{ detailData.publishLocationDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货源类型</div>
            <div class="segment-content">{{ detailData.stockTypeDesc }}</div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">货源信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">货源类型</div>
            <div class="segment-content">{{ detailData.stockTypeDesc }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物类型</div>
            <div class="segment-content">{{ detailData.stockKindName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车型</div>
            <div class="segment-content">{{ detailData.vehicleTypeDesc }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车辆长度</div>
            <div class="segment-content">{{ detailData.vehicleLengthDesc }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">重量/体积</div>
            <div class="segment-content">{{ detailData.unit }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运费单价</div>
            <div class="segment-content">{{ detailData.stockUnitPrice }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运费总价</div>
            <div class="segment-content">{{ detailData.price }}元</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运费支付</div>
            <div class="segment-content">{{ detailData.payWayDesc }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货时间</div>
            <div class="segment-content">{{ detailData.loadDate }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">运输限时</div>
            <div class="segment-content">{{ detailData.transportationTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">自动更新货源</div>
            <div class="segment-content" :class="detailData.autoUpdateDesc == '是' ? 'font-green' : 'font-red'">
              {{ detailData.autoUpdateDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">自动确认司机</div>
            <div class="segment-content" :class="detailData.autoCheckDesc == '是' ? 'font-green' : 'font-red'">
              {{ detailData.autoCheckDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">预约单</div>
            <div class="segment-content" :class="detailData.allowAppointmentDesc == '是' ? 'font-green' : 'font-red'">
              {{ detailData.allowAppointmentDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">任务单</div>
            <div class="segment-content" :class="detailData.workStockDesc == '是' ? 'font-green' : 'font-red'">
              {{ detailData.workStockDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">每日自动结束时间（煤炭）</div>
            <div class="segment-content">{{ detailData.dailyAutoEndTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">渣土任务单截止时间</div>
            <div class="segment-content">{{ detailData.muckDeadline }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车队长信息</div>
            <div class="segment-content">
              <el-button @click="captainInfoVisable = true" class="font-default" type="text">查看</el-button>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">车队长代收运费</div>
            <div class="segment-content" :class="detailData.captainFlag ? 'font-green' : 'font-red'">
              {{ detailData.captainCollectFreightDesc }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">贸易订单号</div>
            <div class="segment-content">{{ detailData.tradeOrderNo }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货源联系人</div>
            <div class="segment-content">{{ detailData.stockContactPhone }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单点</div>
            <div class="segment-content">{{ detailData.signSiteName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">收单规则</div>
            <div class="segment-content">{{ detailData.ruleName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">亏扣单价</div>
            <div class="segment-content">{{ detailData.deductionUnitPrice }} 元/吨</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">平台服务费</div>
            <div class="segment-content">{{ detailData.platformServiceFee }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">优惠补贴</div>
            <div class="segment-content">{{ detailData.preferentialSubsidies }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">备注</div>
            <div class="segment-content" :title="detailData.remark">{{ detailData.remark }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货地</div>
            <div class="segment-content" :title="detailData.loadAddressName">{{ detailData.loadAddressName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.loadAddressDetail">{{ detailData.loadAddressDetail }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">卸货地</div>
            <div class="segment-content" :title="detailData.unloadAddressName">{{ detailData.unloadAddressName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">详细地址</div>
            <div class="segment-content" :title="detailData.unloadAddressDetail">
              {{ detailData.unloadAddressDetail }}
            </div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">保险</div>
            <div class="segment-content">
              {{ detailData.isInsurance === 1 ? '运单已投保' : '运单未投保' }}
              <span
                class="font-default float-right lh-36 pointer ml-30"
                v-if="detailData.isInsurance === 1"
                @click="onJump(detailData.stockInsuranceRelList[0].stockInsuranceUrl)"
              >
                查看协议
              </span>
              <span
                class="font-default float-right lh-36 pointer ml-30"
                @click="handleVisable = true"
                v-if="stockInsuranceIntentionOperationLogList.length !== 0"
              >
                操作记录
              </span>
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">允许收单修改</div>
            <div class="segment-content" :title="detailData.canntReceiveRule">
              {{ detailData.canntReceiveRule == 1 ? '是' : '否' }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货物保障方案</div>
            <div class="segment-content">{{ detailData.guaranteeProductsDesc }}</div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">运费支付方案</div>
        <div class="segment-area">
          <div
            class="segment-area flex-area pb-0 pt-0"
            :span="4"
            v-for="(item, index) in detailData.tradePayRecordList"
            :key="index"
          >
            <div class="segment-item">
              <div class="segment-label">{{ item.costsName }}</div>
              <div class="segment-content">{{ item.totalCosts }} 元</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">装货付款</div>
              <div class="segment-content">{{ item.loadCosts }} 元</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">卸货付款</div>
              <div class="segment-content">{{ item.unloadCosts }} 元</div>
            </div>
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">运单信息</div>
        <div class="segment-area flex-area" :span="4">
          <div class="segment-item">
            <div class="segment-label">发货单号</div>
            <div class="segment-content">{{ detailData.stockOrderNo }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">货源数量</div>
            <div class="segment-content">{{ detailData.carNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">承运公司</div>
            <div class="segment-content" :title="detailData.carrierCompanyName">
              {{ detailData.carrierCompanyName }}
            </div>
          </div>
          <div
            class="font-default float-right lh-36 pointer ml-30"
            @click="handleDetail"
            v-if="detailData.carrierCompanyName"
          >
            查看详情
          </div>
        </div>
      </div>

      <div class="segment">
        <div class="segment-header">运输要求</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">司机上传装货磅单</div>
            <div class="segment-content">{{ detailData.driverLoadPound == 1 ? '是' : '否' }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">装货吨位</div>
            <div class="segment-content">{{ detailData.driverLoadUnit == 1 ? '是' : '否' }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">司机上传卸货磅单</div>
            <div class="segment-content">
              {{ detailData.driverUnloadPound == 1 ? '是' : '否' }}
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">卸货吨位</div>
            <div class="segment-content">{{ detailData.driverUnloadUnit == 1 ? '是' : '否' }}</div>
          </div>
        </div>
      </div>

      <div class="item-header">运费计划</div>
      <el-table :data="detailData.freightPlanList" border>
        <el-table-column
          label="计划运价(元/吨)"
          prop="planUnitPrice"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="生效时间"
          prop="freightPlanEffectDate"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <div class="item-header">操作日志</div>
      <el-table :data="tableData.data" border>
        <el-table-column label="时间" prop="createTime" align="center" min-width="150">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" prop="operateRemark" align="center" min-width="200">
          <template v-slot="scope">
            <span>{{ scope.row.operateTypeName }}</span>
            <span v-if="scope.row.diffItemCount > 0">
              （{{ scope.row.diffItemCount }}项改动）
              <el-button type="text" class="ml-5" @click="handleLogDetail(scope.row)">查看明细</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operateName" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="操作人账号"
          prop="operateMobile"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
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

      <el-dialog title="承运公司详情" :visible.sync="companyVisible">
        <el-table :data="companyData" border>
          <el-table-column prop="carrierName" label="承运公司"></el-table-column>
          <el-table-column prop="scheduleRate" label="调度费比例(%)"></el-table-column>
          <el-table-column prop="scheduleFeeAmount" label="调度费金额(元)"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="查看详情" :visible.sync="publishVisible" :max-height="600">
        <el-table :data="publishData" border>
          <el-table-column prop="target" label="对象"></el-table-column>
          <el-table-column prop="designation" label="名称"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="publishVisible = false">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="操作记录" :visible.sync="handleVisable" custom-class="handle-dialog">
        <div class="timeline-wrap">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in stockInsuranceIntentionOperationLogList"
              :key="index"
              :color="index === 0 ? '#01D28E' : ''"
            >
              <div class="font-size14 mt-5 mb-5">{{ item.operateType === 0 ? '终止协议' : '签约协议' }}</div>
              <span class="font-size14"> {{ item.updateTime }}</span>
              <el-button
                class="bnt"
                @click="onJumpUrl(item.stockInsuranceRetId)"
                v-if="item.operateType === 1"
                type="text"
                >查看协议 >
              </el-button>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div slot="footer">
          <el-button @click="handleVisable = false">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog title="车队长信息" :visible.sync="captainInfoVisable" :max-height="600">
        <el-table :data="detailData.captainInfoList" border>
          <el-table-column prop="captainName" label="车队长姓名" min-width="90"></el-table-column>
          <el-table-column prop="captainMobile" label="车队长手机号" min-width="100"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="captainInfoVisable = false">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 日志明细 -->
      <el-dialog title="日志明细" :visible.sync="logDetailVisable" class="log-dialog">
        <el-table :data="logDetailData" border :max-height="600">
          <el-table-column prop="propertyName" label="改动项" min-width="130"> </el-table-column>
          <el-table-column prop="propertyOldValue" label="改动前" min-width="150">
            <template v-slot="scope">
              <span class="font-gray">{{ scope.row.propertyOldValue }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="propertyValue" label="改动后" min-width="150">
            <template v-slot="scope">
              <span class="font-default">{{ scope.row.propertyValue }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <poster v-show="false" :postData="postData" posterType="stock" ref="poster" />
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import copy from 'clipboard-copy';
import Poster from '@/components/Poster.vue';
import listMixin from '@/utils/listMixin';
export default {
  mixins: [listMixin],
  components: {
    Poster
  },
  data() {
    return {
      detailData: {},
      companyVisible: false,
      companyData: [], //查询企业数据
      publishVisible: false,
      handleVisable: false,
      captainInfoVisable: false,
      publishData: [],
      stockInsuranceIntentionOperationLogList: [],
      postData: {},
      tableOptions: { stockCommonCode: '' },
      tableData: {
        data: [],
        total: 0
      },
      logDetailVisable: false, // 日志明细弹窗
      logDetailData: [] // 操作日志明细
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/transport' },
      { title: '货源列表', path: '/stock/list' },
      { title: '货源详情' }
    ]);
    const result = await axios.post(api.getStockDetail, { stockCode: this.$route.params.id });
    this.detailData = result.data;
    this.stockInsuranceIntentionOperationLogList = result.data.stockInsuranceIntentionOperationLogList || [];
    this.tableOptions.stockCommonCode = this.detailData.stockCommonCode || '';
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.getStockLogList, options);
      this.tableData.data = res.data.data || [];
      this.tableData.total = res.data.total || 0;
    },
    async handleDetail() {
      this.companyVisible = true;
      let { companyCode, price } = this.detailData;
      const result = await axios.post(api.queryCarrierScheduleRate, { companyCode, totalFreight: price });
      this.companyData = result.data;
    },
    // 日志详情
    async handleLogDetail(row) {
      this.logDetailVisable = true;
      const res = await axios.post(api.logDetail, { logId: row.id });
      this.logDetailData = res.data || [];
    },
    async publishDtl() {
      const result = await axios.post(api.releaseDetail, { stockCode: this.$route.params.id });
      this.publishData = result.data.data;
      this.publishVisible = true;
    },
    async onJumpUrl(id) {
      const result = await axios.post(api.queryStockProtocolUrl, {
        stockCode: this.$route.params.id,
        insuranceRelId: id
      });
      window.open(result.data.redirectUrl);
    },
    onJump(url) {
      window.open(url);
    },
    handleCopy() {
      copy(this.detailData.shareLink);
      this.$message.success('复制成功');
    },
    async handleShowPoster() {
      let res = await axios.get(api.getStockPosterData, { params: { stockCode: this.$route.params.id } });
      this.postData = res.data;
      this.$nextTick(() => {
        this.$refs.poster.createQrcode();
      });
    }
  }
};
</script>
<style lang="postcss">
.stock-detail-page {
  .segment .segment-label {
    width: 168px !important;
  }
  .el-dialog__wrapper {
    .el-dialog {
      width: 500px;
      .timeline-wrap {
        max-height: 400px;
        overflow-y: auto;
        padding-left: 50px;
        .bnt {
          position: absolute;
          right: 100px;
          bottom: 5px;
          /* line-height: 20px; */
          font-size: 13px;
        }
      }
    }
    &.log-dialog {
      .el-dialog {
        width: 600px;
      }
    }
  }
}
</style>
