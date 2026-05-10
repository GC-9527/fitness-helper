<template>
  <view class="achievements-page" :style="themeStyle">
    <!-- 顶部统计概览 -->
    <view class="stats-header">
      <view class="stats-content">
        <view class="stats-icon">
          <text class="icon">🏆</text>
        </view>
        <view class="stats-info">
          <text class="stats-title">成就进度</text>
          <view class="stats-numbers">
            <text class="unlocked-count">{{ unlockedCount }}</text>
            <text class="total-count">/ {{ totalCount }}</text>
          </view>
          <text class="stats-desc">已解锁成就</text>
        </view>
        <view class="progress-ring">
          <view class="ring-bg">
            <view class="ring-fill" :style="{ background: `conic-gradient(#FFD700 ${progressPercentage}%, transparent ${progressPercentage}%)` }"></view>
            <view class="ring-center">
              <text class="ring-percentage">{{ progressPercentage }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 阶段性成就进度 -->
    <view class="stage-progress-section" v-if="stageProgressList.length > 0">
      <text class="section-title">阶段进度</text>
      <scroll-view class="stage-list" scroll-x>
        <view
          v-for="stage in stageProgressList"
          :key="stage.stageGroup"
          class="stage-item"
          @click="showStageDetail(stage)"
        >
          <view class="stage-icon">{{ getStageGroupIcon(stage.stageGroup) }}</view>
          <view class="stage-info">
            <text class="stage-name">{{ getStageGroupName(stage.stageGroup) }}</text>
            <view class="stage-bar">
              <view class="stage-bar-fill" :style="{ width: (stage.currentStage / stage.maxStage * 100) + '%' }"></view>
            </view>
            <text class="stage-text">{{ stage.currentStage }}/{{ stage.maxStage }} 阶段</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 分类标签切换 -->
    <view class="category-tabs">
      <view
        v-for="category in categories"
        :key="category.id"
        class="tab-item"
        :class="{ active: currentCategory === category.id }"
        @click="switchCategory(category.id)"
      >
        <text class="tab-icon">{{ category.icon }}</text>
        <text class="tab-name">{{ category.name }}</text>
        <view class="tab-badge" v-if="getCategoryUnlockedCount(category.id) > 0">
          <text>{{ getCategoryUnlockedCount(category.id) }}</text>
        </view>
      </view>
    </view>

    <!-- 成就列表 -->
    <scroll-view class="achievements-list" scroll-y>
      <view class="achievements-grid">
        <view
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="achievement-card"
          :class="[
            achievement.isUnlocked ? 'unlocked' : 'locked',
            achievement.type,
            getStageColorClass(achievement),
            { 'hidden-locked': achievement.type === 'hidden' && !achievement.isUnlocked }
          ]"
          @click="showAchievementDetail(achievement)"
        >
          <!-- 成就图标 -->
          <view class="achievement-icon-wrapper">
            <view class="achievement-icon" :class="{ 'icon-glow': achievement.isUnlocked }">
              <text class="icon-text">{{ getAchievementIcon(achievement) }}</text>
            </view>
            <view class="achievement-status" v-if="achievement.isUnlocked">
              <text class="status-icon">✓</text>
            </view>
            <view class="achievement-type-badge" v-if="achievement.isUnlocked">
              <text v-if="achievement.type === 'stage'">📈</text>
              <text v-else-if="achievement.type === 'hidden'">🔮</text>
              <text v-else-if="achievement.type === 'easter'">🎁</text>
              <text v-else>⭐</text>
            </view>
          </view>

          <!-- 成就信息 -->
          <view class="achievement-info">
            <text class="achievement-name">{{ achievement.name }}</text>
            <text class="achievement-desc">{{ achievement.description }}</text>

            <!-- 已解锁：显示解锁日期 -->
            <view v-if="achievement.isUnlocked" class="unlock-info">
              <text class="unlock-date">{{ formatUnlockDate(achievement.unlockDate) }}</text>
            </view>

            <!-- 未解锁：显示进度条 -->
            <view v-else class="progress-section">
              <view class="progress-bar-bg">
                <view
                  class="progress-bar-fill"
                  :style="{ width: getAchievementProgressData(achievement.id).progress + '%' }"
                ></view>
              </view>
              <view class="progress-text">
                <text class="progress-current">{{ getAchievementProgressData(achievement.id).current }}</text>
                <text class="progress-separator">/</text>
                <text class="progress-target">{{ getAchievementProgressData(achievement.id).target }}</text>
              </view>
            </view>
          </view>

          <!-- 阶段标识 -->
          <view v-if="achievement.type === 'stage' && achievement.isUnlocked" class="stage-badge">
            <text>阶段 {{ achievement.stage }}/{{ achievement.maxStage }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredAchievements.length === 0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">
          {{ allAchievements.length === 0 ? '成就数据加载中...' : '该分类下暂无成就' }}
        </text>
        <text class="empty-hint" v-if="allAchievements.length === 0">请稍后再试</text>
      </view>
    </scroll-view>

    <!-- 成就详情弹窗 -->
    <view class="modal-mask" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedAchievement?.name }}</text>
          <text class="modal-close" @click="closeModal">×</text>
        </view>
        <view class="modal-body">
          <view class="modal-icon">{{ getAchievementIcon(selectedAchievement) }}</view>
          <text class="modal-desc">{{ getAchievementRealDesc(selectedAchievement) }}</text>
          <view class="modal-meta" v-if="selectedAchievement?.isUnlocked">
            <text class="meta-item">解锁时间: {{ formatUnlockDate(selectedAchievement.unlockDate) }}</text>
          </view>
          <view class="modal-meta" v-else>
            <text class="meta-item hint" v-if="selectedAchievement?.type === 'hidden'">
              提示: {{ selectedAchievement.hint }}
            </text>
            <text class="meta-item" v-else>完成进度: {{ getAchievementProgressData(selectedAchievement?.id).progress }}%</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// 引入成就系统
