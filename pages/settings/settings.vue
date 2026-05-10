<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="设置"></custom-navbar>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">设置</text>
      <text class="page-subtitle">个性化您的训练体验</text>
    </view>

    <!-- 主题设置卡片 -->
    <view class="card">
      <view class="section-header">
        <view class="section-icon-wrapper theme-icon">
          <text class="section-icon">🎨</text>
        </view>
        <view class="section-info">
          <text class="section-title">主题设置</text>
          <text class="section-desc">选择您喜欢的界面风格</text>
        </view>
      </view>
      
      <view class="setting-item theme-selector" @click="openThemeSelector">
        <view class="theme-preview">
          <view class="theme-colors">
            <view class="theme-color-dot" :style="{ backgroundColor: currentThemeColors.primary }"></view>
            <view class="theme-color-dot" :style="{ backgroundColor: currentThemeColors.background }"></view>
            <view class="theme-color-dot" :style="{ backgroundColor: currentThemeColors.text }"></view>
          </view>
          <view class="theme-info">
            <text class="theme-name">{{ currentThemeName }}</text>
            <text class="theme-name-en">{{ currentThemeNameEn }}</text>
          </view>
        </view>
        <view class="setting-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>

    <!-- 训练设置卡片 -->
    <view class="card">
      <view class="section-header">
        <view class="section-icon-wrapper training-icon">
          <text class="section-icon">🏋️</text>
        </view>
        <view class="section-info">
          <text class="section-title">训练设置</text>
          <text class="section-desc">自定义训练体验</text>
        </view>
      </view>
      
      <!-- 组间歇计时开关 -->
      <view class="setting-item">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">⏱️</text>
            <text class="setting-name">组间歇计时</text>
          </view>
          <text class="setting-desc">完成一组后自动启动间歇计时</text>
        </view>
        <switch 
          :checked="settings.isRestTimerEnabled" 
          @change="toggleSetting('isRestTimerEnabled', $event)"
          :color="switchColor"
        />
      </view>

      <!-- 间歇时长设置 -->
      <view class="setting-item" v-if="settings.isRestTimerEnabled">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">⏳</text>
            <text class="setting-name">间歇时长</text>
          </view>
          <text class="setting-desc">组间休息时间</text>
        </view>
        <view class="setting-value">
          <picker 
            mode="selector" 
            :range="durationOptions" 
            :range-key="'text'"
            :value="getDurationIndex()"
            @change="onDurationChange"
          >
            <view class="picker-value">
              <text class="duration-value">{{settings.restDuration}}秒</text>
              <text class="picker-arrow">▾</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 自动锁定开关 -->
      <view class="setting-item">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">🔒</text>
            <text class="setting-name">自动锁定训练</text>
          </view>
          <text class="setting-desc">进入训练时自动锁定，防止误触</text>
        </view>
        <switch 
          :checked="settings.autoLockEnabled" 
          @change="toggleSetting('autoLockEnabled', $event)"
          :color="switchColor"
        />
      </view>
    </view>

    <!-- 通知设置卡片 -->
    <view class="card">
      <view class="section-header">
        <view class="section-icon-wrapper notification-icon">
          <text class="section-icon">🔔</text>
        </view>
        <view class="section-info">
          <text class="section-title">通知设置</text>
          <text class="section-desc">管理提醒和通知</text>
        </view>
      </view>
      
      <!-- 休息结束通知开关 -->
      <view class="setting-item">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">📢</text>
            <text class="setting-name">休息结束通知</text>
          </view>
          <text class="setting-desc">休息结束时发送通知提醒</text>
        </view>
        <switch 
          :checked="settings.notificationEnabled" 
          @change="toggleSetting('notificationEnabled', $event)"
          :color="switchColor"
        />
      </view>

      <!-- 震动提醒开关 -->
      <view class="setting-item">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">📳</text>
            <text class="setting-name">震动提醒</text>
          </view>
          <text class="setting-desc">完成动作或休息结束时震动提醒</text>
        </view>
        <switch 
          :checked="settings.vibrationEnabled" 
          @change="toggleSetting('vibrationEnabled', $event)"
          :color="switchColor"
        />
      </view>
    </view>

    <!-- 个性化设置卡片 -->
    <view class="card">
      <view class="section-header">
        <view class="section-icon-wrapper custom-icon">
          <text class="section-icon">🖼️</text>
        </view>
        <view class="section-info">
          <text class="section-title">个性化</text>
          <text class="section-desc">自定义启动图</text>
        </view>
      </view>
      
      <view class="splash-preview">
        <image 
          v-if="hasCustomSplash" 
          class="splash-preview-image" 
          :src="customSplashImage" 
          mode="aspectFill"
        />
        <view v-else class="splash-default">
          <text class="splash-default-icon">💪</text>
          <text class="splash-default-text">默认启动图</text>
        </view>
      </view>
      <view class="splash-actions">
        <button class="splash-btn" @click="uploadSplashImage">
          <text class="splash-btn-icon">📷</text>
          <text class="splash-btn-text">选择图片</text>
        </button>
        <button v-if="hasCustomSplash" class="splash-btn remove" @click="removeSplashImage">
          <text class="splash-btn-icon">🗑️</text>
          <text class="splash-btn-text">恢复默认</text>
        </button>
      </view>
      <view class="splash-hint">
        <text>启动时将显示 1 秒钟</text>
      </view>
    </view>

    <!-- 关于卡片 -->
    <view class="card">
      <view class="section-header">
        <view class="section-icon-wrapper about-icon">
          <text class="section-icon">ℹ️</text>
        </view>
        <view class="section-info">
          <text class="section-title">关于</text>
          <text class="section-desc">应用信息</text>
        </view>
      </view>
      
      <!-- 版本信息 -->
      <view class="setting-item">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">📱</text>
            <text class="setting-name">当前版本</text>
          </view>
          <text class="setting-desc">训练日常</text>
        </view>
        <view class="setting-value">
          <text class="version-value">{{currentVersion}}</text>
        </view>
      </view>

      <!-- 检查更新 -->
      <view class="setting-item clickable" @click="checkUpdate">
        <view class="setting-info">
          <view class="setting-name-wrapper">
            <text class="setting-icon">🔄</text>
            <text class="setting-name">检查更新</text>
          </view>
          <text class="setting-desc">检查是否有新版本可用</text>
        </view>
        <view class="setting-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>
    </view>

    <!-- 提示卡片 -->
    <view class="card tips-card">
      <view class="tips-header">
        <text class="tips-icon">💡</text>
        <text class="tips-title">使用提示</text>
      </view>
      <view class="tips-content">
        <view class="tip-item">
          <text class="tip-bullet">•</text>
          <text class="tip-text">组间歇计时默认60秒，可根据训练强度调整</text>
        </view>
        <view class="tip-item">
          <text class="tip-bullet">•</text>
          <text class="tip-text">自动锁定训练可防止训练时误触修改计划</text>
        </view>
        <view class="tip-item">
          <text class="tip-bullet">•</text>
          <text class="tip-text">通知和震动提醒有助于掌握训练节奏</text>
        </view>
      </view>
    </view>

    <!-- 主题选择弹窗 -->
    <view class="modal-mask" v-if="showThemeModal" @click="closeThemeModal"></view>
    <view class="theme-modal" v-if="showThemeModal">
      <view class="modal-header">
        <text class="modal-title">选择主题</text>
        <text class="close-btn" @click="closeThemeModal">×</text>
      </view>
      <scroll-view class="theme-list" scroll-y>
        <view
          class="theme-item"
          v-for="theme in themeList"
          :key="theme.key"
          :class="{ active: currentTheme === theme.key }"
          @click="switchTheme(theme.key)"
        >
          <view class="theme-color-preview">
            <view class="color-block primary" :style="{ backgroundColor: theme.colors.primary }"></view>
            <view class="color-block secondary" :style="{ backgroundColor: theme.colors.background }"></view>
            <view class="color-block tertiary" :style="{ backgroundColor: theme.colors.backgroundSecondary }"></view>
          </view>
          <view class="theme-info">
            <text class="theme-name">{{ theme.name }}</text>
            <text class="theme-name-en">{{ theme.nameEn }}</text>
          </view>
          <view class="theme-check" v-if="currentTheme === theme.key">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { updateUtil } from '../../utils/index';
