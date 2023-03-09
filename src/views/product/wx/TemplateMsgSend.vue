<template>
  <layout navActive="product">
    <div class="template-send-page">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">公众号</span>
          <el-select v-model="form.appId" style="width: 200px" placeholder="请选择" :disabled="!changeStatus">
            <el-option
              :label="item.appName"
              :value="item.appId"
              v-for="item in wechatList"
              :key="item.appId"
            ></el-option>
          </el-select>
        </div>
        <div class="toolbar-item">
          <span class="item-label">模板ID</span>
          <el-input
            v-model.trim="form.templateId"
            placeholder="请输入模板ID"
            :disabled="!changeStatus"
            style="width: 400px"
          ></el-input>
          <span class="ml-5 font-gray">请从微信后台查询使用的模版ID</span>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" v-if="changeStatus" @click="getTemplate" :disabled="!form.appId || !form.templateId"
            >获取模板</el-button
          >
          <el-button type="primary" v-else @click="resetTemplate"> 重置模板</el-button>
        </div>
      </div>

      <template v-if="template.templateId">
        <div class="template-title mt-20 mb-20">
          模板标题：<span>{{ template.title }}</span>
        </div>
        <div class="template-wrap">
          <div class="template-content">
            <div class="segment">
              <div class="segment-header">模板内容</div>
              <div class="segment-area" v-html="template.content"></div>
            </div>
            <div class="segment last ml-20">
              <div class="segment-header">示例</div>
              <div class="segment-area" v-html="template.example"></div>
            </div>
          </div>
        </div>
        <div class="template-wrap mt-20">
          <div class="template-content">
            <div class="segment">
              <div class="segment-header">参数设置</div>
              <div class="segment-area">
                <div class="segment-item mb-10" v-for="(item, idx) in variables" :key="idx">
                  <div class="segment-label">{{ item.key }}</div>
                  <div class="segment-content">
                    <el-input v-model.trim="item.val" placeholder=""></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="segment last ml-20">
              <div class="segment-header">预览</div>
              <div class="segment-area" v-html="previewContent"></div>
            </div>
          </div>
        </div>
        <div class="toolbar-panel mb-20">
          <div class="toolbar-item">
            <span class="item-label">链接</span>
            <el-input v-model.trim="url" placeholder="" style="width：500px"></el-input>
          </div>
          <div class="toolbar-item">
            <span class="item-label">发送给</span>
            <span class="font-gray">公众号内所有用户</span>
          </div>
        </div>
      </template>
      <div class="toolbar-item">
        <el-button type="primary" @click="handleSend" :disabled="!template.templateId">发送</el-button>
        <el-button @click="goBack">取消</el-button>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
export default {
  data() {
    return {
      form: { appId: '', templateId: '' },
      url: '',
      wechatList: [], // 公众号集合
      template: {}, // 模板消息
      variables: [], // 模板参数集合
      previewContent: '', // 预览
      changeStatus: true
    };
  },
  watch: {
    variables: {
      handler(to, from) {
        if (this.template.templateId) this.previewContent = this.formatTemplate(this.variables, this.template.content);
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/product' },
      { title: '模板消息', path: '/template/msg' },
      { title: '发送模板消息' }
    ]);
    this.getWechatList();
  },
  methods: {
    async getWechatList() {
      let res = await axios.post(api.wechatList);
      this.wechatList = res.data;
    },
    resetTemplate() {
      this.url = '';
      this.form.appId = '';
      this.form.templateId = '';
      this.template = {};
      this.changeStatus = true;
    },
    async getTemplate() {
      let res = await axios.post(api.wechatTemplateSample, { ...this.form });
      this.template = res.data;
      if (this.template.templateId) {
        this.changeStatus = false;
        this.variables = this.template.variables.map(el => {
          return {
            key: el,
            val: ''
          };
        });
      }
    },
    formatTemplate(data, tmpl) {
      return tmpl.replace(/{{(\w+\.\w+)}}/g, function (m1, m2) {
        if (!m2) return '';
        let item = data.filter(el => el.key === m2.split('.')[0]);
        return item.length > 0 ? item[0].val : '';
      });
    },
    valid() {
      if (!this.form.appId) {
        this.$message.error('请选择公众号');
        return false;
      }
      if (!this.form.templateId) {
        this.$message.error('请填写模板ID');
        return false;
      }
      if (!this.template.templateId) {
        this.$message.error('模板ID填写不正确');
        return false;
      }
      for (let i = 0; i < this.variables.length; i++) {
        if (!this.variables[i].val) {
          this.$message.error('参数设置不完整');
          return false;
        }
      }
      if (!this.url) {
        this.$message.error('请填写链接');
        return false;
      }
      // let urlReg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      // if (!urlReg.test(this.url)) {
      //   this.$message.error('链接格式不正确');
      //   return false;
      // }
      return true;
    },
    async handleSend() {
      let isValid = this.valid();
      if (isValid) {
        let params = {};
        this.variables.map(el => {
          params[el.key] = el.val;
        });
        const options = { ...this.form, params: JSON.stringify(params), url: this.url };
        console.log('options', options);
        this.$confirm(``, '确认发送消息吗？', {
          confirmButtonText: '继续',
          cancelButtonText: '取消'
        })
          .then(async () => {
            await axios.post(api.wechatTemplateSend, options);
            this.goBack();
          })
          .catch(() => {});
      }
    },
    goBack() {
      this.$router.push('/template/msg');
    }
  }
};
</script>
<style lang="postcss">
.template-wrap {
  width: 100%;
  background-color: #fff;
  .template-title {
    margin-top: 20px;
  }
  .template-content {
    display: flex;
    .segment {
      width: 35%;
      &.last {
        margin-bottom: 16px;
      }
      .segment-area {
        line-height: 30px;
        white-space: pre-line;
        .segment-item {
          display: flex;
          .segment-content {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
