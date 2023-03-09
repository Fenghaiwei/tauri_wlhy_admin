<template>
  <layout navActive="config">
    <div class="licence-whitelist-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">车牌号</span>
          <el-input v-model.trim="tableOptions.plateNumber" placeholder="请输入车牌号" clearable></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:owncar:whitelist:add'">添加</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="车辆所有人" prop="vehicleOwner" min-width="300" align="center"> </el-table-column>
        <el-table-column label="车牌号" prop="plateNumber" min-width="300" align="center"> </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="130" prop="createTime"> </el-table-column>
        <el-table-column label="创建人" prop="createUser" align="center"> </el-table-column>
        <el-table-column label="操作" min-width="150" align="center">
          <template v-slot="scope">
            <el-button
              class="font-default"
              type="text"
              @click="handleDel(scope.row)"
              v-has="'config:owncar:whitelist:del'"
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

      <el-dialog title="" :visible.sync="addOwncarWhite" custom-class="tip-dialog" :close-on-click-modal="false">
        <div class="add-owncarWhite">
          <span>车牌号码：</span>
          <el-input
            v-model.trim="plateNumbers"
            type="textarea"
            :rows="5"
            placeholder="支持批量添加，信息用'，'或换行隔开；每次最多添加100辆车"
          />
        </div>

        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!plateNumbers">确定</el-button>
          <el-button @click="addOwncarWhite = false">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="" :visible.sync="addResultDia" custom-class="tip-dialog" :close-on-click-modal="false">
        <div>
          <p>{{ addResultTip }}</p>
        </div>
        <div slot="footer">
          <el-button @click="addResultDia = false" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import CompanySearch from '@/components/CompanySearch.vue';
import utils from '@/utils/utils';
export default {
  components: { CompanySearch },
  name: 'OwncarWhitelist',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { plateNumber: '' },
      tableData: {},
      addOwncarWhite: false,
      plateNumbers: '',
      addResultDia: false,
      addResultTip: ''
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '企业自有车白名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.ownerCarCompanyList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { plateNumber: '' };
    },
    onAdd() {
      this.plateNumbers = '';
      this.addOwncarWhite = true;
    },
    async handleSave() {
      const plateNumbers = utils.batchSearchFilter(this.plateNumbers);
      if (plateNumbers.length > 100) {
        this.$message.error('每次最多添加100辆车');
        return;
      }
      let res = await axios.post(api.ownerCarCompanyAdd, { plateNumbers });
      this.addOwncarWhite = false;
      if (res.data) {
        this.addResultTip = res.data;
        this.addResultDia = true;
      }
      this.handleSearch();
    },

    async handleDel(item) {
      this.$confirm(`是否操作移除？`, '确定移除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.ownerCarCompanyDelete, { id: item.id });
          this.handleSearch();
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="postcss">
.licence-whitelist-page {
  .title-box {
    width: 450px;
  }
  .add-owncarWhite {
    display: flex;
    span {
      margin-top: 10px;
      width: 120px;
    }
  }
  .tip-dialog {
    width: 500px;
  }
}
</style>
