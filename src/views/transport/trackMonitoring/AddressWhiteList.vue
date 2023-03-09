<template>
  <layout navActive="transport">
    <div class="address-whitelist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">白名单名称</span>
          <el-input
            style="width: 300px"
            v-model.trim="tableOptions.listName"
            placeholder="请输入"
            :maxlength="100"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="handleAdd" v-has="'transport:address:white:list:add'">添加</el-button>
        </div>
      </div>

      <el-table :data="tableData.data" border>
        <el-table-column label="白名单名称" align="center" prop="listName"> </el-table-column>
        <el-table-column label="创建人" align="center" prop="createName"> </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">
            {{ scope.row.rowCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'transport:address:white:list:delete'"
              >删除</el-button
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

      <el-dialog title="请输入名称" :visible="addVisable" custom-class="tip-dialog" :show-close="false">
        <el-input
          style="width: 300px"
          v-model.trim="whiteName"
          placeholder="请输入"
          :maxlength="20"
          clearable
        ></el-input>
        <template #footer>
          <el-button @click="addVisable = false">取消</el-button>
          <el-button @click="handleConfirm" :disabled="!whiteName" type="primary">保存</el-button>
        </template>
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
  name: 'AddressWhiteList',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { listName: '' },
      tableData: {
        data: [],
        total: 0
      },
      addVisable: false,
      whiteName: ''
    };
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '地址白名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.addressWhiteList, options);
      if (res.data) this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { listName: '' };
    },
    async handleConfirm() {
      await axios.post(api.addressWhiteListAdd, { listName: this.whiteName });
      this.handleSearch();
      this.addVisable = false;
    },
    handleAdd() {
      this.whiteName = '';
      this.addVisable = true;
    },
    async handleDel(item) {
      this.$confirm(`确定移除该企业配置？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.addressWhiteListDelete, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="postcss"></style>
