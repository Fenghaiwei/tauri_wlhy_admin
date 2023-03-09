<template>
  <layout navActive="config">
    <div class="evaluate-edit-page">
      <div class="toolbar-panel mb-20">{{ evaluateData.title }}</div>
      <div>
        <el-button @click="handleAddItem" type="primary">添加项目</el-button>
        <el-button @click="onJumpList">返回</el-button>
      </div>
      <table class="tb-custom" cellspacing="0" cellpadding="0" v-if="itemConfigList.length > 0">
        <thead>
          <th>序号</th>
          <th>项目名称</th>
          <th>选项</th>
          <th>操作</th>
        </thead>
        <tbody>
          <template v-for="(item, idx) in itemConfigList">
            <template v-for="(subtem, subIdx) in item.optionConfigList">
              <tr :key="`${idx}-${subIdx}`" v-if="subIdx === 0">
                <td class="bd-left-none" :rowspan="item.optionConfigList.length">{{ idx + 1 }}</td>
                <td :rowspan="item.optionConfigList.length">{{ item.itemName }}</td>
                <td>{{ subtem.optionName }}</td>
                <td :rowspan="item.optionConfigList.length">
                  <el-button type="text" @click="handleDelItem(item, idx)">删除</el-button>
                  <el-button type="text" @click="handleEditItem(item, idx)">编辑</el-button>
                </td>
              </tr>
              <tr :key="`${idx}-${subIdx}`" v-else>
                <td>{{ subtem.optionName }}</td>
                <td></td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <el-dialog :title="`${id ? '编辑' : '添加'}项目`" :visible.sync="dialogAddVisable" custom-class="tip-dialog">
        <el-form :model="formAdd" ref="formAdd" label-width="90px">
          <el-form-item label="项目名称" prop="title">
            <el-input
              v-model.trim="formAdd.itemName"
              placeholder="请输入项目名称"
              style="width: 300px"
              :maxlength="10"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="ml-20 mb-20">
          <el-button
            class="button-new-tag"
            type="primary"
            size="small"
            @click="hanldeAddInput"
            :disabled="formAdd.optionConfigList.length >= 3"
            >添加选项</el-button
          >
        </div>

        <div class="evaluate-option-list">
          <div v-for="(item, idx) in formAdd.optionConfigList" :key="idx" class="evaluate-option-item">
            <el-input
              placeholder="请输入选项"
              class="input-new-tag"
              :key="idx"
              v-model.trim="item.optionName"
              :maxlength="5"
              size="small"
            >
            </el-input>
            <el-button class="button-new-tag" type="text" size="small" @click="handleDelOption(idx)">删除</el-button>
          </div>
        </div>
        <div slot="footer">
          <el-button
            @click="handleSaveItem"
            type="primary"
            :disabled="!formAdd.itemName || formAdd.optionConfigList.length < 2"
            >确定</el-button
          >
          <el-button @click="dialogAddVisable = false">关闭</el-button>
        </div>
      </el-dialog>

      <div class="segment-foot">
        <el-button type="primary" @click="handleSubmit" v-if="itemConfigList.length > 0">保存</el-button>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import listMixin from '@/utils/listMixin';
import dayjs from 'dayjs';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
export default {
  data() {
    return {
      id: '',
      currentIdx: null,
      formAdd: {
        itemName: '',
        optionConfigList: []
      },
      dialogAddVisable: false,
      evaluateData: {},
      itemConfigList: []
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/config' }, { title: '添加服务评价' }]);
    this.getevaluationConfig();
  },
  methods: {
    async getevaluationConfig() {
      let res = await axios.post(api.evaluationConfigDetailGet, { id: this.id });
      this.evaluateData = res.data;
      this.itemConfigList = res.data.itemConfigList;
    },
    handleAddItem() {
      this.currentIdx = null;
      this.formAdd.itemName = '';
      this.formAdd.optionConfigList = [];
      this.dialogAddVisable = true;
    },
    handleDelItem(item, idx) {
      this.itemConfigList.splice(idx, 1);
    },
    handleSaveItem() {
      let valid = true;
      for (let i = 0; i < this.formAdd.optionConfigList.length; i++) {
        let item = this.formAdd.optionConfigList[i];
        if (!item.optionName) {
          valid = false;
          this.$message.error('选项信息填写不完整');
          break;
        }
      }
      if (!valid) return;
      if (this.currentIdx != null) {
        this.itemConfigList.splice(this.currentIdx, 1, { ...this.formAdd });
      } else {
        console.log(123);
        console.log(this.formAdd);
        this.itemConfigList.push({ ...this.formAdd });
      }
      this.dialogAddVisable = false;
    },
    handleEditItem(item, idx) {
      this.currentIdx = idx;
      this.dialogAddVisable = true;
      this.formAdd = JSON.parse(JSON.stringify(item));
    },
    hanldeAddInput() {
      this.formAdd.optionConfigList.push({ optionName: '' });
    },
    handleDelOption(idx) {
      this.formAdd.optionConfigList.splice(idx, 1);
    },
    onJumpList() {
      this.$router.go(-1);
    },
    handleSubmit() {
      let itemConfigList = this.itemConfigList.map(el => {
        return {
          itemName: el.itemName,
          optionConfigAddList: el.optionConfigList
        };
      });
      let options = {
        id: this.id,
        itemConfigAddList: itemConfigList
      };
      console.log('options', options);
      axios.post(api.evaluationConfigDetailAdd, options).then(res => {
        this.onJumpList();
      });
    }
  }
};
</script>
<style lang="postcss">
.evaluate-edit-page {
  .tip-dialog {
    width: 500px;
  }
  .tb-custom {
    margin: 20px 0;
    width: 100%;
    border: 1px solid #ebeef5;
    text-align: center;
    th {
      background: #f7f9fb;
      height: 40px;
      border-right: none;
      border-bottom: none;
    }
    td {
      height: 40px;
      border: 1px solid #ebeef5;
      border-right: none;
      border-bottom: none;
    }
    .bd-left-none {
      border-left: none;
    }
  }
  .evaluate-option-list {
    display: flex;
    flex-wrap: wrap;
    .evaluate-option-item {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 20px 0;
    }
  }
  .input-new-tag {
    width: 150px;
    margin-right: 10px;
  }
}
</style>
