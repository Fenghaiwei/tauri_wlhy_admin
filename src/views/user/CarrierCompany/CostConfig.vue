<template>
  <layout navActive="user">
    <div class="caption-list-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">承运公司</span>
          <el-input
            style="width: 300px"
            maxlenght="50"
            v-model.trim="tableOptions.carrierName"
            placeholder="请输入关键字"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <div class="toolbar-item">
          <el-button @click="onReset">重置</el-button>
        </div>
      </div>
      <el-table :data="tableData.data" border>
        <el-table-column label="承运公司名称" align="center" prop="companyName" min-width="250"> </el-table-column>
        <el-table-column label="技术服务费费率" align="center" prop="platFreightRatio" min-width="160">
          <template v-slot="scope">
            <span
              v-if="permission.includes('user:technology:rate:edit')"
              class="font-default pointer"
              @click="editTechRate(scope.row)"
              >{{ scope.row.platFreightRatio }}%</span
            >
            <span v-else> {{ scope.row.platFreightRatio }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="运营服务费费率" align="center" prop="cargoGuaranteeRatio" min-width="160">
          <template v-slot="scope">
            <span
              v-if="permission.includes('user:operation:rate:edit')"
              class="font-default pointer"
              @click="editRunRate(scope.row)"
              >{{ scope.row.cargoGuaranteeRatio }}%</span
            >
            <span v-else> {{ scope.row.cargoGuaranteeRatio }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="货保业务状态" align="center" prop="cargoEnableStatus" min-width="130">
          <template v-slot="scope">
            <span> {{ scope.row.cargoEnableStatus ? '已开启' : '未开启' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template v-slot="scope">
            <el-button type="text" @click="handleLog(scope.row)">日志</el-button>
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
      <el-dialog title="日志" :visible.sync="dialogLogVisible" width="50%">
        <el-table :data="logData" border :max-height="500">
          <el-table-column label="操作人" prop="operatorName" width="140"></el-table-column>
          <el-table-column label="操作时间" prop="operatedTime"> </el-table-column>
          <el-table-column label="操作描述" prop="operatedDesc"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="dialogTecVisible" width="500px">
        <el-form :model="formEdit" ref="tecFormEditRef" :rules="rules" label-width="150px">
          <el-form-item label="承运公司名称：" prop="name">
            {{ formEdit.companyName }}
          </el-form-item>
          <el-form-item label="技术服务费费率：" prop="platFreightRatio">
            <el-input
              v-model.trim="formEdit.platFreightRatio"
              placeholder="请输入技术服务费费率"
              style="width: 200px"
            ></el-input>
            %
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogTecVisible = false">取消</el-button>
          <el-button @click="handleTecSave" type="primary">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="dialogRunVisible" width="500px">
        <el-form :model="formEdit" ref="runFormEditRef" :rules="rules" label-width="150px">
          <el-form-item label="承运公司名称：" prop="name">
            {{ formEdit.companyName }}
          </el-form-item>
          <el-form-item label="运营服务费费费率：" prop="cargoGuaranteeRatio">
            <el-input
              v-model.trim="formEdit.cargoGuaranteeRatio"
              placeholder="请输入运营服务费费率"
              style="width: 200px"
            ></el-input>
            %
          </el-form-item>
          <el-form-item label="货保业务：" prop="cargoEnableStatus">
            <el-select v-model="formEdit.cargoEnableStatus" placeholder="请选择状态" style="width: 200px">
              <el-option label="关闭" :value="0"></el-option>
              <el-option label="开启" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogRunVisible = false">取消</el-button>
          <el-button @click="handleRunSave" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import { mapState } from 'vuex';
import { isNumberValid, validatorFn } from '@fe/form-valid';
import { isRangeNumber } from '@fe/validator';
export default {
  name: 'CostConfig',
  mixins: [listMixin],
  data() {
    return {
      pageSize: 20,
      tableOptions: { carrierName: '' },
      tableData: {
        data: [],
        total: 0
      },
      dialogLogVisible: false,
      dialogTecVisible: false,
      dialogRunVisible: false,
      formEdit: {},
      logData: [],
      rules: {
        platFreightRatio: [
          { required: true, message: '请输入技术服务费费率' },
          {
            validator: isNumberValid,
            params: [true, 4],
            message: '请输入大于等于0小于等于100的数字，最大支持4位小数',
            trigger: ['blur', 'change']
          },
          {
            validator: validatorFn(isRangeNumber, 0, 100, true, true),
            message: '请输入大于等于0小于等于100的数字，最大支持4位小数',
            trigger: ['blur', 'change']
          }
        ],
        cargoGuaranteeRatio: [
          { required: true, message: '请输入运营服务费费率' },
          {
            validator: isNumberValid,
            params: [false, 4],
            message: '请输入大于0小于等于100的数字，最大支持4位小数',
            trigger: ['blur', 'change']
          },
          {
            validator: validatorFn(isRangeNumber, 0, 100, false, true),
            message: '请输入大于0小于等于100的数字，最大支持4位小数',
            trigger: ['blur', 'change']
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      permission: state => state.permission
    })
  },
  async activated() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/user' }, { title: '服务费配置' }]);
    this.handleSearch();
  },
  methods: {
    async fetchData(opts) {
      const options = { pageNum: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let res = await axios.post(api.carrierConfigList, options);
      this.tableData.data = res.data.data || [];
      this.tableData.total = res.data.total || 0;
    },
    onReset() {
      this.tableOptions = { carrierName: '' };
    },
    editTechRate(row) {
      this.dialogTecVisible = true;
      this.formEdit = JSON.parse(JSON.stringify(row));
      this.$nextTick(() => {
        this.$refs.tecFormEditRef.clearValidate();
      });
    },
    editRunRate(row) {
      this.dialogRunVisible = true;
      this.formEdit = JSON.parse(JSON.stringify(row));
      this.$nextTick(() => {
        this.$refs.runFormEditRef.clearValidate();
      });
    },
    handleTecSave() {
      this.$refs.tecFormEditRef.validate(async valid => {
        if (valid) {
          this.$confirm('是否确认保存?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
            .then(async () => {
              await axios.post(api.carrierConfigUpdate, {
                carrierCompanyId: this.formEdit.carrierCompanyId,
                platFreightRatio: this.formEdit.platFreightRatio
              });
              this.dialogTecVisible = false;
              this.handleSearch();
            })
            .catch(() => {});
        }
      });
    },
    handleRunSave() {
      this.$refs.runFormEditRef.validate(async valid => {
        if (valid) {
          this.$confirm('是否确认保存?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
            .then(async () => {
              await axios.post(api.carrierConfigUpdate, {
                carrierCompanyId: this.formEdit.carrierCompanyId,
                cargoGuaranteeRatio: this.formEdit.cargoGuaranteeRatio,
                cargoEnableStatus: this.formEdit.cargoEnableStatus
              });
              this.dialogRunVisible = false;
              this.handleSearch();
            })
            .catch(() => {});
        }
      });
    },
    async handleLog(row) {
      this.dialogLogVisible = true;
      const { data } = await axios.post(api.carrierConfigLog, { carrierCompanyId: row.carrierCompanyId });
      this.logData = data || {};
    }
  }
};
</script>
<style lang="postcss"></style>
