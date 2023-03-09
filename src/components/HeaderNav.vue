<template>
  <div class="header-content">
    <div class="header-logo-item">
      <!-- <span>物易云通 - 运营管理</span> -->
    </div>
    <el-menu :default-active="'/' + navActive" mode="horizontal" class="header-nav-menu flex1">
      <template v-for="(el, index) in navData">
        <el-menu-item :index="el.menuUri" :key="index">
          <router-link :to="el.menuUri">{{ el.menuName }}</router-link>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="header-shortcut-panel">
      <div class="header-shortcut-item menu-link" style="display: none">
        <a href="https:www.sijibao.com" target="_blank">司机宝</a>
      </div>
      <div class="header-shortcut-item mr-30">
        <svg class="svgfont font-size21" aria-hidden="true" @click="onLoginOut">
          <use xlink:href="#icon-tuichu"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api/api';
import axios from '@/utils/axios';
import { mapState } from 'vuex';
import HeaderTheme from './HeaderTheme';
import Breadcrumb from './Breadcrumb';
import { getStorage } from '@fe/utils';
import utils from '@/utils/utils';
export default {
  components: { HeaderTheme, Breadcrumb },
  props: {
    navActive: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userName: '',
      userAvatar: '',
      avatarLetter: '',
      isShowNotice: true,
      userAvatarBg: {},
      layoutVisible: false,
      showPopper: false, // 用户头像是否启用popper
      // 用户头像popper数据
      commonMenu: [
        { path: '/example', name: '示例' },
        { path: '/example', name: '示例' },
        { path: '/example', name: '示例' }
      ]
    };
  },
  computed: {
    ...mapState({
      navData: state => state.menuTree,
      g_config: state => state.g_config,
      noticeData: state => state.noticeData,
      isCollapse: state => state.g_config.isCollapse,
      optionsCollapse: state => state.g_config.optionsCollapse
    })
  },
  created() {
    const userData = getStorage('userData') || {};
    this.userName = userData.userName || '';
    this.userAvatar = userData.filePath || '';
    this.userAvatarBg = { backgroundImage: 'url(' + userData.filePath + ')' };
    if (userData.userCode) {
      this.avatarLetter = userData.userCode.substring(0, 1).toUpperCase();
    }
  },
  methods: {
    changeCollapse: function () {
      var g_config = this.$store.state.g_config;
      g_config.isCollapse = !g_config.isCollapse;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    },
    closeSetDialog() {
      const g_config = this.$store.state.g_config;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    },
    async onLoginOut() {
      // 清除业务数据
      sessionStorage.removeItem('orderNos');
      // 清除登录信息
      // let res = await axios.post(api.logout, {}, { backRes: true, showMsg: false });
      // console.log('res', res);
      utils.logoutClear();
      this.$router.push({ path: '/login' });
    }
  }
};
</script>
