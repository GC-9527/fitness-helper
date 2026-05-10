<template>
  <view class="container" :style="themeStyle">
    <view class="test-section">
      <text class="test-title">主题测试页面</text>
      <text class="test-subtitle">当前主题: {{currentTheme}}</text>
    </view>

    <view class="color-test">
      <view class="color-box primary">
        <text>Primary</text>
      </view>
      <view class="color-box background">
        <text>Background</text>
      </view>
      <view class="color-box text">
        <text>Text</text>
      </view>
    </view>

    <view class="theme-info">
      <text class="info-title">主题变量值:</text>
      <text class="info-item">--primary: {{themeStyle['--primary']}}</text>
      <text class="info-item">--background: {{themeStyle['--background']}}</text>
      <text class="info-item">--text: {{themeStyle['--text']}}</text>
    </view>

    <button class="test-btn" @click="switchToLight">切换到浅色主题</button>
    <button class="test-btn" @click="switchToDark">切换到深色主题</button>
  </view>
</template>

<script>
import themeStore from '../../store/themeStore.js';

export default {
  data() {
    return {
      currentTheme: '',
      themeStyle: {}
    };
  },

  onLoad() {
    this.currentTheme = themeStore.getTheme();
    this.updateThemeStyle();
    uni.$on('themeChanged', this.handleThemeChange);
  },

  onUnload() {
    uni.$off('themeChanged', this.handleThemeChange);
  },

  methods: {
    updateThemeStyle() {
      const colors = themeStore.getColors();
      if (colors) {
        this.themeStyle = {
          '--primary': colors.primary,
          '--background': colors.background,
          '--text': colors.text,
          '--background-secondary': colors.backgroundSecondary,
          '--text-secondary': colors.textSecondary
        };
      }
    },

    handleThemeChange(colors) {
      this.currentTheme = themeStore.getTheme();
      this.updateThemeStyle();
    },

    switchToLight() {
      themeStore.setTheme('light');
      this.currentTheme = 'light';
    },

    switchToDark() {
      themeStore.setTheme('dark');
      this.currentTheme = 'dark';
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  min-height: 100vh;
  background-color: var(--background) !important;
  padding: 32rpx;
  box-sizing: border-box;
}

.test-section {
  margin-bottom: 40rpx;
}

.test-title {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text);
  display: block;
  margin-bottom: 16rpx;
}

.test-subtitle {
  font-size: 28rpx;
  color: var(--text-secondary);
  display: block;
}

.color-test {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.color-box {
  flex: 1;
  height: 150rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--border);
}

.color-box.primary {
  background-color: var(--primary);
}

.color-box.primary text {
  color: #ffffff;
}

.color-box.background {
  background-color: var(--background-secondary);
}

.color-box.background text {
  color: var(--text);
}

.color-box.text {
  background-color: var(--text);
}

.color-box.text text {
  color: var(--background);
}

.theme-info {
  background-color: var(--background-secondary);
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 40rpx;
}

.info-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
  display: block;
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 12rpx;
  font-family: monospace;
}

.test-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.test-btn::after {
  border: none;
}
</style>
