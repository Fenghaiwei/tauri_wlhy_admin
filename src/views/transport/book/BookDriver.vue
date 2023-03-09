<template>
  <layout navActive="transport">
    <div class="transport-newspaper-drive">
      <div class="search-box toolbar-panel">
        <template v-if="!bookId">
          <div class="toolbar-item">
            <span class="item-label">报号日期</span>
            <el-date-picker
              v-model="timeRange"
              :editable="false"
              @change="chioceTime"
              value-format="timestamp"
              type="datetimerange"
              placeholder="选择日期范围"
              :default-time="[' 00:00:00', '23:59:59']"
              :clearable="false"
            >
            </el-date-picker>
          </div>
          <div class="toolbar-item">
            <span class="item-label">企业名称</span>
            <el-input v-model.trim="tableOptions.companyName" placeholder="企业名称" style="width: 200px"> </el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">装货地名称</span>
            <el-input v-model.trim="tableOptions.sourceAddressName" placeholder="装货地名称" style="width: 200px">
            </el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">卸货地名称</span>
            <el-input v-model.trim="tableOptions.targetAddressName" placeholder="卸货地名称" style="width: 200px">
            </el-input>
          </div>
        </template>
        <div class="toolbar-item">
          <span class="item-label">关键字</span>
          <el-input
            v-model.trim="tableOptions.keyword"
            placeholder="经纪人、经纪人手机号、车牌号、司机姓名、司机手机号"
            style="width: 420px"
          >
          </el-input>
        </div>
        <!-- <div class="toolbar-item">
          <span class="item-label">报号状态</span>
          <el-select v-model="tableOptions.status" placeholder="请选择报号状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div> -->
        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch"> 筛选</el-button>
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column prop="sourceAddressName" label="装货地名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="targetAddressName" label="卸货地名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="plateNumber" label="车牌号"> </el-table-column>
        <el-table-column prop="driverName" label="司机姓名"> </el-table-column>
        <el-table-column prop="driverMobile" label="司机手机号"> </el-table-column>
        <el-table-column prop="agentName" label="经纪人"> </el-table-column>
        <el-table-column prop="agentMobile" label="经纪人手机号"> </el-table-column>
        <el-table-column prop="bookCreateTime" label="报号时间">
          <template v-slot="scope">
            <span>{{ scope.row.bookCreateTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="运费单价（元/吨）"> </el-table-column>
        <el-table-column prop="statusName" label="报号状态"> </el-table-column>
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
import utils from '@/utils/utils';
export default {
  name: 'BookDriver',
  mixins: [listMixin],
  data() {
    return {
      bookId: '',
      pageSize: 20,
      tableOptions: {
        startTime: '',
        endTime: '',
        sourceAddressName: '',
        targetAddressName: '',
        keyword: '',
        companyName: ''
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '报号中', value: 1 },
        { label: '报号已截止', value: 2 },
        { label: '装车中', value: 3 },
        { label: '装车已截止', value: 4 }
      ],
      timeRange: [],
      tableData: { data: [], total: 0 }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '报号司机列表' }]);
    this.bookId = this.$route.params.id || '';
    if (this.bookId) this.tableOptions.bookId = this.bookId;
    this.initDatetime();
    this.handleSearch();
  },
  methods: {
    initDatetime() {
      if (this.bookId) {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
        this.timeRange = [];
      } else {
        this.tableOptions.startTime = utils.getCurrentMonth().nowDate;
        this.tableOptions.endTime = utils.getCurrentMonth().eDate;
        this.timeRange = [this.tableOptions.startTime, this.tableOptions.endTime];
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.bookDriverList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.initDatetime();
      this.tableOptions.sourceAddressName = '';
      this.tableOptions.targetAddressName = '';
      this.tableOptions.keyword = '';
      this.tableOptions.companyName = '';
    },
    chioceTime(val) {
      if (val) {
        this.tableOptions.startTime = new Date(val[0]).getTime();
        this.tableOptions.endTime = new Date(val[1]).getTime();
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    }
  }
};
</script>
<style></style>
