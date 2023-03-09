<template>
  <layout navActive="config">
    <div class="balance-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">手机号</span>
          <el-input v-model.trim="tableOptions.mobile" placeholder="请输入" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">设置建行密码</span>
          <el-select v-model="tableOptions.isSetCCBPwd" placeholder="请选择" clearable width="120px">
            <el-option value="true" label="是"></el-option>
            <el-option value="false" label="否"></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="handeAdd" v-has="'config:licence:interceptionList:import'"
            >导入拦截名单</el-button
          >
          <el-button type="primary" @click="jumpImport" v-has="'config:licence:interceptionList:autoimport'"
            >自动加入名单</el-button
          >
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="用户编号" prop="userCode" align="center"> </el-table-column>
        <el-table-column label="司机姓名" prop="userName" align="center"> </el-table-column>
        <el-table-column label="注册手机号" prop="mobile" align="center"> </el-table-column>
        <el-table-column label="加入名单时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.addWhitelistTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否设置建行密码" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.setCCBPwd ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台余额提现拦截" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.setCCBPwd">{{ scope.row.setIntercept ? '是' : '否' }}</span>
            <span v-else>
              <el-switch
                class="tableScopeSwitch"
                @change="handleStatusChange(scope.row, scope.$index)"
                active-text="是"
                inactive-text="否"
                v-model="scope.row.setIntercept"
              >
              </el-switch
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="操作日志" min-width="110" align="center" fixed="right">
          <template v-slot="scope">
            <el-button class="font-default" type="text" @click="handleLog(scope.row)">查看</el-button>
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

      <el-dialog title="操作日志" :visible.sync="handleVisable">
        <el-table :data="logData.data" border :max-height="600">
          <el-table-column label="操作人" prop="userName" align="center"> </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template v-slot="scope">
              <span>{{ scope.row.operatedTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="operatedDesc" align="center"> </el-table-column>
          <el-table-column label="原因" prop="reason" align="center"> </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="修改原因" :visible="dialogAddVisable" custom-class="tip-dialog" :show-close="false">
        <el-input
          v-model.trim="modifyText"
          :autosize="{ minRows: 4 }"
          type="textarea"
          placeholder="请输入修改为不拦截的原因"
          :maxlength="100"
        ></el-input>
        <div slot="footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSave" :disabled="!modifyText" type="primary">确认修改</el-button>
        </div>
      </el-dialog>

      <el-dialog title="批量导入拦截名单" :visible="importVisable" :show-close="false" width="500px">
        <el-input
          v-if="!isSucceeded"
          v-model.trim="importList"
          :autosize="{ minRows: 5, maxRows: 10 }"
          type="textarea"
          placeholder="请输入用户编码，编码用“,”或换行隔开，每次最多允许2000条"
        ></el-input>
        <div v-if="isSucceeded" class="tip-title">
          成功导入<span>{{ CountData.successCount || 0 }}</span> 条，失败<span>{{ CountData.failCount || 0 }}</span> 条
        </div>
        <div slot="footer">
          <el-button v-if="!isSucceeded" @click="handleUpload" type="primary">确定导入</el-button>
          <el-button v-if="!isSucceeded" @click="importVisable = false">取消</el-button>
          <el-button v-if="isSucceeded" @click="handleknow" type="primary">我知道了</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
export default {
  name: 'BalanceInterception',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { mobile: '', userName: '', isSetCCBPwd: null },
      tableData: {},
      logData: {
        data: [],
        total: 0
      },
      dialogAddVisable: false,
      handleVisable: false,
      importVisable: false,
      isSucceeded: false,
      modifyText: '',
      importList: '',
      dataIdx: '',
      CountData: {}
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '平台账户提现拦截' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.qryWithdrawWhitelist, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { mobile: '', userName: '' };
    },
    async handleLog(item) {
      this.userCode = item.userCode;
      await this.getLogList();
      this.handleVisable = true;
    },
    async getLogList() {
      let res = await axios.post(api.qryWhitelistWithdrawOperated, {
        pageNum: this.page,
        pageSize: 1000,
        userCode: this.userCode
      });
      this.logData = res.data;
    },
    async handleStatusChange(item, idx) {
      this.modifyText = '';
      if (item.setIntercept) {
        await axios.post(api.WhitelistWithdrawIntercept, {
          isIntercept: item.setIntercept ? 1 : 0,
          userCode: item.userCode
        });
        this.handleSearch();
        return;
      }
      this.dialogAddVisable = true;
      this.dataIdx = idx;
    },
    async handleSave() {
      await axios.post(api.WhitelistWithdrawIntercept, {
        isIntercept: this.tableData.data[this.dataIdx].setIntercept ? 1 : 0,
        userCode: this.tableData.data[this.dataIdx].userCode,
        reason: this.modifyText
      });
      this.dialogAddVisable = false;
      this.handleSearch();
    },
    handleCancel() {
      this.dialogAddVisable = false;
      this.tableData.data[this.dataIdx].setIntercept = !this.tableData.data[this.dataIdx].setIntercept;
    },
    handleknow() {
      this.isSucceeded = false;
      this.importVisable = false;
      this.importList = '';
      this.handleSearch();
    },
    async handleUpload() {
      if (!this.importList) {
        this.$message.error('请输入导入用户信息');
        return;
      }
      let reg = /^[\d\n\,]*$/;
      if (!reg.test(this.importList)) {
        this.$message.error('输入格式错误');
        return;
      }

      let res = await axios.post(api.whitelistWithdrawImport, {
        userCodeStr: this.importList
      });

      this.CountData = res.data;
      this.isSucceeded = true;
    },
    handeAdd() {
      this.importList = '';
      this.importVisable = true;
    },
    jumpImport() {
      this.$router.push('/autoimport/list');
    }
  }
};
</script>
<style lang="postcss">
.balance-page {
  .tip-title {
    text-align: center;
    line-height: 30px;
    font-size: 15px;
  }
  .tableScopeSwitch .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  /*打开时文字位置设置*/
  .tableScopeSwitch .el-switch__label--right {
    z-index: 1;
    right: 6px; /*不同场景下可能不同，自行调整*/
  }
  /*关闭时文字位置设置*/
  .tableScopeSwitch .el-switch__label--left {
    z-index: 1;
    left: 6px; /*不同场景下可能不同，自行调整*/
  }
  /*显示文字*/
  .tableScopeSwitch .el-switch__label.is-active {
    display: block;
  }
  .tableScopeSwitch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 75px !important; /*开关按钮的宽度大小*/
  }
}
</style>
