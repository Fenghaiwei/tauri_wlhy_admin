<template>
  <div id="app">
    <template v-if="!isLoading">
      <keep-alive :max="50" :include="keepAliveRouter">
        <router-view :key="$route.fullPath"></router-view>
      </keep-alive>
    </template>
    <template v-else>
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
    <ul id="viewerDom">
      <li v-for="(img, index) in viewerData" :key="index">
        <img :src="img.url" :alt="img.title || '图片'" style="display: none" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { routes } from './router';
import permission from '@/utils/permission';
import THEME_UTILS from '@/components/theme';
import { invoke } from '@tauri-apps/api/tauri';
import { WebviewWindow } from '@tauri-apps/api/window';

export default {
  data: function () {
    return {
      isLoading: true
    };
  },
  computed: {
    ...mapState({
      keepAliveRouter: state => state.keepAliveRouter, // 要缓存的页面 注意这些页面文件加name(组件name需与 路由name一致)
      excludeRoutes: state => state.excludeRoutes,
      viewerData: state => state.viewerData
    })
  },
  created: async function () {
    // 初始化主题
    // THEME_UTILS.init();
    if (!this.excludeRoutes.includes(this.$route.path)) {
      // 获取用户权限
      await permission.init(true);
    }

    this.isLoading = false;
  },
  mounted() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('DOMContentLoaded', () => {
      // DOM 内容加载完成之后，通过 invoke 调用 在 Rust 中已经注册的命令
      const splashWindow = WebviewWindow.getByLabel('splashscreen');
      if (splashWindow) {
        setTimeout(() => {
          invoke('close_splashscreen');
        }, 1500);
      }
    });
  }
};
</script>

<style lang="postcss">
@import './assets/css/common/reset.css';
@import './assets/css/common/common.css';
</style>
