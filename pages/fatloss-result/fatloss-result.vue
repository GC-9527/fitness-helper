<template>
  <view class="container" :style="themeStyle">
    <view class="header-section">
      <text class="title">你的减脂计划</text>
      <text class="subtitle">根据你的数据生成的个性化减脂方案</text>
    </view>
    
    <!-- 视图切换按钮 -->
    <view class="view-toggle">
      <view 
        class="toggle-item" 
        :class="{ active: currentView === 'overview' }" 
        @click="currentView = 'overview'"
      >
        <text>方案概览</text>
      </view>
      <view 
        class="toggle-item" 
        :class="{ active: currentView === 'calendar' }" 
        @click="currentView = 'calendar'"
      >
        <text>日历视图</text>
      </view>
    </view>

    <!-- 概览视图 -->
    <view v-if="currentView === 'overview'">
      <!-- 方案概述卡片 -->
      <view class="card overview-card">
        <view class="card-header">
          <text class="card-title">方案概述</text>
        </view>
        <view class="plan-overview">
          <view class="overview-row">
            <view class="overview-item">
              <text class="overview-label">选择方案</text>
              <text class="overview-value">{{ planData.planName }}</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">体型</text>
              <text class="overview-value">{{ planData.somatotypeText }}</text>
            </view>
          </view>
          <view class="overview-row">
            <view class="overview-item">
              <text class="overview-label">基础代谢</text>
              <text class="overview-value">{{ planData.bmr }} 大卡</text>
            </view>
            <view class="overview-item">
              <text class="overview-label">每日总消耗</text>
              <text class="overview-value">{{ planData.tdee }} 大卡</text>
            </view>
          </view>
          <view class="overview-row">
            <view class="overview-item full-width">
              <text class="overview-label">目标热量缺口</text>
              <text class="overview-value highlight">{{ planData.targetCalories }} 大卡</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 碳水循环计划概览卡片 -->
      <view class="card" v-if="planData.carbsCycle">
        <view class="card-header">
          <text class="card-title">碳水循环计划</text>
          <text class="card-subtitle">{{ planData.carbsCycle.length }}天循环</text>
        </view>
        <view class="cycle-overview">
          <view class="cycle-days-preview">
            <view 
              class="day-preview-item" 
              v-for="(day, index) in planData.carbsCycle" 
              :key="index"
              :class="day.type"
              @click="showCarbsCycleModal"
            >
              <text class="day-type-text">{{ day.typeText }}</text>
              <text class="day-calories">{{ day.calories }}</text>
            </view>
          </view>
          <view class="cycle-legend">
            <view class="legend-item">
              <view class="legend-dot high"></view>
              <text class="legend-text">高碳日</text>
            </view>
            <view class="legend-item">
              <view class="legend-dot medium"></view>
              <text class="legend-text">中碳日</text>
            </view>
            <view class="legend-item">
              <view class="legend-dot low"></view>
              <text class="legend-text">低碳日</text>
            </view>
          </view>
          <button class="view-table-btn" @click="showCarbsCycleModal">
            <text class="btn-text">查看详细计划表</text>
            <text class="btn-icon">›</text>
          </button>
        </view>
      </view>

      <!-- 训练建议折叠卡片 -->
      <view class="card" v-if="planData.workoutSuggestions">
        <view class="card-header collapsible" @click="toggleWorkoutSection">
          <view class="header-left">
            <text class="card-title">训练建议</text>
            <text class="card-subtitle">{{ planData.workoutSuggestions.length }}条建议</text>
          </view>
          <view class="expand-icon" :class="{ expanded: showWorkoutSection }">
            <text>›</text>
          </view>
        </view>
        <view class="workout-suggestions" v-show="showWorkoutSection">
          <view class="suggestion-item" v-for="(suggestion, index) in planData.workoutSuggestions" :key="index">
            <view class="suggestion-number">{{ index + 1 }}</view>
            <text class="suggestion-text">{{ suggestion }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 日历视图 -->
    <view v-else-if="currentView === 'calendar'">
      <view class="card calendar-card">
        <view class="card-header">
          <text class="card-title">日历视图</text>
          <text class="card-subtitle">{{ planData.dailyPlans.length }}天计划</text>
        </view>
        
        <!-- 日历头部 -->
        <view class="calendar-header">
          <text class="calendar-nav" @click="prevMonth">‹</text>
          <text class="calendar-title">{{ calendar.year }}年{{ calendar.month + 1 }}月</text>
          <text class="calendar-nav" @click="nextMonth">›</text>
        </view>
        
        <!-- 星期标题 -->
        <view class="calendar-weekdays">
          <view class="weekday" v-for="weekday in ['日', '一', '二', '三', '四', '五', '六']" :key="weekday">
            <text>{{ weekday }}</text>
          </view>
        </view>
        
        <!-- 日历主体 -->
        <view class="calendar-body">
          <view 
            class="calendar-day"
            v-for="(day, index) in calendar.days"
            :key="index"
            :class="{
              'not-current-month': !day.isCurrentMonth,
              'has-plan': day.hasPlan,
              'selected': calendar.selectedDate && calendar.selectedDate.toDateString() === day.date.toDateString(),
              'high': day.cycleType === 'high',
              'medium': day.cycleType === 'medium',
              'low': day.cycleType === 'low'
            }"
            @click="selectDay(day)"
          >
            <text class="day-number">{{ day.day }}</text>
            <view class="day-type-tag" v-if="day.cycleType" :class="day.cycleType">
              <text>{{ day.cycleType === 'high' ? '高' : day.cycleType === 'medium' ? '中' : '低' }}</text>
            </view>
            <view class="plan-indicator" v-if="day.hasPlan"></view>
          </view>
        </view>
      </view>
      
      <!-- 选中日期的计划详情 -->
      <view class="card day-detail-card" v-if="selectedDayPlan">
        <!-- 头部：日类型 + 编辑按钮 -->
        <view class="day-detail-header">
          <view class="day-type-section">
            <text class="section-label">日类型</text>
            <text class="type-badge" :class="selectedDayPlan.cycleType || selectedDayPlan.stage">
              {{ selectedDayPlan.cycleTypeText || selectedDayPlan.stageText }}
            </text>
          </view>
          <button class="edit-btn-small" @click="startEdit(selectedDayPlan.date)" v-if="!editingDay">
            <text class="edit-icon">✎</text>
            <text class="edit-text">编辑</text>
          </button>
        </view>
        
        <!-- 编辑模式 -->
        <view v-if="editingDay === selectedDayPlan.date" class="editing-form">
          <view class="form-row">
            <text class="form-label">热量（大卡）</text>
            <input type="number" v-model.number="tempDayData.calories" class="form-input" />
          </view>
          <view class="form-row">
            <text class="form-label">蛋白质（g）</text>
            <input type="number" v-model.number="tempDayData.protein" class="form-input" />
          </view>
          <view class="form-row">
            <text class="form-label">碳水（g）</text>
            <input type="number" v-model.number="tempDayData.carbs" class="form-input" />
          </view>
          <view class="form-row">
            <text class="form-label">脂肪（g）</text>
            <input type="number" v-model.number="tempDayData.fat" class="form-input" />
          </view>
          <view class="form-row">
            <text class="form-label">备注</text>
            <input type="text" v-model="tempDayData.notes" class="form-input" placeholder="添加备注" />
          </view>
          <view class="form-actions">
            <button class="btn-small btn-secondary" @click="cancelEdit">取消</button>
            <button class="btn-small btn-primary" @click="saveEdit">保存</button>
          </view>
        </view>
        
        <!-- 查看模式 -->
        <view v-else class="day-detail-content">
          <!-- 宏量营养素 -->
          <view class="macros-grid">
            <view class="macro-item">
              <text class="macro-label">热量</text>
              <text class="macro-value">{{ selectedDayPlan.calories }}大卡</text>
            </view>
            <view class="macro-item">
              <text class="macro-label">蛋白质</text>
              <text class="macro-value">{{ selectedDayPlan.protein }}g</text>
            </view>
            <view class="macro-item">
              <text class="macro-label">碳水</text>
              <text class="macro-value">{{ selectedDayPlan.carbs }}g</text>
            </view>
            <view class="macro-item">
              <text class="macro-label">脂肪</text>
              <text class="macro-value">{{ selectedDayPlan.fat }}g</text>
            </view>
          </view>
          
          <!-- 完成状态 - 美化版 -->
          <view class="completion-section" @click="toggleCompletion(selectedDayPlan.date)">
            <view class="completion-left">
              <view class="completion-icon" :class="{ completed: selectedDayPlan.isCompleted }">
                <text v-if="selectedDayPlan.isCompleted">✓</text>
                <text v-else>○</text>
              </view>
              <view class="completion-info">
                <text class="completion-title">今日计划</text>
                <text class="completion-status" :class="{ completed: selectedDayPlan.isCompleted }">
                  {{ selectedDayPlan.isCompleted ? '已完成' : '点击标记完成' }}
                </text>
              </view>
            </view>
            <view class="completion-toggle-btn" :class="{ completed: selectedDayPlan.isCompleted }">
              <text>{{ selectedDayPlan.isCompleted ? '已完成' : '去完成' }}</text>
            </view>
          </view>
          
          <!-- 饮食建议 - 折叠 -->
          <view class="tips-section collapsible-section" v-if="selectedDayPlan.tips">
            <view class="section-header" @click="toggleTipsSection">
              <text class="section-label">饮食建议</text>
              <view class="expand-icon-small" :class="{ expanded: showTipsSection }">
                <text>›</text>
              </view>
            </view>
            <view class="tips-content-wrapper" v-show="showTipsSection">
              <text class="tips-content">{{ selectedDayPlan.tips }}</text>
            </view>
          </view>
          
          <!-- 备注 -->
          <view class="notes-section" v-if="selectedDayPlan.notes">
            <text class="section-label">备注</text>
            <text class="notes-content">{{ selectedDayPlan.notes }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 - 仅在概览视图显示 -->
    <view class="action-section" v-if="currentView === 'overview'">
      <button class="btn-secondary" @click="goBack">返回</button>
      <button class="btn-primary" @click="openSaveModal">保存计划</button>
    </view>
    
    <!-- 碳水循环计划表格弹窗 -->
    <view class="modal-mask" v-if="showCarbsCycleTable" @click="closeCarbsCycleModal"></view>
    <view class="carbs-cycle-modal" v-if="showCarbsCycleTable">
      <view class="modal-header">
        <text class="modal-title">碳水循环计划详情</text>
        <text class="close-btn" @click="closeCarbsCycleModal">×</text>
      </view>
      <view class="modal-content">
        <view class="table-container">
          <view class="cycle-table">
            <!-- 表头 -->
            <view class="table-header">
              <view class="table-header-cell">日期类型</view>
              <view class="table-header-cell">热量</view>
              <view class="table-header-cell">蛋白质</view>
              <view class="table-header-cell">碳水</view>
              <view class="table-header-cell">脂肪</view>
            </view>
            <!-- 表格内容 -->
            <view class="table-body">
              <view 
                class="table-row" 
                v-for="(day, index) in planData.carbsCycle" 
                :key="index"
                :class="day.type"
              >
                <view class="table-cell type-cell">
                  <text class="type-text">{{ day.typeText }}</text>
                </view>
                <view class="table-cell">{{ day.calories }}</view>
                <view class="table-cell">{{ day.protein }}g</view>
                <view class="table-cell">{{ day.carbs }}g</view>
                <view class="table-cell">{{ day.fat }}g</view>
              </view>
            </view>
          </view>
        </view>
        <!-- 营养说明 -->
        <view class="nutrition-tips">
          <text class="tips-title">营养分配说明</text>
          <view class="tip-item">
            <view class="tip-dot high"></view>
            <text class="tip-text">高碳日：碳水充足，适合高强度训练日</text>
          </view>
          <view class="tip-item">
            <view class="tip-dot medium"></view>
            <text class="tip-text">中碳日：碳水适中，适合中等强度训练</text>
          </view>
          <view class="tip-item">
            <view class="tip-dot low"></view>
            <text class="tip-text">低碳日：碳水较低，适合休息日或低强度训练</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 保存计划弹窗 -->
    <view class="modal-mask" v-if="showSaveModal" @click="closeSaveModal"></view>
    <view class="save-modal" v-if="showSaveModal">
      <view class="modal-header">
        <text class="modal-title">保存计划</text>
        <text class="close-btn" @click="closeSaveModal">×</text>
      </view>
      <view class="modal-content">
        <view class="form-item">
          <text class="form-label">计划名称</text>
          <input 
            class="form-input" 
            v-model="planName" 
            placeholder="请输入计划名称，以便区分不同计划" 
            placeholder-style="color: #888888;"
          />
        </view>
        <view class="form-item">
          <text class="form-hint">提示：建议包含计划类型、创建日期或个人标识，方便后续查看</text>
        </view>
      </view>
      <view class="modal-footer">
        <button class="modal-btn cancel-btn" @click="closeSaveModal">取消</button>
        <button class="modal-btn confirm-btn" @click="savePlan">保存</button>
      </view>
    </view>
  </view>
</template>

<script>
import FatlossManager from '../../utils/fatlossManager';

export default {
  data() {
    return {
      planData: {
        planName: '',
        somatotypeText: '',
        bmr: 0,
        tdee: 0,
        targetCalories: 0,
        carbsCycle: [],
        workoutSuggestions: [],
        dailyPlans: []
      },
      currentView: 'overview',
      calendar: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        selectedDate: null,
        days: []
      },
      selectedDayPlan: null,
      editingDay: null,
      tempDayData: null,
      showWorkoutSection: false,
      showTipsSection: false,
      showCarbsCycleTable: false,
      showSaveModal: false,
      planName: ''
    };
  },

  onLoad(options) {
    const tempPlanData = uni.getStorageSync('tempFatlossPlan');
    if (tempPlanData) {
      this.planData = tempPlanData;
      this.generateCalendar();
      uni.removeStorageSync('tempFatlossPlan');
    } else {
      uni.navigateBack();
    }
  },
  
  watch: {
    'calendar.year': function() {
      this.generateCalendar();
    },
    'calendar.month': function() {
      this.generateCalendar();
    }
  },
  
  methods: {
    generateCalendar() {
      const year = this.calendar.year;
      const month = this.calendar.month;
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const calendarDays = [];
      
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const prevMonthDay = new Date(year, month, -i);
        calendarDays.push({
          date: prevMonthDay,
          day: prevMonthDay.getDate(),
          isCurrentMonth: false,
          hasPlan: false,
          cycleType: null
        });
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        const currentDay = new Date(year, month, i);
        const dateStr = currentDay.toISOString().split('T')[0];
        const dayPlan = this.planData.dailyPlans.find(plan => plan.date === dateStr);
        
        calendarDays.push({
          date: currentDay,
          day: i,
          isCurrentMonth: true,
          hasPlan: !!dayPlan,
          cycleType: dayPlan ? dayPlan.cycleType : null
        });
      }
      
      const remainingDays = 42 - calendarDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(year, month + 1, i);
        calendarDays.push({
          date: nextMonthDay,
          day: nextMonthDay.getDate(),
          isCurrentMonth: false,
          hasPlan: false,
          cycleType: null
        });
      }
      
      this.calendar.days = calendarDays;
    },
    
    goBack() {
      uni.navigateBack();
    },

    toggleWorkoutSection() {
      this.showWorkoutSection = !this.showWorkoutSection;
    },

    toggleTipsSection() {
      this.showTipsSection = !this.showTipsSection;
    },

    showCarbsCycleModal() {
      this.showCarbsCycleTable = true;
    },

    closeCarbsCycleModal() {
      this.showCarbsCycleTable = false;
    },

    prevMonth() {
      if (this.calendar.month === 0) {
        this.calendar.year--;
        this.calendar.month = 11;
      } else {
        this.calendar.month--;
      }
    },

    nextMonth() {
      if (this.calendar.month === 11) {
        this.calendar.year++;
        this.calendar.month = 0;
      } else {
        this.calendar.month++;
      }
    },

    selectDay(day) {
      if (!day.isCurrentMonth) return;
      
      this.calendar.selectedDate = day.date;
      const dateStr = day.date.toISOString().split('T')[0];
      this.selectedDayPlan = this.planData.dailyPlans.find(plan => plan.date === dateStr) || null;
    },

    toggleCompletion(dateStr) {
      const dayPlan = this.planData.dailyPlans.find(plan => plan.date === dateStr);
      if (dayPlan) {
        dayPlan.isCompleted = !dayPlan.isCompleted;
        if (this.selectedDayPlan && this.selectedDayPlan.date === dateStr) {
          this.selectedDayPlan.isCompleted = dayPlan.isCompleted;
        }
      }
    },

    startEdit(dateStr) {
      this.editingDay = dateStr;
      const dayPlan = this.planData.dailyPlans.find(plan => plan.date === dateStr);
      if (dayPlan) {
        this.tempDayData = JSON.parse(JSON.stringify(dayPlan));
      }
    },

    cancelEdit() {
      this.editingDay = null;
      this.tempDayData = null;
    },

    saveEdit() {
      if (this.editingDay && this.tempDayData) {
        const planIndex = this.planData.dailyPlans.findIndex(plan => plan.date === this.editingDay);
        if (planIndex !== -1) {
          this.planData.dailyPlans[planIndex] = JSON.parse(JSON.stringify(this.tempDayData));
          if (this.selectedDayPlan && this.selectedDayPlan.date === this.editingDay) {
            this.selectedDayPlan = JSON.parse(JSON.stringify(this.tempDayData));
          }
        }
        this.editingDay = null;
        this.tempDayData = null;
        
        uni.showToast({
          title: '编辑已保存',
          icon: 'success',
          duration: 2000
        });
      }
    },

    savePlan() {
      if (!this.planName.trim()) {
        uni.showToast({
          title: '请输入计划名称',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      try {
        const planToSave = {
          ...this.planData,
          planName: this.planName.trim()
        };
        
        FatlossManager.savePlan(planToSave);
        
        uni.showToast({
          title: '计划已保存',
          icon: 'success',
          duration: 2000
        });
        
        this.closeSaveModal();
      } catch (e) {
        console.error('保存计划失败:', e);
        uni.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        });
      }
    },
    
    openSaveModal() {
      this.showSaveModal = true;
      this.planName = '';
    },
    
    closeSaveModal() {
      this.showSaveModal = false;
      this.planName = '';
    }
  }
};
</script>

