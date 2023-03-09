<template>
  <layout navActive="product">
    <div class="balance-zs-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <div class="balance-show">可用余额：{{ money | thousands(2) }}</div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
export default {
  data() {
    return {
      money: ''
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/product' }, { title: '众树余额查询' }]);
    this.handleSearch();
  },
  methods: {
    async handleSearch() {
      let res = await axios.post(api.zsBalanceQry);
      this.money = res.data;
    }
  }
};
</script>
<style lang="postcss">
.balance-zs-page {
  .balance-show {
    font-size: 28px;
  }
}
</style>
