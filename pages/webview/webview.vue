<template>
  <view class="webview-container" :style="themeStyle">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <!-- 返回按钮 -->
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <!-- 页面标题 -->
        <text class="nav-title">{{ pageTitle }}</text>
        <!-- 占位，保持标题居中 -->
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-container" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view class="error-container" v-if="hasError">
      <text class="error-icon">⚠️</text>
      <text class="error-text">页面加载失败</text>
      <text class="error-desc">{{ errorMessage }}</text>
      <view class="retry-btn" @click="reloadPage">
        <text class="retry-text">重新加载</text>
      </view>
    </view>

    <!-- WebView 组件 -->
    <web-view
      v-if="webUrl && !hasError"
      :src="webUrl"
      class="web-view"
      @load="onLoad"
      @error="onError"
    ></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webUrl: '',
      pageTitle: '加载中...',
      isLoading: true,
      hasError: false,
      errorMessage: '',
      statusBarHeight: 0
    };
  },

  onLoad(options) {
    // 获取状态栏高度
    this.getStatusBarHeight();

    // 解析 URL 参数
    this.parseOptions(options);
  },

  methods: {
    // 获取状态栏高度
    getStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 0;
      } catch (e) {
        console.error('获取系统信息失败:', e);
        this.statusBarHeight = 0;
      }
    },

    // 解析页面参数
    parseOptions(options) {
      if (!options) {
        this.showError('缺少必要参数');
        return;
      }

      // 获取并解码 URL
      let url = options.url || '';
      if (url) {
        try {
          // 尝试解码 URL（处理被编码的 URL）
          url = decodeURIComponent(url);
        } catch (e) {
          console.warn('URL 解码失败，使用原始 URL:', e);
        }
      }

      // 验证 URL
      if (!url) {
        this.showError('缺少 URL 参数');
        return;
      }

      // 检查 URL 格式
      if (!this.isValidUrl(url)) {
        this.showError('无效的 URL 格式');
        return;
      }

      this.webUrl = url;

      // 获取标题
      let title = options.title || '';
      if (title) {
        try {
          title = decodeURIComponent(title);
        } catch (e) {
          console.warn('标题解码失败，使用原始标题:', e);
        }
      }
      this.pageTitle = title || '网页浏览';

      // 设置页面导航栏标题（如果提供了标题）
      if (title) {
        uni.setNavigationBarTitle({
          title: title
        });
      }
    },

    // 验证 URL 格式
    isValidUrl(url) {
      if (!url || typeof url !== 'string') {
        return false;
      }
      // 检查是否以 http:// 或 https:// 开头
      return url.match(/^https?:\/\/.+/i) !== null;
    },

    // 页面加载完成
    onLoad() {
      this.isLoading = false;
      this.hasError = false;
      console.log('WebView 加载完成:', this.webUrl);
    },

    // 页面加载错误
    onError(e) {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = '无法加载该页面，请检查网络连接或 URL 是否正确';
      console.error('WebView 加载错误:', e);
    },

    // 显示错误信息
    showError(message) {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = message;
      this.pageTitle = '加载失败';
    },

    // 返回上一页
    goBack() {
      // 检查是否可以返回
      const pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1,
          fail: () => {
            // 如果返回失败，跳转到首页
            uni.switchTab({
              url: '/pages/index/index'
            });
          }
        });
      } else {
        // 如果没有上一页，跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },

    // 重新加载页面
    reloadPage() {
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = '';

      // 重新设置 URL 触发重新加载
      const currentUrl = this.webUrl;
      this.webUrl = '';
      // 使用 setTimeout 替代 $nextTick 确保 DOM 更新
      setTimeout(() => {
        this.webUrl = currentUrl;
      }, 50);
    }
  }
};
</script>

<style scoped>
.webview-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--background) !important;
}

/* 顶部导航栏 */
.nav-bar {
  background-color: var(--background-secondary);
  border-bottom: 1rpx solid var(--border);
  flex-shrink: 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 64rpx;
  border-radius: 12rpx;
  transition: background-color 0.2s;
}

.back-btn:active {
  background-color: var(--surface-hover);
}

.back-icon {
  font-size: 36rpx;
  color: var(--text);
  font-weight: bold;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 20rpx;
}

.nav-placeholder {
  width: 80rpx;
}

/* WebView 组件 */
.web-view {
  flex: 1;
  width: 100%;
}

/* 加载状态 */
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
}

/* 错误状态 */
.error-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  z-index: 10;
}

.error-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.error-text {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16rpx;
}

.error-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.retry-btn {
  padding: 20rpx 60rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 12rpx;
  transition: opacity 0.2s;
}

.retry-btn:active {
  opacity: 0.8;
}

.retry-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>
