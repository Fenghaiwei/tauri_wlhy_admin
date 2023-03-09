<template>
  <div>
    <div :class="['mt-10', 'leftMenuBtn', { 'btn-shouqi': isCollapse, 'btn-zhankai': !isCollapse }]">
      <svg class="svgfont pointer menu-trigger font-size24" aria-hidden="true" @click="changeCollapse">
        <use :xlink:href="isCollapse ? '#icon-zhankai' : '#icon-shouqi'"></use>
      </svg>
    </div>
    <div class="layout-side-menu">
      <el-menu router :default-active="sideAction" :default-openeds="defaultOpens" :collapse="isCollapse">
        <loop-menu v-for="(el, idx) in sideData" :key="idx" :node="el"></loop-menu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoopMenu from './LoopMenu';
export default {
  components: { LoopMenu },
  props: {
    navActive: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    sideData() {
      // 当前模块下的左侧菜单
      let pageMenu = this.menuTree.filter(item => item.menuUri === '/' + this.navActive);
      pageMenu = pageMenu[0] || {};
      let children = JSON.parse(JSON.stringify(pageMenu.children || []));
      return children;
    },
    defaultOpens() {
      let openList = [];
      for (var i = 0; i < this.sideData.length; i++) {
        if (this.optionsCollapse) {
          // 展开全部第一级
          openList.push((this.sideData[i].menuUri || this.sideData[i].id).toString());
        } else {
          // 展开当前打开的菜单
          const active = this.$route.meta.active || '';
          if (active && Array.isArray(this.sideData[i].children)) {
            const idx = this.sideData[i].children.findIndex(el => el.menuUri === active);
            if (idx !== -1) {
              openList.push((this.sideData[i].menuUri || this.sideData[i].id).toString());
              break;
            }
          }
        }
      }
      return openList;
    },
    ...mapState({
      menuTree: state => state.menuTree,
      permission: state => state.permission,
      sideAction: state => state.sideAction,
      isCollapse: state => state.g_config.isCollapse,
      optionsCollapse: state => state.g_config.optionsCollapse
    })
  },
  methods: {
    changeCollapse: function () {
      var g_config = this.$store.state.g_config;
      g_config.isCollapse = !g_config.isCollapse;
      localStorage.setItem('g_config', JSON.stringify(g_config));
    }
  }
};
</script>
