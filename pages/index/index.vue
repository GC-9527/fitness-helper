<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="健身计划" v-if="!isTraining"></custom-navbar>

    <!-- 页面头部 -->
    <view class="page-header" v-if="!isTraining">
      <view class="header-greeting">
        <text class="greeting-text">{{greeting}}</text>
        <text class="date-text">{{currentDate}}</text>
      </view>
    </view>

    <!-- 今日数据概览 - 未训练状态 -->
    <view class="stats-overview" v-if="!isTraining">
      <view class="stat-box">
        <text class="stat-value">{{todayWorkouts}}</text>
        <text class="stat-label">今日训练</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-box">
        <text class="stat-value">{{todayDuration}}</text>
        <text class="stat-label">分钟</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-box">
        <text class="stat-value">{{weekWorkouts}}</text>
        <text class="stat-label">本周</text>
      </view>
    </view>

    <!-- 主要操作区 - 未训练状态 -->
    <view class="main-action" v-if="!isTraining">
      <button class="btn-start" @click="startWorkout">
        <view class="start-icon">🏋️</view>
        <view class="start-text">开始训练</view>
        <view class="start-subtext">{{hasExercises ? '继续上次训练' : '创建新训练'}}</view>
      </button>
    </view>

    <!-- 快捷入口 - 未训练状态 -->
    <view class="quick-section" v-if="!isTraining">
      <view class="section-title">快捷入口</view>
      <view class="quick-grid">
        <view class="quick-item" @click="goToPlans">
          <view class="quick-icon plans">📋</view>
          <text class="quick-name">训练计划</text>
        </view>
        <view class="quick-item" @click="goToExercises">
          <view class="quick-icon exercises">💪</view>
          <text class="quick-name">动作库</text>
        </view>
        <view class="quick-item" @click="goToFatloss">
          <view class="quick-icon fatloss">🔥</view>
          <text class="quick-name">减脂计划</text>
        </view>
        <view class="quick-item" @click="goToHistory">
          <view class="quick-icon history">📊</view>
          <text class="quick-name">历史记录</text>
        </view>
      </view>
    </view>

    <!-- 训练状态头部 -->
    <view class="training-header" v-if="isTraining">
      <view class="timer-section">
        <view class="timer-display">
          <text class="timer-value">{{formatTime(timer)}}</text>
          <text class="timer-label">{{isRunning ? '训练中' : '已暂停'}}</text>
        </view>
        <view class="timer-controls">
          <view class="timer-btn" :class="isRunning ? 'pause' : 'play'" @click="toggleTimer">
            <text>{{isRunning ? '⏸️' : '▶️'}}</text>
          </view>
          <view class="timer-btn reset" @click="resetTimer">
            <text>🔄</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 实时成就进度面板 -->
    <view class="achievement-progress-panel" v-if="isTraining && currentWorkout.exercises.length > 0">
      <view class="panel-header" @click="toggleAchievementPanel">
        <view class="panel-title">
          <text class="panel-icon">🏆</text>
          <text class="panel-text">成就进度</text>
          <text class="panel-badge" v-if="nearbyAchievements.length > 0">{{nearbyAchievements.length}}</text>
        </view>
        <text class="panel-toggle">{{showAchievementPanel ? '▼' : '▶'}}</text>
      </view>
      <view class="panel-content" v-if="showAchievementPanel">
        <!-- 即将完成的成就 -->
        <view class="nearby-achievements" v-if="nearbyAchievements.length > 0">
          <text class="section-subtitle">即将完成</text>
          <view
            v-for="achievement in nearbyAchievements"
            :key="achievement.id"
            class="progress-item"
          >
            <view class="progress-icon">{{getAchievementIcon(achievement.id)}}</view>
            <view class="progress-info">
              <text class="progress-name">{{achievement.name}}</text>
              <view class="progress-bar-bg">
                <view class="progress-bar-fill" :style="{width: achievement.progress + '%'}"></view>
              </view>
              <text class="progress-detail">{{achievement.current}}/{{achievement.target}} ({{achievement.progress}}%)</text>
            </view>
          </view>
        </view>
        <!-- 当前训练相关的成就 -->
        <view class="related-achievements" v-if="relatedAchievements.length > 0">
          <text class="section-subtitle">本训练相关</text>
          <view
            v-for="achievement in relatedAchievements"
            :key="achievement.id"
            class="progress-item"
          >
            <view class="progress-icon">{{getAchievementIcon(achievement.id)}}</view>
            <view class="progress-info">
              <text class="progress-name">{{achievement.name}}</text>
              <view class="progress-bar-bg">
                <view class="progress-bar-fill" :style="{width: achievement.progress + '%'}"></view>
              </view>
              <text class="progress-detail">{{achievement.current}}/{{achievement.target}} ({{achievement.progress}}%)</text>
            </view>
          </view>
        </view>
        <view class="no-progress" v-if="nearbyAchievements.length === 0 && relatedAchievements.length === 0">
          <text class="no-progress-text">继续训练以解锁更多成就！</text>
        </view>
      </view>
    </view>

    <!-- 组间歇计时器 -->
    <view class="rest-card" v-if="showRestTimer">
      <view class="rest-header">
        <text class="rest-title">☕ 组间休息</text>
        <text class="rest-status" :class="{ended: restTimerEnded}">{{restTimerEnded ? '休息结束' : '准备下一组'}}</text>
      </view>
      <view class="rest-timer">{{formatRestTime(restTimer)}}</view>
      <view class="rest-progress">
        <view class="progress-track">
          <view class="progress-bar" :style="{width: calculateRestProgress() + '%'}"></view>
        </view>
      </view>
      <view class="rest-actions">
        <button class="btn-rest" :class="restIsRunning ? 'pause' : 'start'" @click="toggleRestTimer">
          {{restIsRunning ? '暂停' : '开始'}}
        </button>
        <button class="btn-rest reset" @click="resetRestTimer">重置</button>
        <button class="btn-rest skip" @click="hideRestTimer">跳过</button>
      </view>
    </view>

    <!-- 智能建议 -->
    <view class="suggestion-card" v-if="isTraining && suggestionVisible && currentSuggestion">
      <view class="suggestion-header">
        <text class="suggestion-icon">💡</text>
        <text class="suggestion-title">智能建议</text>
      </view>
      <view class="suggestion-body">
        <view class="suggestion-stats">
          <view class="sg-stat">
            <text class="sg-value">{{currentSuggestion.weight}}kg</text>
            <text class="sg-label">重量</text>
          </view>
          <view class="sg-stat">
            <text class="sg-value">{{currentSuggestion.reps}}次</text>
            <text class="sg-label">次数</text>
          </view>
          <view class="sg-stat">
            <text class="sg-value">{{currentSuggestion.sets || 3}}组</text>
            <text class="sg-label">组数</text>
          </view>
        </view>
        <view class="suggestion-msg" v-if="currentSuggestion.message">
          {{currentSuggestion.message}}
        </view>
      </view>
    </view>

    <!-- 训练动作列表 - 可折叠 -->
    <view class="exercises-section" v-if="isTraining">
      <view class="section-header">
        <view class="section-info">
          <text class="section-name">训练动作</text>
          <text class="section-count">{{completedExercises}}/{{currentWorkout.exercises.length}} 完成</text>
        </view>
        <view class="section-actions">
          <view class="lock-btn" :class="{locked: isLocked}" @click="toggleLock">
            <text>{{isLocked ? '🔒' : '🔓'}}</text>
          </view>
          <view class="fold-btn" @click="toggleAllFold">
            <text>{{allFolded ? '展开' : '收起'}}</text>
          </view>
        </view>
      </view>

      <view class="exercise-list">
        <view 
          class="exercise-item" 
          v-for="(item, index) in currentWorkout.exercises" 
          :key="item.id"
          :class="{completed: item.completedSets >= item.sets, folded: item.folded}"
        >
          <!-- 折叠状态头部 -->
          <view class="exercise-header" @click="toggleFold(index)">
            <view class="exercise-status">
              <view class="status-icon" :class="{done: item.completedSets >= item.sets}">
                <text v-if="item.completedSets >= item.sets">✓</text>
                <text v-else>{{index + 1}}</text>
              </view>
            </view>
            <view class="exercise-brief">
              <text class="exercise-name">{{item.name}}</text>
              <text class="exercise-progress">{{item.completedSets}}/{{item.sets}} 组 · {{getExerciseTypeLabel(item)}}</text>
            </view>
            <view class="exercise-actions">
              <!-- 顺序调整按钮 -->
              <view class="reorder-btns" :class="{disabled: isLocked}" @click.stop>
                <view class="reorder-btn up" :class="{disabled: index === 0}" @click="moveExerciseUp(index)">▲</view>
                <view class="reorder-btn down" :class="{disabled: index === currentWorkout.exercises.length - 1}" @click="moveExerciseDown(index)">▼</view>
              </view>
              <view class="exercise-arrow">
                <text :class="{rotated: !item.folded}">›</text>
              </view>
            </view>
          </view>

          <!-- 展开状态详情 -->
          <view class="exercise-detail" v-if="!item.folded">
            <view class="detail-body">
              <view class="detail-row">
                <view class="detail-item">
                  <text class="detail-label">部位</text>
                  <text class="detail-value">{{item.part || item.bodyPart}}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">类型</text>
                  <view class="type-selector" :class="{disabled: isLocked}">
                    <view 
                      class="type-option" 
                      :class="{active: item.exerciseType === 'bodyweight'}"
                      @click.stop="setExerciseType(index, 'bodyweight')"
                    >自重</view>
                    <view 
                      class="type-option" 
                      :class="{active: item.exerciseType === 'freeweight'}"
                      @click.stop="setExerciseType(index, 'freeweight')"
                    >自由重量</view>
                  </view>
                </view>
              </view>
              
              <!-- 组数控制 -->
              <view class="sets-control-row">
                <text class="control-label">组数</text>
                <view class="sets-control-btns" :class="{disabled: isLocked}">
                  <view class="ctrl-btn-small minus" @click.stop="decreaseSets(index)">−</view>
                  <text class="ctrl-value">{{item.sets}}</text>
                  <view class="ctrl-btn-small plus" @click.stop="increaseSets(index)">+</view>
                </view>
              </view>

              <!-- 每组详情 -->
              <view class="sets-detail">
                <view class="sets-detail-header">
                  <text class="sets-detail-title">组详情</text>
                  <text class="sets-detail-subtitle">点击数值可修改</text>
                </view>
                <view class="set-list">
                  <view 
                    class="set-item" 
                    v-for="(set, setIndex) in item.setDetails" 
                    :key="setIndex"
                    :class="{completed: setIndex < item.completedSets, current: setIndex === item.completedSets}"
                  >
                    <view class="set-number">{{setIndex + 1}}</view>
                    <view class="set-inputs">
                      <!-- 自由重量显示重量输入 -->
                      <view class="input-group" v-if="item.exerciseType === 'freeweight'">
                        <input 
                          class="set-input" 
                          type="digit" 
                          v-model="set.weight"
                          :disabled="isLocked || setIndex < item.completedSets"
                          @blur="onSetDetailChange(index, setIndex)"
                        />
                        <text class="input-unit">kg</text>
                      </view>
                      <!-- 次数输入 -->
                      <view class="input-group">
                        <input 
                          class="set-input reps-input" 
                          type="number" 
                          v-model="set.reps"
                          :disabled="isLocked || setIndex < item.completedSets"
                          @blur="onSetDetailChange(index, setIndex)"
                        />
                        <text class="input-unit">次</text>
                      </view>
                    </view>
                    <view class="set-status">
                      <text v-if="setIndex < item.completedSets" class="set-done">✓</text>
                      <text v-else-if="setIndex === item.completedSets" class="set-pending">○</text>
                      <text v-else class="set-wait">−</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="detail-actions">
                <button 
                  class="btn-complete" 
                  :disabled="item.completedSets >= item.sets"
                  @click.stop="completeSet(index)"
                >
                  <text v-if="item.completedSets >= item.sets">已完成</text>
                  <text v-else>完成第 {{item.completedSets + 1}} 组</text>
                </button>
                <view class="action-btns">
                  <view class="icon-btn-small" @click.stop="enterFullscreen(item, index)">📱</view>
                  <view class="icon-btn-small delete" :class="{disabled: isLocked}" @click.stop="removeExercise(index)">🗑️</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 添加动作按钮 -->
      <view class="add-exercise-bar" @click="goToExercises">
        <text class="add-icon">+</text>
        <text class="add-text">添加动作</text>
      </view>
    </view>

    <!-- 完成训练按钮 -->
    <view class="finish-bar" v-if="isTraining && currentWorkout.exercises.length > 0">
      <button class="btn-finish" @click="finishWorkout">
        <text>完成训练</text>
      </button>
    </view>

    <!-- 空状态 -->
    <view class="empty-training" v-if="isTraining && currentWorkout.exercises.length === 0">
      <view class="empty-icon">🏋️</view>
      <text class="empty-title">还没有动作</text>
      <text class="empty-desc">点击上方添加动作开始训练</text>
    </view>

    <!-- 励志弹窗 -->
    <view class="modal" v-if="showQuoteModal" @click="hideQuoteModal">
      <view class="modal-content quote-modal" @click.stop>
        <view class="quote-icon">🌟</view>
        <view class="quote-title">今日励志</view>
        <view class="quote-text">{{currentQuote}}</view>
        <button class="btn-primary btn-modal" @click="startWithQuote">开始训练</button>
      </view>
    </view>

    <!-- 完成弹窗 -->
    <view class="modal" v-if="showEncouragementModal" @click="hideEncouragementModal">
      <view class="modal-content finish-modal" @click.stop>
        <view class="finish-icon">🎉</view>
        <view class="finish-title">训练完成!</view>
        <view class="finish-quote">{{currentEncouragement}}</view>
        <view class="finish-stats">
          <view class="ft-stat">
            <text class="ft-value">{{encouragementStats.exerciseCount}}</text>
            <text class="ft-label">动作</text>
          </view>
          <view class="ft-stat">
            <text class="ft-value">{{encouragementStats.completedSets}}</text>
            <text class="ft-label">完成组</text>
          </view>
          <view class="ft-stat">
            <text class="ft-value">{{encouragementStats.timeText}}</text>
            <text class="ft-label">时长</text>
          </view>
        </view>
        <button class="btn-primary btn-modal" @click="confirmEncouragement">太棒了</button>
      </view>
    </view>

    <!-- 全屏模式 -->
    <view class="fullscreen" v-if="isFullscreen" @click="exitFullscreen">
      <view class="fullscreen-content" @click.stop>
        <view class="fs-header">
          <text class="fs-title">{{fullscreenExercise.name}}</text>
          <view class="fs-close" @click="exitFullscreen">×</view>
        </view>
        <view class="fs-body">
          <view class="fs-part">{{fullscreenExercise.part || fullscreenExercise.bodyPart}}</view>
          <view class="fs-progress">
            <text class="fs-current">{{fullscreenExercise.completedSets}}</text>
            <text class="fs-separator">/</text>
            <text class="fs-total">{{fullscreenExercise.sets}}</text>
          </view>
          <view class="fs-label">组数</view>
          <view class="fs-reps">× {{fullscreenExercise.reps}} 次</view>
          <button 
            class="btn-fs-complete" 
            :disabled="fullscreenExercise.completedSets >= fullscreenExercise.sets"
            @click="completeFullscreenSet"
          >
            完成一组
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import timerStore from '../../store/index';
import { motivationalQuotes, encouragementMessages, getRandomItem, saveWorkoutHistory, saveCheckIn, notificationUtils } from '../../utils/index';
import { suggestNextSet, getExerciseHistory, saveExerciseRecord } from '../../utils/progressiveOverload.js';
import achievementSystem from '../../utils/achievementSystem.js';

