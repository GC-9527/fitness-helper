<template>
  <view class="app-container" :style="appThemeStyle">
    <slot />
  </view>
</template>

<script>
import timerStore from './store/index';
import themeStore from './store/themeStore.js';
import { updateUtil } from './utils/index';

export default {
  globalData: {},

  data() {
    return {
      appThemeStyle: {}
    };
  },

  onLaunch() {
    console.log('App Launch');
    themeStore.init();
    this.applyThemeStyle();

    // 设置 HTML 元素的 data-theme 属性（仅在 H5 环境下）
    try {
      const currentTheme = themeStore.getTheme() || 'dark';
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    } catch (e) {
      // 非 H5 环境，忽略错误
    }

    timerStore.init();

    try {
      const history = uni.getStorageSync('workoutHistory');
      if (!history) {
        uni.setStorageSync('workoutHistory', []);
      }
    } catch (e) {
      console.error('初始化 workoutHistory 失败:', e);
    }

    try {
      const checkIns = uni.getStorageSync('checkIns');
      if (!checkIns) {
        uni.setStorageSync('checkIns', {});
      }
    } catch (e) {
      console.error('初始化 checkIns 失败:', e);
    }

    try {
      const customExercises = uni.getStorageSync('customExercises');
      if (!customExercises) {
        uni.setStorageSync('customExercises', []);
      }
    } catch (e) {
      console.error('初始化 customExercises 失败:', e);
    }

    // 启动时先显示启动页
    uni.reLaunch({
      url: '/pages/splash/splash'
    });

    // 应用启动后延迟检查更新，避免影响启动速度
    setTimeout(() => {
      updateUtil.checkUpdate();
    }, 3000);
  },

  onShow() {
    console.log('App Show');
    this.applyThemeStyle();
  },

  methods: {
    applyThemeStyle() {
      const colors = themeStore.getColors();
      if (colors) {
        // 构建 CSS 变量样式
        const cssVars = {
          '--primary': colors.primary,
          '--primary-light': colors.primaryLight,
          '--primary-dark': colors.primaryDark,
          '--secondary': colors.secondary,
          '--accent': colors.accent,
          '--background': colors.background,
          '--background-secondary': colors.backgroundSecondary,
          '--background-tertiary': colors.backgroundTertiary,
          '--surface': colors.surface,
          '--surface-hover': colors.surfaceHover,
          '--border': colors.border,
          '--border-light': colors.borderLight,
          '--text': colors.text,
          '--text-secondary': colors.textSecondary,
          '--text-tertiary': colors.textTertiary,
          '--success': colors.success,
          '--warning': colors.warning,
          '--danger': colors.danger,
          '--info': colors.info
        };

        this.appThemeStyle = cssVars;

        // 在小程序端，尝试设置 page 元素的样式
        // #ifdef MP-WEIXIN
        try {
          const styleStr = Object.entries(cssVars)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
          // 使用 wxs 或动态样式的方式应用到 page
          console.log('小程序端主题样式:', styleStr);
        } catch (e) {
          console.error('设置小程序主题样式失败:', e);
        }
        // #endif
      }
    }
  }
}
</script>

<style>
@import './static/css/variables.css';

page {
  background-color: var(--background);
  color: var(--text);
}

.app-container {
  min-height: 100vh;
}
</style>
