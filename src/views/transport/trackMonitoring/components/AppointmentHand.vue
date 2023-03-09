<template>
  <el-dialog title="处理" :visible="appointmentHandData.appointmentHandVisible" :show-close="false" width="500px">
    <div class="abnormal-handle-item mb-10">
      <span class="mr-20"><span class="font-red mr-5">*</span>选择时间</span>
      <el-date-picker
        v-model="appointmentHandData.appointmentTime"
        type="datetime"
        placeholder="选择日期时间"
        value-format="timestamp"
        :picker-options="pickerOptions"
        :default-time="defaultTime"
      >
      </el-date-picker>
    </div>
    <div class="abnormal-handle-item">
      <el-input
        v-model.trim="appointmentHandData.processingRemark"
        type="textarea"
        :rows="5"
        placeholder="请输入描述"
        :maxlength="128"
        show-word-limit
      />
    </div>
    <div slot="footer">
      <el-button @click="appointmentHandData.appointmentHandVisible = false">取消</el-button>
      <el-button type="primary" @click="apointmentHandSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/api/api';
import axios from '@/utils/axios';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      defaultTime: dayjs(Date.now()).format('HH:mm:ss'),
      orderNumber: '',
      appointmentHandData: {
        appointmentHandVisible: false,
        appointmentTime: '',
        processingRemark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 8.64e7;
        }
      }
    };
  },
  methods: {
    async apointmentHandSubmit() {
      let { appointmentTime, processingRemark } = this.appointmentHandData;
      if (!appointmentTime) {
        this.$message.error('请选择时间');
        return false;
      }
      if (appointmentTime < new Date(Date.now()).getTime()) {
        this.$message.error('所选择时间不能早于当前时间');
        return false;
      }
      await axios.post(api.abnormalReserveHandling, {
        appointmentTime,
        processingRemark,
        orderNumber: this.orderNumber
      });
      this.appointmentHandData.appointmentHandVisible = false;
      this.$emit('appointFinish');
    },
    openDialog(orderNumber) {
      this.orderNumber = orderNumber;
      this.appointmentHandData.appointmentTime = '';
      this.appointmentHandData.processingRemark = '';
      this.appointmentHandData.appointmentHandVisible = true;
    }
  }
};
</script>
