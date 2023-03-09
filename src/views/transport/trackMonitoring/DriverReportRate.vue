<template>
  <layout navActive="transport">
    <div class="driver-report-rate">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button @click="addData">添加</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </div>
      </div>
      <el-form class="mt-20 mb-20" :model="{ formTableData: tableData }" ref="formTableRef">
        <el-table :data="tableData" border style="width: 100%" :max-height="600">
          <el-table-column label="最小值<(km)" min-width="120" prop="minValue">
            <template #default="scope">
              <el-form-item>
                <span>{{ scope.row.minValue }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="最大值≥(km)" min-width="120">
            <template #default="scope">
              <el-form-item :prop="'formTableData.' + scope.$index + '.maxValue'" :rules="rules.maxValue">
                <el-input
                  @blur="changeMaxRange(scope.row.maxValue, scope.$index)"
                  v-model.trim="scope.row.maxValue"
                  clearable
                  placeholder="请输入"
                  :maxlength="6"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="监控频次（min）" min-width="120">
            <template #default="scope">
              <el-form-item :prop="'formTableData.' + scope.$index + '.rateValue'" :rules="rules.rateValue">
                <el-input v-model.trim="scope.row.rateValue" clearable placeholder="请输入" :maxlength="4"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="无定位策略（次）" min-width="120">
            <template #default="scope">
              <el-form-item :prop="'formTableData.' + scope.$index + '.strategyValue'" :rules="rules.strategyValue">
                <el-input
                  v-model.trim="scope.row.strategyValue"
                  clearable
                  placeholder="请输入"
                  :maxlength="4"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="升级策略（次）" min-width="120">
            <template #default="scope">
              <el-form-item
                :prop="'formTableData.' + scope.$index + '.upgradeStrategyValue'"
                :rules="rules.upgradeStrategyValue"
              >
                <el-input
                  v-model.trim="scope.row.upgradeStrategyValue"
                  clearable
                  placeholder="请输入"
                  :maxlength="4"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="140">
            <template #default="scope">
              <el-button type="text" link @click="deleteItem(scope.$index)" v-if="tableData.length > 1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import { isInt, isNumber, isRangeNumber } from '@fe/validator';
import { validatorFn } from '@fe/form-valid';
export default {
  data() {
    let validMax = (rule, value, callback) => {
      let index = Number(rule.fullField.split('.')[1]);
      if (!isNumber(value, false, 1)) {
        callback(new Error('请输入数字，允许输入一位小数'));
      } else if (Number(value) <= Number(this.tableData[index].minValue)) {
        callback(new Error('当前行最大值应大于最小值'));
      } else {
        callback();
      }
    };
    let validMemo = (rule, value, callback) => {
      if (!isInt(value)) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      formTableData: [],
      maxValue: 9999,
      dataItem: {
        minValue: '',
        maxValue: '',
        rateValue: '',
        strategyValue: '',
        upgradeStrategyValue: ''
      },
      rules: {
        maxValue: [
          { required: true, message: '请输入最大值' },
          { validator: validMax, trigger: 'blur' },
          {
            validator: validatorFn(isRangeNumber, 0, 9999.9, false, true),
            message: '最大值不能超过9999.9',
            trigger: ['blur', 'change']
          }
        ],
        rateValue: [{ required: true, message: '请输入监控频次' }, { validator: validMemo }],
        strategyValue: [{ required: true, message: '请输入无定位策略' }, { validator: validMemo }],
        upgradeStrategyValue: [{ required: true, message: '请输入升级策略' }, { validator: validMemo }]
      }
    };
  },
  mounted() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '司机位置上报频次' }]);
    this.handleSearch();
  },
  methods: {
    async handleSearch() {
      let res = await axios.post(api.driverReportRateConfig);
      this.tableData = res.data || [];
    },
    addData() {
      if (this.tableData.length == 0) {
        this.tableData.push({ ...JSON.parse(JSON.stringify({ ...this.dataItem })), minValue: 0 });
      } else {
        this.tableData.push({
          ...JSON.parse(JSON.stringify({ ...this.dataItem })),
          minValue: this.tableData[this.tableData.length - 1].maxValue
        });
      }
    },
    changeMaxRange(val, index) {
      if (index != this.tableData.length - 1 && isNumber(val, false, 1)) {
        this.tableData[index + 1].minValue = val;
      }
    },
    submit() {
      this.$refs.formTableRef.validate(async valid => {
        if (valid) {
          await axios.post(api.driverReportRateSubmit, this.tableData);
          this.$message.success('修改成功');
          this.handleSearch();
        }
      });
    },
    deleteItem(index) {
      this.$confirm('是否确认删除?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          if (index == 0) {
            this.tableData[index + 1].minValue = 0;
          } else if (index != this.tableData.length - 1) {
            this.tableData[index + 1].minValue = this.tableData[index - 1].maxValue;
          }
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    }
  }
};
</script>
