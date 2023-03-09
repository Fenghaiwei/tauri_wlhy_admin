<template>
  <layout navActive="transport">
    <div class="transport-newspaper-plan">
      <div class="search-box toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">创建时间</span>
          <el-date-picker
            v-model="tableOptions.createTime"
            value-format="timestamp"
            type="date"
            placeholder="选择日期"
            @change="selectTimeChange"
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
        <div class="toolbar-item">
          <span class="item-label">报号状态</span>
          <el-select v-model="tableOptions.status" placeholder="请选择报号状态">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" size="small" @click="handleSearch"> 筛选</el-button>
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column prop="companyName" label="企业名称" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="sourceAddressName" label="装货地名称" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="targetAddressName" label="卸货地名称" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="unitPrice" label="运价（元/吨）" width="140"> </el-table-column>
        <el-table-column prop="needCarNum" label="要车数量"> </el-table-column>
        <el-table-column prop="bookCloseTime" label="报号截止日期" width="140">
          <template v-slot="scope">
            <span>{{ scope.row.bookCloseTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loadTime" label="装车日期" width="140">
          <template v-slot="scope">
            <span>{{ scope.row.loadTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="loadCloseTime" label="装车截止日期" width="140">
          <template v-slot="scope">
            <span>{{ scope.row.loadCloseTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="报号状态"> </el-table-column>
        <el-table-column prop="driverNum" label="报号车数"> </el-table-column>
        <el-table-column prop="remainNum" label="剩余车数"> </el-table-column>
        <el-table-column prop="currentBookOrderNum" label="运单数"> </el-table-column>
        <el-table-column prop="changePriceNum" label="调价次数"> </el-table-column>
        <el-table-column prop="createName" label="创建人"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button type="text" @click="handleToDiver(scope.row)">查看司机</el-button>
            <el-button type="text" @click="priceHistory(scope.row)">调价历史</el-button>
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

      <el-dialog title="调价历史" :visible.sync="dialogVisible" width="30%" :max-height="600">
        <el-table :data="priceData" border>
          <el-table-column label="运费单价（元/吨）" prop="unitPrice"></el-table-column>
          <el-table-column label="报号数量" prop="carNum">
            <template v-slot="scope">
              <span> {{ scope.row.carNum }} </span>
              <template v-if="scope.row.addNum > 0 || scope.row.subNum > 0">
                (<span class="blueFont" v-if="scope.row.addNum > 0"> +{{ scope.row.addNum }} </span>
                <span class="redFont" v-if="scope.row.subNum > 0"> -{{ scope.row.subNum }} </span>)
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="createUserName"></el-table-column>
          <el-table-column label="操作时间" prop="createTime">
            <template v-slot="scope">
              <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'BooPlan',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        companyName: '',
        sourceAddressName: '',
        targetAddressName: '',
        createTime: '',
        keyword: '',
        status: ''
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '报号中', value: 1 },
        { label: '报号已截止', value: 2 },
        { label: '装车中', value: 3 },
        { label: '装车已截止', value: 4 }
      ],
      tableData: { data: [], total: 0 },
      priceData: [],
      dialogVisible: false
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '报号计划列表' }]);
    this.handleSearch();
  },
  methods: {
    selectTimeChange(val) {
      this.tableOptions.createTime = val + 8.64e7 - 1000;
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.bookScheduleList, options);
      this.tableData = res.data;
    },
    async priceHistory(row) {
      let res = await axios.post(api.bookPriceHis, { bookId: row.id });
      this.priceData = res.data;
      this.dialogVisible = true;
    },
    handleToDiver(row) {
      this.$router.push(`/book/driver/${row.id}`);
    },
    onReset() {
      this.tableOptions = {
        createTime: '',
        keyword: '',
        status: '',
        companyName: '',
        sourceAddressName: '',
        targetAddressName: ''
      };
    }
  }
};
</script>
<style></style>
