<template>
  <layout navActive="config">
    <div class="product-config-add">
      <div class="segment">
        <div class="segment-header">
          <span>产品类型</span>
        </div>
        <div class="segment-area flex-area" span="4">
          <div class="segment-item">
            <div class="segment-label">产品类型</div>
            <div class="segment-content">
              <el-select v-model="formData.productType" placeholder="请选择产品类型" :disabled="formType == 'edit'">
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header mb-10">
          <span>保障方案</span>
        </div>
        <div class="segment-area flex-area" span="2">
          <div class="segment-item" style="width: 500px">
            <div class="segment-label">规则名称</div>
            <div class="segment-content" style="width: 220px !important">
              <el-input
                :disabled="formType == 'edit'"
                v-model.trim="formData.ruleName"
                placeholder="请输入规则名称"
                clearable
                :maxlength="10"
              ></el-input>
            </div>
          </div>

          <div class="segment-item">
            <div class="segment-label">货源类型</div>
            <div class="segment-content">
              <el-select
                v-model="formData.stockKind"
                placeholder="请选择货源类型"
                :disabled="formType == 'edit'"
                @change="getStockList"
                filterable
              >
                <el-option
                  v-for="item in stockKindList"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                ></el-option>
              </el-select>
            </div>
            <div class="segment-content">
              <el-select
                v-model="formData.stockSecondKind"
                placeholder="请选择二级货源类型"
                :disabled="formType == 'edit'"
                filterable
              >
                <el-option
                  v-for="item in stockSecondKindList"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="segment-area flex-area" span="4">
          <div class="segment-item" style="width: 500px">
            <div class="segment-label">
              <span class="font-red">*</span>货物价值（<span class="font-red">万元</span>）
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label"><span class="font-red">*</span>价格（元）</div>
          </div>
        </div>
        <div class="segment-area flex-area" span="4" v-for="(item, idx) in productsDetailConfig" :key="idx">
          <div class="segment-item" style="width: 500px">
            <div class="segment-content">
              <el-input
                v-model.trim="item.goodsMinValue"
                disabled
                :maxlength="7"
                :placeholder="idx === 0 ? '固定0，不准修改' : '固定上一级右侧数值，不准修改'"
              ></el-input>
            </div>
            <div class="ml-5 mr-5">—</div>
            <div class="segment-content">
              <el-input
                v-model.trim="item.goodsMaxValue"
                placeholder="请输入，≤某个值"
                clearable
                :maxlength="7"
              ></el-input>
            </div>
          </div>
          <div class="segment-item" style="width: 280px">
            <div class="segment-content">
              <el-input v-model.trim="item.chargePrice" placeholder="请输入价格" clearable></el-input>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-content">
              <svg class="svgfont font-size24" aria-hidden="true" v-if="idx === 0" @click="addItem">
                <use xlink:href="#icon-xinzeng"></use>
              </svg>
              <svg class="svgfont font-size24" aria-hidden="true" v-if="idx > 0" @click="delItem(idx)">
                <use xlink:href="#icon-shanchu"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="segment-area">
          <div class="segment-item mb-10">
            <span class="font-red">*</span>注：1.遵循右包含原则，例如0-5000元，其中包含5000；
          </div>
          <div class="segment-item ml-20 pl-15">2.最后一档最大值为：9999999，只支持输入正整数</div>
        </div>
        <div class="segment-foot mt-20">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="onJumpList">返回</el-button>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import utils from '@/utils/utils';
