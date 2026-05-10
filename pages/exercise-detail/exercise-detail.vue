<template>
  <view class="container" :style="themeStyle">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="page-title">动作详情</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="!exercise" class="error-state">
      <text class="error-icon">❌</text>
      <text class="error-text">未找到该动作</text>
      <text class="error-hint">动作ID可能已失效或不存在</text>
      <view class="back-home-btn" @click="goBack">
        <text>返回动作库</text>
      </view>
    </view>

    <!-- 动作详情内容 -->
    <scroll-view v-else class="content-scroll" scroll-y show-scrollbar="false">
      <!-- 动作基本信息 -->
      <view class="exercise-header">
        <text class="exercise-name">{{ exercise.name }}</text>
        <view class="tags-row">
          <view class="tag muscle-tag">
            <text class="tag-icon">💪</text>
            <text class="tag-text">{{ exercise.part }}</text>
          </view>
          <view class="tag equipment-tag">
            <text class="tag-icon">🏋️</text>
            <text class="tag-text">{{ exercise.equipment }}</text>
          </view>
          <view class="tag difficulty-tag" :class="getDifficultyClass(exercise.difficulty)">
            <text class="tag-icon">⭐</text>
            <text class="tag-text">{{ exercise.difficulty }}</text>
          </view>
        </view>
      </view>

      <!-- 视频播放按钮 -->
      <view class="video-section">
        <view class="video-btn" @click="openVideo">
          <view class="video-icon-wrapper">
            <text class="video-icon">📋</text>
          </view>
          <text class="video-text">🎬 观看教学视频</text>
          <text class="video-hint">点击复制链接，打开抖音自动跳转</text>
        </view>
      </view>

      <!-- 动作要领 -->
      <view class="section">
        <view class="section-header">
          <text class="section-icon">📋</text>
          <text class="section-title">动作要领</text>
        </view>
        <view class="section-content">
          <view
            v-for="(instruction, index) in exercise.instructions"
            :key="index"
            class="instruction-item"
          >
            <view class="instruction-number">{{ index + 1 }}</view>
            <text class="instruction-text">{{ instruction }}</text>
          </view>
        </view>
      </view>

      <!-- 常见错误 -->
      <view class="section">
        <view class="section-header">
          <text class="section-icon">⚠️</text>
          <text class="section-title">常见错误</text>
        </view>
        <view class="section-content">
          <view
            v-for="(mistake, index) in exercise.commonMistakes"
            :key="index"
            class="mistake-item"
          >
            <text class="mistake-icon">❌</text>
            <text class="mistake-text">{{ mistake }}</text>
          </view>
        </view>
      </view>

      <!-- 替代动作 -->
      <view class="section" v-if="alternativeExercises.length > 0">
        <view class="section-header">
          <text class="section-icon">🔄</text>
          <text class="section-title">替代动作</text>
        </view>
        <view class="section-content">
          <view
            v-for="altExercise in alternativeExercises"
            :key="altExercise.id"
            class="alternative-item"
            @click="goToAlternative(altExercise.id)"
          >
            <view class="alternative-info">
              <text class="alternative-name">{{ altExercise.name }}</text>
              <view class="alternative-tags">
                <text class="alternative-tag">{{ altExercise.part }}</text>
                <text class="alternative-tag">{{ altExercise.equipment }}</text>
              </view>
            </view>
            <text class="alternative-arrow">→</text>
          </view>
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="content-footer"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="exercise">
      <view class="add-to-workout-section">
        <view class="quick-add-row">
          <view class="quick-input-group">
            <text class="quick-label">组数</text>
            <view class="quick-control">
              <view class="quick-btn minus" @click="decreaseQuickSets">−</view>
              <text class="quick-value">{{quickSets}}</text>
              <view class="quick-btn plus" @click="increaseQuickSets">+</view>
            </view>
          </view>
          <view class="quick-input-group">
            <text class="quick-label">次数</text>
            <view class="quick-control">
              <view class="quick-btn minus" @click="decreaseQuickReps">−</view>
              <text class="quick-value">{{quickReps}}</text>
              <view class="quick-btn plus" @click="increaseQuickReps">+</view>
            </view>
          </view>
          <view class="quick-input-group" v-if="quickType === 'freeweight'">
            <text class="quick-label">重量(kg)</text>
            <input class="quick-weight-input" type="digit" v-model="quickWeight" placeholder="0"/>
          </view>
        </view>
        <view class="type-toggle-row">
          <view class="type-toggle">
            <view 
              class="toggle-option" 
              :class="{active: quickType === 'bodyweight'}"
              @click="quickType = 'bodyweight'"
            >自重</view>
            <view 
              class="toggle-option" 
              :class="{active: quickType === 'freeweight'}"
              @click="quickType = 'freeweight'"
            >自由重量</view>
          </view>
        </view>
        <button class="btn-add-to-workout" @click="addToWorkout">
          <text class="btn-icon">+</text>
          <text class="btn-text">添加到训练</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getExerciseById } from '@/utils/exerciseDatabase';

