<template>
  <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <view class="navbar-left" v-if="showBack" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="navbar-title">{{title}}</view>
      <view class="navbar-right"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNavbar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusBarHeight: 0
    };
  },
  mounted() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.custom-navbar {
  background-color: var(--background);
  border-bottom: 1rpx solid var(--border);
}

.navbar-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
}

.navbar-left {
  width: 60rpx;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 48rpx;
  color: var(--text);
  font-weight: 300;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text);
}

.navbar-right {
  width: 60rpx;
}
</style>
