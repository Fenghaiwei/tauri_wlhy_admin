<template>
  <layout navActive="product">
    <div class="licence-config-page">
      <div class="segment">
        <div class="segment-header">
          <span class="title"
            >当前状态:
            <span v-if="details.biddingType == 0">未发布</span>
            <span v-if="details.biddingType == 1">竞价中</span>
            <span v-if="details.biddingType == 2">待开标</span>
            <span v-if="details.biddingType == 3">已开标</span>
            <span v-if="details.biddingType == 5">已作废</span>
          </span>
        </div>
        <div class="segment">
          <div class="segment-header">招标信息</div>
          <div class="segment-area flex-area item-first" span="3">
            <div class="segment-item">
              <div class="segment-label">招标编号</div>
              <div class="segment-content">{{ details.biddingCode }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">招标日期</div>
              <div class="segment-content">{{ details.biddingDate | dateFormat('YYYY-MM-DD') }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">业务员</div>
              <div class="segment-content">{{ details.busiEmployeeName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">网络货运平台</div>
              <div class="segment-content">{{ details.platformName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">平台账号</div>
              <div class="segment-content">{{ details.platformAccountName }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">平台签收人</div>
              <div class="segment-content">{{ details.platformSignerName }}&nbsp;{{ details.platformSignerPhone }}</div>
            </div>
            <div class="segment-item">
              <div class="segment-label">关联订单号</div>
              <div class="segment-content">{{ details.refOrderNo }}</div>
            </div>
          </div>
        </div>

        <div class="segment segment-hight">
          <div class="segment-header">发运信息</div>
          <div class="segment-area flex-area" span="1">
            <div class="segment-item item-second">
              发货信息：&nbsp;&nbsp;<span class="info-details">
                <div class="address">
                  发货地点：{{ details.senderAddress }}
                  <span class="address-details">{{ details.senderAddressDetail }}</span>
                </div>
                <div class="segment-area flex-area people-details" span="2">
                  <div class="segment-item">联系人：{{ details.senderName }}</div>
                  <div class="segment-item">联系电话：{{ details.senderTel }}</div>
                </div>
              </span>
            </div>
            <div class="segment-item item-second item-third">
              收货信息：&nbsp;&nbsp;<span class="info-details">
                <div class="address">
                  收货地点：{{ details.receiverAddress
                  }}<span class="address-details">{{ details.receiverAddressDetail }}</span>
                </div>
                <div class="segment-area flex-area people-details" span="2">
                  <div class="segment-item">联系人：{{ details.receiverName }}</div>
                  <div class="segment-item">联系电话：{{ details.receiverTel }}</div>
                </div>
              </span>
            </div>
            <div class="segment-item item-second item-third">
              产品信息：&nbsp;&nbsp;<span class="info-details-3">
                <div class="segment-area flex-area product-details" span="2">
                  <div class="segment-item">产品编码：{{ details.prodCode }}</div>
                  <div class="segment-item">产品名称：{{ details.prodName }}</div>
                </div>
                <div class="segment-area flex-area product-details" span="2">
                  <div class="segment-item">产品规格：{{ details.specCode }}</div>
                  <div class="segment-item">
                    长度：<span v-if="this.details.prodLength">{{ details.prodLength }}mm</span>
                  </div>
                </div>
                <div class="segment-area flex-area product-details" span="2">
                  <div class="segment-item">
                    宽度：<span v-if="this.details.prodWidth">{{ details.prodWidth }}mm</span>
                  </div>
                </div>
              </span>
            </div>
            <div class="segment-item item-second item-third-4">
              运输需求：&nbsp;&nbsp;<span class="info-details">
                <div class="segment-area flex-area product-details" span="2">
                  <div class="segment-item">
                    发标总重量：<span v-if="this.details.prodWeight">{{ details.prodWeight }}吨</span>
                  </div>
                  <div class="segment-item">
                    需要车数：<span v-if="this.details.truckNum">{{ details.truckNum }}辆</span>
                  </div>
                </div>
                <div class="segment-area flex-area product-details" span="2">
                  <div class="segment-item">
                    产品数量：<span v-if="this.details.prodNum">{{ details.prodNum }}{{ details.prodNumUnit }}</span>
                  </div>
                  <div class="segment-item">装货时间：{{ details.loadTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
                </div>
              </span>
            </div>
          </div>
        </div>

        <div class="segment">
          <div class="segment-header">运输费用</div>
          <div class="segment-area flex-area item-first" span="2">
            <div class="segment-item">
              参考单价：<span v-if="this.details.refFreightPrice">
                <span v-if="this.details.refPriceType == 0">{{ details.refFreightPrice }}元/吨</span>
                <span v-if="this.details.refPriceType == 1">{{ details.refFreightPrice }}元/车</span>
              </span>
            </div>
            <div class="segment-item">
              信息费：<span>{{ details.infoFee }}元</span>
            </div>
            <div class="segment-item warp">
              <div class="segment-label" style="width: 50px">备注：</div>
              <div class="segment-content">{{ details.biddingRemark }}</div>
            </div>
          </div>
        </div>
        <div class="segment">
          <div class="segment-header">投标详情</div>
          <div class="table">
            <el-table :data="tableData.data" border>
              <el-table-column label="投标时间">
                <template v-slot="scope">
                  {{ scope.row.biddingTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column prop="driverName" label="司机"> </el-table-column>
              <el-table-column prop="phoneNo" label="手机号"> </el-table-column>
              <el-table-column prop="enrollNum" label="报价车数"> </el-table-column>
              <el-table-column prop="plateCode" label="车牌"> </el-table-column>
              <el-table-column label="最终报价">
                <template v-slot="scope">
                  <span v-if="scope.row.joinFreightPrice">{{ scope.row.joinFreightPrice }}元/吨</span>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="司机备注"> </el-table-column>
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
          <div class="button" v-if="details.biddingType == 1">
            <el-button type="primary" size="medium" @click="createposter">生成海报</el-button>
            <el-button type="primary" size="medium" @click="handleCopy(details.shareLinkAddress)">分享链接</el-button>
          </div>
        </div>
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
  components: {
    Poster
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      tableData: {
        data: [],
        total: 0
      },
      details: {},
      postData: {}
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '运力招标详情' }]);
    this.search();
  },
  methods: {
    search() {
      const code = this.$route.query.biddingCode;
      const options = {
        biddingCode: code,
        pageNum: 1,
        pageSize: 10
      };
      axios.post(api.biddingDetails, { biddingCode: code }).then(res => (this.details = res.data));
      axios.post(api.biddingdriverOrderList, options).then(res => {
        this.tableData.data = res.data.data;
        this.tableData.total = res.data.total;
      });
    },
    async createposter() {
      let res = await axios.get(api.getPosterData, { params: { biddingCode: this.$route.query.biddingCode } });
      this.postData = res.data;
      this.$nextTick(() => {
        this.$refs.poster.createQrcode();
      });
    },

    handleCopy(item) {
      copy(item);
      this.$message.success('复制成功');
    },
    currentChange(val) {
      axios
        .post(api.biddingdriverOrderList, {
          biddingCode: this.$route.query.biddingCode,
          pageNum: val,
          pageSize: this.pageSize
        })
        .then(res => {
          this.tableData.data = res.data.data;
          this.tableData.total = res.data.total;
        });
    },
    handleSizeChange(val) {
      axios
        .post(api.biddingdriverOrderList, {
          biddingCode: this.$route.query.biddingCode,
          pageNum: 1,
          pageSize: val
        })
        .then(res => {
          this.tableData.data = res.data.data;
          this.tableData.total = res.data.total;
        });
    }
  }
};
</script>

<style>
.title {
  font-size: 16px;
  color: #f04844;
  margin-left: 30px;
}
.segment-title {
  font-size: 15px;
  font-weight: 600;
  width: 100%;
  height: 30px;
  margin-left: 30px;
  margin-top: 50px;
}

.item-first {
  margin-left: 100px;
}
.item-second {
  margin-left: 100px;
}
.info-details {
  width: 800px;
  height: 100px;
  background-color: rgba(242, 242, 242, 1);
}
.info-details-3 {
  width: 800px;
  height: 135px;
  background-color: rgba(242, 242, 242, 1);
}
.item-third {
  margin-top: 100px;
}
.item-third-4 {
  margin-top: 135px;
}
.address {
  margin-left: 50px;
  margin-top: 10px;
}
.address-details {
  margin-left: 100px;
}
.people-details {
  margin-left: 20px;
}
.product-details {
  margin-left: 20px;
  margin-bottom: -25px;
}
.remark {
  margin-left: 30px;
  margin-bottom: 20px;
}
.table {
  margin-top: 30px;
  margin-left: 30px;
  width: 1550px;
}
.button {
  margin-top: 40px;
  margin-left: 600px;
  margin-bottom: 40px;
}
.segment-hight {
  height: 650px;
}
</style>
