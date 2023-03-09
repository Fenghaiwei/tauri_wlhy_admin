<template>
  <layout navActive="match">
    <div>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input
            v-model.trim="tableOptions.driverName"
            placeholder="请输入司机姓名"
            clearable
            maxlength="50"
            @keyup.enter.native="search"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">身份证号</span>
          <el-input
            v-model.trim="tableOptions.idCard"
            placeholder="请输入身份证号"
            clearable
            maxlength="50"
            @keyup.enter.native="search"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">导出状态</span>
          <el-select filterable clearable v-model="tableOptions.exportStatus" placeholder="请选择导出状态">
            <el-option
              v-for="data in dictData.exportStatusEnum"
              :key="data.value"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">税务登记状态</span>
          <el-select filterable clearable v-model="tableOptions.taxRegisterStatusEnum" placeholder="请选择税务登记状态">
            <el-option
              v-for="data in dictData.taxRegisterStatusEnum"
              :key="data.value"
              :label="data.label"
              :value="data.value"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item" v-has="'match:driver:member:list:batchExport'">
          <el-dropdown>
            <el-button type="primary">批量导出</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleExport(el.value)"
                v-for="el in dictData.exportTypeEnum"
                :key="el.value"
                >{{ el.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="toolbar-item" v-has="'match:driver:member:list:import'">
          <fe-upload
            listType="text"
            :hidetip="true"
            :showFileList="false"
            :limit="9999"
            :allowType="['json']"
            @success="importSuccess"
          >
            <template slot="uploadBtn">
              <el-button type="primary">导入</el-button>
            </template>
          </fe-upload>
        </div>
      </div>

      <el-table :data="tableData.data" border ref="tableRef" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="55" reserve-selection align="center" fixed="left"></el-table-column>
        <el-table-column label="姓名" prop="driverName" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="身份证号" prop="idCard" min-width="170" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机号" prop="driverMobile" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="临时税务登记号"
          prop="taxRegisterNo"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="临时税务登记状态"
          prop="taxRegisterStatusName"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="临时税务登记说明"
          prop="taxRegisterExplain"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="导出状态"
          prop="exportStatusName"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="更新日期" prop="updateTime" min-width="150" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.row.updateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" prop="handle" fixed="right">
          <template v-slot="scope">
            <el-button type="text" @click="handleViewAgreement(scope.row)">查看代开协议</el-button>
            <el-button type="text" @click="hanldeToDetail(scope.row)">查看详情</el-button>
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
  name: 'DriverMemberList',
  mixins: [listMixin],
  data() {
    return {
      dictData: {
        taxRegisterStatusEnum: [
          { label: '登记成功', value: '0' },
          { label: '登记失败', value: '1' }
        ], // 税务登记状态、司机状态
        exportStatusEnum: [
          { label: '未导出', value: '0' },
          { label: '已导出', value: '1' }
        ], // 导出状态
        exportTypeEnum: [
          { label: 'xlsx格式', value: 'xlsx' },
          { label: 'json格式', value: 'json' }
        ] // 导出类型
      },
      pageSize: 20,
      tableOptions: {
        driverName: '',
        exportStatus: '',
        idCard: '',
        taxRegisterStatusEnum: ''
      },
      tableData: {},
      selectData: [] // 多选数据
    };
  },
  created() {},
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/match' }, { title: this.$route.meta.title }]);
    this.handleSearch();
  },
  methods: {
    search() {
      this.$refs.tableRef.clearSelection(); // 清空多选
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let { data } = await axios.post(api.queryDriverList, options);
      this.tableData = data || {};
    },
    // 查看代开协议
    async handleViewAgreement(row) {
      let { data } = await axios.post(api.queryDriverAgreement, { driverCode: row.driverCode });
      if (data && data.dkAgreementUrl) {
        utils.openNewTab(data.dkAgreementUrl);
      } else {
        this.$message.warning('暂无代开协议！');
      }
    },
    //点击多选，获取所选数据
    handleSelectionChange(val) {
      this.selectData = val;
    },
    // 查看详情
    hanldeToDetail(row) {
      this.$router.push(`/driver/member/detail/${row.driverCode}`);
    },
    // 导入成功回调
    async importSuccess(file) {
      await axios.post(api.matchDriverImport, { fileUrl: file.resUrl });
      this.$message.success('导入成功');
      this.search();
    },
    // 导出
    async handleExport(type) {
      if (this.selectData && this.selectData.length > 0) {
        let ids = this.selectData.map(el => el.id);
        if (type === 'xlsx') {
          await axios.post(api.matchDriverExportExcel, { ids });
          this.$refs.tableRef.clearSelection(); // 清空多选
          this.$message.success('添加导出任务成功，请在个人中心-下载列表新查看');
        } else if (type === 'json') {
          this.$refs.tableRef.clearSelection(); // 清空多选
          utils.openNewTab(`${api.matchDriverExportJson}?ids=${ids}`);
        }
      } else {
        this.$message.warning('请先勾选数据，再执行导出');
      }
    },
    // 重置
    onReset() {
      Object.keys(this.tableOptions).forEach(key => {
        this.tableOptions[key] = '';
      });
    }
  }
};
</script>
