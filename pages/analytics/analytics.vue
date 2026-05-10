<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="数据分析"></custom-navbar>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">训练数据分析</text>
      <text class="page-subtitle">科学追踪你的进步轨迹</text>
    </view>

    <!-- 顶部统计卡片 -->
    <view class="stats-cards-container" v-if="hasData">
      <view class="stat-card stat-card-1">
        <view class="stat-icon">💪</view>
        <view class="stat-content">
          <text class="stat-value">{{ stats.totalWorkouts }}</text>
          <text class="stat-label">总训练次数</text>
        </view>
      </view>
      <view class="stat-card stat-card-2">
        <view class="stat-icon">⏱️</view>
        <view class="stat-content">
          <text class="stat-value">{{ formatDuration(stats.totalDuration) }}</text>
          <text class="stat-label">总训练时长</text>
        </view>
      </view>
      <view class="stat-card stat-card-3">
        <view class="stat-icon">🏋️</view>
        <view class="stat-content">
          <text class="stat-value">{{ formatVolume(stats.totalVolume) }}</text>
          <text class="stat-label">总训练容量(kg)</text>
        </view>
      </view>
      <view class="stat-card stat-card-4">
        <view class="stat-icon">🔥</view>
        <view class="stat-content">
          <text class="stat-value">{{ stats.consecutiveDays }}</text>
          <text class="stat-label">连续训练天数</text>
        </view>
      </view>
    </view>

    <!-- 综合效果评估 -->
    <view class="chart-section" v-if="hasData && effectiveness.overall > 0">
      <view class="section-header">
        <text class="section-title">训练效果评估</text>
        <text class="section-subtitle">基于科学指标的综合分析</text>
      </view>
      <view class="effectiveness-card">
        <view class="overall-score">
          <text class="score-value">{{ effectiveness.overall }}</text>
          <text class="score-label">综合评分</text>
        </view>
        <view class="category-scores">
          <view class="category-item" v-for="(item, key) in effectiveness.categories" :key="key">
            <view class="category-bar">
              <view class="category-fill" :style="{ width: (item.score * 10) + '%', backgroundColor: getScoreColor(item.score) }"></view>
            </view>
            <text class="category-name">{{ getCategoryName(key) }}</text>
            <text class="category-score">{{ item.score }}</text>
          </view>
        </view>
      </view>
      <!-- 建议列表 -->
      <view class="recommendations" v-if="effectiveness.recommendations.length > 0">
        <text class="recommendations-title">💡 训练建议</text>
        <view class="recommendation-list">
          <view class="recommendation-item" v-for="(rec, index) in effectiveness.recommendations" :key="index" :class="rec.priority">
            <text class="rec-priority">{{ getPriorityLabel(rec.priority) }}</text>
            <text class="rec-message">{{ rec.message }}</text>
            <text class="rec-action">{{ rec.action }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 训练容量趋势图 -->
    <view class="chart-section" v-if="hasData">
      <view class="section-header">
        <text class="section-title">训练容量趋势</text>
        <text class="section-subtitle">近30天变化 - {{ volumeTrend.trend === 'increasing' ? '📈 上升' : volumeTrend.trend === 'decreasing' ? '📉 下降' : '➡️ 稳定' }}</text>
      </view>
      <view class="chart-container">
        <canvas
          canvas-id="volumeChart"
          id="volumeChart"
          class="chart-canvas"
          @touchstart="touchVolumeChart"
          @touchmove="moveVolumeChart"
          @touchend="touchEndVolumeChart"
        ></canvas>
      </view>
      <view class="trend-stats" v-if="volumeTrend.prediction">
        <view class="trend-item">
          <text class="trend-label">趋势变化率</text>
          <text class="trend-value" :class="volumeTrend.trend">{{ volumeTrend.trendRate > 0 ? '+' : '' }}{{ volumeTrend.trendRate }}/天</text>
        </view>
        <view class="trend-item">
          <text class="trend-label">7天预测</text>
          <text class="trend-value">{{ formatVolume(volumeTrend.prediction.predictedValue) }}</text>
        </view>
      </view>
    </view>

    <!-- 训练频率分析 -->
    <view class="chart-section" v-if="hasData && frequency.frequencyPerWeek > 0">
      <view class="section-header">
        <text class="section-title">训练频率分析</text>
        <text class="section-subtitle">{{ frequency.frequencyLevel }} · 每周 {{ frequency.frequencyPerWeek }} 次</text>
      </view>
      <view class="frequency-stats">
        <view class="frequency-item">
          <text class="frequency-value">{{ frequency.totalWorkouts }}</text>
          <text class="frequency-label">近30天训练</text>
        </view>
        <view class="frequency-item">
          <text class="frequency-value">{{ frequency.consistency }}%</text>
          <text class="frequency-label">训练一致性</text>
        </view>
        <view class="frequency-item">
          <text class="frequency-value">{{ frequency.restDays.length }}</text>
          <text class="frequency-label">休息周期</text>
        </view>
      </view>
    </view>

    <!-- 力量进步曲线 -->
    <view class="chart-section" v-if="hasData">
      <view class="section-header">
        <view class="section-title-row">
          <text class="section-title">力量进步曲线</text>
          <view class="exercise-selector" @click="showExercisePicker">
            <text class="selected-exercise">{{ selectedExerciseName }}</text>
            <text class="selector-arrow">▼</text>
          </view>
        </view>
        <text class="section-subtitle">追踪动作力量变化</text>
      </view>
      <view class="chart-container">
        <canvas
          canvas-id="strengthChart"
          id="strengthChart"
          class="chart-canvas"
          @touchstart="touchStrengthChart"
          @touchmove="moveStrengthChart"
          @touchend="touchEndStrengthChart"
        ></canvas>
      </view>
      <!-- 动作统计信息 -->
      <view class="exercise-stats" v-if="selectedExerciseStats">
        <view class="exercise-stat-item">
          <text class="exercise-stat-value">{{ selectedExerciseStats.maxWeight }}kg</text>
          <text class="exercise-stat-label">最大重量</text>
        </view>
        <view class="exercise-stat-item">
          <text class="exercise-stat-value">{{ selectedExerciseStats.avgWeight }}kg</text>
          <text class="exercise-stat-label">平均重量</text>
        </view>
        <view class="exercise-stat-item">
          <text class="exercise-stat-value">{{ selectedExerciseStats.totalSets }}</text>
          <text class="exercise-stat-label">总组数</text>
        </view>
        <view class="exercise-stat-item">
          <text class="exercise-stat-value" :class="{ positive: selectedExerciseStats.progress > 0, negative: selectedExerciseStats.progress < 0 }">{{ selectedExerciseStats.progress }}%</text>
          <text class="exercise-stat-label">进步幅度</text>
        </view>
      </view>
    </view>

    <!-- 训练强度分析 -->
    <view class="chart-section" v-if="hasData && intensity.averageIntensity > 0">
      <view class="section-header">
        <text class="section-title">训练强度分析</text>
        <text class="section-subtitle">基于1RM百分比评估</text>
      </view>
      <view class="intensity-display">
        <view class="intensity-ring">
          <text class="intensity-value">{{ Math.round(intensity.averageIntensity) }}%</text>
          <text class="intensity-label">平均强度</text>
        </view>
        <view class="intensity-details">
          <view class="intensity-item">
            <text class="intensity-level" :style="{ color: getIntensityColor(intensity.averageIntensity) }">{{ intensity.intensityLevel }}</text>
            <text class="intensity-desc">{{ getIntensityDesc(intensity.averageIntensity) }}</text>
          </view>
          <view class="intensity-item">
            <text class="intensity-rpe">RPE {{ intensity.rpe }}/10</text>
            <text class="intensity-desc">主观用力程度</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="isLoading">
      <view class="loading-icon">⏳</view>
      <text class="loading-text">正在加载数据...</text>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!hasData && !isLoading">
      <view class="empty-icon">📊</view>
      <text class="empty-title">暂无训练数据</text>
      <text class="empty-desc">开始训练后，这里将展示你的进步轨迹</text>
      <button class="start-btn" @click="goToWorkout">开始训练</button>
    </view>

    <!-- 动作选择器弹窗 -->
    <view class="picker-modal" v-if="showPicker" @click="hideExercisePicker">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择动作</text>
          <text class="picker-close" @click="hideExercisePicker">×</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view
            class="picker-item"
            v-for="exercise in availableExercises"
            :key="exercise.id"
            :class="{ active: selectedExerciseId === exercise.id }"
            @click="selectExercise(exercise)"
          >
            <text class="picker-item-name">{{ exercise.name }}</text>
            <text class="picker-item-check" v-if="selectedExerciseId === exercise.id">✓</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import themeStore from '../../store/themeStore.js';
import {
  calculateTrainingVolume,
  calculateTrainingIntensity,
  analyzeTrainingFrequency,
  analyzeTrainingTrend,
  evaluateTrainingEffectiveness,
  formatDataForChart,
  INTENSITY_LEVELS,
  FREQUENCY_STANDARDS,
  getSetDetails
} from '@/utils/trainingAnalytics.js';

// ==================== 响应式数据 ====================
const workoutHistory = ref([]);
const exerciseHistoryMap = ref(new Map());
const availableExercises = ref([]);
const selectedExerciseId = ref('');
const selectedExerciseName = ref('请选择动作');
const showPicker = ref(false);
const hasData = ref(false);
const isLoading = ref(true);

// 统计数据
const stats = ref({
  totalWorkouts: 0,
  totalDuration: 0,
  totalVolume: 0,
  consecutiveDays: 0
});

// 选中动作的统计
const selectedExerciseStats = ref(null);

// 新增：科学分析数据
const effectiveness = ref({
  overall: 0,
  categories: {},
  recommendations: []
});
const volumeTrend = ref({
  trend: 'stable',
  trendRate: 0,
  prediction: null,
  dataPoints: []
});
const frequency = ref({
  totalWorkouts: 0,
  frequencyPerWeek: 0,
  frequencyLevel: '',
  restDays: [],
  consistency: 0
});
const intensity = ref({
  averageIntensity: 0,
  intensityByExercise: {},
  intensityLevel: '',
  rpe: 0
});

// uCharts 实例
let volumeChartInstance = null;
let strengthChartInstance = null;

// 主题颜色缓存
const themeColors = ref(null);

// ==================== 计算属性 ====================

// ==================== 生命周期 ====================
onMounted(() => {
  console.log('[Analytics] onMounted 触发');
  loadThemeColors();
  loadData();
});

// 页面显示时刷新数据
onShow(() => {
  console.log('[Analytics] onShow 触发');
  loadThemeColors();
  loadData();
});

// ==================== 加载主题颜色 ====================
function loadThemeColors() {
  themeColors.value = themeStore.getColors();
}

// ==================== 数据加载 ====================
function loadData() {
  try {
    console.log('[Analytics] 开始加载数据...');
    
    // 加载训练历史
    let history = uni.getStorageSync('workoutHistory');
    console.log('[Analytics] 原始数据:', history);
    
    // 处理各种可能的数据格式
    if (!history) {
      history = [];
    } else if (typeof history === 'string') {
      try {
        history = JSON.parse(history);
      } catch (e) {
        console.error('[Analytics] 解析历史数据失败:', e);
        history = [];
      }
    }
    
    workoutHistory.value = Array.isArray(history) ? history : [];

    // 调试日志
    console.log('[Analytics] 加载训练历史:', workoutHistory.value.length, '条记录');
    if (workoutHistory.value.length > 0) {
      console.log('[Analytics] 第一条记录:', JSON.stringify(workoutHistory.value[0], null, 2));
    }

    // 加载各动作的历史记录
    loadExerciseHistory();

    // 计算统计数据
    calculateStats();

    // 执行科学分析
    performScientificAnalysis();

    // 检查是否有数据
    const hasWorkoutHistory = workoutHistory.value.length > 0;
    const hasExerciseHistory = availableExercises.value.length > 0;
    hasData.value = hasWorkoutHistory || hasExerciseHistory;

    console.log('[Analytics] hasData:', hasData.value, '| workoutHistory:', hasWorkoutHistory, '| availableExercises:', hasExerciseHistory);
    console.log('[Analytics] workoutHistory.length:', workoutHistory.value.length);
    console.log('[Analytics] availableExercises.length:', availableExercises.value.length);

    // 数据加载完成
    isLoading.value = false;

    // 初始化图表 - 使用 setTimeout 确保 DOM 完全渲染
    if (hasData.value) {
      setTimeout(() => {
        console.log('[Analytics] 延迟初始化图表');
        initVolumeChart();
        if (selectedExerciseId.value) {
          initStrengthChart();
        }
      }, 300);
    }
  } catch (e) {
    console.error('加载数据失败:', e);
    hasData.value = false;
    isLoading.value = false;
  }
}

// 执行科学分析
function performScientificAnalysis() {
  if (workoutHistory.value.length === 0) {
    console.log('[Analytics] 没有训练数据，跳过科学分析');
    return;
  }

  console.log('[Analytics] 开始科学分析...');

  // 训练效果评估
  effectiveness.value = evaluateTrainingEffectiveness(workoutHistory.value, 30);
  console.log('[Analytics] 效果评估:', effectiveness.value);

  // 容量趋势分析
  volumeTrend.value = analyzeTrainingTrend(workoutHistory.value, 'volume', 30);
  console.log('[Analytics] 容量趋势:', volumeTrend.value);

  // 频率分析
  frequency.value = analyzeTrainingFrequency(workoutHistory.value, 30);
  console.log('[Analytics] 频率分析:', frequency.value);

  // 强度分析（需要1RM数据，这里简化处理）
  const oneRMData = {};
  workoutHistory.value.forEach(workout => {
    const exercises = workout.exercises || [];
    exercises.forEach(exercise => {
      const setDetails = getSetDetails(exercise);
      if (exercise.id && setDetails.length > 0) {
        const maxWeight = Math.max(...setDetails.map(s => s.weight || 0));
        if (maxWeight > 0) {
          oneRMData[exercise.id] = maxWeight * 1.1; // 估算1RM
        }
      }
    });
  });
  
  // 计算最近一次训练的强度
  if (workoutHistory.value.length > 0) {
    const lastWorkout = workoutHistory.value[workoutHistory.value.length - 1];
    intensity.value = calculateTrainingIntensity(lastWorkout.exercises || [], oneRMData);
  }
}

// 加载各动作的历史记录
function loadExerciseHistory() {
  exerciseHistoryMap.value.clear();
  availableExercises.value = [];

  try {
    // 首先从 workoutHistory 中提取所有动作
    const exerciseMap = new Map();
    workoutHistory.value.forEach(workout => {
      const exercises = workout.exercises || [];
      exercises.forEach(exercise => {
        if (exercise.id && exercise.name) {
          if (!exerciseMap.has(exercise.id)) {
            exerciseMap.set(exercise.id, {
              id: exercise.id,
              name: exercise.name,
              history: []
            });
          }
          // 从 setDetails 中提取该次训练的数据
          const setDetails = getSetDetails(exercise);
          if (setDetails.length > 0) {
            const maxWeight = Math.max(...setDetails.map(s => s.weight || 0));
            const totalReps = setDetails.reduce((sum, s) => sum + (s.reps || 0), 0);
            exerciseMap.get(exercise.id).history.push({
              date: workout.date,
              weight: maxWeight,
              reps: totalReps / setDetails.length,
              sets: setDetails.length
            });
          }
        }
      });
    });

    // 将提取的动作添加到可用列表
    exerciseMap.forEach((exercise, id) => {
      exerciseHistoryMap.value.set(id, exercise);
      availableExercises.value.push({
        id: exercise.id,
        name: exercise.name
      });
    });

    console.log('[Analytics] 从训练历史提取的动作:', availableExercises.value.length);

    // 如果还没有动作，尝试从 exercise_history_ 存储键加载（兼容旧数据）
    if (availableExercises.value.length === 0) {
      let keys = [];
      try {
        const storageInfo = uni.getStorageInfoSync();
        keys = storageInfo.keys || [];
      } catch (e) {
        console.warn('获取存储信息失败:', e);
      }
      const exerciseKeys = keys.filter(key => key.startsWith('exercise_history_'));

      exerciseKeys.forEach(key => {
        const exerciseId = key.replace('exercise_history_', '');
        const history = uni.getStorageSync(key) || [];

        if (Array.isArray(history) && history.length > 0) {
          let exerciseName = history[0].exerciseName || history[0].name || '未知动作';

          if (exerciseName === '未知动作') {
            for (const workout of workoutHistory.value) {
              if (workout.exercises) {
                const found = workout.exercises.find(e => e.id === exerciseId);
                if (found) {
                  exerciseName = found.name;
                  break;
                }
              }
            }
          }

          exerciseHistoryMap.value.set(exerciseId, {
            id: exerciseId,
            name: exerciseName,
            history: history
          });

          availableExercises.value.push({
            id: exerciseId,
            name: exerciseName
          });
        }
      });
    }

    if (availableExercises.value.length > 0 && !selectedExerciseId.value) {
      selectedExerciseId.value = availableExercises.value[0].id;
      selectedExerciseName.value = availableExercises.value[0].name;
      calculateExerciseStats();
    }
  } catch (e) {
    console.error('加载动作历史失败:', e);
  }
}

// ==================== 统计计算 ====================
function calculateStats() {
  const history = workoutHistory.value;

  if (history.length === 0) {
    stats.value = {
      totalWorkouts: 0,
      totalDuration: 0,
      totalVolume: 0,
      consecutiveDays: 0
    };
    return;
  }

  let totalDuration = 0;
  let totalVolume = 0;
  const workoutDates = new Set();

  history.forEach(workout => {
    totalDuration += workout.duration || 0;

    if (workout.date) {
      workoutDates.add(workout.date);
    }

    // 使用科学计算函数计算容量
    const vol = calculateTrainingVolume(workout.exercises || []);
    totalVolume += vol.totalVolume;
  });

  const consecutiveDays = calculateConsecutiveDays(Array.from(workoutDates));

  stats.value = {
    totalWorkouts: history.length,
    totalDuration,
    totalVolume,
    consecutiveDays
  };
}

// 计算连续训练天数
function calculateConsecutiveDays(dates) {
  if (dates.length === 0) return 0;

  const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let consecutiveDays = 0;
  let currentDate = new Date(today);

  const todayStr = formatDate(currentDate);
  if (sortedDates.includes(todayStr)) {
    consecutiveDays++;
  } else {
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!sortedDates.includes(formatDate(yesterday))) {
      return 0;
    }
  }

  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dateStr = formatDate(currentDate);
    if (sortedDates.includes(dateStr)) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
}