import { getAllAchievements, getStageProgress, getAchievementProgress } from '@/utils/achievementSystem';

// 分类配置
const categories = [
  { id: 'all', name: '全部', icon: '🏅' },
  { id: 'training', name: '训练类', icon: '💪' },
  { id: 'persistence', name: '坚持类', icon: '🔥' },
  { id: 'specialist', name: '专项类', icon: '⭐' },
  { id: 'hidden', name: '隐藏', icon: '🔮' },
  { id: 'easter', name: '彩蛋', icon: '🎁' }
];

// 成就图标映射
const achievementIcons = {
  // 普通成就
  first_workout: '🎯',
  volume_king: '🏋️',
  personal_record: '📈',
  centurion: '💯',
  millennium: '🔥',
  chest_master: '🦾',
  back_master: '🔙',
  leg_master: '🦵',
  shoulder_master: '💪',
  arm_master: '💪',
  core_master: '🎯',
  fat_loss: '🔥',
  muscle_gain: '🏆',

  // 阶段性成就 - 连续训练
  consistent_3: '🌱',
  consistent_7: '🌿',
  consistent_14: '🌳',
  consistent_30: '👑',
  consistent_100: '👑',

  // 阶段性成就 - 早起
  early_bird_3: '🐣',
  early_bird: '🐤',
  early_bird_14: '🦅',
  early_bird_30: '🦅',

  // 阶段性成就 - 周末
  week_warrior_2: '📅',
  week_warrior: '📆',
  week_warrior_8: '🗓️',
  week_warrior_12: '🗓️',

  // 阶段性成就 - 胸部训练
  chest_beginner: '🌱',
  chest_intermediate: '🌿',
  chest_advanced: '🌳',
  chest_master: '👑',

  // 阶段性成就 - 背部训练
  back_beginner: '🌱',
  back_intermediate: '🌿',
  back_advanced: '🌳',
  back_master: '👑',

  // 阶段性成就 - 腿部训练
  leg_beginner: '🌱',
  leg_intermediate: '🌿',
  leg_advanced: '🌳',
  leg_master: '👑',

  // 阶段性成就 - 肩部训练
  shoulder_beginner: '🌱',
  shoulder_intermediate: '🌿',
  shoulder_advanced: '🌳',
  shoulder_master: '👑',

  // 阶段性成就 - 手臂训练
  arm_beginner: '🌱',
  arm_intermediate: '🌿',
  arm_advanced: '🌳',
  arm_master: '👑',

  // 阶段性成就 - 核心训练
  core_beginner: '🌱',
  core_intermediate: '🌿',
  core_advanced: '🌳',
  core_master: '👑',

  // 阶段性成就 - 总训练量
  total_beginner: '🔰',
  total_intermediate: '⭐',
  total_advanced: '🌟',
  total_master: '🏆',

  // 隐藏成就
  night_owl: '🦉',
  perfect_week: '✨',
  perfect_month: '🌟',
  comeback_king: '🏆',
  lone_warrior: '🥷',
  exercise_collector: '📚',
  endurance_master: '⏱️',
  strength_beast: '🦁',

  // 彩蛋成就
  new_year_workout: '🎆',
  birthday_workout: '🎂',
  valentine_workout: '💝',
  singles_day_workout: '🛍️',
  devil_hour: '😈',
  forever_love: '💕',
  lucky_666: '🎰',
  love_calories: '❤️',
  precision_master: '⏰',
  time_explorer: '🌍'
};