import { isRangeNumber, isNumber, isInt } from '@fe/validator';
// const reg = /^[1-9]\d{0,6}$/; 1 - 9999999
// const regPrice = /^([1-9]\d{0,7}|0)(\.\d{1,2})?$/; 0 - 99999999.99
export default {
  data() {
    return {
      formType: 'add',
      productsId: '',
      formData: {
        productType: '', // 产品类型
        ruleName: '', // 规则名称
        stockSecondKind: '', // 货源类型
        stockKind: '' // 货源类型
      },
      productsDetailConfig: [
        {
          goodsMinValue: 0,
          goodsMaxValue: '',
          chargePrice: ''
        }
      ],
      productList: [],
      stockKindList: [],
      stockSecondKindList: [],
      priceMax: 9999999
    };
  },
  watch: {
    productsDetailConfig: {
      handler(newValue, oldValue) {
        for (let i = 0; i < this.productsDetailConfig.length; i++) {
          let item = this.productsDetailConfig[i];
          if (i != this.productsDetailConfig.length - 1 && item.goodsMaxValue) {
            this.productsDetailConfig[i + 1].goodsMinValue = item.goodsMaxValue;
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [
      { title: '首页', path: '/config' },
      { title: '产品配置', path: '/product/config' },
      { title: `${this.$route.name == 'ProductConfigEdit' ? '编辑' : '新增'}产品配置` }
    ]);
    await this.getSysDict();
    await this.getStockList();
    if (this.$route.name == 'ProductConfigEdit') {
      this.formType = 'edit';
      this.productsId = this.$route.params.id;
      await this.getDetail();
      this.getStockList(this.formData.stockKind);
    }
  },
  methods: {
    async getSysDict() {
      let productRes = await utils.getSysDict('cargo_guarantee_type', true);
      this.productList = productRes;
      this.formData.productType = this.productList[0].value;
    },
    async getStockList(val = '') {
      let stockKindRes = await axios.get(api.findStockTypeMetaPage, val ? { params: { parentCode: val } } : {});
      if (!val) {
        this.stockKindList = stockKindRes.data || [];
      } else {
        if (this.formType != 'edit') {
          this.formData.stockSecondKind = '';
        }
        this.stockSecondKindList = stockKindRes.data || [];
      }
    },
    async getDetail() {
      let result = await axios.post(api.cargoGuaranteeDetail, {
        productsId: this.productsId
      });
      this.formData.productType = result.data.productType;
      this.formData.ruleName = result.data.ruleName;
      this.formData.stockKind = result.data.stockKind;
      this.formData.stockSecondKind = result.data.stockSecondKind || '';

      this.productsDetailConfig = result.data.cargoGuaranteeProductsDetailReqs;
    },
    addItem() {
      if (this.productsDetailConfig.length === 5) {
        this.$message.error('最大支持5级阶梯方案');
        return;
      }
      this.productsDetailConfig.push({
        goodsMinValue: JSON.parse(JSON.stringify(this.productsDetailConfig[this.productsDetailConfig.length - 1]))
          .goodsMaxValue,
        goodsMaxValue: '',
        chargePrice: ''
      });
    },
    delItem(idx) {
      this.productsDetailConfig.splice(idx, 1);
    },
    onJumpList() {
      this.$router.go(-1);
    },
    hanldleValid() {
      if (!this.formData.productType) {
        this.$message.error('请选择产品类型');
        return false;
      }
      if (!this.formData.ruleName) {
        this.$message.error('请填写规则名称');
        return false;
      }
      if (!this.formData.stockKind) {
        this.$message.error('请选择货物类型');
        return false;
      }
      for (let i = 0; i < this.productsDetailConfig.length; i++) {
        let item = this.productsDetailConfig[i];
        if ((!item.goodsMinValue && item.goodsMinValue != 0) || !item.goodsMaxValue || !item.chargePrice) {
          this.$message.error(`第${i + 1}行数据填写不完整`);
          return false;
        }
        if ((item.goodsMinValue != 0 && !isInt(item.goodsMinValue, false)) || !isInt(item.goodsMaxValue, false)) {
          this.$message.error('货物价值格式不正确');
          return false;
        }
        if (
          !this.checkNumberVali(item.chargePrice) ||
          (this.checkNumberVali(item.chargePrice) && this.priceMax - parseFloat(item.chargePrice) < 0)
        ) {
          this.$message.error('价格格式不正确');
          return false;
        }
        if (item.goodsMinValue - item.goodsMaxValue >= 0) {
          this.$message.error(`第${i + 1}行货物价值最小值应小于最大值`);
          return false;
        }
      }
      return true;
    },
    checkNumberVali(val) {
      if (isNumber(val) && isRangeNumber(val, 0, 100000000, true, false)) {
        return true;
      }
      return false;
    },
    async handleSave() {
      let isValid = this.hanldleValid();
      if (isValid) {
        let apiUrl = this.formType == 'add' ? api.cargoGuaranteeAdd : api.cargoGuaranteeEdit;
        let options = {
          addCargoGuaranteeProductsDetailReqs: this.productsDetailConfig
        };
        if (this.formType == 'add') {
          options.ruleName = this.formData.ruleName;
          options.productType = this.formData.productType;
          options.stockKind = this.formData.stockKind;
          options.stockSecondKind = this.formData.stockSecondKind;
        } else {
          options.productsId = this.productsId;
        }
        this.$confirm('是否确认配置?', '提交确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            await axios.post(apiUrl, {
              ...options
            });
            this.onJumpList();
          })
          .catch(() => {});
      }
    }
  }
};
</script>
<style lang="postcss">
.product-config-add {
  .segment .segment-area {
    padding: 8px;
  }
  .segment-label {
    width: 120px;
  }
  /* .segment-flex {
    display: flex;
    align-items: center;
    .el-input {
      width: 200px;
    }
  } */
}
</style>
