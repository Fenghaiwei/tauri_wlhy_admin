<template>
  <layout navActive="transport">
    <div class="address-setting-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">企业名称</span>
          <el-input
            style="width: 300px"
            v-model.trim="tableOptions.companyName"
            placeholder="请输入"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="addJump" v-has="'transport:exceptionlevelsetting:list:add'">添加</el-button>
          <el-button type="primary" @click="configException" v-has="'transport:exceptionlevelsetting:list:config'"
            >配置异常等级</el-button
          >
          <el-button type="primary" @click="lookLevel" v-has="'transport:exceptionlevelsetting:list:see'"
            >查看异常等级</el-button
          >
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="企业名称" align="center" prop="companyName"> </el-table-column>
        <el-table-column label="异常等级" align="center" prop="abnormalLevelNames"> </el-table-column>
        <el-table-column label="创建人" align="center" prop="createName" width="250px"> </el-table-column>
        <el-table-column label="创建时间" align="center" width="250px">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'transport:exceptionlevelsetting:list:del'"
              >移除</el-button
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

      <el-dialog title="配置异常等级" :visible.sync="isVisable" :center="true">
        <el-table :data="levelData" border>
          <el-table-column label="一级级别" align="center" prop="firstAbnormalLevel"> </el-table-column>
          <el-table-column label="二级级别" align="center" prop="abnormalLevel"> </el-table-column>
          <el-table-column label="异常类型" align="center" prop="abnormalTypeName"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="text" @click="handleLogDel(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="异常等级" :visible="isAbnormal" :show-close="false">
        <div class="abnormal-content">
          <div class="title">选择异常类型</div>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in exceptionType" :key="item.id" :label="item.value">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="abnormal-content">
          <div class="title">输入一级异常等级</div>
          <el-input
            v-model.trim="firstAbnormalName"
            style="width: 500px"
            placeholder="请输入"
            :maxlength="10"
          ></el-input>
        </div>
        <div class="abnormal-content">
          <div class="title">输入二级异常等级</div>
          <el-input v-model.trim="abnormalName" style="width: 500px" placeholder="请输入" :maxlength="10"></el-input>
        </div>

        <div slot="footer">
          <el-button @click="isAbnormal = false">取消</el-button>
          <el-button
            @click="handlePreservation"
            :disabled="checkList.length === 0 || !firstAbnormalName || !abnormalName"
            type="primary"
            >保存</el-button
          >
        </div>
      </el-dialog>
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
  name: 'ExceptionSetting',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { companyName: '' },
      tableData: {
        data: [],
        total: 0
      },
      levelData: [],
      exceptionType: [],
      isVisable: false,
      isAbnormal: false,
      checkList: [],
      abnormalName: '',
      firstAbnormalName: ''
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '异常等级设置' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.configListTrack, options);
      this.tableData = res.data;
    },
    async lookLevel() {
      this.isVisable = true;
      let res = await axios.post(api.configListLevel);
      if (res.data) this.levelData = res.data;
    },
    onReset() {
      this.tableOptions = { companyName: '' };
    },
    async handleDel(item) {
      this.$confirm(`确定移除该企业配置？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.configListTracklDel, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    },
    // 配置异常等级
    async configException() {
      this.checkList = [];
      this.firstAbnormalName = '';
      this.abnormalName = '';
      this.isAbnormal = true;
      let res = await axios.post(api.configListLevelType);
      if (res.data) this.exceptionType = res.data;
    },
    addJump() {
      this.$router.push('/exceptionlevelsetting/add');
    },
    async handlePreservation() {
      await axios.post(api.configListLevelAdd, {
        abnormalTypes: this.checkList,
        firstAbnormalName: this.firstAbnormalName,
        abnormalName: this.abnormalName
      });
      this.isAbnormal = false;
    },
    async handleLogDel(row) {
      await axios.post(api.configDelLevel, { id: row.id });
      this.lookLevel();
    }
  }
};
</script>
<style lang="postcss">
.address-setting-page {
  .abnormal-content {
    margin-bottom: 20px;
    .title {
      font-size: 15px;
      margin-bottom: 10px;
    }
  }
}
</style>
