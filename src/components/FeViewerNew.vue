<template>
  <!-- image viewer -->
  <ul :id="domId">
    <li v-for="(img, index) in viewerData" :key="index">
      <img :src="img.url" :alt="img.title || '图片'" style="display: none" />
    </li>
  </ul>
</template>
<script>
import { randomName } from '@fe/utils';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
export default {
  name: 'FeViewer',
  props: {
    value: {
      required: true,
      type: Boolean,
      default: false
    },
    options: {
      required: false,
      type: Object,
      default: () => {
        return {};
      }
    },
    data: {
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      domId: '',
      viewer: null,
      viewerInstance: null
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === true) {
        this.showViewer();
      } else {
        this.closeViewer();
      }
    }
  },
  computed: {
    viewerData() {
      return this.data.map(el => {
        if (typeof el === 'string') {
          return { url: el, title: '图片' };
        } else {
          return el;
        }
      });
    }
  },
  created() {
    this.domId = randomName(8);
  },
  methods: {
    showViewer() {
      // options支持viewerjs所有选项
      let options = this.options || {};
      options.zIndex = 3000;

      if (typeof options.navbar !== 'boolean') {
        if (this.viewerData.length === 1) {
          options.navbar = false;
        } else {
          options.navbar = true;
        }
      }
      this.$nextTick(() => {
        if (this.viewerInstance) {
          this.viewerInstance.show();
        } else {
          const dom = document.getElementById(this.domId);
          if (dom) {
            this.viewerInstance = new Viewer(dom, { ...options });
            this.viewerInstance.show();
            dom.addEventListener('hidden', () => {
              this.closeViewer();
            });
          }
        }
      });
    },
    closeViewer() {
      if (this.viewerInstance) {
        this.viewerInstance.destroy(); // 关闭时销毁实例
        this.viewerInstance = null;
      }
      this.$emit('input', false);
    }
  }
};
</script>
<style lang="postcss"></style>