// 计算选中动作的统计
function calculateExerciseStats() {
  if (!selectedExerciseId.value || !selectedExerciseName.value) {
    selectedExerciseStats.value = null;
    return;
  }

  // 从 workoutHistory 中重新计算统计数据
  const exerciseRecords = [];
  
  workoutHistory.value.forEach(workout => {
    const exercises = workout.exercises || [];
    exercises.forEach(exercise => {
      if (exercise.id === selectedExerciseId.value || exercise.name === selectedExerciseName.value) {
        const setDetails = getSetDetails(exercise);
        const validSets = setDetails.filter(s => (s.weight || 0) > 0 && (s.reps || 0) > 0);
        
        if (validSets.length > 0) {
          const weights = validSets.map(s => s.weight);
          const maxWeight = Math.max(...weights);
          const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
          
          exerciseRecords.push({
            date: workout.date,
            maxWeight: maxWeight,
            avgWeight: avgWeight,
            sets: validSets.length
          });
        }
      }
    });
  });

  if (exerciseRecords.length === 0) {
    selectedExerciseStats.value = null;
    return;
  }

  // 按日期排序
  exerciseRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 计算统计数据
  let maxWeight = 0;
  let totalAvgWeight = 0;
  let totalSets = 0;

  exerciseRecords.forEach(record => {
    if (record.maxWeight > maxWeight) {
      maxWeight = record.maxWeight;
    }
    totalAvgWeight += record.avgWeight;
    totalSets += record.sets;
  });

  const avgWeight = Math.round((totalAvgWeight / exerciseRecords.length) * 10) / 10;

  // 计算进步幅度（比较最早和最晚的记录）
  const firstRecord = exerciseRecords[0];
  const lastRecord = exerciseRecords[exerciseRecords.length - 1];
  const firstWeight = firstRecord.avgWeight; // 使用平均重量计算进步
  const lastWeight = lastRecord.avgWeight;
  
  let progress = 0;
  if (firstWeight > 0) {
    progress = Math.round(((lastWeight - firstWeight) / firstWeight) * 100);
  }

  console.log('[Analytics] 动作统计:', {
    maxWeight,
    avgWeight,
    totalSets,
    progress,
    firstWeight,
    lastWeight,
    records: exerciseRecords.length
  });

  selectedExerciseStats.value = {
    maxWeight,
    avgWeight,
    totalSets,
    progress: progress > 0 ? `+${progress}` : progress.toString()
  };
}

