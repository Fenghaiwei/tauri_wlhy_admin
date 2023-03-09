<template>
  <div class="fe-upload-component">
    <el-upload
      class="fe-upload-component"
      :class="[{ 'hide-plus': hidePlus }, $attrs.class]"
      :ref="uploadRef"
      :list-type="listType"
      :file-list="uploadFileList"
      :show-file-list="showFileList"
      :limit="limit"
      :multiple="multiple"
      :action="uploadAction"
      :headers="uploadHeader"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-error="handleError"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
    >
      <template v-if="listType === 'picture-card'">
        <i class="el-icon-plus"></i>
      </template>
      <template v-if="listType === 'picture' || listType === 'text'">
        <slot name="uploadBtn">
          <el-button size="small" type="primary" class="fe-upload-btn">点击上传</el-button>
        </slot>
      </template>
      <template v-if="!hidetip" #tip>
        <div class="el-upload__tip">
          <slot name="tip">
            <div class="font-size13 font-gray">
              请选择
              <span class="font-red">{{ allowTypeStr }}</span
              >格式的文件上传，文件质量最大为
              <span class="font-red">{{ maxSize }} M</span>
            </div>
          </slot>
        </div>
      </template>
    </el-upload>
    <FeViewer v-model="viewerVisible" :data="viewerData"></FeViewer>
  </div>
</template>
<script>
import { randomName } from '@fe/utils';
import FeViewer from './FeViewerNew';
import jpg from '../assets/img/fileicon/jpg.png';
import png from '../assets/img/fileicon/png.png';
import gif from '../assets/img/fileicon/gif.png';
import doc from '../assets/img/fileicon/doc.png';
import xls from '../assets/img/fileicon/xls.png';
import ppt from '../assets/img/fileicon/ppt.png';
import pdf from '../assets/img/fileicon/pdf.png';
import zip from '../assets/img/fileicon/zip.png';
import other from '../assets/img/fileicon/other.png';
import api from '@/api/api';

