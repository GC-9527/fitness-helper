<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="历史记录"></custom-navbar>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="greeting">训练历史</text>
      <text class="page-subtitle">记录你的每一次进步</text>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card" v-if="workoutHistory.length > 0">
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{totalWorkouts}}</text>
          <text class="stat-label">总训练</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{totalDuration}}</text>
          <text class="stat-label">总时长(分)</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{totalSets}}</text>
          <text class="stat-label">完成组数</text>
        </view>
      </view>
    </view>

    <!-- 历史列表 -->
    <view class="history-section" v-if="workoutHistory.length > 0">
      <view class="section-header">
        <text class="section-title">最近训练</text>
        <text class="section-count">{{workoutHistory.length}} 次</text>
      </view>

      <view class="history-list">
        <view
          class="history-item"
          v-for="(item, index) in workoutHistory"
          :key="item.id"
          @click="showDetail(item.id)"
          :class="{ expanded: expandedIndex === index, highlighted: item.date === highlightedDate }"
        >
          <view class="history-main">
            <view class="history-date-box">
              <text class="date-day">{{getDay(item.date)}}</text>
              <text class="date-month">{{getMonth(item.date)}}</text>
            </view>
            <view class="history-info">
              <view class="info-row">
                <text class="history-date">{{item.date}}</text>
                <text class="history-duration">{{item.duration}}分钟</text>
              </view>
              <view class="info-row secondary">
                <text class="history-exercises">{{item.exercises.length}} 个动作</text>
                <text class="history-sets">{{item.completedSets}}/{{item.totalSets}} 组</text>
              </view>
              <view class="progress-bar" v-if="expandedIndex !== index">
                <view class="progress-fill" :style="{width: (item.completedSets / item.totalSets * 100) + '%'}"></view>
              </view>
            </view>
            <view class="expand-icon">
              <text :class="{ rotated: expandedIndex === index }">›</text>
            </view>
          </view>

          <!-- 展开详情 -->
          <view class="history-detail" v-if="expandedIndex === index">
            <view class="detail-exercises">
              <view class="detail-exercise" v-for="(exercise, exIndex) in item.exercises" :key="exIndex">
                <view class="exercise-main-info">
                  <view class="exercise-status" :class="{ completed: exercise.completedSets >= exercise.sets }">
                    <text v-if="exercise.completedSets >= exercise.sets">✓</text>
                    <text v-else>○</text>
                  </view>
                  <text class="exercise-name">{{exercise.name}}</text>
                  <text class="exercise-sets">{{exercise.completedSets}}/{{exercise.sets}}组</text>
                </view>
                <!-- 显示每组的详细信息 -->
                <view class="exercise-set-details" v-if="exercise.setDetails && exercise.setDetails.length > 0">
                  <view class="set-detail-item" v-for="(set, setIndex) in exercise.setDetails" :key="setIndex">
                    <text class="set-number">第{{setIndex + 1}}组</text>
                    <text class="set-weight" v-if="set.weight > 0">{{set.weight}}kg</text>
                    <text class="set-reps">{{set.reps}}次</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="detail-actions">
              <button class="action-btn delete" @click.stop="deleteWorkout(item)">删除记录</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="workoutHistory.length === 0">
      <view class="empty-icon">📊</view>
      <view class="empty-text">暂无训练记录</view>
      <view class="empty-hint">开始你的第一次训练吧</view>
      <button class="btn-primary start-btn" @click="goToWorkout">开始训练</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      workoutHistory: [],
      totalWorkouts: 0,
      totalDuration: 0,
      totalSets: 0,
      expandedIndex: -1,
      highlightedDate: ''
    };
  },

  onLoad() {
    this.loadHistory();
    this.checkSelectedDate();
  },

  onShow() {
    this.loadHistory();
    this.checkSelectedDate();
  },

  methods: {
    loadHistory() {
      try {
        const history = uni.getStorageSync('workoutHistory') || [];
        
        let totalWorkouts = history.length;
        let totalDuration = 0;
        let totalSets = 0;
        
        history.forEach(item => {
          totalDuration += item.duration;
          totalSets += item.completedSets;
        });
        
        this.workoutHistory = history;
        this.totalWorkouts = totalWorkouts;
        this.totalDuration = totalDuration;
        this.totalSets = totalSets;
      } catch (e) {
        console.error('加载历史记录失败:', e);
      }
    },

    getDay(dateStr) {
      const date = new Date(dateStr);
      return date.getDate();
    },

    getMonth(dateStr) {
      const date = new Date(dateStr);
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return months[date.getMonth()];
    },

    showDetail(id) {
      const index = this.workoutHistory.findIndex(item => item.id === id);
      if (index !== -1) {
        this.expandedIndex = this.expandedIndex === index ? -1 : index;
      }
    },

    deleteWorkout(item) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条训练记录吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              const history = this.workoutHistory.filter(h => h.id !== item.id);
              uni.setStorageSync('workoutHistory', history);
              
              this.expandedIndex = -1;
              this.loadHistory();
              
              uni.showToast({
                title: '已删除',
                icon: 'success'
              });
            } catch (e) {
              console.error('删除失败:', e);
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },

    goToWorkout() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },

    checkSelectedDate() {
      const selectedDate = uni.getStorageSync('selectedHistoryDate');
      if (selectedDate) {
        this.highlightedDate = selectedDate;
        // 查找对应日期的训练记录并展开
        const index = this.workoutHistory.findIndex(item => item.date === selectedDate);
        if (index !== -1) {
          this.expandedIndex = index;
          // 清除存储的选中日期
          uni.removeStorageSync('selectedHistoryDate');
        }
      }
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  padding: 0 32rpx 32rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24rpx;
  padding-top: 32rpx;
}