import themeStore from '../../store/themeStore.js';
import { getAllThemes, getTheme } from '../../static/css/themes.js';

export default {
  data() {
    return {
      settings: {
        isRestTimerEnabled: false,
        restDuration: 60,
        autoLockEnabled: true,
        notificationEnabled: true,
        vibrationEnabled: true
      },
      durationOptions: [
        { value: 30, text: '30秒' },
        { value: 45, text: '45秒' },
        { value: 60, text: '60秒' },
        { value: 90, text: '90秒' },
        { value: 120, text: '2分钟' },
        { value: 180, text: '3分钟' }
      ],
      currentVersion: '3.5',
      themeList: getAllThemes(),
      currentTheme: themeStore.getTheme(),
      showThemeModal: false,
      customSplashImage: '',
      hasCustomSplash: false
    };
  },

  computed: {
    currentThemeName() {
      const theme = this.themeList.find(t => t.key === this.currentTheme);
      return theme ? theme.name : '深色主题';
    },
    currentThemeNameEn() {
      const theme = this.themeList.find(t => t.key === this.currentTheme);
      return theme ? theme.nameEn : 'Dark';
    },
    currentThemeColors() {
      const theme = getTheme(this.currentTheme);
      return theme ? theme.colors : getTheme('dark').colors;
    },
    switchColor() {
      const theme = getTheme(this.currentTheme);
      return theme ? theme.colors.primary : '#0ea5e9';
    }
  },

  onLoad() {
    this.loadSettings();
    this.getCurrentVersion();
    this.currentTheme = themeStore.getTheme();
    this.loadSplashImage();
  },

  methods: {
    openThemeSelector() {
      this.showThemeModal = true;
    },

    closeThemeModal() {
      this.showThemeModal = false;
    },

    switchTheme(themeKey) {
      themeStore.setTheme(themeKey);
      this.currentTheme = themeKey;
      this.showThemeModal = false;
      uni.showToast({
        title: '主题已切换',
        icon: 'success',
        duration: 1500
      });
    },

    loadSettings() {
      try {
        const savedSettings = uni.getStorageSync('fitnessSettings');
        if (savedSettings) {
          this.settings = { ...this.settings, ...savedSettings };
        }
      } catch (e) {
        console.error('加载设置失败:', e);
      }
    },

    toggleSetting(key, event) {
      this.settings[key] = event.detail.value;
      this.saveSettings();
    },
    
    saveSettings() {
      try {
        uni.setStorageSync('fitnessSettings', this.settings);
        uni.showToast({
          title: '设置已保存',
          icon: 'success'
        });
      } catch (e) {
        console.error('保存设置失败:', e);
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    },

    getDurationIndex() {
      return this.durationOptions.findIndex(item => item.value === this.settings.restDuration);
    },

    onDurationChange(e) {
      const index = e.detail.value;
      this.settings.restDuration = this.durationOptions[index].value;
      this.saveSettings();
    },
    
    getCurrentVersion() {
      // #ifdef APP-PLUS
      try {
        const manifest = plus.runtime.manifest;
        this.currentVersion = manifest.version.name;
      } catch (e) {
        console.error('获取版本号失败:', e);
      }
      // #endif
    },
    
    checkUpdate() {
      updateUtil.checkUpdate(true);
    },

    loadSplashImage() {
      try {
        const imagePath = uni.getStorageSync('customSplashImagePath');
        if (imagePath && imagePath.length > 10) {
          this.customSplashImage = imagePath;
          this.hasCustomSplash = true;
          return;
        }
        const image = uni.getStorageSync('customSplashImage');
        if (image) {
          this.customSplashImage = image;
          this.hasCustomSplash = true;
        } else {
          this.hasCustomSplash = false;
        }
      } catch (e) {
        console.error('加载启动图片失败:', e);
        this.hasCustomSplash = false;
      }
    },

    uploadSplashImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          console.log('选择图片成功，临时路径:', tempFilePath);
          this.saveSplashImage(tempFilePath);
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({
            title: '选择失败',
            icon: 'none'
          });
        }
      });
    },

    saveSplashImage(filePath) {
      console.log('开始保存图片，路径:', filePath);
      this.customSplashImage = filePath;
      this.hasCustomSplash = true;
      uni.saveFile({
        tempFilePath: filePath,
        success: (res) => {
          const savedFilePath = res.savedFilePath;
          console.log('图片保存成功，永久路径:', savedFilePath);
          try {
            uni.setStorageSync('customSplashImage', savedFilePath);
            uni.showToast({
              title: '设置成功',
              icon: 'success'
            });
          } catch (e) {
            console.error('保存图片路径失败:', e);
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('保存文件失败:', err);
          try {
            uni.setStorageSync('customSplashImage', filePath);
            uni.showToast({
              title: '设置成功',
              icon: 'success'
            });
          } catch (e) {
            console.error('保存临时路径失败:', e);
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        }
      });
    },

    removeSplashImage() {
      uni.showModal({
        title: '确认恢复',
        content: '确定要恢复默认启动图吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              uni.removeStorageSync('customSplashImagePath');
              uni.removeStorageSync('customSplashImage');
              this.customSplashImage = '';
              this.hasCustomSplash = false;
              uni.showToast({
                title: '已恢复默认',
                icon: 'success'
              });
            } catch (e) {
              console.error('删除启动图片失败:', e);
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  padding: 0 24rpx 24rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32rpx;
  padding: 16rpx 8rpx;
}

.page-title {
  font-size: 44rpx;
  font-weight: 800;
  color: var(--text);
  display: block;
  margin-bottom: 12rpx;
}

.page-subtitle {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 卡片样式 */
.card {
  background-color: var(--background-secondary);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--border);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

/* 区域头部 */
.section-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid var(--border);
}

.section-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon-wrapper.theme-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-icon-wrapper.training-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.section-icon-wrapper.notification-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.section-icon-wrapper.about-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.section-icon-wrapper.custom-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.section-icon {
  font-size: 32rpx;
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text);
  display: block;
  margin-bottom: 4rpx;
}

.section-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.clickable:active {
  background-color: var(--surface-hover);
  margin: 0 -32rpx;
  padding: 24rpx 32rpx;
}

.setting-item.theme-selector {
  padding: 20rpx 0;
}

.setting-info {
  flex: 1;
  margin-right: 20rpx;
}

.setting-name-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.setting-icon {
  font-size: 28rpx;
}

.setting-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.setting-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  padding-left: 40rpx;
}

.setting-value {
  display: flex;
  align-items: center;
}

.picker-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
  border: 2rpx solid var(--border);
}

.duration-value {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
}

.picker-arrow {
  font-size: 20rpx;
  color: var(--text-secondary);
}

.version-value {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--primary);
  padding: 12rpx 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
}