export default {
  name: 'FeUpload',
  components: {
    FeViewer
  },
  props: {
    defaultFiles: {
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    },
    limit: {
      required: false,
      type: Number,
      default: 1
    },
    allowType: {
      required: false,
      type: Array,
      default: () => {
        return ['jpg', 'png', 'jpeg'];
      }
    },
    maxSize: {
      required: false,
      type: Number,
      default: 10
    },
    multiple: {
      required: false,
      type: Boolean,
      default: false
    },
    listType: {
      required: false,
      type: String,
      default: 'picture-card'
    },
    showFileList: {
      required: false,
      type: Boolean,
      default: true
    },
    hidetip: {
      required: false,
      type: Boolean,
      default: true
    },
    checkResponse: {
      required: false,
      type: Function,
      default: null
    },
    viewerTitle: {
      required: false,
      type: String,
      default: ''
    },
    action: {
      required: false,
      type: String,
      default: api.upload
    },
    header: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      uploadFileList: [],
      loading: false,
      hidePlus: false,
      viewerVisible: false,
      viewerData: [],
      imageExt: ['jpg', 'jpeg', 'png'],
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
      }
    };
  },
  computed: {
    uploadRef() {
      return 'upload' + randomName(8);
    },
    uploadAction() {
      return this.action;
    },
    uploadHeader() {
      return this.header;
    },
    allowTypeStr() {
      return this.allowType.join(',').toLowerCase(); // 允许上传的文件类型
    }
  },
  watch: {
    defaultFiles: {
      handler() {
        this.uploadFileList = this.defaultFiles.map(file => this.formatFiles(file));
      },
      immediate: true
    },
    'uploadFileList.length': {
      handler() {
        this.hidePlus = this.uploadFileList.length >= this.limit;
      },
      immediate: true
    },

    limit(newVal, oldVal) {
      this.hidePlus = this.uploadFileList.length >= this.limit;
    }
  },
  methods: {
    formatFiles(file) {
      let newFile = {};
      if (typeof file === 'string') {
        newFile.id = '';
        newFile.name = this.viewerTitle || file.substring(file.lastIndexOf('/') + 1);
        newFile.ext = file.substring(file.lastIndexOf('.') + 1).toLowerCase();
        newFile.isImage = this.imageExt.includes(newFile.ext);
        newFile.url = newFile.isImage ? file : this.extIcon[newFile.ext] || this.extIcon.other;
        newFile.blobBase64 = file;
        newFile.resUrl = file;
      } else {
        newFile.id = file.id || '';
        newFile.name = file.name || this.viewerTitle || file.url.substring(file.url.lastIndexOf('/') + 1);
        newFile.ext = (file.ext || file.url.substring(file.url.lastIndexOf('.') + 1)).toLowerCase();
        newFile.isImage = this.imageExt.includes(newFile.ext);
        newFile.url = newFile.isImage ? file.url : this.extIcon[newFile.ext] || this.extIcon.other; // 显示的缩略图(用于页面控件展示)
        newFile.blobBase64 = file.blobBase64 || file.url; // blob或者base64(用于打开 或者预览)
        newFile.resUrl = file.resUrl || file.url; // 上传返回的response路径(用于提交表单)
      }
      return newFile;
    },
    // 图片上传前钩子
    beforeUpload(file) {
      // 上传之前 验证文件格式
      const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const fileType = this.allowTypeStr.split(',').includes(fileExt);
      const fileSize = file.size / 1024 / 1024 < this.maxSize;
      if (!fileType) this.$message.error({ message: `上传的文件只能是 ${this.allowTypeStr} 格式！` });
      if (!fileSize) this.$message.error({ message: `上传的文件大小不能超过 ${this.maxSize}MB！` });
      if (fileType && fileSize) {
        this.loading = true;
      }
      if (this.uploadFileList.length + 1 === this.limit) {
        this.hidePlus = true; // 提前隐藏上传按钮 避免闪烁
      }
      return fileType && fileSize;
    },

    // 可以提前拦截 不用选择文件后再提示
    handleCheckBefore(e) {
      if (this.hidePlus) {
        this.$message.error({ message: `最多只能上传 ${this.limit} 个文件！` });
        e.stopPropagation(); // 如果element修改了dom结构  这个方式就有问题了
      }
    },
    // 超出个数钩子
    handleExceed(file, fileList) {
      this.$message.error(`最多只能上传${this.limit}个文件！`);
    },
    // 移除钩子
    handleRemove(file, fileList) {
      this.loading = false;
      this.hidePlus = false;
      this.uploadFileList = fileList;
      this.$emit('remove', file, this.getUploadFiles('all'));
    },

    // 上传出错钩子
    handleError(err, file, fileList) {
      this.loading = false;
      this.hidePlus = this.uploadFileList.length >= this.limit;
      this.$message.error({ message: '上传失败' });
      this.$emit('error', file, this.getUploadFiles('all'));
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        // 传入一个参数对象即可得到基于该参数对象的文本内容
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          // target.result 该属性表示目标对象的DataURL
          resolve(e.target.result);
        };
      });
    },

    // 上传成功钩子
    async handleSuccess(response, file, fileList) {
      this.loading = false;
      if (this.checkResponse) {
        response = this.checkResponse(response); // 如果返回结构不一致 需页面自己转换为合法结构
        // 合法结构示例如下
        // response = {
        //   code: 0, // or 1
        //   message: '失败原因', // code为1时的失败原因
        //   data: {
        //     fileUri: '/2020/01/02/123456789.png'
        //   }
        // };
      }
      if (response.code === 0) {
        file.resUrl = response.data.fileUri;
        file.blobBase64 = await this.toBase64(file.raw);
        file.ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        const isImage = this.imageExt.includes(file.ext);
        file.isImage = isImage;
        if (!isImage) {
          file.url = this.extIcon[file.ext] || this.extIcon.other;
        }
        this.uploadFileList = fileList;
        this.$emit('success', file, this.getUploadFiles('all'));
      } else {
        this.$message.error({ message: response.message || '上传失败' });
        fileList.splice(fileList.indexOf(file), 1);
        this.uploadFileList = fileList;
      }
    },

    // 文件预览
    handlePreview(file) {
      if (file.isImage) {
        this.viewerData = [{ url: file.blobBase64, title: file.name || '预览图片' }];
        this.viewerVisible = true;
      } else {
        if (file.blobBase64.startsWith('http')) {
          // http地址直接打开
          window.open(file.blobBase64);
        } else {
          if (file.ext === 'pdf' || file.ext === 'pdfx' || file.ext === 'html' || file.ext === 'htm') {
            let pdfWindow = window.open('');
            pdfWindow.document.write('<style>*{margin: 0; padding: 0;}</style>');
            pdfWindow.document.write(
              "<iframe width='100%' height='100%' border='0' style='border:none' src ='" +
                encodeURI(file.blobBase64) +
                "'></iframe>"
            );
          } else {
            // ppt预览无法弹出下载框
            window.open(new File(file.blobBase64));
          }
        }
      }
    },
    // 获取上传的文件 type= 'res' | 'preview' | 'all'
    getUploadFiles(type = 'res') {
      if (this.loading) {
        this.$message.error({ message: '请等待图片上传完成' });
        throw new Error('请等待图片上传完成');
      }
      if (type === 'res') {
        return this.$refs[this.uploadRef].uploadFiles.map(el => el.resUrl);
      } else if (type === 'preview') {
        return this.$refs[this.uploadRef].uploadFiles.map(el => el.blobBase64);
      } else {
        return JSON.parse(JSON.stringify(this.$refs[this.uploadRef].uploadFiles));
      }
    },
    getRefs() {
      return this.uploadRef;
    }
  },
  created() {}
};
</script>
<style lang="postcss">
.fe-upload-component {
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 106px;
    border-radius: 2px;
  }
  .el-upload-list--picture-card {
    .el-progress {
      width: 80px !important;
    }
    .el-progress-circle {
      width: 80px !important;
    }
    .el-progress {
      top: 75%;
    }
    .el-progress .el-progress__text {
      top: 30%;
    }
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border-radius: 2px;
      transition: none !important;
    }
  }
  .el-icon-close-tip {
    display: none !important;
  }
  .fe-isimg-preview {
    width: 100px;
    height: 100px;
  }
  .fe-notimg-preview {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
.fe-upload-component {
  .el-upload--picture-card {
    transition: all 0.3s;
  }
}
.fe-upload-component.hide-plus {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
