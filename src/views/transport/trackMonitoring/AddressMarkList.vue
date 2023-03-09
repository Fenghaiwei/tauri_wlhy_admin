<template>
  <layout navActive="transport">
    <div class="address-marklist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">添加时间</span>
          <el-date-picker
            :clearable="false"
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">关键字</span>
          <el-input
            style="width: 300px"
            v-model.trim="tableOptions.keyword"
            placeholder="请输入详细地址，地址名称，添加人"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">地址类型</span>
          <el-select v-model="tableOptions.addressType" placeholder="请选择地址类型">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="黑名单" :value="1"></el-option>
            <el-option label="白名单" :value="2"></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">标签</span>
          <el-select
            v-model="tableOptions.labelCodes"
            multiple
            collapse-tags
            clearable
            placeholder="请选择标签"
            style="width: 200px"
          >
            <el-option v-for="(item, idx) in labelList" :key="idx" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="区域" align="center">
          <template v-slot="scope">
            <template v-if="scope.row.pointType === 1">
              {{ scope.row.markPoint.regionName }}
            </template>
            <template v-if="scope.row.pointType === 2">
              <div>{{ scope.row.markLine.startRegionName }}</div>
              <div>{{ scope.row.markLine.endRegionName }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" min-width="200">
          <template v-slot="scope">
            <template v-if="scope.row.pointType === 1">
              {{ scope.row.markPoint.addressDetail }}
            </template>
            <template v-if="scope.row.pointType === 2">
              <div>{{ scope.row.markLine.startAddressDetail }}</div>
              <div>{{ scope.row.markLine.endAddressDetail }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="地址类型" align="center" prop="addressTypeName"> </el-table-column>
        <el-table-column label="地址名称" align="center" prop="addressName"> </el-table-column>
        <el-table-column label="标签" prop="labelName" align="center">
          <template v-slot="scope">
            {{ scope.row.labelNames ? scope.row.labelNames.join(',') : '' }}
          </template>
        </el-table-column>
        <el-table-column label="添加人" align="center" prop="createName"> </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDtl(scope.row)"
              v-has="'transport:address:mark:list:detail'"
              >查看详情</el-button
            >
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'transport:address:mark:list:del'"
              >删除</el-button
            >
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
import dayjs from 'dayjs';
import utils from '@/utils/utils';
export default {
  name: 'AddressMarkList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      labelListAll: [],
      labelList: [],
      createTimeRange: [],
      tableOptions: { startTime: '', endTime: '', addressType: 0, keyword: '', labelCodes: [] },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  watch: {
    'tableOptions.addressType'(val) {
      if (val == 0) {
        this.labelList = this.labelListAll;
      } else {
        this.labelList = [...this.labelListAll].filter(el => el.type == val);
      }
      this.tableOptions.labelCodes = [];
    }
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '地址标记列表' }]);
    this.getAddressLabel();
    this.handleSearch();
  },
  methods: {
    async getAddressLabel() {
      let res = await axios.post(api.addressLabel, { type: 0 });
      this.labelList = res.data || [];
      this.labelListAll = res.data;
    },
    // 选择时间范围回调
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.tableOptions.startTime = val[0];
        this.tableOptions.endTime = val[1];
      } else {
        this.tableOptions.startTime = '';
        this.tableOptions.endTime = '';
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.markAddress, options);
      if (res.data) this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { startTime: '', endTime: '', addressType: 0, keyword: '', labelCodes: [] };
      this.createTimeRange = [];
    },
    handleDtl(row) {
      this.$router.push(`/address/mark/detail/${row.id}`);
    },
    async handleDel(item) {
      this.$confirm(`确定删除该地址？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.markAddressDel, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="postcss">
.address-marklist-page {
  .el-dialog__body {
    text-align: center;
  }
}
</style>