// 阶段组图标
const stageGroupIcons = {
  consistent: '📅',
  early_bird: '🌅',
  week_warrior: '📆',
  chest_training: '🦾',
  back_training: '🔙',
  leg_training: '🦵',
  shoulder_training: '💪',
  arm_training: '💪',
  core_training: '🎯',
  total_training: '🏋️'
};

// 阶段组名称
const stageGroupNames = {
  consistent: '连续训练',
  early_bird: '早起训练',
  week_warrior: '周末战士',
  chest_training: '胸部训练',
  back_training: '背部训练',
  leg_training: '腿部训练',
  shoulder_training: '肩部训练',
  arm_training: '手臂训练',
  core_training: '核心训练',
  total_training: '总训练量'
};

// 响应式数据
const currentCategory = ref('all');
const allAchievements = ref([]);
const achievementProgressMap = ref(new Map());
const stageProgressList = ref([]);
const showModal = ref(false);
const selectedAchievement = ref(null);

// 计算属性
const unlockedCount = computed(() => {
  return allAchievements.value.filter(a => a.isUnlocked).length;
});

const totalCount = computed(() => {
  return allAchievements.value.length;
});

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((unlockedCount.value / totalCount.value) * 100);
});

const filteredAchievements = computed(() => {
  let filtered = allAchievements.value;

  // 按分类筛选
  if (currentCategory.value !== 'all') {
    filtered = filtered.filter(
      achievement => achievement.category === currentCategory.value
    );
  }

  // 排序：已解锁的在前，未解锁的在后
  return filtered.sort((a, b) => {
    // 已解锁的排在前面
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;

    // 如果都解锁了，按解锁时间倒序（最新的在前）
    if (a.isUnlocked && b.isUnlocked) {
      const dateA = new Date(a.unlockDate || 0);
      const dateB = new Date(b.unlockDate || 0);
      return dateB - dateA;
    }

    // 如果都未解锁，保持原有顺序
    return 0;
  });
});

// 方法
const switchCategory = (categoryId) => {
  currentCategory.value = categoryId;
};

const getCategoryUnlockedCount = (categoryId) => {
  if (categoryId === 'all') {
    return unlockedCount.value;
  }
  return allAchievements.value.filter(
    a => a.isUnlocked && a.category === categoryId
  ).length;
};

const getAchievementIcon = (achievement) => {
  if (!achievement) return '🏆';
  // 隐藏成就未解锁时显示问号
  if (achievement.type === 'hidden' && !achievement.isUnlocked) {
    return '❓';
  }
  return achievementIcons[achievement.id] || '🏆';
};