export default {
  data() {
    return {
      todayWorkouts: 0,
      todayDuration: 0,
      weekWorkouts: 0,
      isTraining: false,
      currentWorkout: { exercises: [] },
      timer: 0,
      isRunning: false,
      updateInterval: null,
      showQuoteModal: false,
      currentQuote: '',
      showEncouragementModal: false,
      currentEncouragement: '',
      encouragementStats: { duration: 0, completedSets: 0, totalSets: 0, exerciseCount: 0, timeText: '' },
      isLocked: true,
      allFolded: false,
      isFullscreen: false,
      currentFullscreenExercise: null,
      fullscreenExercise: null,
      restTimer: 0,
      restIsRunning: false,
      restInterval: null,
      restDuration: 60,
      showRestTimer: false,
      restTimerEnded: false,
      settings: {
        isRestTimerEnabled: false,
        restDuration: 60,
        autoLockEnabled: true,
        notificationEnabled: true,
        vibrationEnabled: true
      },
      currentSuggestion: null,
      suggestionVisible: false,
      greeting: '',
      currentDate: '',
      hasExercises: false,
      showAchievementPanel: false,
      nearbyAchievements: [],
      relatedAchievements: [],
      achievementUpdateInterval: null
    };
  },

  computed: {
    completedExercises() {
      return this.currentWorkout.exercises.filter(e => e.completedSets >= e.sets).length;
    }
  },

  onLoad() {
    this.setGreeting();
    this.setCurrentDate();
    this.loadData();
    this.loadSettings();
    
    const restored = this.restoreTrainingState();
    if (!restored) {
      this.loadCurrentWorkout();
    }
    
    this.updateTimerDisplay();
    this.startTimerUpdate();
  },

  onShow() {
    this.loadData();
    this.loadSettings();
    
    const restored = this.restoreTrainingState();
    if (!restored) {
      this.loadCurrentWorkout();
    }
    
    this.updateTimerDisplay();
    this.startTimerUpdate();
    
    if (this.isTraining && !timerStore.isTimerRunning()) {
      timerStore.startTimer();
      this.updateTimerDisplay();
    }
    
    this.saveTrainingState();
  },

  onUnload() {
    this.stopTimerUpdate();
    this.saveTrainingState();
  },

  onHide() {
    this.stopTimerUpdate();
    this.saveTrainingState();
  },

  methods: {
    setGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) this.greeting = '早上好，开始今天的训练吧 💪';
      else if (hour < 18) this.greeting = '下午好，保持状态 🔥';
      else this.greeting = '晚上好，今天训练了吗 🌙';
    },

    setCurrentDate() {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[date.getDay()];
      this.currentDate = `${month}月${day}日 · ${weekDay}`;
    },

    startTimerUpdate() {
      this.stopTimerUpdate();
      this.updateInterval = setInterval(() => {
        this.updateTimerDisplay();
      }, 200);
    },

    stopTimerUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },

    updateTimerDisplay() {
      this.timer = timerStore.getElapsedTime();
      this.isRunning = timerStore.isTimerRunning();
    },

    loadData() {
      const history = uni.getStorageSync('workoutHistory') || [];
      const today = this.formatDate(new Date());
      const weekStart = this.getWeekStart();
      
      let todayWorkouts = 0;
      let todayDuration = 0;
      let weekWorkouts = 0;
      
      history.forEach(item => {
        if (item.date === today) {
          todayWorkouts++;
          todayDuration += item.duration;
        }
        if (new Date(item.date) >= weekStart) {
          weekWorkouts++;
        }
      });
      
      this.todayWorkouts = todayWorkouts;
      this.todayDuration = todayDuration;
      this.weekWorkouts = weekWorkouts;
    },

    getWeekStart() {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(now.setDate(diff));
    },

    loadCurrentWorkout() {
      try {
        const currentWorkout = uni.getStorageSync('currentWorkout') || { exercises: [] };
        const allCompleted = currentWorkout.exercises.length > 0 && 
                            currentWorkout.exercises.every(item => item.completedSets >= item.sets);
        
        if (allCompleted) {
          this.currentWorkout = { exercises: [] };
          this.isTraining = false;
          uni.removeStorageSync('currentWorkout');
          this.clearTrainingState();
        } else {
          // 初始化折叠状态和组详情
          currentWorkout.exercises.forEach((e, i) => {
            e.folded = i !== 0; // 只有第一个默认展开
            // 初始化训练类型（默认自由重量）
            if (!e.exerciseType) {
              e.exerciseType = 'freeweight';
            }
            // 初始化组详情
            this.initSetDetails(e);
          });
          this.currentWorkout = currentWorkout;
          this.isTraining = currentWorkout.exercises.length > 0;
          this.hasExercises = currentWorkout.exercises.length > 0;
          this.isLocked = this.settings.autoLockEnabled;
          
          if (this.isTraining && !timerStore.isTimerRunning()) {
            timerStore.startTimer();
            this.updateTimerDisplay();
          }
        }
      } catch (e) {
        console.error('加载训练数据失败:', e);
        this.currentWorkout = { exercises: [] };
        this.isTraining = false;
      }
    },
    
    loadSettings() {
      try {
        const savedSettings = uni.getStorageSync('fitnessSettings');
        if (savedSettings) {
          this.settings = { ...this.settings, ...savedSettings };
          this.restDuration = this.settings.restDuration;
        }
      } catch (e) {
        console.error('加载设置失败:', e);
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    startWorkout() {
      if (!this.hasExercises) {
        uni.switchTab({ url: '/pages/exercises/exercises' });
      } else {
        this.showQuoteModal = true;
        this.currentQuote = getRandomItem(motivationalQuotes);
      }
    },

    hideQuoteModal() {
      this.showQuoteModal = false;
    },

    startWithQuote() {
      this.hideQuoteModal();
      this.isTraining = true;
      timerStore.startTimer();
      this.updateTimerDisplay();

      if (this.settings.notificationEnabled) {
        notificationUtils.sendWorkoutStartNotification(this.currentWorkout).catch(() => {});
      }

      // 启动成就进度实时更新
      this.startAchievementProgressUpdate();

      this.updateSuggestionForCurrentExercise();
    },

    updateSuggestionForCurrentExercise() {
      const currentExercise = this.currentWorkout.exercises.find(item => item.completedSets < item.sets);
      
      if (currentExercise && currentExercise.id) {
        const history = getExerciseHistory(currentExercise.id);
        
        if (history && history.length > 0) {
          this.currentSuggestion = suggestNextSet(history);
          this.suggestionVisible = true;
        } else {
          this.currentSuggestion = {
            weight: currentExercise.weight || 10,
            reps: currentExercise.reps || 12,
            sets: currentExercise.sets || 3,
            message: '首次训练，建议从轻重量开始',
            trend: 'first'
          };
          this.suggestionVisible = true;
        }
      } else {
        this.suggestionVisible = false;
        this.currentSuggestion = null;
      }
    },

    toggleTimer() {
      if (timerStore.isTimerRunning()) {
        timerStore.stopTimer();
      } else {
        timerStore.startTimer();
      }
      this.updateTimerDisplay();
    },

    resetTimer() {
      timerStore.resetTimer();
      this.updateTimerDisplay();
    },

    formatRestTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    startRestTimer() {
      this.restTimer = this.restDuration;
      this.restIsRunning = true;
      this.restTimerEnded = false;
      this.showRestTimer = true;
      
      if (this.restInterval) clearInterval(this.restInterval);
      
      this.restInterval = setInterval(() => {
        if (this.restTimer > 0) {
          this.restTimer--;
        } else {
          this.restIsRunning = false;
          this.restTimerEnded = true;
          clearInterval(this.restInterval);
          this.restInterval = null;
          
          if (this.settings.vibrationEnabled) uni.vibrateLong();
          if (this.settings.notificationEnabled) notificationUtils.sendRestTimerEndNotification().catch(() => {});
        }
      }, 1000);
    },

    toggleRestTimer() {
      if (this.restIsRunning) {
        this.restIsRunning = false;
        if (this.restInterval) {
          clearInterval(this.restInterval);
          this.restInterval = null;
        }
      } else {
        this.restIsRunning = true;
        this.restInterval = setInterval(() => {
          if (this.restTimer > 0) {
            this.restTimer--;
          } else {
            this.restIsRunning = false;
            this.restTimerEnded = true;
            clearInterval(this.restInterval);
            this.restInterval = null;
            if (this.settings.vibrationEnabled) uni.vibrateLong();
            if (this.settings.notificationEnabled) notificationUtils.sendRestTimerEndNotification().catch(() => {});
          }
        }, 1000);
      }
    },

    resetRestTimer() {
      this.restTimer = this.restDuration;
      this.restIsRunning = false;
      this.restTimerEnded = false;
      if (this.restInterval) {
        clearInterval(this.restInterval);
        this.restInterval = null;
      }
    },

    hideRestTimer() {
      this.showRestTimer = false;
      this.restIsRunning = false;
      if (this.restInterval) {
        clearInterval(this.restInterval);
        this.restInterval = null;
      }
    },

    calculateRestProgress() {
      return Math.round((this.restTimer / this.restDuration) * 100);
    },

    toggleFold(index) {
      const exercise = this.currentWorkout.exercises[index];
      exercise.folded = !exercise.folded;
      this.$forceUpdate();
    },

    toggleAllFold() {
      this.allFolded = !this.allFolded;
      this.currentWorkout.exercises.forEach(e => {
        e.folded = this.allFolded;
      });
      this.$forceUpdate();
    },

    // 获取训练类型标签
    getExerciseTypeLabel(item) {
      if (item.exerciseType === 'bodyweight') {
        return '自重';
      } else if (item.exerciseType === 'freeweight') {
        return '自由重量';
      }
      return '训练';
    },

    // 设置训练类型
    setExerciseType(index, type) {
      if (this.isLocked) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      currentWorkout.exercises[index].exerciseType = type;
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
    },

    // 初始化动作的组详情
    initSetDetails(exercise) {
      if (!exercise.setDetails || exercise.setDetails.length !== exercise.sets) {
        exercise.setDetails = [];
        for (let i = 0; i < exercise.sets; i++) {
          exercise.setDetails.push({
            weight: exercise.weight || 0,
            reps: exercise.reps || 12
          });
        }
      }
      return exercise;
    },

    // 组详情变化处理
    onSetDetailChange(index, setIndex) {
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      const set = currentWorkout.exercises[index].setDetails[setIndex];
      // 确保数值有效
      set.weight = parseFloat(set.weight) || 0;
      set.reps = parseInt(set.reps) || 1;
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
    },

    increaseSets(index) {
      if (this.isLocked) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      currentWorkout.exercises[index].sets++;
      // 添加新的组详情
      if (!currentWorkout.exercises[index].setDetails) {
        currentWorkout.exercises[index].setDetails = [];
      }
      const lastSet = currentWorkout.exercises[index].setDetails[currentWorkout.exercises[index].setDetails.length - 1];
      currentWorkout.exercises[index].setDetails.push({
        weight: lastSet ? lastSet.weight : (currentWorkout.exercises[index].weight || 0),
        reps: lastSet ? lastSet.reps : (currentWorkout.exercises[index].reps || 12)
      });
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
    },

    decreaseSets(index) {
      if (this.isLocked) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      if (currentWorkout.exercises[index].sets > 1) {
        currentWorkout.exercises[index].sets--;
        if (currentWorkout.exercises[index].completedSets > currentWorkout.exercises[index].sets) {
          currentWorkout.exercises[index].completedSets = currentWorkout.exercises[index].sets;
        }
        // 移除多余的组详情
        if (currentWorkout.exercises[index].setDetails) {
          currentWorkout.exercises[index].setDetails.pop();
        }
        this.currentWorkout = currentWorkout;
        uni.setStorageSync('currentWorkout', currentWorkout);
      }
    },

    increaseReps(index) {
      if (this.isLocked) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      currentWorkout.exercises[index].reps++;
      // 同步更新所有未完成的组详情
      if (currentWorkout.exercises[index].setDetails) {
        currentWorkout.exercises[index].setDetails.forEach((set, i) => {
          if (i >= currentWorkout.exercises[index].completedSets) {
            set.reps = currentWorkout.exercises[index].reps;
          }
        });
      }
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
    },

    decreaseReps(index) {
      if (this.isLocked) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      if (currentWorkout.exercises[index].reps > 1) {
        currentWorkout.exercises[index].reps--;
        // 同步更新所有未完成的组详情
        if (currentWorkout.exercises[index].setDetails) {
          currentWorkout.exercises[index].setDetails.forEach((set, i) => {
            if (i >= currentWorkout.exercises[index].completedSets) {
              set.reps = currentWorkout.exercises[index].reps;
            }
          });
        }
        this.currentWorkout = currentWorkout;
        uni.setStorageSync('currentWorkout', currentWorkout);
      }
    },

    completeSet(index) {
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      const exercise = currentWorkout.exercises[index];

      if (exercise.completedSets < exercise.sets) {
        const completedSetIndex = exercise.completedSets;
        exercise.completedSets++;
        this.currentWorkout = currentWorkout;
        uni.setStorageSync('currentWorkout', currentWorkout);

        this.saveTrainingState();
        this.saveExerciseSetRecord(exercise, completedSetIndex);

        if (this.settings.vibrationEnabled) uni.vibrateShort();
        if (this.settings.notificationEnabled) {
          notificationUtils.sendSetCompletedNotification(exercise, exercise.completedSets).catch(() => {});
        }

        // 自动折叠已完成动作
        if (exercise.completedSets >= exercise.sets) {
          exercise.folded = true;
          
          const allCompleted = this.currentWorkout.exercises.every(item => item.completedSets >= item.sets);
          if (allCompleted) {
            setTimeout(() => this.showCompletionModal(), 500);
            this.hideRestTimer();
            this.suggestionVisible = false;
          } else {
            // 展开下一个未完成的动作
            const nextIndex = this.currentWorkout.exercises.findIndex((item, i) => i > index && item.completedSets < item.sets);
            if (nextIndex !== -1) {
              this.currentWorkout.exercises[nextIndex].folded = false;
            }
            if (this.settings.isRestTimerEnabled) this.startRestTimer();
            this.updateSuggestionForCurrentExercise();
          }
        } else {
          if (this.settings.isRestTimerEnabled) this.startRestTimer();
        }

        // 实时更新成就进度
        this.updateRealtimeAchievementProgress();

        this.$forceUpdate();
      }
    },

    saveExerciseSetRecord(exercise, completedSetIndex) {
      if (!exercise || !exercise.id) return;
      try {
        const record = {
          exerciseId: exercise.id,
          date: this.formatDate(new Date()),
          weight: exercise.weight || exercise.lastWeight || 10,
          reps: exercise.reps || 10,
          sets: exercise.sets || 3,
          completedSets: exercise.completedSets,
          completedReps: Array(exercise.completedSets).fill(exercise.reps || 10),
          restSeconds: this.settings.restDuration || 60,
          notes: `第 ${completedSetIndex + 1} 组完成`
        };
        saveExerciseRecord(record);
      } catch (e) {
        console.error('保存训练记录失败:', e);
      }
    },

    removeExercise(index) {
      if (this.isLocked) return;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个动作吗？',
        success: (res) => {
          if (res.confirm) {
            const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
            currentWorkout.exercises.splice(index, 1);
            this.currentWorkout = currentWorkout;
            this.isTraining = currentWorkout.exercises.length > 0;
            uni.setStorageSync('currentWorkout', currentWorkout);
            this.$forceUpdate();
          }
        }
      });
    },

    // 上移动作
    moveExerciseUp(index) {
      if (this.isLocked || index === 0) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      const temp = currentWorkout.exercises[index];
      currentWorkout.exercises[index] = currentWorkout.exercises[index - 1];
      currentWorkout.exercises[index - 1] = temp;
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
      this.$forceUpdate();
    },

    // 下移动作
    moveExerciseDown(index) {
      if (this.isLocked || index === this.currentWorkout.exercises.length - 1) return;
      const currentWorkout = JSON.parse(JSON.stringify(this.currentWorkout));
      const temp = currentWorkout.exercises[index];
      currentWorkout.exercises[index] = currentWorkout.exercises[index + 1];
      currentWorkout.exercises[index + 1] = temp;
      this.currentWorkout = currentWorkout;
      uni.setStorageSync('currentWorkout', currentWorkout);
      this.$forceUpdate();
    },

    toggleLock() {
      this.isLocked = !this.isLocked;
      uni.showToast({
        title: this.isLocked ? '已锁定' : '已解锁',
        icon: 'success'
      });
    },

    goToExercises() {
      uni.switchTab({ url: '/pages/exercises/exercises' });
    },

    goToPlans() {
      uni.navigateTo({ url: '/pages/plans/plans' });
    },

    goToFatloss() {
      uni.navigateTo({ url: '/pages/fatloss/fatloss' });
    },

    goToHistory() {
      uni.switchTab({ url: '/pages/history/history' });
    },

    finishWorkout() {
      if (this.currentWorkout.exercises.length === 0) {
        uni.showToast({ title: '请先添加训练动作', icon: 'none' });
        return;
      }

      timerStore.stopTimer();

      // 停止成就进度实时更新
      this.stopAchievementProgressUpdate();

      const durationInSeconds = timerStore.getElapsedTime();
      const durationInMinutes = Math.ceil(durationInSeconds / 60);
      const completedSets = this.currentWorkout.exercises.reduce((sum, ex) => sum + ex.completedSets, 0);
      const totalSets = this.currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
      const exerciseCount = this.currentWorkout.exercises.length;
      
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = durationInSeconds % 60;
      let timeText = '';
      if (hours > 0) timeText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      else timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      this.showEncouragementModal = true;
      this.currentEncouragement = getRandomItem(encouragementMessages);
      this.encouragementStats = { 
        duration: durationInMinutes, 
        timeText: timeText,
        completedSets: completedSets,
        totalSets: totalSets,
        exerciseCount: exerciseCount
      };
      
      if (this.settings.notificationEnabled) {
        notificationUtils.sendWorkoutCompletedNotification(durationInMinutes).catch(() => {});
      }
    },

    hideEncouragementModal() {
      this.showEncouragementModal = false;
    },

    confirmEncouragement() {
      this.hideEncouragementModal();
      this.saveWorkout();
    },

    saveWorkout() {
      try {
        const durationInSeconds = timerStore.getElapsedTime();
        const durationInMinutes = Math.ceil(durationInSeconds / 60);

        const workoutData = {
          duration: durationInMinutes,
          durationSeconds: durationInSeconds,
          exercises: this.currentWorkout.exercises,
          totalSets: this.currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0),
          completedSets: this.currentWorkout.exercises.reduce((sum, ex) => sum + ex.completedSets, 0),
          date: new Date().toISOString()
        };

        saveWorkoutHistory(workoutData);
        saveCheckIn(this.formatDate(new Date()));
        this.saveAllExerciseRecords();

        // 检查并解锁成就
        this.checkAndShowAchievements(workoutData);

        timerStore.resetTimer();
        this.currentWorkout = { exercises: [] };
        this.isTraining = false;
        uni.removeStorageSync('currentWorkout');
        this.clearTrainingState();
        this.loadData();
        this.updateTimerDisplay();

        uni.showToast({ title: '训练已保存', icon: 'success' });
      } catch (e) {
        console.error('保存训练失败:', e);
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },

    // 检查成就并显示弹窗
    checkAndShowAchievements(workoutData) {
      try {
        // 转换训练数据格式以适配成就系统
        const formattedWorkoutData = {
          ...workoutData,
          exercises: workoutData.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            muscleGroup: ex.muscleGroup,
            sets: Array(ex.completedSets).fill(null).map(() => ({
              weight: ex.weight || ex.lastWeight || 0,
              reps: ex.reps || 10,
              isPersonalRecord: ex.isPersonalRecord || false
            }))
          }))
        };

        // 检查成就
        const newAchievements = achievementSystem.checkAchievements(formattedWorkoutData);

        // 如果有新解锁的成就，显示弹窗
        if (newAchievements && newAchievements.length > 0) {
          setTimeout(() => {
            this.showAchievementUnlockModal(newAchievements);
          }, 1000); // 延迟1秒显示，等保存成功的toast消失
        }
      } catch (e) {
        console.error('检查成就失败:', e);
      }
    },

    // 显示成就解锁弹窗
    showAchievementUnlockModal(achievements) {
      if (!achievements || achievements.length === 0) return;

      const achievementNames = achievements.map(a => `「${a.name}」`).join('、');

      // 激励性文案库
      const encouragementMessages = {
        normal: [
          '💪 坚持就是胜利！',
          '🔥 你的努力正在开花结果！',
          '⭐ 每一步都在变得更强大！',
          '🚀 突破自我，永不止步！'
        ],
        stage: [
          '📈 阶段性突破！继续向更高目标前进！',
          '🌟 进阶成功！你已经超越了昨天的自己！',
          '🏅 新的里程碑！这只是一个开始！',
          '👑 王者之路，步步为营！'
        ],
        hidden: [
          '🔮 神秘成就解锁！你是真正的探索者！',
          '✨ 隐藏彩蛋被发现！你的坚持令人惊叹！',
          '🎭 秘密解锁！只有真正的强者才能做到！',
          '💎 稀有成就！你是万里挑一的存在！'
        ],
        easter: [
          '🎁 惊喜彩蛋！今天的运气爆棚！',
          '🌈 特别时刻！让训练充满乐趣！',
          '🎉 趣味成就！健身也可以很有趣！',
          '🎊 意外之喜！继续保持这份热情！'
        ]
      };

      // 获取随机激励文案
      const getRandomEncouragement = (type) => {
        const messages = encouragementMessages[type] || encouragementMessages.normal;
        return messages[Math.floor(Math.random() * messages.length)];
      };

      let title = '';
      let content = '';

      if (achievements.length === 1) {
        const achievement = achievements[0];
        const encouragement = getRandomEncouragement(achievement.type);

        // 根据成就类型设置不同的标题和样式
        switch (achievement.type) {
          case 'hidden':
            title = '🔮 隐藏成就解锁！';
            content = `【${achievement.name}】\n\n${achievement.description}\n\n${encouragement}`;
            break;
          case 'easter':
            title = '🎁 彩蛋成就解锁！';
            content = `【${achievement.name}】\n\n${achievement.description}\n\n${encouragement}`;
            break;
          case 'stage':
            title = `📈 阶段 ${achievement.stage}/${achievement.maxStage} 达成！`;
            content = `【${achievement.name}】\n\n${achievement.description}\n\n${encouragement}`;
            break;
          default:
            title = '🏆 成就解锁！';
            content = `【${achievement.name}】\n\n${achievement.description}\n\n${encouragement}`;
        }
      } else {
        // 多个成就同时解锁
        const hasHidden = achievements.some(a => a.type === 'hidden');
        const hasEaster = achievements.some(a => a.type === 'easter');
        const hasStage = achievements.some(a => a.type === 'stage');

        let specialPrefix = '';
        if (hasHidden) specialPrefix += '🔮';
        if (hasEaster) specialPrefix += '🎁';
        if (hasStage) specialPrefix += '📈';

        title = `${specialPrefix || '🏆'} 多重成就解锁！`;

        // 按类型分组显示
        const groupedAchievements = {
          normal: achievements.filter(a => a.type === 'normal'),
          stage: achievements.filter(a => a.type === 'stage'),
          hidden: achievements.filter(a => a.type === 'hidden'),
          easter: achievements.filter(a => a.type === 'easter')
        };

        let achievementDetails = '';
        if (groupedAchievements.hidden.length > 0) {
          achievementDetails += `\n🔮 隐藏成就：${groupedAchievements.hidden.map(a => a.name).join('、')}`;
        }
        if (groupedAchievements.easter.length > 0) {
          achievementDetails += `\n🎁 彩蛋成就：${groupedAchievements.easter.map(a => a.name).join('、')}`;
        }
        if (groupedAchievements.stage.length > 0) {
          achievementDetails += `\n📈 阶段成就：${groupedAchievements.stage.map(a => a.name).join('、')}`;
        }
        if (groupedAchievements.normal.length > 0) {
          achievementDetails += `\n⭐ 普通成就：${groupedAchievements.normal.map(a => a.name).join('、')}`;
        }

        content = `太棒了！你同时完成了 ${achievements.length} 个成就！${achievementDetails}\n\n继续保持，下一个目标就在前方！`;
      }

      uni.showModal({
        title,
        content,
        showCancel: false,
        confirmText: achievements.length === 1 ? '继续加油 💪' : '太棒了 🎉',
        success: () => {
          console.log('成就弹窗关闭');
        }
      });
    },

    // 切换成就面板显示
    toggleAchievementPanel() {
      this.showAchievementPanel = !this.showAchievementPanel;
      if (this.showAchievementPanel) {
        this.updateRealtimeAchievementProgress();
      }
    },

    // 获取成就图标
    getAchievementIcon(achievementId) {
      const iconMap = {
        // 胸部训练
        chest_beginner: '🌱', chest_intermediate: '🌿', chest_advanced: '🌳', chest_master: '👑',
        // 背部训练
        back_beginner: '🌱', back_intermediate: '🌿', back_advanced: '🌳', back_master: '👑',
        // 腿部训练
        leg_beginner: '🌱', leg_intermediate: '🌿', leg_advanced: '🌳', leg_master: '👑',
        // 肩部训练
        shoulder_beginner: '🌱', shoulder_intermediate: '🌿', shoulder_advanced: '🌳', shoulder_master: '👑',
        // 手臂训练
        arm_beginner: '🌱', arm_intermediate: '🌿', arm_advanced: '🌳', arm_master: '👑',
        // 核心训练
        core_beginner: '🌱', core_intermediate: '🌿', core_advanced: '🌳', core_master: '👑',
        // 总训练量
        total_beginner: '🔰', total_intermediate: '⭐', total_advanced: '🌟', total_master: '🏆',
        // 连续训练
        consistent_3: '🌱', consistent_7: '🌿', consistent_14: '🌳', consistent_30: '👑', consistent_100: '👑',
        // 早起训练
        early_bird_3: '🐣', early_bird: '🐤', early_bird_14: '🦅', early_bird_30: '🦅',
        // 周末战士
        week_warrior_2: '📅', week_warrior: '📆', week_warrior_8: '🗓️', week_warrior_12: '🗓️',
        // 普通成就
        first_workout: '🎯', volume_king: '🏋️', personal_record: '📈', centurion: '💯', millennium: '🔥',
        fat_loss: '🔥'
      };
      return iconMap[achievementId] || '🏆';
    },

    // 更新实时成就进度
    updateRealtimeAchievementProgress() {
      try {
        const allAchievements = achievementSystem.getAllAchievements();
        const history = uni.getStorageSync('workoutHistory') || [];

        // 计算当前训练的数据
        const currentChestSets = this.getCurrentMuscleSets('chest');
        const currentBackSets = this.getCurrentMuscleSets('back');
        const currentLegSets = this.getCurrentMuscleSets('legs');
        const currentShoulderSets = this.getCurrentMuscleSets('shoulders');
        const currentArmSets = this.getCurrentMuscleSets('arms');
        const currentCoreSets = this.getCurrentMuscleSets('core');
        const currentTotalSets = this.currentWorkout.exercises.reduce((sum, ex) => sum + ex.completedSets, 0);

        // 获取历史累计数据
        const historyChestSets = this.getHistoryMuscleSets(history, 'chest');
        const historyBackSets = this.getHistoryMuscleSets(history, 'back');
        const historyLegSets = this.getHistoryMuscleSets(history, 'legs');
        const historyShoulderSets = this.getHistoryMuscleSets(history, 'shoulders');
        const historyArmSets = this.getHistoryMuscleSets(history, 'arms');
        const historyCoreSets = this.getHistoryMuscleSets(history, 'core');
        const historyTotalSets = history.reduce((sum, workout) => {
          return sum + (workout.completedSets || 0);
        }, 0);

        // 即将完成的成就（进度70%-99%）
        this.nearbyAchievements = allAchievements
          .filter(a => !a.isUnlocked && a.type === 'stage')
          .map(a => {
            let current = 0;
            let target = 0;

            // 根据成就类型计算进度
            if (a.id.includes('chest')) {
              current = historyChestSets + currentChestSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('back')) {
              current = historyBackSets + currentBackSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('leg')) {
              current = historyLegSets + currentLegSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('shoulder')) {
              current = historyShoulderSets + currentShoulderSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('arm')) {
              current = historyArmSets + currentArmSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('core')) {
              current = historyCoreSets + currentCoreSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('total')) {
              current = historyTotalSets + currentTotalSets;
              target = a.id.includes('beginner') ? 50 : a.id.includes('intermediate') ? 100 : a.id.includes('advanced') ? 300 : 500;
            }

            const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

            return {
              ...a,
              current,
              target,
              progress
            };
          })
          .filter(a => a.progress >= 70 && a.progress < 100)
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3); // 最多显示3个

        // 与本训练相关的成就
        const activeMuscleGroups = this.currentWorkout.exercises
          .filter(e => e.completedSets > 0)
          .map(e => e.muscleGroup)
          .filter((v, i, a) => a.indexOf(v) === i);

        this.relatedAchievements = allAchievements
          .filter(a => {
            if (a.isUnlocked) return false;
            // 检查是否与当前训练的肌群相关
            if (a.stageGroup) {
              const groupMap = {
                'chest_training': 'chest',
                'back_training': 'back',
                'leg_training': 'legs',
                'shoulder_training': 'shoulders',
                'arm_training': 'arms',
                'core_training': 'core'
              };
              return activeMuscleGroups.includes(groupMap[a.stageGroup]);
            }
            return false;
          })
          .map(a => {
            let current = 0;
            let target = 0;

            if (a.id.includes('chest')) {
              current = historyChestSets + currentChestSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('back')) {
              current = historyBackSets + currentBackSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('leg')) {
              current = historyLegSets + currentLegSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('shoulder')) {
              current = historyShoulderSets + currentShoulderSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('arm')) {
              current = historyArmSets + currentArmSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            } else if (a.id.includes('core')) {
              current = historyCoreSets + currentCoreSets;
              target = a.id.includes('beginner') ? 20 : a.id.includes('intermediate') ? 50 : a.id.includes('advanced') ? 100 : 200;
            }

            const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

            return {
              ...a,
              current,
              target,
              progress
            };
          })
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3); // 最多显示3个

      } catch (e) {
        console.error('更新实时成就进度失败:', e);
      }
    },

    // 获取当前训练中某肌群的完成组数
    getCurrentMuscleSets(muscleGroup) {
      return this.currentWorkout.exercises
        .filter(e => e.muscleGroup === muscleGroup)
        .reduce((sum, e) => sum + e.completedSets, 0);
    },

    // 获取历史训练中某肌群的完成组数
    getHistoryMuscleSets(history, muscleGroup) {
      return history.reduce((total, workout) => {
        if (!workout.exercises) return total;
        return total + workout.exercises
          .filter(e => e.muscleGroup === muscleGroup)
          .reduce((sum, e) => sum + (e.completedSets || 0), 0);
      }, 0);
    },

    // 启动成就进度实时更新
    startAchievementProgressUpdate() {
      // 立即更新一次
      this.updateRealtimeAchievementProgress();
      // 每5秒更新一次
      this.achievementUpdateInterval = setInterval(() => {
        if (this.showAchievementPanel) {
          this.updateRealtimeAchievementProgress();
        }
      }, 5000);
    },

    // 停止成就进度实时更新
    stopAchievementProgressUpdate() {
      if (this.achievementUpdateInterval) {
        clearInterval(this.achievementUpdateInterval);
        this.achievementUpdateInterval = null;
      }
    },

    saveAllExerciseRecords() {
      try {
        this.currentWorkout.exercises.forEach(exercise => {
          if (exercise.id && exercise.completedSets > 0) {
            // 获取历史记录检查是否破纪录
            const history = getExerciseHistory(exercise.id);
            const currentWeight = exercise.weight || exercise.lastWeight || 10;
            const currentReps = exercise.reps || 10;
            const currentVolume = currentWeight * currentReps * exercise.completedSets;

            // 检查是否破纪录（最大重量或最大容量）
            let isPersonalRecord = false;
            if (history.length > 0) {
              const maxWeight = Math.max(...history.map(h => h.weight || 0));
              const maxVolume = Math.max(...history.map(h => (h.weight || 0) * (h.reps || 0) * (h.completedSets || 0)));

              if (currentWeight > maxWeight || currentVolume > maxVolume) {
                isPersonalRecord = true;
              }
            }

            const record = {
              exerciseId: exercise.id,
              date: this.formatDate(new Date()),
              weight: currentWeight,
              reps: currentReps,
              sets: exercise.sets || 3,
              completedSets: exercise.completedSets,
              completedReps: Array(exercise.completedSets).fill(currentReps),
              restSeconds: this.settings.restDuration || 60,
              notes: `训练完成，共完成 ${exercise.completedSets}/${exercise.sets} 组`,
              isPersonalRecord
            };
            saveExerciseRecord(record);

            // 标记 exercise 为破纪录（用于成就检查）
            exercise.isPersonalRecord = isPersonalRecord;
          }
        });
      } catch (e) {
        console.error('保存所有训练记录失败:', e);
      }
    },
    
    saveTrainingState() {
      try {
        const trainingState = {
          isTraining: this.isTraining,
          currentWorkout: JSON.parse(JSON.stringify(this.currentWorkout)),
          timer: timerStore.getElapsedTime(),
          isRunning: timerStore.isTimerRunning(),
          restTimer: this.restTimer,
          restIsRunning: this.restIsRunning,
          restDuration: this.restDuration,
          showRestTimer: this.showRestTimer,
          restTimerEnded: this.restTimerEnded,
          settings: this.settings
        };
        uni.setStorageSync('trainingState', trainingState);
      } catch (e) {
        console.error('保存训练状态失败:', e);
      }
    },
    
    restoreTrainingState() {
      try {
        const currentWorkoutFromStorage = uni.getStorageSync('currentWorkout') || { exercises: [] };
        const hasValidExercises = currentWorkoutFromStorage.exercises.length > 0;
        
        if (hasValidExercises) {
          this.currentWorkout = currentWorkoutFromStorage;
          const allCompleted = this.currentWorkout.exercises.every(item => item.completedSets >= item.sets);
          
          if (allCompleted) {
            this.clearTrainingState();
            return false;
          }
        } else {
          const trainingState = uni.getStorageSync('trainingState');
          if (trainingState) {
            this.currentWorkout = trainingState.currentWorkout || { exercises: [] };
            const allCompleted = this.currentWorkout.exercises.length > 0 && 
                                this.currentWorkout.exercises.every(item => item.completedSets >= item.sets);
            if (allCompleted) {
              this.clearTrainingState();
              return false;
            }
          } else {
            this.currentWorkout = { exercises: [] };
          }
        }
        
        this.isTraining = this.currentWorkout.exercises.length > 0;
        
        if (this.isTraining) {
          const trainingState = uni.getStorageSync('trainingState') || {};
          this.restTimer = trainingState.restTimer || 0;
          this.restIsRunning = trainingState.restIsRunning || false;
          this.restDuration = trainingState.restDuration || 60;
          this.showRestTimer = trainingState.showRestTimer || false;
          this.restTimerEnded = trainingState.restTimerEnded || false;
          this.settings = trainingState.settings || this.settings;
          
          if (trainingState.isRunning) timerStore.startTimer();
          else timerStore.stopTimer();
          timerStore.setElapsedTime(trainingState.timer || 0);
          this.updateTimerDisplay();
        }
        
        uni.setStorageSync('currentWorkout', this.currentWorkout);
        return this.isTraining;
      } catch (e) {
        console.error('恢复训练状态失败:', e);
        return false;
      }
    },
    
    clearTrainingState() {
      try {
        uni.removeStorageSync('trainingState');
      } catch (e) {
        console.error('清理训练状态失败:', e);
      }
    },
    
    enterFullscreen(exercise, index) {
      this.fullscreenExercise = exercise;
      this.currentFullscreenExercise = index;
      this.isFullscreen = true;
    },
    
    exitFullscreen() {
      this.isFullscreen = false;
      this.fullscreenExercise = null;
      this.currentFullscreenExercise = null;
    },
    
    completeFullscreenSet() {
      if (this.currentFullscreenExercise === null) return;
      this.completeSet(this.currentFullscreenExercise);
      this.fullscreenExercise = this.currentWorkout.exercises[this.currentFullscreenExercise];
      
      if (this.fullscreenExercise.completedSets >= this.fullscreenExercise.sets) {
        const allCompleted = this.currentWorkout.exercises.every(item => item.completedSets >= item.sets);
        if (allCompleted) {
          setTimeout(() => this.exitFullscreen(), 1000);
        } else {
          setTimeout(() => this.nextExercise(), 1000);
        }
      }
    },
    
    nextExercise() {
      let nextIndex = this.currentFullscreenExercise + 1;
      while (nextIndex < this.currentWorkout.exercises.length) {
        if (this.currentWorkout.exercises[nextIndex].completedSets < this.currentWorkout.exercises[nextIndex].sets) break;
        nextIndex++;
      }
      
      if (nextIndex < this.currentWorkout.exercises.length) {
        this.enterFullscreen(this.currentWorkout.exercises[nextIndex], nextIndex);
      } else {
        const allCompleted = this.currentWorkout.exercises.every(item => item.completedSets >= item.sets);
        if (allCompleted) {
          this.exitFullscreen();
          this.finishWorkout();
        } else {
          nextIndex = 0;
          while (nextIndex < this.currentWorkout.exercises.length) {
            if (this.currentWorkout.exercises[nextIndex].completedSets < this.currentWorkout.exercises[nextIndex].sets) {
              this.enterFullscreen(this.currentWorkout.exercises[nextIndex], nextIndex);
              return;
            }
            nextIndex++;
          }
        }
      }
    },

    showCompletionModal() {
      this.finishWorkout();
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

/* 页面容器 */
.container {
  padding: 0 32rpx 32rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
  box-sizing: border-box;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32rpx;
  padding-top: 32rpx;
}

.header-greeting {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.greeting-text {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text);
}

.date-text {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 数据概览 */
.stats-overview {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--background-secondary);
  border-radius: 32rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid var(--border);
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 56rpx;
  font-weight: 800;
  color: var(--primary);
  font-family: 'DIN Alternate', sans-serif;
  line-height: 1;
}

.stat-label {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background-color: var(--border);
}

/* 主要操作 */
.main-action {
  margin-bottom: 32rpx;
}

.btn-start {
  width: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 32rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  border: none;
  box-shadow: 0 12rpx 40rpx rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
}

.btn-start:active {
  transform: translateY(4rpx);
  box-shadow: 0 6rpx 20rpx rgba(14, 165, 233, 0.2);
}

.start-icon {
  font-size: 64rpx;
}

.start-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
}

