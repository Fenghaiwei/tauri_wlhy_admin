<template>
  <layout navActive="config">
    <div class="driver-blacklist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">司机姓名</span>
          <el-input v-model.trim="tableOptions.driverName" placeholder="请输入司机姓名" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">司机手机号</span>
          <el-input v-model.trim="tableOptions.driverPhone" placeholder="请输入司机手机号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:driver:blacklist:add'">添加</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="司机姓名" prop="driverName" align="center"> </el-table-column>
        <el-table-column label="司机身份证" prop="driverIdCode" align="center"> </el-table-column>
        <el-table-column label="司机手机号" prop="driverPhone" align="center"> </el-table-column>
        <el-table-column label="原因" prop="reasonRemark" align="center"> </el-table-column>
        <el-table-column label="拦截策略" prop="interceptTypeDesc" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="operatorName" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.operatorTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'config:driver:blacklist:del'"
              >移除</el-button
            >
            <el-button class="font-default" type="text" @click="handleEdit(scope.row)">编辑</el-button>
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

      <el-dialog title="" :visible.sync="showDriver" custom-class="add-driver-dialog">
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">司机姓名</span>
            <el-input v-model.trim="addDriverOptions.driverName" clearable placeholder="请输入司机姓名"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">司机手机号</span>
            <el-input v-model.trim="addDriverOptions.driverPhone" clearable placeholder="请输入司机手机号"></el-input>
          </div>

          <div class="toolbar-item">
            <el-button type="primary" @click="handleAddSearch">筛选</el-button>
          </div>
        </div>

        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">拦截策略</span>
            <el-select style="width: 205px" v-model="formAdd.interceptType" placeholder="请选择" multiple>
              <el-option
                v-for="item in dictData.blacklistInterceptType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="toolbar-item">
            <span class="item-label">拦截用户</span>
            <el-select style="width: 205px" v-model="formAdd.interceptMode" placeholder="请选择" multiple>
              <el-option
                v-for="item in dictData.blacklistInterceptMode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="toolbar-panel">
          <div class="toolbar-item">
            <span class="item-label">黑名单原因</span>
            <el-select style="width: 205px" v-model="formAdd.reasonCode" placeholder="请选择">
              <el-option v-for="item in causes" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
            <el-input
              class="limit-input"
              v-if="formAdd.reasonCode === 9"
              v-model.trim="formAdd.reasonRemark"
              placeholder="请输入黑名单原因"
              :maxlength="32"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <el-table
          :data="driverData.data"
          border
          @selection-change="multiselect"
          ref="multipleTable"
          row-key="driverCode"
          :max-height="600"
        >
          <el-table-column type="selection" width="40" reserve-selection :selectable="isSelect"> </el-table-column>
          <el-table-column label="司机姓名" prop="driverName" align="center"> </el-table-column>
          <el-table-column label="司机手机号" prop="driverPhone" align="center"> </el-table-column>
        </el-table>

        <div class="pagination-fix">
          <el-pagination
            :page-size="pageSize"
            :current-page.sync="driverPage"
            :total="driverData.total"
            @current-change="handleDriverChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!saveable">确定</el-button>
          <el-button @click="showDriver = false">关闭</el-button>
        </div>
      </el-dialog>

      <!--编辑司机黑名单-->
      <el-dialog title="编辑" :visible.sync="dialogEditVisable" custom-class="edit-dialog">
        <el-form :model="formAdd" ref="formAdd" label-width="130px">
          <el-form-item label="司机姓名">
            <el-input v-model.trim="otherData.driverName" placeholder="司机姓名" disabled></el-input>
          </el-form-item>
          <el-form-item label="司机手机号">
            <el-input v-model.trim="otherData.driverPhone" placeholder="司机手机号" disabled></el-input>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-select v-model="formAdd.reasonCode" placeholder="请选择" class="custom-select">
              <el-option v-for="item in causes" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
            <el-input
              class="mt-10"
              v-if="formAdd.reasonCode === 9"
              v-model.trim="formAdd.reasonRemark"
              placeholder="请输入黑名单原因"
              :maxlength="32"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="拦截策略">
            <el-select v-model="formAdd.interceptType" placeholder="请选择" multiple class="custom-select">
              <el-option
                v-for="item in dictData.blacklistInterceptType"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拦截用户">
            <el-select v-model="formAdd.interceptMode" placeholder="请选择" multiple class="custom-select">
              <el-option
                v-for="item in dictData.blacklistInterceptMode"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSave" type="primary">确定</el-button>
          <el-button @click="dialogEditVisable = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
