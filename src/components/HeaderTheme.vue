<template>
  <div class="theme-sepan" title="切换主题">
    <i class="iconfont icon-zhuti theme-icon" @click="showThemePicker"></i>
    <el-color-picker
      ref="themePicker"
      class="theme-picker"
      popper-class="theme-picker-dropdown"
      v-model="theme"
      :predefine="predefineColors"
    >
    </el-color-picker>
  </div>
</template>

<script>
import THEME_UTILS from './theme';

const default_theme = '#2772c0'; // 系统默认主题色
const local_theme = localStorage.getItem('theme') || default_theme; // 本地保存的的主题色

export default {
  name: 'ThemePicker',
  data() {
    return {
      chalk: '',
      predefineColors: ['#2772c0', '#17cb9f', '#F56C6C', '#E6A23C'],
      theme: local_theme
    };
  },
  mounted() {},
  watch: {
    async theme(val, oldVal) {
      if (typeof val !== 'string') return;
      if (val.toLowerCase() === oldVal.toLowerCase()) return;

      await THEME_UTILS.update(val, oldVal);

      this.$emit('onThemeChange', val);
      return;
    }
  },
  methods: {
    showThemePicker() {
      this.$refs.themePicker.click();
    }
  }
};
</script>

<style lang="postcss">
@import '../assets/css/common/theme.css';
.theme-sepan {
  position: relative;
  .theme-icon {
    position: absolute;
    top: -2px;
    left: 1px;
    font-size: 26px;
    cursor: pointer;
    color: var(--nav-item-fontcolor);
  }

  .theme-picker .el-color-picker__trigger {
    width: 28px;
    vertical-align: middle;
    border: none;
    opacity: 0;
  }
  .el-color-picker__color {
    border: none;
    .el-color-picker__color-inner {
      background: var(--base-color) !important;
    }
  }
}
.theme-sepan:hover {
  .theme-icon {
    color: var(--base-color);
  }
}
.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
