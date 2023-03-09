<template>
  <layout navActive="config">
    <div class="subscribe-manage-page">
      <div class="segment noborder">
        <div class="segment-area flex-area" span="1">
          <div class="segment-item">
            <div class="segment-label">平台企业名称：</div>
            <div class="segment-content">{{ subscribeData.customerName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">渠道ID：</div>
            <div class="segment-content">{{ subscribeData.customerCode }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">App key：</div>
            <div class="segment-content">{{ subscribeData.appKey }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">secret key：</div>
            <div class="segment-content">{{ subscribeData.secretKey }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">App param：</div>
            <div class="segment-content">{{ subscribeData.appParam }}</div>
          </div>
          <div class="segment-item warp row-width">
            <div class="segment-label">URL：</div>
            <div class="segment-content">
              <el-input
                type="textarea"
                :rows="1"
                maxlength="150"
                v-model.trim="pushUrl"
                placeholder="请输入备注"
                style="width: 500px"
              ></el-input>
            </div>
          </div>
          <div class="segment-item mt-5">
            <div class="segment-label">推送运单类型：</div>
            <div class="segment-content">
              <el-radio-group v-model="pushOrderType">
                <el-radio :label="0">全部运单</el-radio>
                <el-radio :label="10">订单运单</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-tree
      v-if="subscribeList.length > 0"
      ref="tree"
      :data="subscribeList"
      show-checkbox
      node-key="subscribeType"
      :default-checked-keys="subscribeItems"
      :props="defaultProps"
      :default-expand-all="true"
    >
    </el-tree>
    <div class="segment-foot mt-20">
      <el-button type="primary" size="small" @click="hanldeSave">保存</el-button>
      <el-button size="small" @click="handleBack">取消</el-button>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import dayjs from 'dayjs';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
export default {
  mixins: [listMixin],
  data() {
    return {
      customerId: '',
      pushUrl: '',
      pushOrderType: null,
      subscribeData: {},
      subscribeList: [], // 订阅树形结构
      subscribeItems: [], // 已订阅数组
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.customerId = id;
      this.queryDetail();
    }
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: ' 订阅管理' }]);
  },
  methods: {
    async queryDetail() {
      let res = await axios.post(api.openPlateformSubscribeDetail, { customerId: this.customerId });
      this.subscribeData = res.data;
      this.subscribeList = res.data.items;
      this.subscribeItems = res.data.subscribeItems;
      this.pushUrl = res.data.pushUrl;
      this.pushOrderType = res.data.pushOrderType;
    },
    async hanldeSave() {
      if (!this.pushUrl) {
        this.$message.error('请填写URL');
        return;
      }
      if (this.pushOrderType == null) {
        this.$message.error('请选择推送运单类型');
        return;
      }
      var powercodes = this.$refs.tree.getCheckedKeys();
      var powercodes1 = this.$refs.tree.getCheckedNodes();
      console.log('powercodes', powercodes);
      console.log('powercodes1', powercodes1);
      const options = {
        customerId: this.customerId,
        pushUrl: this.pushUrl,
        pushOrderType: this.pushOrderType,
        subscribeTypes: [...powercodes]
      };
      let res = await axios.post(api.openPlateformSubscribeSaveAll, options);
      this.handleBack();
    },
    handleBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="postcss">
</style>