.start-subtext {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 快捷入口 */
.quick-section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 20rpx;
  padding-left: 8rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 16rpx;
  background-color: var(--background-secondary);
  border-radius: 24rpx;
  border: 1rpx solid var(--border);
  transition: all 0.2s ease;
}

.quick-item:active {
  background-color: var(--surface-hover);
  transform: scale(0.98);
}

.quick-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.quick-icon.plans { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.quick-icon.exercises { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.quick-icon.fatloss { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.quick-icon.history { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }

.quick-name {
  font-size: 24rpx;
  color: var(--text);
  font-weight: 500;
}

/* 训练头部 */
.training-header {
  margin-bottom: 24rpx;
}

.timer-section {
  background-color: var(--background-secondary);
  border-radius: 32rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1rpx solid var(--border);
}

.timer-display {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.timer-value {
  font-size: 56rpx;
  font-weight: 800;
  color: var(--text);
  font-family: 'DIN Alternate', monospace;
  line-height: 1;
}

.timer-label {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.timer-controls {
  display: flex;
  gap: 16rpx;
}

.timer-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  border: none;
  transition: all 0.2s ease;
}

.timer-btn.play {
  background-color: var(--success);
}

.timer-btn.pause {
  background-color: var(--warning);
}

.timer-btn.reset {
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
}

.timer-btn:active {
  transform: scale(0.95);
}

/* 实时成就进度面板 */
.achievement-progress-panel {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid rgba(102, 126, 234, 0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.panel-icon {
  font-size: 36rpx;
}

.panel-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.panel-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #1a1a2e;
  font-size: 22rpx;
  font-weight: bold;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.panel-toggle {
  font-size: 28rpx;
  color: var(--text-secondary);
}

.panel-content {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(102, 126, 234, 0.1);
}

.section-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 16rpx;
  display: block;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: var(--background-tertiary);
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}

.progress-icon {
  font-size: 40rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: 50%;
}

.progress-info {
  flex: 1;
}

.progress-name {
  font-size: 26rpx;
  color: var(--text);
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
}

.progress-bar-bg {
  height: 10rpx;
  background: var(--surface);
  border-radius: 5rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.progress-bar-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 5rpx;
  transition: width 0.3s ease;
}

.progress-detail {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.nearby-achievements {
  margin-bottom: 20rpx;
}

.related-achievements {
  margin-top: 20rpx;
}

.no-progress {
  text-align: center;
  padding: 40rpx 20rpx;
}

.no-progress-text {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 休息卡片 */
.rest-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--border);
}

.rest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.rest-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.rest-status {
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 40rpx;
  color: var(--text-secondary);
}

.rest-status.ended {
  background-color: var(--success);
  color: #ffffff;
}

.rest-timer {
  font-size: 80rpx;
  font-weight: 800;
  color: var(--text);
  text-align: center;
  font-family: 'DIN Alternate', monospace;
  margin-bottom: 24rpx;
}

.rest-progress {
  margin-bottom: 24rpx;
}

.progress-track {
  height: 12rpx;
  background-color: var(--background-tertiary);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--success) 0%, #34d399 100%);
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.rest-actions {
  display: flex;
  gap: 16rpx;
}

.btn-rest {
  flex: 1;
  padding: 20rpx 32rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  color: var(--text);
  transition: all 0.2s ease;
}

.btn-rest.start {
  background-color: var(--success);
}

.btn-rest.pause {
  background-color: var(--warning);
}

.btn-rest.reset {
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
}

.btn-rest.skip {
  background-color: var(--danger);
}

/* 建议卡片 */
.suggestion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.suggestion-icon {
  font-size: 32rpx;
}

.suggestion-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
}

.suggestion-body {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.suggestion-stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: var(--surface);
  border-radius: 20rpx;
}

.sg-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.sg-value {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text);
}

.sg-label {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.suggestion-msg {
  font-size: 26rpx;
  color: var(--text);
  text-align: center;
  padding: 16rpx;
  background-color: var(--surface);
  border-radius: 16rpx;
}

/* 动作列表区域 */
.exercises-section {
  background-color: var(--background-secondary);
  border-radius: 32rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.section-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text);
}

.section-count {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.section-actions {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.lock-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  transition: all 0.2s ease;
}

.lock-btn.locked {
  background-color: var(--success);
  border-color: var(--success);
}

.fold-btn {
  font-size: 24rpx;
  color: var(--primary);
  font-weight: 600;
  padding: 12rpx 24rpx;
  background-color: var(--background-tertiary);
  border-radius: 40rpx;
}

/* 动作项 */
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.exercise-item {
  background-color: var(--background-tertiary);
  border-radius: 24rpx;
  border: 2rpx solid var(--border);
  overflow: hidden;
  transition: all 0.3s ease;
}

.exercise-item.completed {
  opacity: 0.7;
  border-color: var(--success);
}

.exercise-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  gap: 20rpx;
}

.exercise-status {
  flex-shrink: 0;
}

.status-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border: 2rpx solid var(--border);
}

.status-icon.done {
  background-color: var(--success);
  border-color: var(--success);
  color: #ffffff;
}

.exercise-brief {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.exercise-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
}

.exercise-progress {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.exercise-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

/* 顺序调整按钮 */
.reorder-btns {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.reorder-btns.disabled {
  opacity: 0.3;
  pointer-events: none;
}

.reorder-btn {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: var(--text-secondary);
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  transition: all 0.2s ease;
}

.reorder-btn:not(.disabled):active {
  background-color: var(--primary);
  color: #ffffff;
  transform: scale(0.9);
}

.reorder-btn.disabled {
  opacity: 0.3;
  pointer-events: none;
}

.exercise-arrow {
  font-size: 36rpx;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.exercise-arrow .rotated {
  transform: rotate(90deg);
  display: inline-block;
}

/* 动作详情 */
.exercise-detail {
  padding: 0 24rpx 24rpx;
  border-top: 1rpx solid var(--border);
}

.detail-body {
  padding-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.detail-row {
  display: flex;
  gap: 20rpx;
}

.detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.detail-label {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 28rpx;
  color: var(--text);
  font-weight: 500;
}

.controls-row {
  display: flex;
  gap: 32rpx;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.control-group.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.control-label {
  font-size: 22rpx;
  color: var(--text-secondary);
  text-align: center;
}

.control-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  background-color: var(--background-secondary);
  padding: 12rpx;
  border-radius: 16rpx;
}

.ctrl-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #ffffff;
  transition: all 0.2s ease;
}

.ctrl-btn.minus {
  background-color: var(--danger);
}

.ctrl-btn.plus {
  background-color: var(--success);
}

.ctrl-btn:active {
  transform: scale(0.9);
}

.ctrl-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text);
  min-width: 60rpx;
  text-align: center;
  font-family: 'DIN Alternate', monospace;
}

.detail-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 8rpx;
}

.btn-complete {
  flex: 1;
  padding: 24rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  background-color: var(--success);
  color: #ffffff;
  transition: all 0.2s ease;
}

.btn-complete[disabled] {
  background-color: var(--text-tertiary);
  opacity: 0.5;
}

.btn-complete:active {
  transform: translateY(2rpx);
}

.action-btns {
  display: flex;
  gap: 12rpx;
}

.icon-btn-small {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  background-color: var(--background-secondary);
  border: 2rpx solid var(--border);
  transition: all 0.2s ease;
}

.icon-btn-small.delete {
  background-color: var(--danger);
  border-color: var(--danger);
}

.icon-btn-small.disabled {
  opacity: 0.3;
  pointer-events: none;
}

.icon-btn-small:active {
  transform: scale(0.95);
}

/* 添加动作栏 */
.add-exercise-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 28rpx;
  margin-top: 16rpx;
  background-color: var(--background-tertiary);
  border-radius: 20rpx;
  border: 2rpx dashed var(--border);
  transition: all 0.2s ease;
}

.add-exercise-bar:active {
  background-color: var(--surface-hover);
}

.add-icon {
  font-size: 32rpx;
  font-weight: 300;
  color: var(--primary);
}

.add-text {
  font-size: 28rpx;
  color: var(--primary);
  font-weight: 500;
}

/* 完成按钮 */
.finish-bar {
  padding: 0 32rpx 32rpx;
}

.btn-finish {
  width: 100%;
  padding: 32rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
}

.btn-finish:active {
  transform: translateY(4rpx);
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.2);
}

