<template>
  <div>hhh</div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'CertificationDetail',
  mixins: [listMixin],

  data() {
    return {
      userCode: '',
      driverBaseInfoRsp: {}, //基本信息
      driverPersonalInfoRspList: [], // 个人资料
      vehicleInfoRspList: [], // 车辆资料
      routeMap: [
        { routeActice: '/driver/audit/list', navTitle: '司机资料审核' },
        { routeActice: '/car/audit/list', navTitle: '车辆资料审核' },
        { routeActice: '/driver/info', navTitle: '司机资料库' }
      ],
      reason: '',
      useableVisable: false,
      destoryVisable: false,
      userDestroyBeforeDataRsp: {},
      driverDestroyForm: {
        cancelImg: '',
        cancelReason: ''
      },
      rules: {
        cancelImg: [{ required: true, message: '请上传注销凭证' }],
        cancelReason: [{ required: true, message: '请输入注销原因' }]
      }
    };
  },
  created() {
    this.pageType = this.$route.query.pagetype;
    this.userCode = this.$route.params.key;
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/user' },
      { title: this.routeMap[this.pageType - 1].navTitle, path: this.routeMap[this.pageType - 1].routeActice },
      { title: '认证详情' }
    ]);
    this.$store.dispatch('changeSideAction', this.routeMap[this.pageType - 1].routeActice);
    this.fetchDetail();
  },
  methods: {
    // 查询详情
    async fetchDetail() {
      let res = await axios.post(api.queryCertificationDetails, { userCode: this.userCode });
      this.driverBaseInfoRsp = res.data.driverBaseInfoRsp;
      this.driverPersonalInfoRspList = res.data.driverPersonalInfoRspList || [];
      this.vehicleInfoRspList = res.data.vehicleInfoRspList || [];
    },
    // 查看头像照片
    async showImage(url) {
      this.$store.dispatch('showViewer', { data: [{ url: url }] });
    },
    handlePersonalAudit(item) {
      this.$router.push(`/personaldata/audit/${item.userCode}`);
    },
    handleCarAudit(item) {
      this.$router.push(`/cardata/audit/${item.userCode}/${item.vehicleId}`);
    },
    // 启用/禁用
    handleUseable() {
      this.reason = '';
      this.useableVisable = true;
    },
    async handleSaveUseable() {
      await axios.post(api.userStateAble, {
        enable: this.driverBaseInfoRsp.userState == 1 ? false : true,
        reason: this.reason,
        userCode: this.userCode
      });
      this.useableVisable = false;
      this.fetchDetail();
    },
    // 注销
    async handleUserDestroy() {
      let res = await axios.post(api.findUserDestroyBeforeData, { userCode: this.userCode });
      this.userDestroyBeforeDataRsp = res.data || {};
      this.driverDestroyForm.cancelImg = '';
      this.driverDestroyForm.cancelReason = '';
      this.$refs['driverDestroyRef'] && this.$refs['driverDestroyRef'].resetFields();
      this.destoryVisable = true;
    },
    // 导入成功回调
    importSuccess(file) {
      this.driverDestroyForm.cancelImg = file.resUrl;
      this.$refs.driverDestroyRef.clearValidate(['cancelImg']);
    },
    importRemove() {
      this.driverDestroyForm.cancelImg = '';
    },
    handleSaveDestory() {
      this.$refs.driverDestroyRef.validate(async valid => {
        if (valid) {
          await axios.post(api.userDestroy, {
            ...this.driverDestroyForm,
            userCode: this.userCode
          });
          this.destoryVisable = false;
          this.$router.push(`${this.routeMap[this.pageType - 1].routeActice}`);
        }
      });
    },
    // 运单详情
    handleOrderDtl(orderNumber) {
      this.$router.push(`/monitor/order/detail/${orderNumber}`);
    }
  }
};
</script>
<style lang="postcss" scoped>
.certification-detail {
  .upload-flex {
    display: flex;
    flex-wrap: wrap;
    margin: 20px;
    /* .upload-item {
      margin-right: 20px;
      text-align: center;
      .img-preview-item {
        display: inline-block;
      }
    } */
  }
  .plate-number {
    padding: 2px 8px;
    background: #ffbf00;
    border: 1px solid #924413;
    border-radius: 3px;
    color: #111111;
  }
  .segment .segment-label {
    width: 160px !important;
  }
  .car-common-tag {
    padding: 2px 8px;
    border: 1px solid #01d28e;
    color: #01d28e;
    border-radius: 3px;
    text-align: center;
  }
  .destroy-box {
    width: 800px;
    .segment-destroy-box {
      max-height: 600px;
      overflow-y: scroll;
    }
  }
}
</style>
