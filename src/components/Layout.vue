<template>
  <div class="layout">
    <div class="layout-header">
      <header-nav :nav-active="navActive" :key="$route.fullPath"></header-nav>
    </div>
    <div class="layout-content" :style="styleObject">
      <div
        class="layout-side"
        :class="{
          menuWidthLarge: g_config.fullScreen && !g_config.isCollapse,
          menuWidthSmall: !g_config.fullScreen && !g_config.isCollapse,
          menuWidthMini: g_config.isCollapse
        }"
      >
        <side-menu :nav-active="navActive"></side-menu>
      </div>
      <div
        class="layout-content-main"
        :class="{
          contentWidthLarge: g_config.fullScreen && !g_config.isCollapse,
          contentWidthSmall: !g_config.fullScreen && !g_config.isCollapse,
          contentWidthMini: g_config.isCollapse
        }"
      >
        <div class="content-main-header">
          <div class="layout-tab-card el-tabs el-tabs--card el-tabs--top">
            <div class="el-tabs__header is-top">
              <div class="el-tabs__nav-wrap is-top">
                <div class="el-tabs__nav-scroll">
                  <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px)">
                    <div
                      v-for="(item, tabidx) in tabViewsList"
                      :key="item.name"
                      slot="reference"
                      class="el-tabs__item is-top is-closable"
                      :class="{ 'is-active': tabActive === item.name }"
                      @contextmenu.prevent="event => showContextMenu(event, item, tabidx)"
                      @click="onClickTab(item)"
                    >
                      {{ item.meta.title || '标签'
                      }}<span
                        v-if="tabViewsList.length !== 1"
                        class="el-icon-close"
                        @click.stop="onRemoveTab(item.name)"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <breadcrumb :navActive="navActive" class="breadcrumb-container" />
        </div>
        <div class="content-main-page" id="aduitTop">
          <slot></slot>
        </div>
      </div>
      <!-- <el-container>
        <el-aside
          :class="{
            menuWidthLarge: g_config.fullScreen && !g_config.isCollapse,
            menuWidthSmall: !g_config.fullScreen && !g_config.isCollapse,
            menuWidthMini: g_config.isCollapse
          }"
        >
          <side-menu :nav-active="navActive"></side-menu>
        </el-aside>
        <el-main>
          <div class="header-wrap">
            <header-nav :nav-active="navActive"></header-nav>
          </div>
          <div class="layout-content-main">
            <div class="layout-tab-card el-tabs el-tabs--card el-tabs--top">
              <div class="el-tabs__header is-top">
                <div class="el-tabs__nav-wrap is-top">
                  <div class="el-tabs__nav-scroll">
                    <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px);">
                      <div
                        v-for="(item, tabidx) in tabViewsList"
                        :key="item.name"
                        slot="reference"
                        class="el-tabs__item is-top is-closable"
                        :class="{ 'is-active': tabActive === item.name }"
                        @contextmenu.prevent="event => showContextMenu(event, item, tabidx)"
                        @click="onClickTab(item)"
                      >
                        {{ item.meta.title || '标签'
                        }}<span
                          v-if="tabViewsList.length !== 1"
                          class="el-icon-close"
                          @click.stop="onRemoveTab(item.name)"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <slot></slot>
          </div>
        </el-main>
      </el-container> -->
    </div>
    <!-- <div class="layout-footer">&copy; 2020 武汉物易云通网络科技有限公司 版权所有</div> -->

    <transition name="el-zoom-in-top">
      <div v-show="contextMenuVisible" :style="contextMenuStyle" class="context-menu-warp el-dropdown-menu el-popper">
        <div class="context-menu-item el-dropdown-menu__item" @click="onContextMenuClick(1)">关闭当前</div>
        <div class="context-menu-item el-dropdown-menu__item" @click="onContextMenuClick(2)">关闭左侧</div>
        <div class="context-menu-item el-dropdown-menu__item" @click="onContextMenuClick(3)">关闭右侧</div>
        <div class="context-menu-item el-dropdown-menu__item" @click="onContextMenuClick(4)">关闭其他</div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import HeaderNav from '@/components/HeaderNav';
