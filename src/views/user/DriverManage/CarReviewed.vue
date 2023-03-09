<template>
  <layout navActive="user">
    <div class="collection-settings-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">复核时间</span>
          <el-date-picker
            style="width: 380px"
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="请选择复核开始时间"
            end-placeholder="请选择复核结束时间"
            :default-time="[' 00:00:00', '23:59:59']"
          ></el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">注册手机号</span>
          <el-input v-model.trim="tableOptions.userMobile" placeholder="至少输入手机号后4位" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">身份证号</span>
          <el-input v-model.trim="tableOptions.idCode" placeholder="至少输入身份证前5位" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车牌号</span>
          <el-input v-model.trim="tableOptions.plateNumber" placeholder="至少输入车牌号后3位" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">承运公司</span>
          <el-select
            v-model="tableOptions.carrierCompanyCode"
            placeholder="请选择承运公司"
            style="width: 200px"
            clearable
            filterable
          >
            <el-option
              v-for="(item, idx) in carrierCompanyOptions"
              :key="idx"
              :label="item.carrierCompanyName"
              :value="item.carrierCompanyCode"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">复核结果</span>
          <el-select v-model="tableOptions.auditResultType" placeholder="请选择复核结果" style="width: 200px" clearable>
            <el-option
              v-for="(item, idx) in auditResultTypeOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearchFn">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="复核时间" prop="auditTime" width="160"> </el-table-column>
        <el-table-column label="承运公司" prop="carrierCompanyName" min-width="220"> </el-table-column>
        <el-table-column label="司机姓名" min-width="130" prop="userName">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册手机号" min-width="130" prop="userMobile">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" min-width="130" prop="idCode">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.idCode }}</span>
          </template>
        </el-table-column>

        <el-table-column label="车牌号" min-width="130" prop="plateNumber">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.plateNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column label="行驶证" prop="drivingLicenceAuditState" min-width="150">
          <template v-slot="scope">
            <span v-if="scope.row.drivingLicenceAuditState == 1" class="font-defalut"> 通过 </span>
            <span v-if="scope.row.drivingLicenceAuditState == 2" class="font-red">
              不通过
              <span v-if="scope.row.drivingLicenceRejectReason">({{ scope.row.drivingLicenceRejectReason }})</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="道路运输证" prop="roadLicenceAuditState" min-width="150">
          <template v-slot="scope">
            <span v-if="scope.row.roadLicenceAuditState == 1" class="font-defalut"> 通过 </span>
            <span v-if="scope.row.roadLicenceAuditState == 2" class="font-red">
              不通过 <span v-if="scope.row.roadLicenceRejectReason">({{ scope.row.roadLicenceRejectReason }})</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleDtl(scope.row)">查看详情</el-button>
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
import utils from '@/utils/utils';
export default {
  name: 'CarReviewed',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      createTimeRange: [new Date(utils.getDatePre(7)).getTime(), utils.getCurrentMonth().eDate],
      tableOptions: {
        auditStartTime: new Date(utils.getDatePre(7)).getTime(),
        auditEndTime: utils.getCurrentMonth().eDate,
        userName: '',
        userMobile: '',
        idCode: '',
        plateNumber: '',
        carrierCompanyCode: '',
        auditResultType: 2
      },
      tableData: { data: [], total: 0 },
      carrierCompanyOptions: [],
      auditResultTypeOptions: [
        { label: '通过', value: 1 },
        { label: '不通过', value: 2 }
      ]
    };
  },
  created() {
    this.getCarrierList();
    this.handleSearchFn();
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '车辆复核记录' }]);
  },
  methods: {
    handleSearchFn() {
      if (
        this.tableOptions.auditStartTime &&
        this.tableOptions.auditEndTime &&
        this.tableOptions.auditEndTime - this.tableOptions.auditStartTime > 60 * 60 * 1000 * 24 * 100
      ) {
        this.$message.error(' 复核时间跨度限制不超过100天');
        return false;
      }
      this.handleSearch();
    },
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.auditStartTime = val[0];
        this.tableOptions.auditEndTime = val[1];
      } else {
        this.tableOptions.auditStartTime = null;
        this.tableOptions.auditEndTime = null;
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.pageVehicleCarrierReviewed, options);
      this.tableData.data = res.data.data;
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.createTimeRange = [new Date(utils.getDatePre(7)).getTime(), utils.getCurrentMonth().eDate];
      this.tableOptions = {
        auditStartTime: new Date(utils.getDatePre(7)).getTime(),
        auditEndTime: utils.getCurrentMonth().eDate,
        userName: '',
        userMobile: '',
        idCode: '',
        plateNumber: '',
        carrierCompanyCode: '',
        auditResultType: 2
      };
    },
    async getCarrierList() {
      let res = await axios.post(api.carrierList, { pageNum: 1, pageSize: 9999 });
      this.carrierCompanyOptions = res.data.data || [];
    },
    handleDtl(row) {
      this.$router.push(`/cardata/audit/${row.userCode}/${row.vehicleId}`);
    }
  }
};
</script>
<style lang="postcss"></style>