/* 空状态 */
.empty-training {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.modal-content {
  width: 100%;
  max-width: 560rpx;
  background-color: var(--background-secondary);
  border-radius: 40rpx;
  padding: 48rpx;
  text-align: center;
  border: 1rpx solid var(--border);
  box-shadow: 0 24rpx 80rpx rgba(0, 0, 0, 0.3);
}

.quote-icon, .finish-icon {
  font-size: 72rpx;
  margin-bottom: 24rpx;
}

.quote-title, .finish-title {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20rpx;
}

.quote-text, .finish-quote {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40rpx;
}

.finish-stats {
  display: flex;
  justify-content: space-around;
  padding: 32rpx 24rpx;
  background-color: var(--background-tertiary);
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}

.ft-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.ft-value {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--primary);
  font-family: 'DIN Alternate', monospace;
}

.ft-label {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.btn-modal {
  width: 100%;
  padding: 28rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 600;
}

/* 全屏模式 */
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
  z-index: 2000;
}

.fullscreen-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.fs-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}

.fs-close {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--text);
  background-color: var(--surface-hover);
}

.fs-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  padding: 40rpx;
}

.fs-part {
  font-size: 28rpx;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 4rpx;
}

.fs-progress {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
}

.fs-current {
  font-size: 120rpx;
  font-weight: 800;
  color: var(--success);
  font-family: 'DIN Alternate', monospace;
  line-height: 1;
}

