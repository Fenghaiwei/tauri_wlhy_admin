<template>
  <el-dialog title="备注" :visible="dialogVisible" width="400px" @close="dialogVisible = false">
    <el-input
      style="width: 300px"
      type="textarea"
      v-model.trim="remark"
      placeholder="请输入备注"
      :maxlength="32"
    ></el-input>
    <template #footer>
      <el-button @click="handleConfirm" type="primary" :disabled="!remark">保存</el-button>
    </template>
  </el-dialog>
</template>
<script>
import api from '@/api/api';
import axios from '@/utils/axios';
export default {
  data() {
    return {
      dialogVisible: false,
      orderNumber: '',
      remark: ''
    };
  },
  methods: {
    async handleConfirm() {
      await axios.post(api.orderMonitorRemark, {
        orderNumber: this.orderNumber,
        remark: this.remark
      });
      this.$emit('remarkFinish');
      this.dialogVisible = false;
    },
    openDialog(orderNumber) {
      this.orderNumber = orderNumber;
      this.remark = '';
      this.dialogVisible = true;
    }
  }
};
</script>