const getAchievementRealDesc = (achievement) => {
  if (!achievement) return '';
  // 隐藏成就解锁后显示真实描述
  if (achievement.type === 'hidden' && achievement.isUnlocked && achievement.realDescription) {
    return achievement.realDescription;
  }
  return achievement.description;
};

const getStageGroupIcon = (group) => {
  return stageGroupIcons[group] || '📊';
};

const getStageGroupName = (group) => {
  return stageGroupNames[group] || group;
};

// 获取阶段性成就的颜色类名
const getStageColorClass = (achievement) => {
  if (achievement.type !== 'stage') return '';

  // 根据阶段返回对应的颜色类
  switch (achievement.stage) {
    case 1:
      return 'stage-1'; // 绿色
    case 2:
      return 'stage-2'; // 蓝色
    case 3:
      return 'stage-3'; // 紫色
    case 4:
    case 5:
      return 'stage-4'; // 金色
    default:
      return '';
  }
};

const formatUnlockDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日解锁`;
};

const getAchievementProgressData = (achievementId) => {
  if (!achievementId) return { current: 0, target: 1, progress: 0 };
  if (achievementProgressMap.value.has(achievementId)) {
    return achievementProgressMap.value.get(achievementId);
  }

  const progress = getAchievementProgress(achievementId);
  const defaultProgress = {
    current: 0,
    target: 1,
    progress: 0
  };

  const result = progress || defaultProgress;
  achievementProgressMap.value.set(achievementId, result);
  return result;
};

const showAchievementDetail = (achievement) => {
  selectedAchievement.value = achievement;
  showModal.value = true;
};

const showStageDetail = (stage) => {
  uni.showToast({
    title: `${getStageGroupName(stage.stageGroup)}: ${stage.currentStage}/${stage.maxStage} 阶段`,
    icon: 'none'
  });
};

const closeModal = () => {
  showModal.value = false;
  selectedAchievement.value = null;
};

const loadAchievements = () => {
  try {
    // 获取所有成就
    const achievements = getAllAchievements();
    console.log('加载成就数量:', achievements.length);
    console.log('第一个成就:', achievements[0]);

    // 确保数据是响应式的
    allAchievements.value = [...achievements];

    // 获取阶段进度
    const stageGroups = [
      'consistent',
      'early_bird',
      'week_warrior',
      'chest_training',
      'back_training',
      'leg_training',
      'shoulder_training',
      'arm_training',
      'core_training',
      'total_training'
    ];
    const stages = stageGroups
      .map(group => getStageProgress(group))
      .filter(Boolean);
    stageProgressList.value = [...stages];
    console.log('阶段进度数量:', stageProgressList.value.length);

    // 预加载所有成就的进度数据
    achievements.forEach(achievement => {
      if (!achievement.isUnlocked) {
        getAchievementProgressData(achievement.id);
      }
    });

    // 强制刷新
    nextTick(() => {
      console.log('当前成就数量:', allAchievements.value.length);
      console.log('当前分类:', currentCategory.value);
      console.log('过滤后成就数量:', filteredAchievements.value.length);
    });
  } catch (e) {
    console.error('加载成就失败:', e);
    uni.showToast({ title: '加载成就失败', icon: 'none' });
  }
};

// 生命周期
onMounted(() => {
  loadAchievements();
});

// 页面显示时刷新数据
onShow(() => {
  loadAchievements();
});

// 实时更新成就进度（供训练页面调用）
const updateAchievementProgress = () => {
  // 清空进度缓存，强制重新计算
  achievementProgressMap.value.clear();
  // 重新加载所有成就数据
  loadAchievements();
};

// 暴露方法供其他页面调用
defineExpose({
  updateAchievementProgress
});
</script>

<style scoped>
/* 页面基础样式 */
.achievements-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;
  display: flex;
  flex-direction: column;
}

/* 顶部统计区域 */
.stats-header {
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 40rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.stats-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;
}

.stats-icon {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

.stats-icon .icon {
  font-size: 56rpx;
}

.stats-info {
  flex: 1;
  margin-left: 30rpx;
}

.stats-title {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 8rpx;
}

.stats-numbers {
  display: flex;
  align-items: baseline;
  margin-bottom: 4rpx;
}

.unlocked-count {
  font-size: 64rpx;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 2rpx 8rpx rgba(255, 215, 0, 0.4);
}

.total-count {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 8rpx;
}

.stats-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

/* 环形进度 */
.progress-ring {
  width: 120rpx;
  height: 120rpx;
}

.ring-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-fill {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #FFD700 var(--progress, 0%), transparent var(--progress, 0%));
}

.ring-center {
  width: 90rpx;
  height: 90rpx;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.ring-percentage {
  font-size: 28rpx;
  font-weight: bold;
  color: #FFD700;
}

/* 阶段进度区域 */
.stage-progress-section {
  padding: 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
}

.section-title {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
}

.stage-list {
  white-space: nowrap;
  padding: 0 10rpx;
}

.stage-item {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  margin-right: 16rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.stage-item:last-child {
  margin-right: 10rpx;
}

.stage-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.stage-info {
  display: flex;
  flex-direction: column;
}

.stage-name {
  font-size: 26rpx;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.stage-bar {
  width: 120rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.stage-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.stage-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  padding: 20rpx;
  gap: 16rpx;
  overflow-x: auto;
}

.category-tabs::before,
.category-tabs::after {
  content: '';
  flex-shrink: 0;
  width: 10rpx;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
}

.tab-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.tab-name {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.tab-item.active .tab-name {
  color: #ffffff;
  font-weight: 600;
}

.tab-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #FFD700;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.tab-badge text {
  font-size: 20rpx;
  color: #1a1a2e;
  font-weight: bold;
}

/* 成就列表 */
.achievements-list {
  flex: 1;
  padding: 20rpx;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 10rpx;
}

/* 成就卡片 */
.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 普通成就 - 蓝色 */
.achievement-card.normal.unlocked {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(59, 130, 246, 0.15);
}

/* 阶段性成就 - 根据阶段显示不同颜色 */
/* 阶段1 - 绿色 */
.achievement-card.stage-1.unlocked {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(34, 197, 94, 0.15);
}

/* 阶段2 - 蓝色 */
.achievement-card.stage-2.unlocked {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(59, 130, 246, 0.15);
}

/* 阶段3 - 紫色 */
.achievement-card.stage-3.unlocked {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%);
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(168, 85, 247, 0.15);
}

/* 阶段4/5 - 金色 */
.achievement-card.stage-4.unlocked {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.05) 100%);
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(255, 215, 0, 0.15);
}

/* 隐藏成就 - 金色 */
.achievement-card.hidden.unlocked {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.05) 100%);
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 4rpx 24rpx rgba(255, 215, 0, 0.15);
}

/* 彩蛋成就 - 彩色（彩虹渐变） */
.achievement-card.easter.unlocked {
  background: linear-gradient(135deg, rgba(255, 0, 128, 0.15) 0%, rgba(255, 128, 0, 0.1) 50%, rgba(128, 0, 255, 0.15) 100%);
  border-color: rgba(255, 105, 180, 0.4);
  box-shadow: 0 4rpx 24rpx rgba(255, 105, 180, 0.2);
}

.achievement-card.locked {
  opacity: 0.7;
}

.achievement-card.locked::after {
  content: '🔒';
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  font-size: 24rpx;
  opacity: 0.5;
}

.achievement-card.hidden-locked {
  background: rgba(138, 43, 226, 0.1);
  border-color: rgba(138, 43, 226, 0.2);
}

/* 成就图标 */
.achievement-icon-wrapper {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  margin-bottom: 20rpx;
}

.achievement-icon {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 普通成就 - 蓝色 */
.achievement-card.normal.unlocked .achievement-icon {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  box-shadow: 0 4rpx 20rpx rgba(59, 130, 246, 0.4);
}

/* 阶段性成就 - 根据阶段显示不同颜色 */
.achievement-card.stage-1.unlocked .achievement-icon {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  box-shadow: 0 4rpx 20rpx rgba(34, 197, 94, 0.4);
}

.achievement-card.stage-2.unlocked .achievement-icon {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  box-shadow: 0 4rpx 20rpx rgba(59, 130, 246, 0.4);
}

.achievement-card.stage-3.unlocked .achievement-icon {
  background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
  box-shadow: 0 4rpx 20rpx rgba(168, 85, 247, 0.4);
}

.achievement-card.stage-4.unlocked .achievement-icon {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4rpx 20rpx rgba(255, 215, 0, 0.4);
}

/* 隐藏成就 - 金色 */
.achievement-card.hidden.unlocked .achievement-icon {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4rpx 20rpx rgba(255, 215, 0, 0.4);
}

/* 彩蛋成就 - 彩色（彩虹渐变） */
.achievement-card.easter.unlocked .achievement-icon {
  background: linear-gradient(135deg, #FF0080 0%, #FF8000 50%, #8000FF 100%);
  box-shadow: 0 4rpx 20rpx rgba(255, 105, 180, 0.5);
}

.achievement-icon.icon-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 4rpx 20rpx rgba(255, 215, 0, 0.4);
  }
  to {
    box-shadow: 0 4rpx 40rpx rgba(255, 215, 0, 0.7);
  }
}

.icon-text {
  font-size: 48rpx;
}

.achievement-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36rpx;
  height: 36rpx;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #1a1a2e;
}

.status-icon {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: bold;
}

.achievement-type-badge {
  position: absolute;
  top: -8rpx;
  left: -8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

/* 阶段徽章 */
.stage-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

/* 阶段性成就徽章 - 根据阶段显示不同颜色 */
.achievement-card.stage-1.unlocked .stage-badge {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
}

.achievement-card.stage-2.unlocked .stage-badge {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
}

.achievement-card.stage-3.unlocked .stage-badge {
  background: linear-gradient(135deg, #A855F7 0%, #9333EA 100%);
}

.achievement-card.stage-4.unlocked .stage-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.stage-badge text {
  font-size: 20rpx;
  color: #ffffff;
  font-weight: 600;
}

/* 成就信息 */
.achievement-info {
  display: flex;
  flex-direction: column;
}

.achievement-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

/* 普通成就 - 蓝色 */
.achievement-card.normal.unlocked .achievement-name {
  color: #3B82F6;
}

/* 阶段性成就 - 根据阶段显示不同颜色 */
.achievement-card.stage-1.unlocked .achievement-name {
  color: #22C55E;
}

.achievement-card.stage-2.unlocked .achievement-name {
  color: #3B82F6;
}

.achievement-card.stage-3.unlocked .achievement-name {
  color: #A855F7;
}

.achievement-card.stage-4.unlocked .achievement-name {
  color: #FFD700;
}

/* 隐藏成就 - 金色 */
.achievement-card.hidden.unlocked .achievement-name {
  color: #FFD700;
}

/* 彩蛋成就 - 彩色 */
.achievement-card.easter.unlocked .achievement-name {
  color: #FF69B4;
}

.achievement-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 解锁信息 */
.unlock-info {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unlock-date {
  font-size: 22rpx;
  color: #FFD700;
  background: rgba(255, 215, 0, 0.15);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

/* 进度区域 */
.progress-section {
  margin-top: auto;
}

.progress-bar-bg {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 6rpx;
  transition: width 0.5s ease;
}

.progress-text {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4rpx;
}

.progress-current {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 600;
}

.progress-separator {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.4);
}

.progress-target {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.5);
}

.empty-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 12rpx;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #FFD700;
}

.modal-close {
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.modal-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 30rpx;
}

.modal-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.meta-item {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.meta-item.hint {
  color: #8A2BE2;
  font-style: italic;
}

/* 响应式适配 */
@media (max-width: 375px) {
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
