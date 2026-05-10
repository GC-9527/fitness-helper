<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="打卡"></custom-navbar>

    <view class="card calendar-card">
      <view class="calendar-header">
        <view class="nav-btn" @click="prevMonth">‹</view>
        <view class="month-title">{{currentYear}}年{{currentMonth + 1}}月</view>
        <view class="nav-btn" @click="nextMonth">›</view>
      </view>

      <view class="week-days">
        <view class="week-day" v-for="(day, index) in weekDays" :key="index">{{day}}</view>
      </view>

      <view class="calendar-grid">
        <view
          class="calendar-day"
          :class="{
            'empty': item.isEmpty,
            'today': item.isToday,
            'checked': item.isChecked && item.type === 'workout',
            'rest-checked': item.isChecked && item.type === 'rest'
          }"
          v-for="(item, index) in calendarDays"
          :key="index"
          @click="selectDay(item.date)"
        >
          <text class="day-number">{{item.day}}</text>
          <!-- 训练部位小圆点 -->
          <view class="body-parts-dots" v-if="item.bodyParts && item.bodyParts.length > 0">
            <view
              class="body-part-dot"
              v-for="(part, pIndex) in item.bodyParts"
              :key="pIndex"
              :style="{ backgroundColor: getBodyPartColor(part) }"
            ></view>
          </view>
          <view class="check-mark" v-else-if="item.isChecked">{{item.type === 'rest' ? '🏖️' : '✓'}}</view>
        </view>
      </view>
    </view>

    <view class="card stats-card">
      <view class="header">
        <text class="title">打卡统计</text>
      </view>
      <view class="checkin-stats">
        <view class="stat-item">
          <text class="stat-value">{{totalCheckIns}}</text>
          <text class="stat-label">累计打卡</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{currentStreak}}</text>
          <text class="stat-label">连续打卡</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{monthCheckIns}}</text>
          <text class="stat-label">本月打卡</text>
        </view>
      </view>
    </view>

    <view class="tips-card">
      <view class="tips-text">💡 完成训练后会自动打卡哦！</view>
    </view>
    
    <!-- 休息日打卡按钮 -->
    <button class="rest-day-btn" @click="checkInRestDay">
      <text class="rest-day-btn-text">🏖️ 休息日打卡</text>
    </button>

    <!-- 训练部位图例 -->
    <view class="body-parts-legend-card" v-if="hasBodyPartsData">
      <view class="legend-header" @click="toggleLegend">
        <text class="legend-title">训练部位图例</text>
        <text class="legend-toggle">{{showLegend ? '收起 ▲' : '展开 ▼'}}</text>
      </view>
      <view class="legend-content" v-if="showLegend">
        <view class="legend-item" v-for="(part, index) in bodyPartsList" :key="index">
          <view class="legend-dot" :style="{ backgroundColor: getBodyPartColor(part) }"></view>
          <text class="legend-name">{{part}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      currentDate: new Date(),
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      calendarDays: [],
      checkIns: {},
      totalCheckIns: 0,
      currentStreak: 0,
      monthCheckIns: 0,
      showLegend: false,
      bodyPartsList: ['胸部', '背部', '腿部', '肩部', '手臂', '核心', '全身', '有氧']
    };
  },

  computed: {
    hasBodyPartsData() {
      return this.calendarDays.some(day => day.bodyParts && day.bodyParts.length > 0);
    }
  },

  onLoad() {
    this.initCalendar();
    this.loadCheckIns();
  },

  onShow() {
    this.loadCheckIns();
    this.generateCalendar();
  },

  methods: {
    initCalendar() {
      const now = new Date();
      this.currentYear = now.getFullYear();
      this.currentMonth = now.getMonth();
      this.currentDate = now;
      this.generateCalendar();
    },

    // 获取训练部位颜色
    getBodyPartColor(part) {
      const colorMap = {
        '胸部': '#ef4444',
        '背部': '#3b82f6',
        '腿部': '#8b5cf6',
        '肩部': '#f59e0b',
        '手臂': '#10b981',
        '核心': '#06b6d4',
        '全身': '#ec4899',
        '有氧': '#84cc16'
      };
      return colorMap[part] || '#6b7280';
    },

    // 获取训练部位短名称
    getBodyPartShortName(part) {
      const shortNameMap = {
        '胸部': '胸',
        '背部': '背',
        '腿部': '腿',
        '肩部': '肩',
        '手臂': '臂',
        '核心': '核',
        '全身': '全',
        '有氧': '氧'
      };
      return shortNameMap[part] || part.charAt(0);
    },

    // 从训练记录中提取训练部位
    extractBodyPartsFromWorkout(workout) {
      if (!workout || !workout.exercises || workout.exercises.length === 0) {
        return [];
      }

      const bodyParts = new Set();
      workout.exercises.forEach(exercise => {
        if (exercise.part) {
          bodyParts.add(exercise.part);
        }
      });

      return Array.from(bodyParts);
    },

    loadCheckIns() {
      try {
        const checkIns = uni.getStorageSync('checkIns') || {};
        const workoutHistory = uni.getStorageSync('workoutHistory') || [];
        
        // 处理旧的打卡记录格式，转换为新格式
        for (let date in checkIns) {
          if (typeof checkIns[date] === 'boolean') {
            // 旧格式：布尔值，转换为新格式
            checkIns[date] = {
              completed: checkIns[date],
              type: 'workout' // 默认类型为训练打卡
            };
          } else if (!checkIns[date].type) {
            // 新格式但缺少type字段，添加默认类型
            checkIns[date].type = 'workout';
          }
        }
        
        let totalCheckIns = Object.keys(checkIns).filter(date => checkIns[date].completed).length;
        
        let currentStreak = 0;
        const today = this.formatDate(new Date());
        let checkDate = new Date();
        
        while (true) {
          const dateStr = this.formatDate(checkDate);
          if (checkIns[dateStr] && checkIns[dateStr].completed) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        let monthCheckIns = 0;
        const { currentYear, currentMonth } = this;
        for (let date in checkIns) {
          if (checkIns[date].completed) {
            const [year, month] = date.split('-');
            if (parseInt(year) === currentYear && parseInt(month) - 1 === currentMonth) {
              monthCheckIns++;
            }
          }
        }
        
        this.checkIns = checkIns;
        this.totalCheckIns = totalCheckIns;
        this.currentStreak = currentStreak;
        this.monthCheckIns = monthCheckIns;
      } catch (e) {
        console.error('加载打卡数据失败:', e);
      }
    },

    generateCalendar() {
      const { currentYear, currentMonth, checkIns } = this;
      const days = [];

      // 获取训练历史数据
      const workoutHistory = uni.getStorageSync('workoutHistory') || [];
      // 按日期分组训练记录
      const workoutsByDate = {};
      workoutHistory.forEach(workout => {
        if (workout.date) {
          if (!workoutsByDate[workout.date]) {
            workoutsByDate[workout.date] = [];
          }
          workoutsByDate[workout.date].push(workout);
        }
      });

      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);

      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push({
          day: '',
          isEmpty: true,
          date: ''
        });
      }

      const today = new Date();
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isToday = today.getFullYear() === currentYear &&
                        today.getMonth() === currentMonth &&
                        today.getDate() === i;

        const checkIn = checkIns[dateStr] || { completed: false, type: 'workout' };

        // 获取当天的训练部位
        let bodyParts = [];
        if (workoutsByDate[dateStr] && workoutsByDate[dateStr].length > 0) {
          // 合并当天所有训练的部位
          const allParts = new Set();
          workoutsByDate[dateStr].forEach(workout => {
            const parts = this.extractBodyPartsFromWorkout(workout);
            parts.forEach(part => allParts.add(part));
          });
          bodyParts = Array.from(allParts);
        }

        days.push({
          day: i,
          date: dateStr,
          isToday,
          isChecked: checkIn.completed,
          type: checkIn.type,
          bodyParts: bodyParts
        });
      }

      this.calendarDays = days;
    },

    prevMonth() {
      let { currentYear, currentMonth } = this;
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      this.currentYear = currentYear;
      this.currentMonth = currentMonth;
      this.generateCalendar();
      this.loadCheckIns();
    },

    nextMonth() {
      let { currentYear, currentMonth } = this;
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      this.currentYear = currentYear;
      this.currentMonth = currentMonth;
      this.generateCalendar();
      this.loadCheckIns();
    },

    selectDay(date) {
      if (!date) return;

      const workoutHistory = uni.getStorageSync('workoutHistory') || [];
      const dayWorkouts = workoutHistory.filter(item => item.date === date);

      if (dayWorkouts.length > 0) {
        // 有训练记录，跳转到历史页面
        uni.switchTab({
          url: '/pages/history/history',
          success: () => {
            // 通过全局事件或存储传递选中的日期
            uni.setStorageSync('selectedHistoryDate', date);
          }
        });
      } else {
        // 没有训练记录，提示用户
        uni.showToast({
          title: '当天没有训练记录',
          icon: 'none'
        });
      }
    },
    
    // 休息日打卡
    checkInRestDay() {
      try {
        const checkIns = uni.getStorageSync('checkIns') || {};
        const today = this.formatDate(new Date());
        
        // 设置为休息日打卡
        checkIns[today] = {
          completed: true,
          type: 'rest' // 新增type字段，标识为休息日打卡
        };
        
        uni.setStorageSync('checkIns', checkIns);
        
        // 更新数据
        this.loadCheckIns();
        this.generateCalendar();
        
        uni.showToast({
          title: '休息日打卡成功！',
          icon: 'success'
        });
      } catch (e) {
        console.error('休息日打卡失败:', e);
        uni.showToast({
          title: '打卡失败',
          icon: 'none'
        });
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    toggleLegend() {
      this.showLegend = !this.showLegend;
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  padding: 0 30rpx 30rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
}

.card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  margin-top: 30rpx;
}

.calendar-card {
  margin-bottom: 20rpx;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.nav-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 300;
  color: var(--text);
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 50%;
}

.month-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.week-days {
  display: flex;
  margin-bottom: 20rpx;
}

.week-day {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.calendar-grid {
  display: flex;
  flex-wrap: wrap;
}

.calendar-day {
  width: 14.2857%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
}

.calendar-day.empty {
  visibility: hidden;
}

.calendar-day.today {
  background-color: var(--surface-hover);
}

.calendar-day.today .day-number {
  color: var(--text);
}

.calendar-day.checked {
  background-color: var(--success);
}

.calendar-day.checked .day-number {
  color: var(--text);
}

/* 休息日打卡样式 */
.calendar-day.rest-checked {
  background-color: var(--secondary);
}

.calendar-day.rest-checked .day-number {
  color: var(--text);
}

.calendar-day.rest-checked .check-mark {
  font-size: 24rpx;
}

/* 休息日打卡按钮样式 */
.rest-day-btn {
  margin-top: 20rpx;
  background-color: var(--primary);
  color: var(--text);
  border: none;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.rest-day-btn::after {
  border: none;
}

.rest-day-btn-text {
  color: var(--text);
}

.day-number {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 500;
}

/* 训练部位小圆点容器 */
.body-parts-dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4rpx;
  margin-top: 6rpx;
  padding: 0 2rpx;
  max-width: 100%;
  min-height: 16rpx;
}

/* 训练部位小圆点 */
.body-part-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.check-mark {
  position: absolute;
  bottom: 4rpx;
  right: 8rpx;
  font-size: 20rpx;
  color: var(--text);
}

/* 训练部位图例卡片 */
.body-parts-legend-card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-top: 20rpx;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.legend-toggle {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.legend-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid var(--border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.legend-name {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.stats-card {
  margin-bottom: 20rpx;
}

.header {
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
}

.checkin-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.schedule-card {
  margin-bottom: 20rpx;
}

.schedule-list {
  padding: 10rpx 0;
}

.schedule-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border);
}

.schedule-item:last-child {
  border-bottom: none;
}

.schedule-info {
  display: flex;
  flex-direction: column;
}

.schedule-time {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8rpx;
}

.schedule-detail {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.empty-schedule {
  text-align: center;
  padding: 40rpx 0;
}

.text-secondary {
  color: var(--text-secondary);
}

.tips-card {
  background-color: var(--primary);
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
}

.tips-text {
  font-size: 28rpx;
  color: var(--text);
  font-weight: 500;
}
</style>