.fs-separator {
  font-size: 60rpx;
  color: var(--text-secondary);
}

.fs-total {
  font-size: 60rpx;
  font-weight: 700;
  color: var(--text);
  font-family: 'DIN Alternate', monospace;
}

.fs-label {
  font-size: 28rpx;
  color: var(--text-secondary);
}

.fs-reps {
  font-size: 40rpx;
  color: var(--info);
  font-weight: 600;
}

.btn-fs-complete {
  width: 100%;
  max-width: 400rpx;
  padding: 40rpx;
  margin-top: 40rpx;
  border-radius: 40rpx;
  font-size: 36rpx;
  font-weight: 700;
  border: none;
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 12rpx 40rpx rgba(16, 185, 129, 0.4);
}

.btn-fs-complete[disabled] {
  background: var(--text-tertiary);
  box-shadow: none;
  opacity: 0.5;
}

/* 训练类型选择器 */
.type-selector {
  display: flex;
  gap: 8rpx;
  background-color: var(--background-secondary);
  padding: 4rpx;
  border-radius: 12rpx;
}

.type-selector.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.type-option {
  flex: 1;
  padding: 12rpx 16rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
  text-align: center;
  border-radius: 8rpx;
  transition: all 0.2s ease;
}

.type-option.active {
  background-color: var(--primary);
  color: #ffffff;
  font-weight: 500;
}

