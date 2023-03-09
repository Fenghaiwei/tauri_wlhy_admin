<template>
  <layout navActive="config">
    <div class="interface-manage-page">
      <div class="segment noborder">
        <div class="segment-area flex-area" span="1">
          <div class="segment-item">
            <div class="segment-label">平台企业名称：</div>
            <div class="segment-content">{{ interfaceData.customerName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">渠道ID：</div>
            <div class="segment-content">{{ interfaceData.customerCode }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">App key：</div>
            <div class="segment-content">{{ interfaceData.appKey }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">secret key：</div>
            <div class="segment-content">{{ interfaceData.secretKey }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">App param：</div>
            <div class="segment-content">{{ interfaceData.appParam }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-tree
      v-if="interfaceList.length > 0"
      ref="tree"
      :data="interfaceList"
      show-checkbox
      node-key="apiType"
      :default-checked-keys="interfaceItems"
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
      interfaceData: {},
      interfaceList: [], // 订阅树形结构
      interfaceItems: [], // 已订阅数组
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
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: ' 接口管理' }]);
  },
  methods: {
    async queryDetail() {
      let res = await axios.post(api.openPlateformApiDetail, { customerId: this.customerId });
      this.interfaceData = res.data;
      this.interfaceList = res.data.items;
      this.interfaceItems = res.data.apiItems;
    },
    async hanldeSave() {
      var powercodes = this.$refs.tree.getCheckedKeys();
      var powercodes1 = this.$refs.tree.getCheckedNodes();
      console.log('powercodes', powercodes);
      console.log('powercodes1', powercodes1);
      const options = {
        customerId: this.customerId,
        apiTypes: [...powercodes]
      };
      let res = await axios.post(api.openPlateformApiSaveAll, options);
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
