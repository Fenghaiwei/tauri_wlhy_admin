<template>
  <layout navActive="mycenter">
    <div class="welcome-page">
      <div class="segment welcome-segment">
        <div class="segment-area flex-area">
          <div class="segment-item row-width">
            <div class="segment-content">
              欢迎您，<span class="font-default">{{ userData.name }}</span>
            </div>
          </div>
          <div class="segment-item row-width h-auto">
            <div v-if="userData.avatar" class="user-avatar">
              <img :src="userData.avatar" alt="" />
            </div>
            <div v-else class="user-avatar-noimg">
              <!-- <i class="iconfont icon-username"></i> -->
            </div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">登录帐号</div>
            <div class="segment-content">{{ userData.loginName }}</div>
          </div>
          <div class="segment-item row-width">
            <div class="segment-label">当前时间</div>
            <div class="segment-content">{{ loginTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/api';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      loginTime: '',
      userData: {},
      avatarLetter: ''
    };
  },
  async created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/mycenter' }, { title: '欢迎页' }]);
    let res = await axios.get(api.userQuery);
    let userData = res.data;
    this.loginTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.userData = userData;
  },
  methods: {}
};
</script>
<style lang="postcss">
@import '../../assets/css/common/theme.css';
.welcome-page {
  .segment.welcome-segment {
    border: none;
    .segment-label {
      width: 80px;
    }
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .avatar-letter {
    font-size: 50px;
    color: #ffffff;
  }
  .user-avatar-noimg {
    width: 100px;
    height: 100px;
    line-height: 98px;
    text-align: center;
    background: var(--base-color);
    border-radius: 50%;
    i.iconfont {
      font-size: 50px;
      color: #ffffff;
    }
  }
}
</style>
