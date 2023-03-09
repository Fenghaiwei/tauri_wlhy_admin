<template>
  <ul :id="viewerDomId">
    <li v-for="(el, index) in source" :key="index">
      <img :src="el.url" :alt="el.title ? `${title}-${el.title}` : title" style="display: none" />
    </li>
  </ul>
</template>
<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import { randomName } from '@fe/utils';

export default {
  props: {
    title: {
      type: String,
      default: '照片'
    },
    source: {
      type: Array
    }
  },
  data: function () {
    return {
      viewer: null
    };
  },
  computed: {
    viewerDomId() {
      return 'viewer' + randomName();
    }
  },
  methods: {
    show(options = {}) {
      if (this.source.length > 0) {
        this.$nextTick(() => {
          const dom = document.getElementById(this.viewerDomId);
          options.zIndex = 3000;
          this.viewer = new Viewer(dom, options);
          this.viewer.show();
          dom.addEventListener('hidden', () => {
            this.$emit('update:show', false);
            this.viewer.destroy(); // 关闭时销毁实例
          });
        });
      } else {
        this.$message.error('暂无图片');
      }
    }
  }
};
</script>
<style lang="postcss"></style>