// ==================== 图表初始化 ====================
function initVolumeChart() {
  console.log('[Analytics] 初始化容量图表');
  const ctx = uni.createCanvasContext('volumeChart');
  const chartData = formatDataForChart(workoutHistory.value, 'volume');
  console.log('[Analytics] 容量图表数据:', chartData);

  drawLineChart(ctx, {
    data: chartData,
    color: themeColors.value?.success || '#10b981',
    fillColor: hexToRgba(themeColors.value?.success || '#10b981', 0.1),
    title: '训练容量 (kg)'
  });
}

function initStrengthChart() {
  console.log('[Analytics] 初始化力量图表, 选中动作:', selectedExerciseName.value);
  const ctx = uni.createCanvasContext('strengthChart');
  const chartData = formatDataForChart(workoutHistory.value, 'strength', selectedExerciseName.value);
  console.log('[Analytics] 力量图表数据:', chartData);

  drawLineChart(ctx, {
    data: chartData,
    color: themeColors.value?.primary || '#3b82f6',
    fillColor: hexToRgba(themeColors.value?.primary || '#3b82f6', 0.1),
    title: '重量 (kg)'
  });
}

// 辅助函数：十六进制颜色转rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 绘制折线图
function drawLineChart(ctx, options) {
  const { data, labels, color, fillColor, title } = options;

  console.log('[Analytics] drawLineChart 数据:', data);

  if (!data || !data.series || data.series.length === 0) {
    console.log('[Analytics] 无数据，显示空状态');
    ctx.setFillStyle(themeColors.value?.textSecondary || '#94a3b8');
    ctx.setFontSize(14);
    ctx.fillText('暂无数据', 150, 100);
    ctx.draw();
    return;
  }

  const categories = data.categories;
  const seriesList = data.series;

  console.log('[Analytics] seriesList:', seriesList, '数量:', seriesList.length);
  console.log('[Analytics] categories:', categories);

  // 获取系统信息计算 canvas 尺寸
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const canvasWidth = screenWidth - 60; // 减去 padding
  const canvasHeight = 200;
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = canvasWidth - padding.left - padding.right;
  const chartHeight = canvasHeight - padding.top - padding.bottom;

  // 计算所有数据的最大值和最小值（过滤掉null值）
  let allValues = [];
  seriesList.forEach(series => {
    const validData = (series.data || []).filter(v => v !== null && v !== undefined);
    allValues = allValues.concat(validData);
  });
  
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const valueRange = maxValue - minValue || 1;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 绘制网格线 - 使用主题颜色
  const gridColor = themeColors.value?.chartGrid || 'rgba(255,255,255,0.05)';
  ctx.setStrokeStyle(gridColor);
  ctx.setLineWidth(1);

  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
  }

  // 绘制坐标轴 - 使用主题颜色
  const axisColor = themeColors.value?.chartAxis || 'rgba(255,255,255,0.2)';
  ctx.setStrokeStyle(axisColor);
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();

  // 绘制 Y 轴标签 - 使用主题文字颜色
  ctx.setFillStyle(themeColors.value?.textSecondary || '#94a3b8');
  ctx.setFontSize(10);
  ctx.setTextAlign('right');
  for (let i = 0; i <= 5; i++) {
    const value = minValue + (valueRange / 5) * (5 - i);
    const y = padding.top + (chartHeight / 5) * i + 3;
    ctx.fillText(Math.round(value).toString(), padding.left - 8, y);
  }

  // 定义颜色数组用于多线图表 - 使用主题颜色
  const colors = [
    themeColors.value?.primary || '#3b82f6',
    themeColors.value?.warning || '#f59e0b',
    themeColors.value?.success || '#10b981',
    themeColors.value?.danger || '#ef4444'
  ];
  
  // 绘制每条线
  seriesList.forEach((series, seriesIndex) => {
    const seriesData = series.data || [];
    if (seriesData.length === 0) return;
    
    const lineColor = colors[seriesIndex % colors.length];
    
    // 计算点的位置（跳过null值）
    const xStep = seriesData.length > 1 ? chartWidth / (seriesData.length - 1) : chartWidth / 2;
    const points = [];
    seriesData.forEach((value, index) => {
      if (value !== null && value !== undefined) {
        const x = padding.left + xStep * index;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        points.push({ x, y, value, index });
      }
    });

    console.log(`[Analytics] 系列 ${series.name} 的点:`, points);

    // 绘制填充区域（只有第一条线填充）
    if (seriesIndex === 0 && fillColor && points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartHeight);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
      ctx.closePath();

      try {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, fillColor.replace('0.1', '0.3'));
        gradient.addColorStop(1, fillColor.replace('0.1', '0'));
        ctx.setFillStyle(gradient);
      } catch (e) {
        ctx.setFillStyle(fillColor);
      }
      ctx.fill();
    }

    // 绘制折线（跳过null值，形成断点）
    if (points.length > 0) {
      ctx.beginPath();
      ctx.setStrokeStyle(lineColor);
      ctx.setLineWidth(2);
      ctx.setLineCap('round');
      ctx.setLineJoin('round');

      let isFirstPoint = true;
      points.forEach((point) => {
        if (isFirstPoint) {
          ctx.moveTo(point.x, point.y);
          isFirstPoint = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // 绘制数据点
      points.forEach((point) => {
        ctx.beginPath();
        ctx.setFillStyle(themeColors.value?.backgroundSecondary || '#1e293b');
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.setFillStyle(lineColor);
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  });

  // 绘制 X 轴标签
  ctx.setFillStyle(themeColors.value?.textSecondary || '#94a3b8');
  ctx.setFontSize(9);
  ctx.setTextAlign('center');
  const labelStep = Math.ceil(categories.length / 6);
  const categoryXStep = categories.length > 1 ? chartWidth / (categories.length - 1) : chartWidth / 2;
  categories.forEach((label, index) => {
    if (index % labelStep === 0) {
      const x = padding.left + categoryXStep * index;
      ctx.fillText(label, x, padding.top + chartHeight + 15);
    }
  });

  // 绘制标题
  ctx.setFillStyle(themeColors.value?.text || '#f8fafc');
  ctx.setFontSize(12);
  ctx.setTextAlign('left');
  ctx.fillText(title, padding.left, 18);

  // 绘制图例
  if (seriesList.length > 1) {
    let legendX = padding.left + 100;
    seriesList.forEach((series, index) => {
      const legendColor = colors[index % colors.length];
      ctx.setFillStyle(legendColor);
      ctx.fillRect(legendX, 12, 10, 10);
      ctx.setFontSize(10);
      ctx.fillText(series.name.split('(')[0], legendX + 14, 21);
      legendX += 60;
    });
  }

  console.log('[Analytics] 绘制完成，调用 ctx.draw()');
  ctx.draw(true);
}

// ==================== 事件处理 ====================
function showExercisePicker() {
  if (availableExercises.value.length === 0) {
    uni.showToast({
      title: '暂无动作数据',
      icon: 'none'
    });
    return;
  }
  showPicker.value = true;
}

function hideExercisePicker() {
  showPicker.value = false;
}

function selectExercise(exercise) {
  selectedExerciseId.value = exercise.id;
  selectedExerciseName.value = exercise.name;
  showPicker.value = false;

  calculateExerciseStats();
  nextTick(() => {
    initStrengthChart();
  });
}

function goToWorkout() {
  uni.switchTab({
    url: '/pages/index/index'
  });
}

function touchVolumeChart() {}
function moveVolumeChart() {}
function touchEndVolumeChart() {}
function touchStrengthChart() {}
function moveStrengthChart() {}
function touchEndStrengthChart() {}

// ==================== 工具函数 ====================
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatShortDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
}

function formatDuration(minutes) {
  if (minutes < 60) {
    return minutes.toString();
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
}

function formatVolume(volume) {
  if (volume >= 10000) {
    return (volume / 10000).toFixed(1) + 'w';
  }
  if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'k';
  }
  return volume.toString();
}

// ==================== 新增：分析结果格式化函数 ====================
function getCategoryName(key) {
  const names = {
    volume: '容量进展',
    consistency: '训练一致性',
    balance: '肌群平衡',
    recovery: '恢复情况'
  };
  return names[key] || key;
}

function getScoreColor(score) {
  if (score >= 8) return themeColors.value?.success || '#10b981';
  if (score >= 6) return themeColors.value?.warning || '#f59e0b';
  return themeColors.value?.danger || '#ef4444';
}

function getPriorityLabel(priority) {
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '建议'
  };
  return labels[priority] || priority;
}

function getIntensityColor(percentage) {
  for (const [level, range] of Object.entries(INTENSITY_LEVELS)) {
    if (percentage >= range.min && percentage < range.max) {
      return range.color;
    }
  }
  return INTENSITY_LEVELS.MAXIMAL.color;
}

function getIntensityDesc(percentage) {
  if (percentage < 60) return '适合热身和恢复训练';
  if (percentage < 75) return '适合肌耐力训练';
  if (percentage < 85) return '适合肌肥大训练';
  if (percentage < 95) return '适合力量训练';
  return '接近极限，谨慎使用';
}
</script>

<style scoped>
/* ==================== 基础样式 ==================== */
.container {
  min-height: 100vh;
  background-color: var(--background) !important;
  padding: 0 30rpx 50rpx;
  box-sizing: border-box;
}

/* ==================== 页面标题 ==================== */
.page-header {
  margin-bottom: 30rpx;
  padding-top: 30rpx;
}

.page-title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8rpx;
}

