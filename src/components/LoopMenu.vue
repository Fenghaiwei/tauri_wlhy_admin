<template>
  <div class="menu-loop-box">
    <el-submenu
      v-if="hasChildren"
      :index="node.menuUri || node.id"
      :class="'parent-level' + node.treeLevel"
      popper-class="popper-submenu"
    >
      <template slot="title">
        <svg
          v-if="node.menuIcon"
          class="svgfont submenu-icon"
          :class="['menu-level' + node.treeLevel, node.menuIcon]"
          aria-hidden="true"
        >
          <use :xlink:href="`#${node.menuIcon}`"></use>
        </svg>
        <span slot="title" :class="!node.menuIcon ? 'menu-level' + node.treeLevel : ''">{{ node.menuName }}</span>
      </template>
      <loop-menu v-for="(sub, idx) in node.children" :key="idx" :node="sub"></loop-menu>
    </el-submenu>
    <template v-else>
      <template v-if="node.menuType === 0">
        <el-menu-item :index="node.menuUri" :class="'parent-level' + node.treeLevel">
          <svg
            v-if="node.menuIcon"
            class="svgfont submenu-icon"
            :class="['menu-level' + node.treeLevel, node.menuIcon]"
            aria-hidden="true"
          >
            <use :xlink:href="`#${node.menuIcon}`"></use>
          </svg>
          <span slot="title" :class="!node.menuIcon ? 'menu-level' + node.treeLevel : ''">{{ node.menuName }}</span>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  name: 'LoopMenu',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {};
  },
  computed: {
    hasChildren() {
      if (Array.isArray(this.node.children) && this.node.children.length > 0) {
        if (this.node.children.findIndex(el => el.menuType === 0) > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  created() {}
};
</script>
<style></style>
