<template>
  <layout navActive="user">
    <div class="collection-settings-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">注册时间</span>
          <el-date-picker
            style="width: 380px"
            v-model="createTimeRange"
            @change="onDateChange"
            value-format="timestamp"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            :default-time="[' 00:00:00', '23:59:59']"
          ></el-date-picker>
        </div>

        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">注册手机号</span>
          <el-input v-model.trim="tableOptions.userPhone" placeholder="请输入注册手机号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">车牌号</span>
          <el-input v-model.trim="tableOptions.plateNumber" placeholder="至少输入车牌号后3位" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">证件状态</span>
          <el-select
            v-model="tableOptions.licenceType"
            placeholder="请选择证件类型"
            style="width: 200px"
            clearable
            @change="hanldeChange"
          >
            <el-option
              v-for="(item, idx) in licenceTypeOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            :disabled="!tableOptions.licenceType"
            v-model="tableOptions.licenceStatus"
            placeholder="请选择证件状态"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="(item, idx) in licenceStatusOptions"
              :key="idx"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">身份证号</span>
          <el-input v-model.trim="tableOptions.idCard" placeholder="请输入身份证号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearchFn">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="lookDriver">查询已注销司机</el-button>
          <el-button type="primary" @click="lookCar">查询已删除车辆</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="司机姓名" prop="userName" min-width="120">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册手机号" prop="userPhone" min-width="120">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.userPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idCard" min-width="150">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.idCard | idCardSen }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="120">
          <template v-slot="scope">
            <span class="pointer" @click="handleDtl(scope.row)"> {{ scope.row.plateNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证" prop="idCardCertifyStateDesc" min-width="120">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.idCardCertifyState === 2 || scope.row.idCardCertifyState === 5
              }"
            >
              {{ scope.row.idCardCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="驾驶证" prop="driverCertifyStateDesc" min-width="120">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.driverCertifyState === 2 || scope.row.driverCertifyState === 5
              }"
            >
              {{ scope.row.driverCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="从业资格证" prop="qualificationCertifyStateDesc" min-width="120">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.qualificationCertifyState === 2 || scope.row.qualificationCertifyState === 5
              }"
            >
              {{ scope.row.qualificationCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="行驶证" prop="drivingCertifyStateDesc" min-width="120">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.drivingCertifyState === 2 || scope.row.drivingCertifyState === 5
              }"
            >
              {{ scope.row.drivingCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="道路运输证" prop="roadLicenceCertifyStateDesc" min-width="120">
          <template v-slot="scope">
            <span
              :class="{
                'font-orange': scope.row.roadLicenceCertifyState === 2 || scope.row.roadLicenceCertifyState === 5
              }"
            >
              {{ scope.row.roadLicenceCertifyStateDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope">
            <el-button type="primary" @click="handleDtl(scope.row)">查看详情</el-button>
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
  name: 'DriverInfo',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: {
        userName: '',
        userPhone: '',
        plateNumber: '',
        queryTimeStart: null,
        queryTimeEnd: null,
        licenceType: null,
        licenceStatus: null,
        idCard: ''
      },
      tableData: { data: [], total: 0 },
      createTimeRange: [],
      licenceTypeOptions: [],
      licenceStatusOptions: []
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '司机资料库' }]);
    this.getSysDictData();
  },
  methods: {
    handleSearchFn() {
      if (this.tableOptions.licenceType && !this.tableOptions.licenceStatus) {
        this.$message.error('请选中一个证件状态');
        return false;
      }
      if (
        this.tableOptions.licenceType &&
        this.tableOptions.licenceStatus &&
        !this.tableOptions.userName &&
        !this.tableOptions.userPhone &&
        !this.tableOptions.plateNumber &&
        !this.tableOptions.queryTimeStart &&
        !this.tableOptions.queryTimeEnd
      ) {
        this.$message.error('至少填写一个其它筛选项');
        return false;
      }
      if (
        this.tableOptions.queryTimeStart &&
        this.tableOptions.queryTimeEnd &&
        this.tableOptions.queryTimeEnd - this.tableOptions.queryTimeStart > 60 * 60 * 1000 * 24 * 30
      ) {
        this.$message.error(' 注册时间跨度限制不超过30天');
        return false;
      }
      this.handleSearch();
    },
    // 选择时间范围回调
    onDateChange(val) {
      if (val && val.length > 0) {
        this.tableOptions.queryTimeStart = val[0];
        this.tableOptions.queryTimeEnd = val[1];
      } else {
        this.tableOptions.queryTimeStart = null;
        this.tableOptions.queryTimeEnd = null;
      }
    },
    // 获取字典
    async getSysDictData() {
      let driverVehicleLicenceType = await utils.getSysDict('driver_vehicle_licence_type', true);
      let driverVehicleLicenceStatus = await utils.getSysDict('driver_vehicle_licence_status', true);
      this.licenceTypeOptions = driverVehicleLicenceType;
      this.licenceStatusOptions = driverVehicleLicenceStatus;
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.userList, options);
      this.tableData.data = res.data.data;
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.createTimeRange = [];
      this.tableOptions = {
        userName: '',
        userPhone: '',
        plateNumber: '',
        queryTimeStart: null,
        queryTimeEnd: null,
        licenceType: null,
        licenceStatus: null,
        idCard: ''
      };
    },
    hanldeChange(val) {
      if (!val) this.tableOptions.licenceStatus = null;
    },
    lookDriver() {
      this.$router.push(`/logout/driver/list`);
    },
    lookCar() {
      this.$router.push(`/delete/car/list`);
    },
    handleDtl(row) {
      this.$router.push(`/certification/detail/${row.userCode}?pagetype=3`);
    }
  }
};
</script>
<style lang="postcss"></style>
