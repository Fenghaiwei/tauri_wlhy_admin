<template>
  <layout navActive="config">
    <div class="gross-tonnage-edit">
      <div class="segment">
        <div class="segment-header">
          <span>企业名称</span>
        </div>
        <div class="segment-area flex-area" span="3">
          <div class="segment-item">
            <div class="segment-label">企业名称</div>
            <div class="segment-content">
              <span>{{ companyInfo.companyName }}</span>
              <span class="ml-10">
                <el-button type="primary" @click="handleChoose" v-if="formType == 'add'">{{
                  companyInfo.companyName ? '修改' : '添加'
                }}</el-button>
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
            <div class="segment-label">收煤皮重</div>
            <div class="segment-flex">
              <el-input placeholder="" v-model.trim="poundData.emptyMinValue"></el-input>
              <span class="ml-10 mr-10"> - </span>
              <el-input placeholder="" v-model.trim="poundData.emptyMaxValue"></el-input>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area">
          <div class="segment-item">
            <div class="segment-label">收煤毛重</div>
            <div class="segment-flex">
              <el-input placeholder="" v-model.trim="poundData.heavyMinValue"></el-input>
              <span class="ml-10 mr-10"> - </span>
              <el-input placeholder="" v-model.trim="poundData.heavyMaxValue"></el-input>
            </div>
          </div>
        </div>
        <div class="segment-foot mt-20">
          <el-button type="primary" @click="handleSave" :disabled="!companyInfo.companyName || getPundStatus"
            >保存</el-button
          >
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
import { isRangeNumber, isNumber } from '@fe/validator';
export default {
  data() {
    return {
      companyInfo: {
        companyCode: '',
        companyName: ''
      },
      choose: {
        companyCode: ''
      },
      formType: 'add',
      poundData: {
        emptyMinValue: '',
        emptyMaxValue: '',
        heavyMaxValue: '',
        heavyMinValue: ''
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
      showAddDia: false,
      config: {}
    };
  },
  computed: {
    getPundStatus() {
      return (
        !this.poundData.emptyMinValue &&
        !this.poundData.emptyMaxValue &&
        !this.poundData.heavyMaxValue &&
        !this.poundData.heavyMinValue
      );
    }
  },
  created() {
    this.companyCode = this.$route.params.companyCode;
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/config' },
      { title: '毛重/皮重吨位限制', path: '/gross/tonnage' },
      { title: '毛重/皮重吨位限制详情' }
    ]);
    if (this.companyCode) {
      this.formType = 'edit';
      this.queryDetail();
    }
  },
  methods: {
    async queryDetail() {
      let res = await axios.post(api.orderPoundDetail, { companyCode: this.companyCode });
      this.companyInfo.companyName = res.data.companyName;
      this.companyInfo.companyCode = res.data.companyCode;
      this.choose.companyCode = this.companyInfo.companyCode;
      for (let k in this.poundData) {
        this.poundData[k] = res.data[k];
      }
    },
    async handleChoose() {
      await this.fetchData();
      this.choose.companyCode = this.companyInfo.companyCode;
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
          filterType: 1,
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
      this.companyInfo.companyCode = data[0].actualCompanyCode;
      this.companyInfo.companyName = data[0].companyName;
      this.showAddDia = false;
    },
    onJumpList() {
      this.$router.go(-1);
    },
    checkNumberVali(val) {
      if (isNumber(val) && isRangeNumber(val, 0, 100000, true, false)) {
        return true;
      }
      return false;
    },
    async handleSave() {
      // const reg = /^([1-9]\d{0,4}|0)(\.\d{1,2})?$/; [0, 100000) 两位小数
      if (this.poundData.emptyMinValue && !this.checkNumberVali(this.poundData.emptyMinValue)) {
        this.$message.error('收煤皮重最小值格式不正确');
        return false;
      }
      if (this.poundData.emptyMaxValue && !this.checkNumberVali(this.poundData.emptyMaxValue)) {
        this.$message.error('收煤皮重最大值格式不正确');
        return false;
      }
      if (
        this.poundData.emptyMinValue &&
        this.poundData.emptyMaxValue &&
        this.poundData.emptyMinValue - this.poundData.emptyMaxValue > 0
      ) {
        this.$message.error('收煤皮重最小值不能大于收煤皮重最大值');
        return false;
      }
      if (this.poundData.heavyMinValue && !this.checkNumberVali(this.poundData.heavyMinValue)) {
        this.$message.error('收煤毛重最小值格式不正确');
        return false;
      }
      if (this.poundData.heavyMaxValue && !this.checkNumberVali(this.poundData.heavyMaxValue)) {
        this.$message.error('收煤毛重最大值格式不正确');
        return false;
      }
      if (
        this.poundData.heavyMinValue &&
        this.poundData.heavyMaxValue &&
        this.poundData.heavyMinValue - this.poundData.heavyMaxValue > 0
      ) {
        this.$message.error('收煤毛重最小值不能大于收煤毛重最大值');
        return false;
      }

      let url = this.formType === 'edit' ? api.orderPoundUpdate : api.orderPoundAdd;
      let res = await axios.post(url, {
        companyCode: this.companyInfo.companyCode,
        companyName: this.companyInfo.companyName,
        ...this.poundData
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