.greeting {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text);
  display: block;
}

.page-subtitle {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
  display: block;
}

/* 统计卡片 */
.stats-card {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 32rpx;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: 56rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8rpx;
  font-family: 'DIN Alternate', sans-serif;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.2);
}

/* 历史区域 */
.history-section {
  margin-top: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.section-count {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.history-item {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  overflow: hidden;
  transition: all 0.3s ease;
}

.history-item.expanded {
  background-color: var(--background-secondary);
}

.history-item.highlighted {
  border: 2rpx solid var(--primary);
  box-shadow: 0 0 20rpx rgba(14, 165, 233, 0.3);
  animation: highlight-pulse 2s ease-in-out;
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 rgba(14, 165, 233, 0);
  }
  50% {
    box-shadow: 0 0 30rpx rgba(14, 165, 233, 0.5);
  }
  100% {
    box-shadow: 0 0 20rpx rgba(14, 165, 233, 0.3);
  }
}

.history-main {
  display: flex;
  align-items: center;
  padding: 24rpx;
}

.history-date-box {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, var(--primary-light) 0%, rgba(14, 165, 233, 0.2) 100%);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.date-day {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.date-month {
  font-size: 20rpx;
  color: var(--text-secondary);
  margin-top: 4rpx;
}

.history-info {
  flex: 1;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.info-row.secondary {
  margin-bottom: 12rpx;
}

.history-date {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
}

.history-duration {
  font-size: 26rpx;
  color: var(--success);
  font-weight: 500;
}

.history-exercises,
.history-sets {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.progress-bar {
  height: 6rpx;
  background-color: var(--background-tertiary);
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success) 0%, var(--primary) 100%);
  border-radius: 3rpx;
  transition: width 0.5s ease;
}

.expand-icon {
  margin-left: 20rpx;
  font-size: 36rpx;
  color: var(--text-tertiary);
  transition: transform 0.3s ease;
}

.expand-icon .rotated {
  display: inline-block;
  transform: rotate(90deg);
}

/* 展开详情 */
.history-detail {
  padding: 0 24rpx 24rpx;
  border-top: 1rpx solid var(--border);
}

.detail-exercises {
  padding: 20rpx 0;
}

.detail-exercise {
  display: flex;
  flex-direction: column;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--border);
}

.detail-exercise:last-child {
  border-bottom: none;
}

.exercise-main-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.exercise-status {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  font-size: 18rpx;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.exercise-status.completed {
  background-color: var(--success);
  border-color: var(--success);
  color: #ffffff;
}

.exercise-name {
  flex: 1;
  font-size: 28rpx;
  color: var(--text);
}

.exercise-sets {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 组详情样式 */
.exercise-set-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
  margin-left: 48rpx;
  padding: 12rpx;
  background: var(--background-tertiary);
  border-radius: 12rpx;
}

.set-detail-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: var(--surface);
  border-radius: 8rpx;
}

.set-number {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.set-weight {
  font-size: 24rpx;
  color: var(--primary);
  font-weight: 600;
}

.set-reps {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16rpx;
  border-top: 1rpx solid var(--border);
}

.action-btn {
  padding: 16rpx 40rpx;
  font-size: 26rpx;
  border-radius: 50rpx;
  border: none;
}

.action-btn.delete {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 36rpx;
  color: var(--text);
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 40rpx;
}

.start-btn {
  padding: 24rpx 80rpx;
  font-size: 28rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #ffffff;
  border: none;
  border-radius: 50rpx;
  font-weight: 500;
}
</style>
