<template>
  <layout navActive="match">
    <div class="invoice-maintenance-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">发票代码</span>
          <el-input
            v-model.trim="tableOptions.invoiceCode"
            placeholder="请输入发票代码"
            :maxlength="12"
            clearable
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">开票日期</span>
          <el-date-picker
            v-model="tableOptions.applyTime"
            type="date"
            placeholder="请选择开票日期"
            value-format="timestamp"
            clearable
          >
          </el-date-picker>
        </div>
        <div class="toolbar-item">
          <span class="item-label">开票人</span>
          <el-input
            v-model.trim="tableOptions.billingPerson"
            placeholder="请输入开票人"
            :maxlength="16"
            clearable
          ></el-input>
        </div>

        <div class="toolbar-item">
          <el-button type="primary" @click="onAllMatching">批量填入</el-button>
        </div>
      </div>
      <el-form :model="formData" :rules="formRules" label-width="1px" ref="formData" :validate-on-rule-change="false">
        <el-table :data="formData.invoiceData" width="100%" border ref="tableRef">
          <el-table-column label="发票流水号" min-width="130" prop="applySerialNo"></el-table-column>
          <el-table-column label="价税金额(元)" min-width="100" prop="taxAmount">
            <template v-slot="scope">
              <span class="font-orange">{{ scope.row.taxAmount | thousands(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发票代码" min-width="150">
            <template v-slot="scope">
              <el-form-item
                label=" "
                :prop="'invoiceData.' + scope.$index + '.invoiceCode'"
                :rules="formRules.invoiceCode"
              >
                <el-input
                  v-model.trim="scope.row.invoiceCode"
                  :maxlength="12"
                  clearable
                  placeholder="请输入发票代码"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发票号码" min-width="150">
            <template v-slot="scope">
              <el-form-item label=" " :prop="'invoiceData.' + scope.$index + '.invoiceNo'" :rules="formRules.invoiceNo">
                <el-input
                  v-model.trim="scope.row.invoiceNo"
                  :maxlength="8"
                  clearable
                  placeholder="请输入发票号码"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="开票日期" min-width="170">
            <template v-slot="scope">
              <el-form-item label=" " :prop="'invoiceData.' + scope.$index + '.applyTime'" :rules="formRules.applyTime">
                <el-date-picker
                  style="width: 140px"
                  v-model="scope.row.applyTime"
                  type="date"
                  placeholder="请选择开票日期"
                  value-format="timestamp"
                  clearable
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="开票人" min-width="120">
            <template v-slot="scope">
              <el-form-item
                label=" "
                :prop="'invoiceData.' + scope.$index + '.billingPerson'"
                :rules="formRules.billingPerson"
              >
                <el-input
                  v-model.trim="scope.row.billingPerson"
                  :maxlength="16"
                  clearable
                  placeholder="请输入开票人"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="开票备注" min-width="150">
            <template v-slot="scope">
              <el-form-item label="">
                <el-input
                  :maxlength="50"
                  placeholder="请输入开票备注"
                  v-model.trim="scope.row.invoiceRemark"
                  clearable
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发票图片" prop="photoUrl" min-width="110">
            <template v-slot="scope">
              <div class="flex-center">
                <el-button
                  v-if="scope.row.photoUrl"
                  type="text"
                  @click="utils.previewImage(scope.row.photoUrl, '发票图片')"
                >
                  查看
                </el-button>
                <el-form-item label=" " :prop="'invoiceData.' + scope.$index + '.photoUrl'" :rules="formRules.photoUrl">
                  <fe-upload
                    ref="invoiceImgRef"
                    :action="uploadAction"
                    :showFileList="false"
                    :limit="1000"
                    listType="text"
                    :imgSize="3"
                    :defaultFiles="
                      formData.invoiceData[scope.$index].photoUrl ? [formData.invoiceData[scope.$index].photoUrl] : []
                    "
                    @success="uploadSuccess($event, scope.$index)"
                  >
                    <template slot="uploadBtn">
                      <el-button type="text">{{ scope.row.photoUrl ? '重新上传' : '上传图片' }}</el-button>
                    </template>
                  </fe-upload>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template v-slot="scope">
              <el-button
                :disabled="formData.invoiceData.length === 1"
                type="text"
                class="font-red"
                @click="handleDelete(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="mt-20">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleBack">取消</el-button>
      </div>
    </div>
  </layout>
</template>

<script>
import api from '@/api/api';
import axios from '@/utils/axios';
import dayjs from 'dayjs';
import utils from '@/utils/utils';
export default {
  name: 'InvoiceMaintain',
  data() {
    return {
      utils,
      filePrefix: '', // 文件前缀
      uploadAction: api.upload,
      tableOptions: {
        orderNos: []
      },

      formData: {
        invoiceData: []
      },
      formRules: {
        invoiceCode: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        invoiceNo: [{ required: true, message: '请输入发票号码', trigger: 'blur' }],
        applyTime: [{ required: true, message: '请选择开票日期', trigger: 'blur' }],
        billingPerson: [{ required: true, message: '请输入开票人', trigger: 'blur' }],
        photoUrl: [{ required: false, message: '请上传发票图片', trigger: 'blur' }]
      }
    };
  },
  created() {},
  async activated() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/match' },
      { title: '发票列表', path: '/match/invoice/list' },
      { title: this.$route.meta.title }
    ]);
    this.tableOptions.orderNos = JSON.parse(sessionStorage.getItem('orderNos')) || [];
    this.filePrefix = await utils.getFileUrlPrefix();
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let { data } = await axios.post(api.matchMaintenanceInvoiceList, this.tableOptions);
      if (data) {
        this.formData.invoiceData = data || [];
      }
    },
    // 批量写入
    onAllMatching() {
      for (let i = 0; i < this.formData.invoiceData.length; i++) {
        let invoiceCode = this.formData.invoiceData[i].invoiceCode;
        let applyTime = this.formData.invoiceData[i].applyTime;
        let billingPerson = this.formData.invoiceData[i].billingPerson;
        this.formData.invoiceData[i].invoiceCode = this.tableOptions.invoiceCode
          ? this.tableOptions.invoiceCode
          : invoiceCode;
        this.formData.invoiceData[i].applyTime = this.tableOptions.applyTime ? this.tableOptions.applyTime : applyTime;
        this.formData.invoiceData[i].billingPerson = this.tableOptions.billingPerson
          ? this.tableOptions.billingPerson
          : billingPerson;
      }
    },
    // 删除
    handleDelete(idx) {
      this.formData.invoiceData.splice(idx, 1);
    },
    // 发票图片上传成功回调
    uploadSuccess(file, index) {
      this.$message.success(`上传成功`);
      this.formData.invoiceData[index].photoUrl = this.filePrefix + file.resUrl;
    },
    // 保存
    handleSave() {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          const postData = this.formData.invoiceData.map(el => {
            let { applySerialNo, applyTime, billingPerson, invoiceCode, invoiceNo, invoiceRemark, orderNo, photoUrl } =
              el;
            return {
              applySerialNo,
              applyTime,
              billingPerson,
              invoiceCode,
              invoiceNo,
              invoiceRemark,
              orderNo,
              photoUrl
            };
          });
          await axios.post(api.matchMaintenanceInvoiceRateSave, { requestList: postData });
          await this.$store.dispatch('removeTabView', 'InvoiceMaintain');
          this.$store.dispatch('removeKeepAlive', 'InvoiceMaintain');
          this.$router.push(`/match/invoice/list`);
        }
      });
    },
    async handleBack() {
      await this.$store.dispatch('removeTabView', 'InvoiceMaintain');
      this.$store.dispatch('removeKeepAlive', 'InvoiceMaintain');
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="postcss" scoped>
.invoice-maintenance-page {
  .flex-center {
    display: flex;
    align-items: center;
  }
  :deep(.el-form-item) {
    margin-top: 0px;
    margin-bottom: 0;
    display: flex;
  }
}
</style>
