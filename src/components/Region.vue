<template>
  <div class="region-box" ref="regionBox">
    <el-select
      class="region-select"
      v-model="province"
      filterable
      placeholder="请选择省"
      @change="provinceChange"
      value-key="regionCode"
    >
      <el-option v-for="(item, index) in provinceList" :key="index" :value="item" :label="item.regionName"></el-option>
    </el-select>
    <el-select
      class="region-select"
      v-model="city"
      filterable
      placeholder="请选择市"
      @change="cityChange"
      value-key="regionCode"
    >
      <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.regionName"></el-option>
    </el-select>

    <el-select
      class="region-select"
      v-model="region"
      filterable
      placeholder="请选择区"
      @change="callBack"
      value-key="regionCode"
    >
      <el-option v-for="(item, index) in regionList" :key="index" :value="item" :label="item.regionName"></el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      province: {},
      city: {},
      region: {},
      provinceList: [],
      cityList: [],
      regionList: []
    };
  },
  created: function () {
    this.getData();
  },

  methods: {
    async getData() {
      let res = await axios.post(api.sysRegion);
      this.provinceList = res.data;
    },
    async provinceChange(val) {
      let res = await axios.post(api.sysRegion, { regioncode: val.regionCode });
      this.cityList = res.data;
      this.regionList = [];
      this.city = {};
      this.region = {};
      this.callBack();
    },
    async cityChange(val) {
      let res = await axios.post(api.sysRegion, { regioncode: val.regionCode });
      this.regionList = res.data;
      this.region = {};
      this.callBack();
    },
    callBack() {
      this.$emit('back-region', { province: this.province, city: this.city, region: this.region });
    },
    resetData() {
      this.province = {};
      this.cityList = [];
      this.regionList = [];
      this.city = {};
      this.region = {};
    }
  }
};
</script>
<style>
.region-box .region-select {
  float: left;
  width: 120px;
  margin: 0 10px 0 0;
}
</style>
