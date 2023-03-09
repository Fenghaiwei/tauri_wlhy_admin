<template>
  <layout navActive="config">
    <div class="evaluate-result-page">
      <div class="evaluate-result-title">{{ evaluateData.title }}</div>
      <template v-for="(item, idx) in evaluateData.itemConfigList">
        <div :key="item.idx">
          <div class="mt-30 mb-15">
            <span>{{ idx + 1 }}.</span>
            <span>{{ item.itemName }}</span>
          </div>
          <el-table :data="[1]" border>
            <el-table-column label="评价次数" align="center">
              <!-- eslint-disable-next-line -->
              <template slot-scope="scope">
                {{ item.frequency }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(subItem, subIdx) in item.optionConfigList"
              :key="subIdx"
              :label="subItem.optionName"
              :prop="subItem.ratio"
              align="center"
            >
              <!-- eslint-disable-next-line -->
              <template slot-scope="scope">
                <span class="pointer" @click="handleToDetail(subItem)">
                  {{ subItem.ratio }} <span class="ic-serach"></span
                ></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>

      <!-- <div class="evaluate-result-list" v-for="(item, idx) in evaluateData.itemConfigList" :key="item.idx">
        <div class="evaluate-result-name">
          <div>
            <span>{{ idx + 1 }}.</span>
            <span>{{ item.itemName }}</span>
          </div>

          <div>评价次数：{{ item.frequency }}</div>
        </div>
        <div class="evaluate-result-options" v-for="option in item.optionConfigList" :key="option.id">
          <span class="name">{{ option.optionName }}</span>
          <span class="percent">{{ option.ratio }}</span>
          <span class="pointer font-default more" @click="handleToDetail(option)">企业明细</span>
        </div>
      </div> -->
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
      id: null,
      evaluateData: {}
    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.id = id;
      this.queryDetail();
    }
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '查看结果' }]);
  },
  methods: {
    async queryDetail() {
      let res = await axios.post(api.evaluationResultCollect, { id: this.id });
      this.evaluateData = res.data;
    },
    handleToDetail(row) {
      this.$router.push(`/evaluate/enterprise/${row.id}`);
    }
  }
};
</script>
<style lang="postcss">
.evaluate-result-page {
  padding: 20px;
  .evaluate-result-title {
    font-size: 16px;
  }
  .ic-serach {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-top: -5px;
    background: url(../../../assets/img/common/ico_search.png) no-repeat;
    background-size: 14px 14px;
  }
}
</style>
