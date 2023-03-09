<template>
  <layout navActive="product">
    <div class="gross-tonnage-edit">
      <div class="segment">
        <div class="segment-header">
          <span>企业名称</span>
        </div>
        <div class="segment-area flex-area" span="3">
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content">
              <span>{{ formData.companyName }}</span>
              <span class="ml-10">
                <el-button type="primary" @click="handleChoose">{{ formData.companyName ? '修改' : '添加' }}</el-button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header mb-10">
          <span>签收配置</span>
        </div>
        <div class="segment-area flex-area">
          <div class="segment-item">
            <div class="segment-label">线路</div>
            <div class="segment-flex">
              <el-input placeholder="" v-model.trim="formData.loadAddressName" :maxlength="64"></el-input>
              <span class="ml-10 mr-10"> - </span>
              <el-input placeholder="" v-model.trim="formData.unloadAddressName" :maxlength="64"></el-input>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area">
          <div class="segment-item">
            <div class="segment-label">运单日期</div>
            <div class="segment-flex">
              <el-date-picker
                v-model="formData.orderBeginTime"
                type="datetime"
                style="width: 200px"
                placeholder="开始日期"
                value-format="timestamp"
              ></el-date-picker>

              <span class="ml-10 mr-10"> - </span>

              <el-date-picker
                v-model="formData.orderEndTime"
                type="datetime"
                style="width: 200px"
                placeholder="结束日期"
                value-format="timestamp"
                default-time="23:59:59"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area">
          <div class="segment-item">
            <div class="segment-label">参考运单号</div>
            <div class="segment-flex">
              <el-input placeholder="" v-model.trim="formData.referenceOrderNumber"></el-input>
            </div>
          </div>
        </div>
        <div class="segment-foot mt-20">
          <el-button type="primary" @click="handleSave" :disabled="!formData.companyName">保存</el-button>
          <el-button @click="onJumpList">返回</el-button>
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
              <el-radio
                v-model="choose.companyCode"
                :label="scope.row.actualCompanyCode"
                :disabled="!scope.row.dataChooseCan"
                >{{ scope.row.companyName }}</el-radio
              >
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
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';

export default {
  data() {
    return {
      formData: {
        companyCode: '',
        companyName: '',
        loadAddressName: '',
        unloadAddressName: '',
        referenceOrderNumber: '',
        orderBeginTime: '',
        orderEndTime: ''
      },
      choose: {
        companyCode: ''
      },
      pageSize: 20,
      pageNum: 1,
      tableData: {
        data: [],
        total: 0
      },
      addSearchOptions: {
        companyName: ''
      },
      showAddDia: false
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/product' },
      { title: '轨迹工具', path: '/order/track' },
      { title: '添加轨迹工具' }
    ]);
  },
  methods: {
    async handleChoose() {
      await this.fetchData();
      this.choose.companyCode = this.formData.companyCode;
      this.showAddDia = true;
    },
    handleSearch() {
      this.pageNum = 1;
      this.choose.companyCode = '';
      this.fetchData();
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
    handleCurrentChange(val) {
      this.pageNum = val;
      this.choose.companyCode = '';
      this.fetchData();
    },
    handleConfirm() {
      let data = this.tableData.data.filter(el => el.actualCompanyCode === this.choose.companyCode);
      this.formData.companyCode = data[0].actualCompanyCode;
      this.formData.companyName = data[0].companyName;
      this.showAddDia = false;
    },
    onJumpList() {
      this.$router.go(-1);
    },
    async handleSave() {
      if (!this.formData.loadAddressName || !this.formData.unloadAddressName) {
        this.$message.error('线路信息不完整');
        return false;
      }
      if (this.formData.loadAddressName === this.formData.unloadAddressName) {
        this.$message.error('装货地和卸货地不能相同');
        return false;
      }
      if (!this.formData.orderBeginTime || !this.formData.orderEndTime) {
        this.$message.error('请选择运单日期');
        return false;
      }
      if (this.formData.orderBeginTime > this.formData.orderEndTime) {
        this.$message.error('开始日期不能大于结束日期');
        return false;
      }
      if (!this.formData.referenceOrderNumber) {
        this.$message.error('请填写参考运单号');
        return false;
      }
      await axios.post(api.orderTrackCopy, {
        ...this.formData
      });
      this.onJumpList();
    }
  }
};
</script>
<style lang="postcss">
.gross-tonnage-edit {
  .segment .segment-area {
    padding: 8px;
  }
  .segment-flex {
    display: flex;
    align-items: center;
    ..el-input {
      width: 220px;
    }
  }
}
</style>