// 响应式状态
const exercise = ref(null);
const loading = ref(true);
const exerciseId = ref('');

// 快速添加配置
const quickSets = ref(4);
const quickReps = ref(12);
const quickWeight = ref('');
const quickType = ref('freeweight'); // 'bodyweight' 或 'freeweight'

// 快速设置调整
const increaseQuickSets = () => quickSets.value++;
const decreaseQuickSets = () => { if (quickSets.value > 1) quickSets.value--; };
const increaseQuickReps = () => quickReps.value++;
const decreaseQuickReps = () => { if (quickReps.value > 1) quickReps.value--; };

// 添加到训练
const addToWorkout = () => {
  if (!exercise.value) return;
  
  // 获取当前训练
  const currentWorkout = uni.getStorageSync('currentWorkout') || { exercises: [] };
  
  // 检查是否已存在
  const exists = currentWorkout.exercises.some(e => e.id === exercise.value.id);
  if (exists) {
    uni.showToast({ title: '该动作已在训练中', icon: 'none' });
    return;
  }
  
  // 初始化组详情
  const setDetails = [];
  const weight = parseFloat(quickWeight.value) || 0;
  for (let i = 0; i < quickSets.value; i++) {
    setDetails.push({
      weight: weight,
      reps: quickReps.value
    });
  }
  
  // 创建新动作
  const newExercise = {
    id: exercise.value.id,
    name: exercise.value.name,
    part: exercise.value.part,
    muscleGroup: exercise.value.part, // 添加 muscleGroup 用于成就系统
    sets: quickSets.value,
    reps: quickReps.value,
    weight: weight,
    exerciseType: quickType.value,
    completedSets: 0,
    folded: true,
    setDetails: setDetails
  };
  
  // 添加到训练
  currentWorkout.exercises.push(newExercise);
  uni.setStorageSync('currentWorkout', currentWorkout);
  
  uni.showToast({ 
    title: '已添加到训练', 
    icon: 'success',
    duration: 1500
  });
  
  // 延迟返回
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' });
  }, 1500);
};

// 替代动作列表
const alternativeExercises = computed(() => {
  if (!exercise.value || !exercise.value.alternatives) {
    return [];
  }
  return exercise.value.alternatives
    .map(id => getExerciseById(id))
    .filter(item => item !== null);
});

// 获取难度样式类
const getDifficultyClass = (difficulty) => {
  const classMap = {
    '初级': 'difficulty-beginner',
    '中级': 'difficulty-intermediate',
    '高级': 'difficulty-advanced'
  };
  return classMap[difficulty] || '';
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      // 如果返回失败，跳转到动作库页面
      uni.switchTab({
        url: '/pages/exercises/exercises'
      });
    }
  });
};

// 打开视频
const openVideo = () => {
  if (!exercise.value || !exercise.value.videoUrl) {
    uni.showToast({
      title: '暂无视频链接',
      icon: 'none'
    });
    return;
  }

  const videoUrl = exercise.value.videoUrl;

  // 检查是否是抖音链接
  if (videoUrl.includes('douyin.com')) {
    // 抖音链接直接复制，提示用户打开抖音会自动识别
    uni.setClipboardData({
      data: videoUrl,
      success: () => {
        uni.showModal({
          title: '链接已复制',
          content: '视频链接已复制到剪贴板，打开抖音APP即可自动跳转观看',
          showCancel: false,
          confirmText: '知道了'
        });
      }
    });
    return;
  }

  // 其他链接跳转到 webview 页面
  const encodedUrl = encodeURIComponent(videoUrl);
  uni.navigateTo({
    url: `/pages/webview/webview?url=${encodedUrl}&title=${encodeURIComponent(exercise.value.name)}`,
    fail: () => {
      // 如果 webview 页面不存在，提示用户
      uni.showModal({
        title: '提示',
        content: '视频页面暂未开通，请稍后重试',
        showCancel: false
      });
    }
  });
};

// 跳转到替代动作
const goToAlternative = (id) => {
  uni.redirectTo({
    url: `/pages/exercise-detail/exercise-detail?id=${id}`
  });
};

// 加载动作数据
const loadExerciseData = (options = {}) => {
  loading.value = true;

  exerciseId.value = options.id || '';

  if (!exerciseId.value) {
    exercise.value = null;
    loading.value = false;
    return;
  }

  // 从数据库获取动作详情
  const data = getExerciseById(exerciseId.value);

  if (data) {
    exercise.value = data;
  } else {
    exercise.value = null;
  }

  loading.value = false;
};

// 页面加载 - 使用 uni-app 的 onLoad 生命周期
onLoad((options) => {
  loadExerciseData(options);
});

// 备用：onMounted 也尝试加载（兼容某些场景）
onMounted(() => {
  if (!exerciseId.value) {
    // 如果 onLoad 没有触发，尝试从当前页面获取参数
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || currentPage.$route?.query || {};
      loadExerciseData(options);
    }
  }
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: var(--background) !important;
  display: flex;
  flex-direction: column;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx 20rpx;
  background-color: var(--background);
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  border-radius: 30rpx;
  background-color: var(--background-secondary);
  transition: all 0.2s ease;
}