export default {
  name: 'DriverBlacklist',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      createTimeRange: [],
      tableOptions: { driverName: '', driverPhone: '' },
      tableData: {},
      showDriver: false,
      multiselectList: [],
      driverData: {
        data: [],
        total: 0
      },
      driverPage: 1,
      addDriverOptions: {
        driverName: '',
        driverPhone: ''
      },
      causeVisible: false,
      causes: [],
      dictData: {
        blacklistInterceptType: [],
        blacklistInterceptMode: []
      },
      otherData: {
        driverName: '',
        driverPhone: ''
      },
      formAdd: {
        interceptMode: [],
        interceptType: [],
        reasonCode: '',
        reasonRemark: ''
      },
      id: '',
      dialogEditVisable: false
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '司机黑名单' }]);
    this.handleSearch();
    this.getSysDict();
  },
  computed: {
    saveable() {
      return this.multiselectList.length > 0 && this.formAdd.reasonCode !== '';
    }
  },
  methods: {
    // 获取字典
    async getSysDict() {
      this.dictData.blacklistInterceptType = await utils.getSysDict('black_list_intercept_type', true);
      this.dictData.blacklistInterceptMode = await utils.getSysDict('black_list_intercept_mode', true);
      this.getReasonOptions();
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.getDriverBlacklist, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { driverName: '', driverPhone: '' };
    },
    onAdd() {
      this.addDriverOptions.driverName = '';
      this.addDriverOptions.driverPhone = '';
      this.formAdd.reasonCode = '';
      this.formAdd.reasonRemark = '';
      this.formAdd.interceptMode = [];
      this.formAdd.interceptType = [];
      this.id = '';
      this.showDriver = true;
      this.handleAddSearch();
    },
    handleAddSearch() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
      });

      this.driverPage = 1;
      this.getDriverList();
    },
    isSelect(row, index) {
      if (!row.isInBlackList) {
        return 1;
      } else {
        return 0;
      }
    },
    multiselect(val) {
      this.multiselectList = val;
    },
    handleDriverChange(val) {
      this.driverPage = val;
      this.getDriverList();
    },
    async getDriverList() {
      const options = { pageNum: this.driverPage, pageSize: this.pageSize, ...this.addDriverOptions };
      let res = await axios.post(api.getDriverList, options);
      this.driverData = res.data;
    },
    async handleDel(item) {
      await axios.post(api.delDriverFromBlacklist, { driverCode: item.driverCode });
      this.handleSearch();
    },
    handleEdit(item) {
      this.otherData.driverName = item.driverName;
      this.otherData.driverPhone = item.driverPhone;
      this.formAdd.reasonCode = item.reasonCode;
      this.formAdd.reasonRemark = item.reasonRemark;
      this.formAdd.interceptMode = item.interceptMode;
      this.formAdd.interceptType = item.interceptType;
      this.id = item.id;
      this.dialogEditVisable = true;
    },
    async handleSave() {
      if (this.formAdd.reasonCode == 9 && !this.formAdd.reasonRemark) {
        this.$message.error('请输入黑名单原因');
        return;
      }
      if (this.formAdd.interceptType.length == 0) {
        this.$message.error('请选择拦截策略');
        return;
      }
      if (this.formAdd.interceptMode.length == 0) {
        this.$message.error('请选择拦截用户');
        return;
      }
      if (this.formAdd.reasonCode !== 9) {
        const reason = this.causes.find(reason => reason.code === this.formAdd.reasonCode);
        this.formAdd.reasonRemark = reason && reason.desc;
      }
      let apiUrl = api.addDriverToBlacklist;
      let opts = { ...this.formAdd };
      if (this.id) {
        opts.id = this.id;
        apiUrl = api.editDriverToBlacklist;
      } else {
        opts.driverList = [...this.multiselectList];
      }
      await axios.post(apiUrl, opts);
      if (this.id) {
        this.dialogEditVisable = false;
      } else {
        this.showDriver = false;
      }
      this.handleSearch();
    },
    async getReasonOptions() {
      const res = await axios.post(api.getBlacklistReasons);
      this.causes = res.data.data;
    }
  }
};
</script>
<style lang="postcss">
.driver-blacklist-page {
  .cause-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-select,
    .el-input {
      width: 300px;
    }
    .el-input {
      margin-top: 16px;
    }
  }
  .limit-input {
    input {
      padding-right: 45px;
    }
  }
  .add-driver-dialog {
    width: 720px;
  }
  .edit-dialog {
    width: 500px;
    .custom-select {
      width: 100%;
    }
  }
}
</style>
