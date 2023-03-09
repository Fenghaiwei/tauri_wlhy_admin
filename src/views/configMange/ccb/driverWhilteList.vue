<template>
  <layout navActive="config">
    <div class="ccb-whitelist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">手机号</span>
          <el-input v-model.trim="tableOptions.mobile" placeholder="请输入司机手机号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.userName" placeholder="请输入司机姓名" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="用户编号" prop="userCode" align="center"> </el-table-column>
        <el-table-column label="司机姓名" prop="userName" align="center"> </el-table-column>
        <el-table-column label="注册手机号" prop="mobile" align="center"> </el-table-column>
        <el-table-column label="加入白名单时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.addWhitelistTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否设置建行密码" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.setCCBPwd ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接单是否拦截" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.setCCBPwd">{{ scope.row.setIntercept ? '是' : '否' }}</span>
            <span v-else>
              <el-switch
                class="tableScopeSwitch"
                @change="handleStatusChange(scope.row)"
                active-text="是"
                inactive-text="否"
                v-model="scope.row.setIntercept"
              >
              </el-switch
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="操作日志" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleLog(scope.row)"
              v-has="'config:ccb:driver:whitelist:log'"
              >查看</el-button
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

      <el-dialog title="操作日志" :visible.sync="showLog">
        <el-table :data="logData.data" border :max-height="600">
          <el-table-column label="操作人" prop="userName" align="center"> </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template v-slot="scope">
              <span>{{ scope.row.operatedTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作明细" prop="operatedDesc" align="center"> </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button @click="showLog = false">关闭</el-button>
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
  name: 'CcbDriverWhilteList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { userName: '', mobile: '' },
      tableData: { data: [], total: 0 },
      showLog: false,
      logData: {
        data: [],
        total: 0
      },
      userCode: ''
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '建行司机白名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.qryWhitelist, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { userName: '', mobile: '' };
    },
    async handleLog(item) {
      this.userCode = item.userCode;
      await this.getLogList();
      this.showLog = true;
    },
    async getLogList() {
      let res = await axios.post(api.qryWhitelistOperated, {
        pageNum: this.page,
        pageSize: 1000,
        userCode: this.userCode
      });
      this.logData = res.data;
    },
    // 接单拦截
    async handleStatusChange(item) {
      let msg = !item.setIntercept
        ? '确定修改为接单时不需要弹窗拦截吗，修改后该司机可直接接单，但提现时同样需要进行人脸识别设置密码。'
        : '确定修改为接单时弹窗拦截吗，修改后该司机接单时必须先人脸识别设置建行支付密码。';

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.WhitelistIntercept, {
            isIntercept: item.setIntercept ? 1 : 0,
            userCode: item.userCode
          });
          this.handleSearch();
        })
        .catch(() => {
          item.setIntercept = !item.setIntercept;
        });
    }
  }
};
</script>
<style lang="postcss">
.ccb-whitelist-page {
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
