<template>
  <layout navActive="config">
    <div class="etc-address-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <div style="display: flex; align-items: center">
            <span class="item-label">装货城市</span>
            <region style="display: inline-block" ref="regionFH" v-on:back-region="selectSourceCode"></region>
          </div>
        </div>
        <div class="toolbar-item">
          <div style="display: flex; align-items: center">
            <span class="item-label">卸货城市</span>
            <region ref="regionXH" style="display: inline-block" v-on:back-region="selectTargetCode"></region>
          </div>
        </div>
        <div class="toolbar-item">
          <span class="item-label">装货地</span>
          <el-input v-model.trim="tableOptions.loadAddress" placeholder="请输入装货地" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">卸货地</span>
          <el-input v-model.trim="tableOptions.unloadAddress" placeholder="请输入卸货地" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.driverName" placeholder="请输入司机姓名" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="装货城市" prop="loadCity" align="center"> </el-table-column>
        <el-table-column label="装货地" prop="loadAddress" align="center"> </el-table-column>
        <el-table-column label="卸货城市" prop="unloadCity" align="center"> </el-table-column>
        <el-table-column label="卸货地" prop="unloadAddress" align="center"> </el-table-column>
        <el-table-column label="司机姓名" prop="driverName" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="creator" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
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
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'EtcLine',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        loadAddress: '', // 装货地
        unloadAddress: '', // 卸货地
        driverName: '', // 司机姓名
        loadProvince: '', // 装货省
        loadCity: '', // 装货市
        loadRegion: '', // 装货区
        unloadProvince: '', // 卸货省
        unloadCity: '', // 卸货市
        unloadRegion: '' // 卸货区
      },
      tableData: {}
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '线路黑名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.qryEtcLine, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = {
        loadAddress: '',
        unloadAddress: '',
        driverName: '',
        loadProvince: '',
        loadCity: '',
        loadRegion: '',
        unloadProvince: '',
        unloadCity: '',
        unloadRegion: ''
      };
      this.$refs.regionFH.resetData();
      this.$refs.regionXH.resetData();
    },
    // 选择装货城市
    selectSourceCode(data) {
      const { province, city, region } = data;
      this.tableOptions.loadProvince = province.nickName || '';
      this.tableOptions.loadCity = city.nickName || '';
      this.tableOptions.loadRegion = region.nickName || '';
    },
    // 选择卸货城市
    selectTargetCode(data) {
      const { province, city, region } = data;
      this.tableOptions.unloadProvince = province.nickName || '';
      this.tableOptions.unloadCity = city.nickName || '';
      this.tableOptions.unloadRegion = region.nickName || '';
    }
  }
};
</script>
<style lang="postcss"></style>