.setting-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--text-secondary);
}

/* 主题预览 */
.theme-preview {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.theme-colors {
  display: flex;
  gap: -8rpx;
}

.theme-color-dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid var(--background-secondary);
  margin-left: -12rpx;
}

.theme-color-dot:first-child {
  margin-left: 0;
}

.theme-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.theme-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.theme-name-en {
  font-size: 22rpx;
  color: var(--text-secondary);
}

/* 提示卡片 */
.tips-card {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border: none;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.tips-icon {
  font-size: 36rpx;
}

.tips-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #ffffff;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tip-item {
  display: flex;
  gap: 12rpx;
  align-items: flex-start;
}

.tip-bullet {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.6;
}

.tip-text {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--text);
  flex: 1;
}

/* 主题选择弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8rpx);
  z-index: 998;
}

.theme-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-height: 70%;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  z-index: 999;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid var(--border);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text);
}

.close-btn {
  font-size: 48rpx;
  color: var(--text-secondary);
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.close-btn:active {
  background-color: var(--surface-hover);
  color: var(--text);
}

.theme-list {
  padding: 24rpx;
  max-height: 600rpx;
}

.theme-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: all var(--transition-fast);
}

.theme-item:active {
  transform: scale(0.98);
}

.theme-item.active {
  border-color: var(--primary);
  background-color: var(--surface-hover);
}

.theme-color-preview {
  display: flex;
  gap: 8rpx;
  margin-right: 20rpx;
}

.color-block {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  border: 2rpx solid var(--border);
}

.color-block.primary {
  border-radius: 50%;
}

.theme-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.theme-item .theme-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.theme-item .theme-name-en {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.theme-check {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: bold;
}

/* switch样式优化 */
switch {
  transform: scale(0.85);
}

/* 个性化启动图样式 */
.splash-preview {
  width: 100%;
  height: 300rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background-color: var(--background-tertiary);
}

.splash-preview-image {
  width: 100%;
  height: 100%;
}

.splash-default {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background-tertiary);
}

.splash-default-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.splash-default-text {
  font-size: 28rpx;
  color: var(--text-secondary);
}

.splash-actions {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.splash-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 12rpx;
}

.splash-btn.remove {
  background-color: rgba(239, 68, 68, 0.1);
}

.splash-btn-icon {
  font-size: 32rpx;
}

.splash-btn-text {
  font-size: 26rpx;
  color: var(--text);
}

.splash-btn.remove .splash-btn-text {
  color: var(--danger);
}

.splash-hint {
  text-align: center;
}

.splash-hint text {
  font-size: 24rpx;
  color: var(--text-secondary);
}
</style>