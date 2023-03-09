<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="'idx-' + index">
        <span v-if="index == breadcrumb.length - 1" class="no-redirect">{{ item.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    navActive: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      levelList: null,
    };
  },

  computed: {
    ...mapState({
      breadcrumb: state => state.breadcrumb,
    }),
  },
  created() {},
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const first = matched[0];
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
      }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      if (item.name) {
        this.$router.push({
          name: item.name,
          params: item.params,
          query: item.query,
        });
      } else if (item.path) {
        this.$router.push({ path: item.path, params: item.params, query: item.query });
      } else {
        console.log('router null');
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
@import '../assets/css/common/theme.css';

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  height: 50px;
  line-height: 52px;
  margin: 0;
  padding: 0;
  .el-breadcrumb__inner,
  .el-breadcrumb__inner a {
    font-weight: normal;
    color: var(--body-font-color);
  }
  .el-breadcrumb__inner:hover,
  .el-breadcrumb__inner a:hover {
    color: var(--base-color);
  }
  .el-breadcrumb__separator {
    font-weight: normal;
  }

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
