<template>
  <layout navActive="config">
    <div class="account-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">手机号</span>
          <el-input v-model.trim="tableOptions.mobile" placeholder="请输入手机号" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <span class="item-label">状态</span>
          <el-select v-model="tableOptions.status" placeholder="请选择状态">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="已启用" :value="1"></el-option>
            <el-option label="已停用" :value="2"></el-option>
          </el-select>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:account:add'">添加账号</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="手机号" prop="mobile" align="center"> </el-table-column>
        <el-table-column label="姓名" prop="name" align="center"> </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.status === 1 ? '已启用' : '已停用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center" fixed="right">
          <template v-slot="scope">
            <el-button
              v-if="scope.row.status === 1"
              class="font-default"
              type="text"
              @click="handleSwitch(scope.row)"
              v-has="'config:account:switch'"
              >停用</el-button
            >
            <template v-if="scope.row.status === 2">
              <el-button
                class="font-default"
                type="text"
                @click="handleSwitch(scope.row)"
                v-has="'config:account:switch'"
                >启用</el-button
              >
              <el-button class="font-red" type="text" @click="handleDel(scope.row)" v-has="'config:account:del'"
                >删除</el-button
              >
            </template>
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

      <el-dialog title="添加账号" :visible.sync="dialogAddVisable" custom-class="tip-dialog">
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="90px">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.trim="formAdd.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="formAdd.name" auto-complete="off" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSave" type="primary">确定</el-button>
          <el-button @click="dialogAddVisable = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import { isPhoneValid } from '@fe/form-valid';
export default {
  name: 'Account',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { mobile: '', status: 0 },
      tableData: {},
      dialogAddVisable: false,
      formAdd: { name: '', mobile: '' },
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
        mobile: [
          { required: true, message: '请输入手机号' },
          { validator: isPhoneValid, message: '手机号格式不正确', trigger: 'blur' }
        ]
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '定位工具账号管理' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.gisListPhone, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { mobile: '', status: 0 };
    },
    onAdd() {
      if (this.$refs['formAdd']) {
        this.$refs['formAdd'].resetFields();
      }
      this.dialogAddVisable = true;
      this.formAdd.name = '';
      this.formAdd.mobile = '';
    },
    async handleDel(item) {
      this.$confirm(`确定删除该账号`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.gisDelPhone, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleSwitch(item) {
      const options = {
        id: item.id,
        status: item.status === 1 ? 2 : 1
      };
      let res = await axios.post(api.gisSwitchStatusPhone, { ...options });
      this.handleSearch();
    },
    handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          let res = await axios.post(api.gisSavePhone, { ...this.formAdd });
          this.dialogAddVisable = false;
          this.handleSearch();
        }
      });
    }
  }
};
</script>
<style lang="postcss">
.account-page {
  .el-dialog__body {
    text-align: center;
  }
}
</style>
