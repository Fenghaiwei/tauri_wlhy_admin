<template>
  <layout navActive="config">
    <div class="insurance-manage-page">
      <div class="insurance-wrap" v-for="(item, idx) in insuranceList" :key="idx">
        <div class="insurance-title">
          {{ item.insuranceName }}
          <el-button class="bnt-edit" @click="showDialog(item)" type="primary">编辑</el-button>
        </div>

        <div class="insurance-content">
          <div class="insurance-content-left">
            <div class="mr-10">
              <img class="img-show" :src="item.showUrl" />
            </div>
          </div>
          <div class="insurance-content-right">
            <div class="mb-10">
              <span class="title">展示产品</span>
              <span class="content">{{ item.showFlag === 1 ? '是' : '否' }}</span>
            </div>
            <div>
              <div class="title">授权信息</div>
              <span class="content ml-50" v-html="item.authInfo"> </span>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="编辑保险配置" :visible.sync="dialogVisable">
        <el-form :model="formInsurance" ref="formInsurance" :rules="rules" label-width="120px">
          <el-form-item label="展示产品" required>
            <el-switch
              class="Switch"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
              v-model="formInsurance.showFlag"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="授权信息" prop="authInfo">
            <el-input
              type="textarea"
              :rows="5"
              style="width: 500px"
              v-model.trim="formInsurance.authInfo"
              placeholder="请输入授权信息"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传产品图片" required>
            <fe-upload ref="showUrl" :default-files="showUrl" viewer-title="产品图片" :hidetip="true"
          /></el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleSave" type="primary">确定</el-button>
          <el-button @click="dialogVisable = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
export default {
  data() {
    return {
      filePrefix: '',
      dialogVisable: false, //弹框显示控制
      insuranceList: [1, 2], //遍历的页面数据
      showUrl: [], //编辑时的反选图片
      //编辑时的表单数据
      formInsurance: {
        showFlag: 0,
        authInfo: ''
      },
      insuranceId: '', //选中的保险id
      insuranceName: '', //选中的保险名称
      rules: {
        authInfo: [{ required: true, message: '输入授权信息文案' }]
      },
      activities: [
        {
          content: 1,
          timestamp: '2018-04-12 20:46'
        }
      ]
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '业务配置' }, { title: ' 保险' }, { title: ' 保险配置' }]);
    this.filePrefix = await utils.getFileUrlPrefix();
    this.queryDetail();
  },
  methods: {
    async queryDetail() {
      let res = await axios.post(api.stockInsuranceList);
      this.insuranceList = res.data || [];
    },
    showDialog(item) {
      this.insuranceId = item.insuranceId;
      this.insuranceName = item.insuranceName;
      this.showUrl = [];
      this.showUrl.push(item.showUrl || null);
      this.formInsurance.showFlag = item.showFlag || 0;
      this.formInsurance.authInfo = item.authInfo || '';
      this.dialogVisable = true;
    },
    handleSave() {
      this.$refs.formInsurance.validate(async valid => {
        if (valid) {
          let showUrlList = this.$refs.showUrl.getUploadFiles();
          if (showUrlList.length === 0) {
            this.$message.error('请上传产品图片');
            return;
          }
          let option = {
            ...this.formInsurance,
            insuranceId: this.insuranceId,
            showUrl: this.handleRemoveFix(showUrlList[0]),
            insuranceName: this.insuranceName
          };
          await axios.post(api.stockInsuranceUpdate, option);
          this.$message.success('修改成功');
          this.dialogVisable = false;
          this.queryDetail();
        }
      });
    },
    handleRemoveFix(url) {
      return url.replace(/^http(s)?:\/\/.+\.com/, '');
    }
  }
};
</script>
<style lang="postcss">
.insurance-manage-page {
  .insurance-wrap {
    width: 700px;
    height: auto;
    margin: 20px;
    margin-bottom: 70px;
    .insurance-title {
      text-indent: 10px;
      font-size: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      position: relative;
      .bnt-edit {
        position: absolute;
        right: 0px;
        bottom: 3px;
      }
    }
    .insurance-content {
      padding: 20px;
      display: flex;
      .insurance-content-left {
        margin-right: 20px;
        .img-show {
          width: 200px;
          height: 200px;
        }
      }
      .insurance-content-right {
        .title {
          font-size: 15px;
          margin-bottom: 10px;
          margin-right: 10px;
          display: inline-block;
          white-space: pre-line;
        }
        .content {
          font-size: 14px;
          line-height: 20px;
          display: inline-block;
        }
      }
    }
  }
  .emptyline {
    display: inline-block;
    width: 80px;
    border-bottom: 1px solid #000;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
  }

  .Switch .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  /*打开时文字位置设置*/
  .Switch .el-switch__label--right {
    z-index: 1;
    left: 19px; /*不同场景下可能不同，自行调整*/
  }
  /*关闭时文字位置设置*/
  .Switch .el-switch__label--left {
    z-index: 1;
    left: 30px; /*不同场景下可能不同，自行调整*/
  }
  /*显示文字*/
  .Switch .el-switch__label.is-active {
    display: block;
  }
  .Switch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 75px !important; /*开关按钮的宽度大小*/
  }
}
.multiple-img-uploader .el-upload--picture-card {
  width: 200px;
  height: 200px;
  line-height: 200px;
}
</style>
