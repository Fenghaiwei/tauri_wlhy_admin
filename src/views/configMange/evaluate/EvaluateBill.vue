<template>
  <layout navActive="config">
    <div class="evaluate-bill-page">
      <el-tabs v-model="tabActive" @tab-click="tabChange" class="control-tab">
        <el-tab-pane label="异常单服务评价" name="abnormal"></el-tab-pane>
        <el-tab-pane label="开票服务评价" name="bill"></el-tab-pane>
      </el-tabs>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:evaluate:add'">添加</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column type="index" label="序号" width="160"> </el-table-column>
        <el-table-column label="标题" prop="title" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creatorName" align="center"> </el-table-column>
        <el-table-column label="上线时间" prop="onlineTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.onlineTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上线人" prop="onlinerName" align="center"> </el-table-column>
        <el-table-column label="状态" prop="configStateDesc" align="center"> </el-table-column>
        <el-table-column label="备注" prop="memo" align="center"> </el-table-column>
        <el-table-column label="操作" min-width="110" align="center" fixed="right">
          <template v-slot="scope">
            <template v-if="scope.row.configState === 1">
              <el-button type="text" @click="handleEdit(scope.row)" v-has="'config:evaluate:edit'">编辑</el-button>
              <el-button type="text" @click="handleConfig(scope.row)" v-has="'config:evaluate:detail'"
                >评价配置</el-button
              >
              <el-button type="text" @click="handleSwitch(scope.row)" v-has="'config:evaluate:switch'">上线</el-button>
              <el-button class="font-red" type="text" @click="handleDel(scope.row)" v-has="'config:evaluate:del'"
                >删除</el-button
              >
            </template>

            <el-button
              v-if="scope.row.configState === 2"
              class="font-default"
              type="text"
              v-has="'config:evaluate:switch'"
              @click="handleSwitch(scope.row)"
              >下线</el-button
            >

            <el-button
              v-if="scope.row.configState === 2 || scope.row.configState === 3"
              class="font-default"
              type="text"
              v-has="'config:evaluate:result'"
              @click="handleResult(scope.row)"
              >查看结果</el-button
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

      <el-dialog
        :title="`${id ? '编辑' : '添加'}开票服务评价`"
        :visible.sync="dialogAddVisable"
        custom-class="tip-dialog"
      >
        <el-form :model="formAdd" ref="formAdd" :rules="rules" label-width="90px">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="formAdd.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model.trim="formAdd.memo" auto-complete="off" placeholder="请输入备注"></el-input>
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
import dayjs from 'dayjs';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
export default {
  name: 'EvaluateBill',
  mixins: [listMixin],
  data() {
    return {
      tabActive: 'bill',
      pageSize: 20,
      id: '',
      tableOptions: { configType: 2 },
      tableData: {},
      dialogAddVisable: false,
      formAdd: { title: '', memo: '' },
      rules: {
        title: [{ required: true, message: '请输入标题' }]
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '评价配置' }]);
    this.handleSearch();
  },
  methods: {
    tabChange(val) {
      if (this.tabActive == 'abnormal') {
        this.$router.replace({
          path: '/evaluate/abnormal'
        });
      } else {
        this.$router.replace({
          path: '/evaluate/bill'
        });
      }
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.evaluationConfigList, options);
      this.tableData = res.data;
    },
    onAdd() {
      if (this.$refs['formAdd']) {
        this.$refs['formAdd'].resetFields();
      }

      this.id = null;
      this.formAdd.title = '';
      this.formAdd.memo = '';
      this.dialogAddVisable = true;
    },
    async handleDel(item) {
      this.$confirm(`确定删除该服务`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await axios.post(api.evaluationConfigDelete, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleSwitch(item) {
      const options = {
        id: item.id,
        onlineType: item.configState === 1 ? 1 : 2
      };
      let res = await axios.post(api.evaluationConfigOnline, { ...options });
      this.handleSearch();
    },
    handleSave() {
      this.$refs.formAdd.validate(async valid => {
        if (valid) {
          let url = api.evaluationConfigAdd;
          let options = { ...this.formAdd, configType: 2 };
          if (this.id) {
            options.id = this.id;
            url = api.evaluationConfigUpdate;
          }
          let res = await axios.post(url, options);
          this.dialogAddVisable = false;
          this.handleSearch();
        }
      });
    },
    handleEdit(item) {
      this.formAdd.title = item.title;
      this.formAdd.memo = item.memo;
      this.dialogAddVisable = true;
      this.id = item.id;
    },
    handleConfig(item) {
      this.$router.push(`/evaluate/edit/${item.id}`);
    },
    handleResult(item) {
      this.$router.push(`/evaluate/result/${item.id}`);
    }
  }
};
</script>
<style lang="postcss"></style>
