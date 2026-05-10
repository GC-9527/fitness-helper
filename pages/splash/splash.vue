<template>
  <view class="splash-container" :style="themeStyle">
    <image 
      v-if="customImage" 
      class="splash-image" 
      :src="customImage" 
      mode="aspectFill"
      @load="onImageLoad"
      @error="onImageError"
    />
    <view v-else class="default-splash">
      <view class="logo-section">
        <text class="logo-icon">💪</text>
        <text class="app-name">训练日常</text>
      </view>
      <text class="slogan">开启你的健身之旅</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      customImage: '',
      isLoading: true
    };
  },

  onLoad() {
    this.loadCustomImage();
  },

  onReady() {
    // 页面渲染完成后启动定时器
    this.startTimer();
  },

  methods: {
    loadCustomImage() {
      try {
        // 直接加载保存的图片路径
        const imagePath = uni.getStorageSync('customSplashImage');
        console.log('加载启动图片路径:', imagePath);
        console.log('图片类型:', typeof imagePath);
        console.log('图片长度:', imagePath ? imagePath.length : 0);
        
        if (imagePath && imagePath.length > 10) {
          // 如果有图片路径，直接使用
          this.customImage = imagePath;
          console.log('使用自定义启动图片');
        } else {
          // 如果没有，使用默认启动页
          console.log('使用默认启动页');
          this.customImage = '';
        }
      } catch (e) {
        console.error('加载启动图片失败:', e);
        this.customImage = '';
      }
    },

    onImageLoad() {
      console.log('启动图片加载成功');
    },

    onImageError(e) {
      console.error('启动图片加载失败:', e);
      console.error('图片URL:', this.customImage);
      console.error('图片类型:', typeof this.customImage);
      console.error('图片长度:', this.customImage ? this.customImage.length : 0);
      
      // 图片加载失败时，使用默认启动页
      this.customImage = '';
    },

    startTimer() {
      setTimeout(() => {
        this.navigateToHome();
      }, 1500);
    },

    navigateToHome() {
      if (this.isLoading) {
        this.isLoading = false;
        // 使用 reLaunch 确保正确跳转到首页
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.splash-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background) !important;
}

.splash-image {
  width: 100%;
  height: 100%;
}

.default-splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.app-name {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 4rpx;
}

.slogan {
  font-size: 28rpx;
  color: var(--text-secondary);
  letter-spacing: 2rpx;
}
</style>
