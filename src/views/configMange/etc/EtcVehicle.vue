<template>
  <layout navActive="config">
    <div class="etc-vehicle-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">车牌号码</span>
          <el-input v-model.trim="tableOptions.plateNumber" placeholder="请输入车牌号码" clearable></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="onAdd" v-has="'config:etc:vehicle:add'">添加</el-button>
          <el-button
            type="primary"
            @click="onDel"
            :disabled="multiselectList.length === 0"
            v-has="'config:etc:vehicle:del'"
            >删除</el-button
          >
        </div>
      </div>
      <el-table :data="tableData.data" border @selection-change="multiselect" ref="multipleTable">
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="车牌号码" prop="plateNumber" align="center"> </el-table-column>
        <el-table-column label="创建人" prop="createrUserName" align="center"> </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm') }}</span>
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

      <el-dialog title="" :visible.sync="addEtcVehicle" custom-class="tip-dialog" :close-on-click-modal="false">
        <div class="add-etc-vehicle">
          <span>车牌号码：</span>
          <el-input
            v-model.trim="plateNumberList"
            type="textarea"
            :rows="5"
            placeholder="支持批量添加，信息用'，'或换行隔开；每次最多添加100辆车"
          />
        </div>
        <div slot="footer">
          <el-button @click="handleSave" type="primary" :disabled="!plateNumberList">确定</el-button>
          <el-button @click="addEtcVehicle = false">关闭</el-button>
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
  name: 'EtcVehicle',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { plateNumber: '' },
      tableData: {},
      multiselectList: [],
      addEtcVehicle: false,
      plateNumberList: ''
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '车辆黑名单' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.etcVehicleBlackList, options);
      this.tableData = res.data;
    },
    onReset() {
      this.tableOptions = { plateNumber: '' };
    },
    onAdd() {
      this.plateNumberList = '';
      this.addEtcVehicle = true;
    },
    multiselect(val) {
      this.multiselectList = val;
    },
    async onDel() {
      this.$confirm(`移除黑名单后，该车牌产生的运单将会自动开具ETC发票。是否确认移除？`, '确定删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let idList = this.multiselectList.map(el => el.id);
          let res = await axios.post(api.etcVehicleBlackDelete, { idList });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async handleSave() {
      let res = await axios.post(api.etcVehicleBlackAdd, { plateNumberList: this.plateNumberList });
      this.addEtcVehicle = false;
      this.handleSearch();
    }
  }
};
</script>
<style lang="postcss">
.etc-vehicle-page {
  .el-dialog__body {
    text-align: center;
  }
  .add-etc-vehicle {
    display: flex;
    span {
      margin-top: 10px;
      width: 120px;
    }
  }
  .add-vehicle-dec {
    margin: 10px 0 0 40px;
  }
  .tip-dialog {
    width: 500px;
  }
}
</style>
