<template>
  <layout navActive="transport">
    <div class="segment">
      <div class="segment-header">
        <span>企业名称</span>
      </div>
      <div class="segment-area flex-area" span="3">
        <div class="segment-item">
          <div class="segment-label">企业名称</div>
          <div class="segment-content">
            <span>{{ companyInfo.companyName }}</span>
            <span class="ml-10">
              <el-button type="primary" @click="handleChoose">{{
                companyInfo.companyName ? '修改' : '添加'
              }}</el-button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="segment">
      <div class="segment-header">
        <span>配置异常等级</span>
      </div>
      <div class="segment-area flex-area" span="3">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.id" v-for="item in levelData" :key="item.id">{{ item.abnormalLevel }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <el-dialog title="" :visible.sync="showAddDia">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input v-model.trim="addSearchOptions.companyName" clearable placeholder="请输入企业名称"></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border :max-height="600">
        <el-table-column label="企业名称">
          <template v-slot="scope">
            <el-radio v-model="choose.companyCode" :label="scope.row.actualCompanyCode">{{
              scope.row.companyName
            }}</el-radio>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="tableData.total"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="handleConfirm" type="primary" :disabled="!choose.companyCode">确定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-button
        type="primary"
        @click="handlePreservation"
        :disabled="checkList.length === 0 || !companyInfo.companyName"
        >保存</el-button
      >
      <el-button @click="onJumpList">取消</el-button>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
export default {
  data() {
    return {
      companyInfo: {
        companyCode: '',
        companyName: ''
      },
      checkList: [],
      addSearchOptions: {
        companyName: ''
      },
      pageSize: 20,
      pageNum: 1,
      showAddDia: false,
      choose: {
        companyCode: ''
      },
      levelData: [],
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/transport' },
      { title: '异常等级设置', path: '/exceptionsettings/list' },
      { title: '添加企业' }
    ]);
    this.getLevelData();
  },
  methods: {
    async getLevelData() {
      let res = await axios.post(api.configListLevel);
      if (res.data) this.levelData = res.data;
    },
    async handleChoose() {
      await this.fetchData();
      this.showAddDia = true;
    },
    fetchData() {
      return new Promise(async (resolve, rej) => {
        let res = await axios.post(api.getCompanyList, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          filterCertified: true,
          ...this.addSearchOptions
        });
        this.tableData = res.data;
        resolve();
      });
    },

    handleSearch() {
      this.pageNum = 1;
      this.choose.companyCode = '';
      this.fetchData();
    },

    handleCurrentChange(val) {
      this.pageNum = val;
      this.choose.companyCode = '';
      this.fetchData();
    },
    handleConfirm() {
      let data = this.tableData.data.filter(el => el.actualCompanyCode === this.choose.companyCode);
      this.companyInfo.companyCode = data[0].actualCompanyCode;
      this.companyInfo.companyName = data[0].companyName;
      this.showAddDia = false;
    },
    onJumpList() {
      this.$router.go(-1);
    },
    async handlePreservation() {
      await axios.post(api.configListTracklAdd, {
        abnormalLevelIds: this.checkList,
        companyCode: this.companyInfo.companyCode,
        companyName: this.companyInfo.companyName
      });
      this.$router.push('/exceptionsettings/list');
      this.$message.success('添加成功');
    }
  }
};
</script>
<style></style>