/* 组数控制行 */
.sets-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--border);
}

.sets-control-btns {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.sets-control-btns.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.ctrl-btn-small {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  color: #ffffff;
  transition: all 0.2s ease;
}

.ctrl-btn-small.minus {
  background-color: var(--danger);
}

.ctrl-btn-small.plus {
  background-color: var(--success);
}

.ctrl-btn-small:active {
  transform: scale(0.9);
}

/* 组详情区域 */
.sets-detail {
  margin-top: 20rpx;
}

.sets-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.sets-detail-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
}

.sets-detail-subtitle {
  font-size: 22rpx;
  color: var(--text-tertiary);
}

.set-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.set-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 20rpx;
  background-color: var(--background-secondary);
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.set-item.completed {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: var(--success);
  opacity: 0.7;
}

.set-item.current {
  background-color: var(--primary-light);
  border-color: var(--primary);
}

.set-number {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.set-item.completed .set-number {
  background-color: var(--success);
  color: #ffffff;
}

.set-item.current .set-number {
  background-color: var(--primary);
  color: #ffffff;
}

.set-inputs {
  flex: 1;
  display: flex;
  gap: 16rpx;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}

.set-input {
  flex: 1;
  min-width: 80rpx;
  max-width: 120rpx;
  padding: 12rpx 16rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  text-align: center;
  font-family: 'DIN Alternate', monospace;
}

.set-input.reps-input {
  max-width: 100rpx;
}

.set-input[disabled] {
  opacity: 0.5;
  background-color: var(--background-secondary);
}

.input-unit {
  font-size: 24rpx;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.set-status {
  width: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.set-done {
  font-size: 28rpx;
  color: var(--success);
  font-weight: 700;
}

.set-pending {
  font-size: 24rpx;
  color: var(--primary);
}

.set-wait {
  font-size: 24rpx;
  color: var(--text-tertiary);
}
</style>