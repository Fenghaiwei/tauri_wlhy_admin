<template>
  <layout navActive="transport">
    <div class="information-adjustment-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">采购订单</span>
          <el-input
            v-model.trim="tableOptions.tradeSn"
            maxlength="30"
            placeholder="请输入采购订单"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">报号码</span>
          <el-input
            v-model.trim="tableOptions.enrollCode"
            maxlength="30"
            placeholder="请输入报号码"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">运单</span>
          <el-input
            v-model.trim="tableOptions.orderNumber"
            maxlength="30"
            placeholder="请输入运单"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">经纪人</span>
          <el-input
            v-model.trim="tableOptions.agentUserName"
            maxlength="30"
            placeholder="请输入经纪人"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">经纪人手机号</span>
          <el-input
            v-model.trim="tableOptions.agentUserPhone"
            maxlength="30"
            placeholder="请输入经纪人手机号"
            clearable
          ></el-input>
        </div>
        <!-- <div class="toolbar-item">
          <span class="item-label">运单完结时间</span>
          <el-date-picker
            v-model="tableOptions.finishStartTime"
            type="datetime"
            style="width:200px"
            placeholder="开始日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="onSelectTime"
          ></el-date-picker>
          <span class="font-gray ml-5 mr-5">-</span>
          <el-date-picker
            v-model="tableOptions.finishEndTime"
            type="datetime"
            style="width:200px"
            placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            @change="onSelectTime"
          ></el-date-picker>
        </div>-->
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">筛选</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
        <div class="toolbar-item">
          <el-button
            type="primary"
            :disabled="tableList.length === 0"
            @click="hanldeProportion"
            v-has="'transport:information:adjustment:proportion'"
            >调整比例</el-button
          >
        </div>
        <div class="toolbar-item">
          <el-button
            type="primary"
            :disabled="tableList.length === 0"
            @click="handleReview"
            v-has="'transport:information:adjustment:review'"
            >提交复核</el-button
          >
        </div>
      </div>
      <div class="toolbar-panel mb-10 font-gray">
        举例：如原收取信息服务费留存比例20%，原总信息费150元=代收开票费50元+(待付经纪人信息费80元+收取信息服务费20元)，调整为10%，调整后总信息费150元=代收开票费50元+(待付经纪人信息费90元+收取信息服务费10元)
      </div>

      <el-table :data="tableData.data" border @selection-change="selectionChange">
        <el-table-column type="selection" width="36"></el-table-column>
        <el-table-column
          label="收取信息服务费留存比例"
          prop="informationRetentionRate"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="采购订单"
          prop="tradeSn"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="报号码" prop="enrollCode" width="160" align="center"></el-table-column>
        <el-table-column label="运单" prop="orderNumber" width="160" align="center"></el-table-column>
        <el-table-column
          label="经纪人"
          prop="agentUserName"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="经纪人手机号"
          prop="agentUserPhone"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="是否封签" prop="seal" width="120" align="center">
          <template v-slot="scope">
            <span>{{ scope.row.seal ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总信息费" prop="informationFee" min-width="120" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.informationFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="待付经纪人信息费"
          prop="informationDisburseFee"
          min-width="120"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.informationDisburseFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="代收开票费" prop="invoiceFee" min-width="120" show-overflow-tooltip align="center">
          <template v-slot="scope">
            <span>{{ scope.row.invoiceFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收取信息服务费"
          prop="informationRetentionFee"
          min-width="120"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.informationRetentionFee | thousands(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="调整原因"
          prop="changeReason"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          label="运单完结时间"
          prop="finishDeadTime"
          min-width="140"
          show-overflow-tooltip
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.row.finishDeadTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>-->
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

      <el-dialog title="调整比例" :visible.sync="proportionDia" width="600px">
        <div class="settlement-commit-form">
          <el-form
            :model="form"
            :rules="rules"
            :validate-on-rule-change="false"
            label-position="right"
            label-width="120px"
            ref="form"
          >
            <div class="segment noborder">
              <div class="segment-area flex-area" span="1">
                <div class="segment-item mb-15">
                  <el-form-item label="收取信息服务费留存比例" prop="informationRetentionRate" label-width="180px">
                    <el-input v-model.trim="form.informationRetentionRate" clearable maxlength="6" style="width: 222px">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="segment-item mb-15">
                  <el-form-item label="调整原因" label-width="180px">
                    <el-input
                      v-model.trim="form.changeReason"
                      clearable
                      type="textarea"
                      maxlength="64"
                      style="width: 222px"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="proportionDia = false">取 消</el-button>
          <el-button type="primary" @click="onConfirmEdit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import dayjs from 'dayjs';
import { isNumber, isRangeNumber } from '@fe/validator';

export default {
  name: 'InformationAdjustment',
  mixins: [listMixin],
  data() {
    var valiRate = (rule, value, callback) => {
      if (!isNumber(value, true, 2)) {
        callback(new Error('调整比例支持两位小数，不可输入负值'));
      }
      if (!isRangeNumber(value, 0, 100)) {
        callback(new Error('调整比例不能超过100%'));
      }
      callback();
    };

    return {
      pageSize: 20,
      timeRange: [],
      proportionDia: false,
      tableList: [],
      tableOptions: {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        // finishEndTime: '',
        // finishStartTime: '',
        tradeSn: ''
      },
      tableData: {},
      form: {
        changeReason: '',
        informationRetentionRate: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= dayjs().add(1, 'day').startOf('day');
        }
      },
      rules: {
        informationRetentionRate: [
          { required: true, message: '请输入调整比例', trigger: 'blur' },
          { validator: valiRate, trigger: 'blur' }
        ]
      }
    };
  },
  activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '信息费调整比例列表' }]);
    this.handleSearch();
  },
  methods: {
    selectionChange(val) {
      this.tableList = val;
    },
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.reviewList, options);
      this.tableData = res.data;
    },
    hanldeProportion() {
      this.proportionDia = true;
      if (this.$refs['form']) {
        this.$refs['form'].resetFields();
      }
      this.form.informationRetentionRate = '';
      this.form.changeReason = '';
    },
    handleReview() {
      this.$confirm('是否提交复核?', '提交复核确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const enrollNumberIds = this.tableList.map(el => el.enrollNumberId);
          await axios.post(api.reviewSubmit, { enrollNumberIds });
          this.handleSearch();
        })
        .catch(() => {});
    },
    async onConfirmEdit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const enrollNumberIds = this.tableList.map(el => el.enrollNumberId);
          await axios.post(api.rateChange, {
            enrollNumberIds,
            ...this.form
          });
          this.$message.success('提交成功');
          this.proportionDia = false;
          this.handleSearch();
        }
      });
    },
    onSelectTime() {
      let { finishStartTime, finishEndTime } = this.tableOptions;
      if (finishStartTime && finishEndTime && finishStartTime > finishEndTime) {
        this.$message.warning('结束时间不能小于开始时间,请重新选择');
        this.tableOptions.finishEndTime = '';
        return;
      }
    },
    onReset() {
      this.tableOptions = {
        agentUserName: '',
        agentUserPhone: '',
        enrollCode: '',
        // finishEndTime: '',
        // finishStartTime: '',
        tradeSn: ''
      };
    }
  }
};
</script>
<style lang="postcss">
.information-adjustment-page {
}
</style>