<style scoped>
@import url('../../static/css/variables.css');

.container {
  padding: 20rpx 30rpx 40rpx;
  background-color: var(--background) !important;
}

.header-section {
  text-align: center;
  padding: 30rpx 0 40rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12rpx;
  display: block;
}

.subtitle {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 卡片基础样式 */
.card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.card-header {
  margin-bottom: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header.collapsible {
  cursor: pointer;
  margin-bottom: 0;
}

.card-header.collapsible:active {
  opacity: 0.8;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text);
}

.card-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 展开图标 */
.expand-icon {
  font-size: 40rpx;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
  transform: rotate(90deg);
}

.expand-icon.expanded {
  transform: rotate(-90deg);
}

.expand-icon-small {
  font-size: 32rpx;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
  transform: rotate(90deg);
}

.expand-icon-small.expanded {
  transform: rotate(-90deg);
}

/* 方案概述样式 */
.overview-card {
  background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-tertiary) 100%);
}

.plan-overview {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.overview-row {
  display: flex;
  gap: 20rpx;
}

.overview-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 16rpx;
  border: 1rpx solid var(--border);
}

.overview-item.full-width {
  flex: none;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.overview-label {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.overview-value {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.overview-value.highlight {
  color: var(--primary);
  font-size: 32rpx;
}

/* 碳水循环概览样式 */
.cycle-overview {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.cycle-days-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  justify-content: center;
}

.day-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 16rpx;
  border-radius: 16rpx;
  min-width: 100rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.day-preview-item:active {
  transform: scale(0.95);
}

.day-preview-item.high {
  background-color: rgba(102, 126, 234, 0.15);
  border-color: var(--primary);
}

.day-preview-item.medium {
  background-color: rgba(118, 75, 162, 0.15);
  border-color: var(--secondary);
}

.day-preview-item.low {
  background-color: rgba(6, 182, 212, 0.15);
  border-color: var(--info);
}

.day-type-text {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8rpx;
}

.day-calories {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.cycle-legend {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  padding: 16rpx 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.legend-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.legend-dot.high {
  background-color: var(--primary);
}

.legend-dot.medium {
  background-color: var(--secondary);
}

.legend-dot.low {
  background-color: var(--info);
}

.legend-text {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.view-table-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 16rpx;
  border: none;
  margin-top: 8rpx;
}

.view-table-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.btn-icon {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 700;
}

/* 训练建议样式 */
.workout-suggestions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid var(--border);
}

.suggestion-item {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
  border: 1rpx solid var(--border);
}

.suggestion-number {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.6;
}

/* 视图切换按钮样式 */
.view-toggle {
  display: flex;
  background-color: var(--surface-hover);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.toggle-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.toggle-item.active {
  background-color: var(--primary);
  color: #ffffff;
}

/* 日历样式 */
.calendar-card {
  padding: 28rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.calendar-nav {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.calendar-nav:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.calendar-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.weekday {
  text-align: center;
  padding: 16rpx 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-secondary);
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12rpx;
}

.calendar-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8rpx;
}

.calendar-day:active {
  transform: scale(0.95);
}

.calendar-day.not-current-month {
  opacity: 0.3;
}

.calendar-day.has-plan {
  background-color: var(--surface-hover);
}

.calendar-day.selected {
  background-color: var(--primary);
  border-color: var(--primary);
}

.calendar-day.selected .day-number {
  color: #ffffff;
}

.calendar-day.high {
  border-color: var(--primary);
  background-color: rgba(102, 126, 234, 0.1);
}

.calendar-day.medium {
  border-color: var(--secondary);
  background-color: rgba(118, 75, 162, 0.1);
}

.calendar-day.low {
  border-color: var(--info);
  background-color: rgba(6, 182, 212, 0.1);
}

.day-number {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
}

.day-type-tag {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-type-tag.high {
  background-color: var(--primary);
}

.day-type-tag.medium {
  background-color: var(--secondary);
}

.day-type-tag.low {
  background-color: var(--info);
}

.day-type-tag text {
  font-size: 16rpx;
  color: #ffffff;
  font-weight: 700;
}

.plan-indicator {
  position: absolute;
  bottom: 8rpx;
  width: 6rpx;
  height: 6rpx;
  background-color: var(--primary);
  border-radius: 50%;
}

.calendar-day.selected .plan-indicator {
  background-color: #ffffff;
}

/* 日详情卡片 */
.day-detail-card {
  margin-top: 24rpx;
}

.day-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.day-type-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.section-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.type-badge {
  padding: 10rpx 24rpx;
  font-size: 24rpx;
  font-weight: 600;
  border-radius: 24rpx;
  color: #ffffff;
}

.type-badge.high {
  background-color: var(--primary);
}

.type-badge.medium {
  background-color: var(--secondary);
}

.type-badge.low {
  background-color: var(--info);
}

/* 小编辑按钮 */
.edit-btn-small {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  transition: all 0.3s ease;
}

.edit-btn-small:active {
  background-color: var(--surface-hover);
  transform: scale(0.95);
}

.edit-icon {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.edit-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 宏量营养素网格 */
.macros-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.macro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
}

.macro-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}

.macro-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--primary);
}

/* 完成状态 - 美化版 */
.completion-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 16rpx;
  margin-bottom: 28rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.completion-section:active {
  transform: scale(0.98);
  background-color: var(--surface-hover);
}

.completion-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.completion-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-secondary);
  border: 3rpx solid var(--border);
  transition: all 0.3s ease;
}

.completion-icon.completed {
  background: linear-gradient(135deg, var(--success) 0%, #22c55e 100%);
  border-color: var(--success);
}

.completion-icon text {
  font-size: 28rpx;
  color: var(--text-secondary);
  font-weight: 700;
}

.completion-icon.completed text {
  color: #ffffff;
}

.completion-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.completion-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.completion-status {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.completion-status.completed {
  color: var(--success);
  font-weight: 600;
}

.completion-toggle-btn {
  padding: 14rpx 28rpx;
  background-color: var(--background-secondary);
  border: 2rpx solid var(--border);
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.completion-toggle-btn.completed {
  background: linear-gradient(135deg, var(--success) 0%, #22c55e 100%);
  border-color: var(--success);
  color: #ffffff;
}

/* 饮食建议折叠 */
.tips-section {
  margin-bottom: 28rpx;
}

.tips-section.collapsible-section {
  background-color: var(--surface-hover);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  cursor: pointer;
}

.section-header:active {
  background-color: rgba(255, 255, 255, 0.05);
}

.tips-content-wrapper {
  padding: 0 24rpx 24rpx;
}

.tips-content {
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.7;
}

/* 备注部分 */
.notes-section {
  background-color: var(--surface-hover);
  padding: 24rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  margin-bottom: 28rpx;
}

.notes-content {
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.7;
}

/* 每日计划操作按钮 */
.day-actions {
  display: flex;
  gap: 20rpx;
}

.btn-small {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

/* 编辑表单样式 */
.editing-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.form-label {
  width: 160rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
}

.form-input {
  flex: 1;
  padding: 20rpx;
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 26rpx;
  color: var(--text);
  background-color: var(--background-tertiary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--surface-hover);
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

/* 操作按钮样式 */
.action-section {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
  padding: 0 10rpx;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #ffffff;
  border: none;
  border-radius: 16rpx;
  padding: 28rpx 0;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.btn-secondary {
  flex: 1;
  background-color: var(--background-tertiary);
  color: var(--text);
  border: 2rpx solid var(--border);
  border-radius: 16rpx;
  padding: 28rpx 0;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:active {
  transform: scale(0.98);
  background-color: var(--surface-hover);
}

/* 弹窗遮罩 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 998;
}

/* 碳水循环计划弹窗 */
.carbs-cycle-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: 80%;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  z-index: 999;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
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
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0 16rpx;
}

.close-btn:active {
  color: var(--text);
}

.modal-content {
  padding: 32rpx;
  overflow-y: auto;
  flex: 1;
}

/* 表格样式 */
.table-container {
  margin-bottom: 32rpx;
}

.cycle-table {
  width: 100%;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #ffffff;
  font-weight: 600;
}

.table-header-cell {
  flex: 1;
  padding: 24rpx 12rpx;
  text-align: center;
  font-size: 24rpx;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: flex;
  border-bottom: 1rpx solid var(--border);
  transition: all 0.3s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.high {
  background-color: rgba(102, 126, 234, 0.08);
}

.table-row.medium {
  background-color: rgba(118, 75, 162, 0.08);
}

.table-row.low {
  background-color: rgba(6, 182, 212, 0.08);
}

.table-cell {
  flex: 1;
  padding: 24rpx 12rpx;
  text-align: center;
  font-size: 26rpx;
  color: var(--text);
}

.table-cell.type-cell {
  font-weight: 600;
}

.type-text {
  color: var(--text);
}

/* 营养说明 */
.nutrition-tips {
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  padding: 24rpx;
}

.tips-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20rpx;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.tip-dot.high {
  background-color: var(--primary);
}

.tip-dot.medium {
  background-color: var(--secondary);
}

.tip-dot.low {
  background-color: var(--info);
}

.tip-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 保存计划弹窗样式 */
.save-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 600rpx;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  z-index: 999;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-hint {
  display: block;
  font-size: 22rpx;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-top: 16rpx;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 28rpx 32rpx;
  border-top: 1rpx solid var(--border);
}

.modal-btn {
  flex: 1;
  padding: 24rpx 0;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background-color: var(--background-tertiary);
  color: var(--text);
  border: 1rpx solid var(--border);
}

.cancel-btn:active {
  background-color: var(--surface-hover);
  transform: scale(0.98);
}

.confirm-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
}

.confirm-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