.page-subtitle {
  display: block;
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* ==================== 统计卡片 ==================== */
.stats-cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
}

.stat-card-1 {
  background: var(--gradient-card-1);
}

.stat-card-2 {
  background: var(--gradient-card-2);
}

.stat-card-3 {
  background: var(--gradient-card-3);
}

.stat-card-4 {
  background: var(--gradient-card-4);
}

.stat-icon {
  font-size: 48rpx;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  backdrop-filter: blur(10rpx);
}

.stat-content {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4rpx;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* ==================== 图表区域 ==================== */
.chart-section {
  background: var(--glass-bg);
  border: 1rpx solid var(--glass-border);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.section-header {
  margin-bottom: 24rpx;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.section-subtitle {
  font-size: 24rpx;
  color: var(--text-tertiary);
}

.exercise-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(59, 130, 246, 0.15);
  padding: 12rpx 20rpx;
  border-radius: 30rpx;
  border: 1rpx solid rgba(59, 130, 246, 0.3);
}

.selected-exercise {
  font-size: 24rpx;
  color: var(--primary-light);
  font-weight: 500;
  max-width: 200rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selector-arrow {
  font-size: 20rpx;
  color: var(--primary-light);
}

.chart-container {
  background: var(--background-secondary);
  border-radius: 16rpx;
  padding: 20rpx;
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

/* ==================== 效果评估卡片 ==================== */
.effectiveness-card {
  display: flex;
  gap: 30rpx;
  padding: 20rpx 0;
}

.overall-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 140rpx;
}

.score-value {
  font-size: 72rpx;
  font-weight: 700;
  color: var(--success);
  line-height: 1;
}

.score-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
}

.category-scores {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.category-bar {
  flex: 1;
  height: 12rpx;
  background: var(--surface);
  border-radius: 6rpx;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.category-name {
  font-size: 24rpx;
  color: var(--text-secondary);
  width: 120rpx;
}

.category-score {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  min-width: 40rpx;
  text-align: right;
}

/* ==================== 建议列表 ==================== */
.recommendations {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid var(--border);
}

.recommendations-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  display: block;
  margin-bottom: 16rpx;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.recommendation-item {
  background: var(--background-tertiary);
  border-radius: 12rpx;
  padding: 20rpx;
  border-left: 4rpx solid var(--warning);
}

.recommendation-item.high {
  border-left-color: var(--danger);
}

.recommendation-item.medium {
  border-left-color: var(--warning);
}

.recommendation-item.low {
  border-left-color: var(--success);
}

.rec-priority {
  font-size: 22rpx;
  color: var(--warning);
  display: block;
  margin-bottom: 8rpx;
}

.recommendation-item.high .rec-priority {
  color: var(--danger);
}

.recommendation-item.low .rec-priority {
  color: var(--success);
}

.rec-message {
  font-size: 26rpx;
  color: var(--text);
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.rec-action {
  font-size: 24rpx;
  color: var(--text-tertiary);
  display: block;
}

/* ==================== 趋势统计 ==================== */
.trend-stats {
  display: flex;
  gap: 30rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid var(--border);
}

.trend-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.trend-label {
  font-size: 24rpx;
  color: var(--text-tertiary);
  margin-bottom: 8rpx;
}

.trend-value {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.trend-value.increasing {
  color: var(--success);
}

.trend-value.decreasing {
  color: var(--danger);
}

/* ==================== 频率统计 ==================== */
.frequency-stats {
  display: flex;
  gap: 20rpx;
}

.frequency-item {
  flex: 1;
  background: var(--background-tertiary);
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
}

.frequency-value {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-bottom: 8rpx;
}

.frequency-label {
  font-size: 24rpx;
  color: var(--text-tertiary);
}

/* ==================== 强度显示 ==================== */
.intensity-display {
  display: flex;
  align-items: center;
  gap: 40rpx;
  padding: 20rpx 0;
}

.intensity-ring {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--primary) v-bind(intensity.averageIntensity)%, rgba(255,255,255,0.1) 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.intensity-ring::before {
  content: '';
  position: absolute;
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  background: var(--background-secondary);
}

.intensity-value {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text);
  position: relative;
  z-index: 1;
}

.intensity-label {
  font-size: 22rpx;
  color: var(--text-tertiary);
  position: relative;
  z-index: 1;
}

.intensity-details {
  flex: 1;
}

.intensity-item {
  margin-bottom: 20rpx;
}

.intensity-item:last-child {
  margin-bottom: 0;
}

.intensity-level {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 4rpx;
}

.intensity-rpe {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--warning);
  display: block;
  margin-bottom: 4rpx;
}

.intensity-desc {
  font-size: 24rpx;
  color: var(--text-tertiary);
}

/* ==================== 动作统计信息 ==================== */
.exercise-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid var(--border);
}

.exercise-stat-item {
  text-align: center;
}

.exercise-stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4rpx;
}

.exercise-stat-value.positive {
  color: var(--success);
}

.exercise-stat-value.negative {
  color: var(--danger);
}

.exercise-stat-label {
  display: block;
  font-size: 20rpx;
  color: var(--text-tertiary);
}

/* ==================== 加载状态 ==================== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 40rpx;
  text-align: center;
}

.loading-icon {
  font-size: 80rpx;
  margin-bottom: 30rpx;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: var(--text-secondary);
}

/* ==================== 空状态 ==================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.8;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: var(--text-tertiary);
  margin-bottom: 50rpx;
  line-height: 1.6;
}

.start-btn {
  background: var(--gradient-primary);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  padding: 28rpx 80rpx;
  border-radius: 50rpx;
  border: none;
  box-shadow: 0 8rpx 30rpx rgba(59, 130, 246, 0.4);
  transition: transform 0.2s ease;
}

.start-btn:active {
  transform: scale(0.98);
}

/* ==================== 选择器弹窗 ==================== */
.picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10rpx);
}

.picker-content {
  background: var(--background-secondary);
  border-radius: 32rpx 32rpx 0 0;
  width: 100%;
  max-height: 70vh;
  border-top: 1rpx solid var(--border);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid var(--border);
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.picker-close {
  font-size: 48rpx;
  color: var(--text-tertiary);
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-list {
  max-height: 60vh;
  padding: 20rpx 0;
}

.picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 40rpx;
  margin: 0 20rpx;
  border-radius: 12rpx;
  transition: background 0.2s ease;
}

.picker-item:active {
  background: var(--surface-hover);
}

.picker-item.active {
  background: rgba(59, 130, 246, 0.15);
}

.picker-item-name {
  font-size: 30rpx;
  color: var(--text);
}

.picker-item.active .picker-item-name {
  color: var(--primary);
  font-weight: 500;
}

.picker-item-check {
  font-size: 28rpx;
  color: var(--primary);
  font-weight: 700;
}
</style>