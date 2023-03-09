<template>
  <layout navActive="config">
    <div class="data-reporting-page">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in paneArr" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
      </el-tabs>
      <div class="mt-10 mb-20 font-orange">
        <div v-if="activeName == 'DataAnti'">
          此功能用于通过省数据上报平台的&lt;报文参考号&gt;反查司机和车辆信息，目前仅适用于湖北省
        </div>
        <div v-else>此功能用于修改司机和车辆标的认证状态，请谨慎操作</div>
      </div>
      <component :is="currentComponent"></component>
    </div>
  </layout>
</template>

<script>
import DataAntiQuery from './DataAntiQuery.vue';
import BatchUpdateCertification from './BatchUpdateCertification.vue';

export default {
  name: '',
  components: {
    DataAntiQuery,
    BatchUpdateCertification
  },
  data() {
    return {
      activeName: 'DataAnti',
      currentComponent: DataAntiQuery,
      paneArr: [
        { label: '省平台异常数据反查', value: 'DataAnti', component: DataAntiQuery },
        { label: '批量修改认证状态', value: 'Certification', component: BatchUpdateCertification }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '数据上报异常处理' }]);
    },
    handleClick(tab) {
      let activeItem = this.paneArr.find(item => item.value === this.activeName);
      this.currentComponent = activeItem.component;
    }
  }
};
</script>
<style lang="postcss"></style>