import SideMenu from '@/components/SideMenu';
import Breadcrumb from './Breadcrumb';
export default {
  props: {
    navActive: {
      type: String,
      required: true,
      default: ''
    }
  },
  data: function () {
    return {
      contextMenuVisible: false,
      contextMenuStyle: {},
      contextMenuItem: {},
      contextMenuIndex: -1
    };
  },
  components: {
    HeaderNav,
    SideMenu,
    Breadcrumb
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  computed: {
    styleObject() {
      return this.g_config.fullScreen ? 'width: auto;min-width: 100%;max-width: 100%;' : 'width:1300px';
    },
    ...mapState({
      g_config: state => state.g_config,
      tabViewsList: state => state.tabViewsList,
      keepAliveRouter: state => state.keepAliveRouter,
      tabActive: state => state.tabActive
    })
  },
  methods: {
    // 删除tab
    async onRemoveTab(tabName) {
      if (this.tabViewsList.length === 1) return;
      await this.$store.dispatch('removeTabView', tabName);
      // 移除缓存
      await this.$store.dispatch('removeKeepAlive', tabName);
      // 删除当前tab 跳转至第一个tab
      if (this.tabActive === tabName) {
        this.$router.push({
          name: this.tabViewsList[0].name,
          params: this.tabViewsList[0].params,
          query: this.tabViewsList[0].query
        });
      }
    },
    // 点击tab
    onClickTab(tab) {
      const selected = this.tabViewsList.filter(item => item.name === tab.name);
      this.$router.push({
        name: selected[0].name,
        params: selected[0].params,
        query: selected[0].query
      });
    },
    // 显示右键菜单
    showContextMenu(event, item, index) {
      this.contextMenuItem = item;
      this.contextMenuIndex = index;

      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      this.contextMenuStyle = {
        left: event.clientX + 'px',
        top: event.clientY + scrollTop + 'px'
      };
      document.body.addEventListener('click', this.hideContextMenu);
      this.contextMenuVisible = true;
    },
    // 隐藏邮件菜单
    hideContextMenu() {
      this.contextMenuVisible = false;
      document.body.removeEventListener('click', this.hideContextMenu);
    },
    // 右键菜单点击
    async onContextMenuClick(type) {
      if (this.tabViewsList.length === 1) return;
      let removeTabs = [],
        newTabs = [],
        breakFlag = false;

      switch (type) {
        case 1:
          // 关闭当前
          this.onRemoveTab(this.contextMenuItem.name);
          breakFlag = true;
          break;
        case 2:
          // 关闭左侧
          if (this.contextMenuIndex === 0) {
            breakFlag = true;
            break;
          }
          removeTabs = this.tabViewsList.slice(0, this.contextMenuIndex);
          newTabs = this.tabViewsList.slice(this.contextMenuIndex);
          break;
        case 3:
          // 关闭右侧
          if (this.contextMenuIndex === this.tabViewsList.length - 1) {
            breakFlag = true;
            break;
          }
          removeTabs = this.tabViewsList.slice(this.contextMenuIndex + 1);
          newTabs = this.tabViewsList.slice(0, this.contextMenuIndex + 1);
          break;
        case 4:
          // 关闭其他
          removeTabs = this.tabViewsList.filter(el => el.name !== this.contextMenuItem.name);
          newTabs = this.tabViewsList.slice(this.contextMenuIndex, this.contextMenuIndex + 1);
          break;
        default:
          break;
      }
      if (breakFlag) return;

      // 修改tab
      await this.$store.dispatch('clearTabView', newTabs);

      //去除缓存
      const newKeepAlive = this.keepAliveRouter.filter(rname => {
        return !(removeTabs.findIndex(item => item.name === rname) > -1);
      });
      this.$store.dispatch('clearKeepAlive', newKeepAlive);

      // 当前tab被删除 跳转至第一个tab
      if (removeTabs.findIndex(item => item.name === this.tabActive) > -1) {
        this.$router.push({
          name: this.tabViewsList[0].name,
          params: this.tabViewsList[0].params,
          query: this.tabViewsList[0].query
        });
      }
    },
    handleResize() {
      var _w = document.documentElement.clientWidth;
      var g_config = { ...this.$store.state.g_config };
      if (_w >= 1300) {
        g_config.isCollapse = false;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      } else {
        g_config.isCollapse = true;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      }
    }
  }
};
</script>
<style lang="postcss">
@import '../assets/css/common/layout.css';
.context-menu-warp.el-dropdown-menu {
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  padding: 12px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  .context-menu-item.el-dropdown-menu__item {
    line-height: 30px;
    padding: 0 15px;
  }
}
</style>
