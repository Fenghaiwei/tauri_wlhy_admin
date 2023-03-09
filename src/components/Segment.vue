<template>
  <layout>
    <div class="welcome-page">
      <div class="segment welcome-segment">
        <div class="segment-header">我是标题</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">文案超长</div>
            <div class="segment-content" title="文案超长自动省略文案超长自动省略文案超长自动省略文案超长自动省略">
              文案超长自动省略文案超长自动省略文案超长自动省略文案超长自动省略
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">红色</div>
            <div class="segment-content font-red">请输入帐号密码</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">绿色</div>
            <div class="segment-content font-green">操作成功</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">橘色</div>
            <div class="segment-content font-orange">12975.32</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">主题色</div>
            <div class="segment-content font-default">跟随主题的颜色</div>
          </div>
          <div class="segment-item-title">其他信息</div>
          <div class="segment-line"></div>
          <div class="segment-item">
            <div class="segment-label">label色</div>
            <div class="segment-content font-label">我是label色</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">文字灰色</div>
            <div class="segment-content font-gray">我是灰色文字</div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">占满整行</div>
            <div class="segment-content">
              占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item" colspan="2">
            <div class="segment-label">跨域两列</div>
            <div class="segment-content">跨域两列跨域两列跨域两列跨域两列跨域两列</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>

          <div class="segment-item warp">
            <div class="segment-label">超长换行</div>
            <div class="segment-content">
              超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item haslink">
            <div class="segment-label">营业资质</div>
            <div class="segment-content">武汉物易云通网络科技有限公司</div>
            <div class="the-linker" @click="showViewer(imgSrc3)">查看</div>
          </div>

          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item row-width h-auto">
            <div class="segment-label">图片展示</div>
            <div class="segment-content imgcontent">
              <img class="img-preview-item" :src="imgSrc1.src" @click="showViewer(imgSrc1)" />
              <img class="img-preview-item" :src="imgSrc2.src" @click="showViewer(imgSrc2)" />
              <el-button type="primary" @click="showViewerAll">多图查看</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="segment">
        <div class="segment-header">我是标题2</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import dayjs from 'dayjs';
import defaultAvatar from '@/assets/img/default.png';
import { getStorage } from '@fe/utils';

export default {
  data() {
    return {
      loginTime: '',
      belongCompany: {},
      userData: {},

      imgSrc1: {
        src:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592457953920&di=aa8ce08f07b3d841547b3bbc9308099b&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201803%2F09%2F20180309203626_qgnvp.thumb.700_0.jpeg',
        title: '凭证1'
      },
      imgSrc2: {
        src:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592457953920&di=bcccf2e890ec1e368fab48f9551f1c1f&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn20115%2F521%2Fw1056h1065%2F20181211%2Feb2b-hqackaa2812377.jpg',
        title: '凭证1'
      },
      imgSrc3: {
        src:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592457953919&di=b3ff7163400b90dc8fde6f9f564478c5&imgtype=0&src=http%3A%2F%2Ft2.58cdn.com.cn%2Fbidding%2Fbig%2Fn_v29911e4db9626414e9b40a905f9e57411.jpg',
        title: '营业资质'
      }
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/adminmng' }, { title: '欢迎页' }]);

    this.loginTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const userData = getStorage('userData') || {};
    userData.avatar = userData.avatar || defaultAvatar;
    this.userData = userData;
  },
  methods: {
    showViewer(item) {
      this.$store.dispatch('showViewer', { data: [{ url: item.src, title: item.title }] });
    },
    showViewerAll() {
      this.$store.dispatch('showViewer', {
        data: [
          { url: this.imgSrc1.src, title: this.imgSrc1.title },
          { url: this.imgSrc2.src, title: this.imgSrc2.title }
        ]
      });
    }
  }
};
</script>
<style lang="postcss">
.welcome-page {
  .segment.welcome-segment {
    border: none;
    .segment-label {
      width: 80px;
    }
  }
}
</style>