.back-btn:active {
  background-color: var(--background-tertiary);
  transform: scale(0.95);
}

.back-icon {
  font-size: 32rpx;
  color: var(--text);
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
}

/* 加载状态 */
.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: 28rpx;
  color: var(--text-secondary);
}

/* 错误状态 */
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.error-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.error-text {
  font-size: 32rpx;
  color: var(--text);
  font-weight: 600;
  margin-bottom: 12rpx;
}

.error-hint {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 40rpx;
}

.back-home-btn {
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 40rpx;
}

.back-home-btn text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 内容滚动区域 */
.content-scroll {
  flex: 1;
  padding: 0 30rpx;
}

/* 动作头部信息 */
.exercise-header {
  background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-tertiary) 100%);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
}

.exercise-name {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--text);
  display: block;
  margin-bottom: 24rpx;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  background-color: var(--background-tertiary);
}

.tag-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.tag-text {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 500;
}

.difficulty-beginner {
  background-color: rgba(34, 197, 94, 0.2);
}

.difficulty-beginner .tag-text {
  color: #22c55e;
}

.difficulty-intermediate {
  background-color: rgba(245, 158, 11, 0.2);
}

.difficulty-intermediate .tag-text {
  color: #f59e0b;
}

.difficulty-advanced {
  background-color: rgba(239, 68, 68, 0.2);
}

.difficulty-advanced .tag-text {
  color: #ef4444;
}

/* 视频区域 */
.video-section {
  margin-bottom: 30rpx;
}

.video-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.video-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.video-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.video-icon {
  font-size: 40rpx;
  color: #ffffff;
  margin-left: 8rpx;
}

.video-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.video-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 区块样式 */
.section {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid var(--border);
}

.section-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
}

/* 动作要领 */
.instruction-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.instruction-item:last-child {
  margin-bottom: 0;
}

.instruction-number {
  width: 44rpx;
  height: 44rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.instruction-number text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 600;
}

.instruction-text {
  flex: 1;
  font-size: 28rpx;
  color: var(--text);
  line-height: 1.6;
}

/* 常见错误 */
.mistake-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
  padding: 16rpx 20rpx;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 12rpx;
  border-left: 4rpx solid #ef4444;
}

.mistake-item:last-child {
  margin-bottom: 0;
}

.mistake-icon {
  font-size: 24rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.mistake-text {
  flex: 1;
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.5;
}

/* 替代动作 */
.alternative-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: all 0.2s ease;
}

.alternative-item:last-child {
  margin-bottom: 0;
}

.alternative-item:active {
  background-color: var(--background);
  transform: scale(0.98);
}

.alternative-info {
  flex: 1;
}

.alternative-name {
  font-size: 28rpx;
  color: var(--text);
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.alternative-tags {
  display: flex;
  gap: 12rpx;
}

.alternative-tag {
  font-size: 22rpx;
  color: var(--text-secondary);
  background-color: var(--background-secondary);
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
}

.alternative-arrow {
  font-size: 28rpx;
  color: var(--primary);
  margin-left: 16rpx;
}

/* 内容底部 */
.content-footer {
  height: 40rpx;
}

/* 底部操作栏 */
.bottom-bar {
  background-color: var(--background-secondary);
  border-top: 1rpx solid var(--border);
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.add-to-workout-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.quick-add-row {
  display: flex;
  gap: 20rpx;
  align-items: flex-end;
}

.quick-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.quick-label {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.quick-control {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background-color: var(--background-tertiary);
  padding: 8rpx;
  border-radius: 12rpx;
}

.quick-btn {
  width: 44rpx;
  height: 44rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  transition: all 0.2s ease;
}

.quick-btn.minus {
  background-color: var(--danger);
}

.quick-btn.plus {
  background-color: var(--success);
}

.quick-btn:active {
  transform: scale(0.9);
}

.quick-value {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  font-family: 'DIN Alternate', monospace;
}

.quick-weight-input {
  flex: 1;
  padding: 16rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  text-align: center;
  font-family: 'DIN Alternate', monospace;
}

.type-toggle-row {
  display: flex;
  justify-content: center;
}

.type-toggle {
  display: flex;
  gap: 8rpx;
  background-color: var(--background-tertiary);
  padding: 4rpx;
  border-radius: 12rpx;
}

.toggle-option {
  padding: 16rpx 32rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
  border-radius: 10rpx;
  transition: all 0.2s ease;
}

.toggle-option.active {
  background-color: var(--primary);
  color: #ffffff;
  font-weight: 500;
}

.btn-add-to-workout {
  width: 100%;
  padding: 28rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border: none;
  transition: all 0.2s ease;
}

.btn-add-to-workout:active {
  transform: translateY(2rpx);
  opacity: 0.9;
}

.btn-add-to-workout .btn-icon {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 300;
}

.btn-add-to-workout .btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
}
</style>
