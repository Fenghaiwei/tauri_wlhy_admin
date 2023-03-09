<template>
  <div class="fe-image-preview-component">
    <div v-if="previewList && previewList.length > 0">
      <el-image
        v-for="(item, index) in previewList"
        :key="index"
        :src="item.isImage === false ? item.icon : item.url"
        :lazy="item.lazy !== null ? item.lazy : lazy"
        :fit="item.fit !== null ? item.fit : fit"
        :title="item.altTitle"
        style="width: 100px; height: 100px"
        :class="{ 'is-file': item.isImage === false }"
        @click="showImage(item)"
      ></el-image>
    </div>
    <template v-else>
      <div v-if="showNoImage">
        <el-image src="" fit="fill" style="width: 100px; height: 100px">
          <template #error>
            <span class="el-image__error">{{ noDataTitle }}</span>
          </template>
        </el-image>
      </div>
    </template>
    <FeViewer v-model="viewerVisible" :data="viewerData" :options="viewerOptions"></FeViewer>
  </div>
</template>
<script>
import FeViewer from './FeViewerNew.vue';
import jpg from '../assets/img/fileicon/jpg.png';
import png from '../assets/img/fileicon/png.png';
import gif from '../assets/img/fileicon/gif.png';
import doc from '../assets/img/fileicon/doc.png';
import xls from '../assets/img/fileicon/xls.png';
import ppt from '../assets/img/fileicon/ppt.png';
import pdf from '../assets/img/fileicon/pdf.png';
import zip from '../assets/img/fileicon/zip.png';
import other from '../assets/img/fileicon/other.png';
const imageExt = ['jpg', 'jpeg', 'png', 'gif'];
import { randomName } from '@fe/utils';
import { Message } from 'element-ui';

export default {
  name: 'FeImagePreview',
  components: {
    FeViewer
  },
  props: {
    imageList: {
      required: false,
      type: [Array, String],
      default: () => []
    },
    lazy: {
      required: false,
      type: Boolean,
      default: false
    },
    fit: {
      required: false,
      type: String,
      default: 'fill'
    },
    showNoImage: {
      required: false,
      type: Boolean,
      default: true
    },
    noDataTitle: {
      required: false,
      type: String,
      default: '暂无图片'
    },
    title: {
      required: false,
      type: String,
      default: '预览图片'
    }
  },
  data() {
    return {
      extIcon: {
        jpg: jpg,
        jpeg: jpg,
        png: png,
        gif: gif,
        doc: doc,
        docx: doc,
        ppt: ppt,
        pptx: ppt,
        xls: xls,
        xlsx: xls,
        pdf: pdf,
        zip: zip,
        other: other
      },
      viewerVisible: false,
      viewerOptions: {}, // 支持viewer插件所支持的选项
      viewerData: []
    };
  },
  created() {},
  computed: {
    previewList() {
      if (typeof this.imageList === 'string') {
        return [this.getFormat(this.imageList)];
      } else {
        return this.imageList.map(file => this.getFormat(file));
      }
    }
  },
  methods: {
    getFileExt(url) {
      return url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    },
    getFileName(url) {
      return url.substring(url.lastIndexOf('/') + 1);
    },
    getFormat(file) {
      if (typeof file === 'string') {
        const ext = this.getFileExt(file);
        if (imageExt.includes(ext)) {
          return {
            fid: randomName(12),
            isImage: true,
            url: file,
            altTitle: this.getFileName(file)
          };
        } else {
          return {
            fid: randomName(12),
            isImage: false,
            icon: this.extIcon[ext] || this.extIcon.other,
            url: file,
            altTitle: this.getFileName(file)
          };
        }
      } else {
        const fileUrl = file.url || '';
        const ext = this.getFileExt(fileUrl);
        if (imageExt.includes(ext)) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
        return {
          ...file,
          fid: randomName(12),
          icon: this.extIcon[ext] || this.extIcon.other,
          altTitle: file.title || this.getFileName(fileUrl)
        };
      }
    },
    showImage(item, idx) {
      // 非图片处理
      if (item.isImage === false) {
        let fileUrl = typeof item === 'string' ? item : item.url || '';
        if (fileUrl.startsWith('http')) {
          window.open(fileUrl); // http地址直接打开
        } else {
          Message.error('无效文件');
          return;
        }
        return;
      }
      let previewData = [];
      this.previewList.forEach(el => {
        if (el.isImage) {
          previewData.push({ fid: el.fid, url: el.url, title: el.title || this.title });
        }
      });
      if (previewData.length > 0) {
        const index = previewData.findIndex(el => el.fid === item.fid);
        console.log('index', index);
        if (index > -1) this.viewerOptions = { initialViewIndex: index }; // 多图预览索引

        this.viewerVisible = true;
        this.viewerData = previewData;
      }

      // let previewData = [];
      // if (this.multiple) {
      //   previewData = this.imageList.map(el => {
      //     if (typeof el === 'string') {
      //       return { url: el, title: '预览图片' };
      //     } else {
      //       return { url: el.url, title: el.title || '预览图片' };
      //     }
      //   });
      //   this.viewerOptions = { initialViewIndex: idx }; // 多图预览索引
      // } else {
      //   if (typeof item === 'string') {
      //     previewData.push({ url: item, title: '预览图片' });
      //   } else {
      //     previewData.push({ url: item.url, title: item.title || '预览图片' });
      //   }
      // }
      // this.viewerVisible = true;
      // this.viewerData = previewData;
    }
  }
};
</script>
<style lang="postcss" scoped>
.el-image :deep(.el-image__inner) {
  cursor: pointer;
}
.el-image + .el-image {
  margin-left: 10px;
}
.is-file {
  border: 1px solid #dddddd;
}
</style>
