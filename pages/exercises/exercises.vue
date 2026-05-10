<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="动作库"></custom-navbar>

    <!-- 页面标题 -->
    <view class="page-header">
      <text class="greeting">动作库</text>
      <text class="page-subtitle">{{ filteredExercises.length }} 个动作</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          type="text"
          placeholder="搜索动作名称..."
          v-model="searchKeyword"
          @input="handleSearch"
        />
        <text v-if="searchKeyword" class="clear-icon" @click="clearSearch">×</text>
      </view>
    </view>

    <!-- 筛选器折叠面板 -->
    <view class="filter-panel" :class="{ folded: filtersFolded }">
      <view class="filter-header" @click="toggleFilters">
        <text class="filter-title">筛选条件</text>
        <view class="filter-toggle">
          <text class="filter-count" v-if="activeFilterCount > 0">{{ activeFilterCount }}</text>
          <text class="toggle-icon" :class="{ rotated: !filtersFolded }">›</text>
        </view>
      </view>

      <view class="filter-content" v-if="!filtersFolded">
        <!-- 肌群分类标签 -->
        <view class="filter-section">
          <text class="filter-label">肌群</text>
          <scroll-view class="filter-scroll" scroll-x show-scrollbar="false">
            <view
              class="filter-tag"
              :class="{ active: selectedMuscle === '' }"
              @click="selectMuscle('')"
            >
              全部
            </view>
            <view
              v-for="muscle in muscleGroups"
              :key="muscle.key"
              class="filter-tag"
              :class="{ active: selectedMuscle === muscle.key }"
              @click="selectMuscle(muscle.key)"
            >
              {{ muscle.label }}
            </view>
          </scroll-view>
        </view>

        <!-- 器械筛选器 -->
        <view class="filter-section">
          <text class="filter-label">器械</text>
          <scroll-view class="filter-scroll" scroll-x show-scrollbar="false">
            <view
              class="filter-tag"
              :class="{ active: selectedEquipment === '' }"
              @click="selectEquipment('')"
            >
              全部
            </view>
            <view
              v-for="equipment in equipmentTypes"
              :key="equipment"
              class="filter-tag"
              :class="{ active: selectedEquipment === equipment }"
              @click="selectEquipment(equipment)"
            >
              {{ equipment }}
            </view>
          </scroll-view>
        </view>

        <!-- 难度筛选器 -->
        <view class="filter-section">
          <text class="filter-label">难度</text>
          <scroll-view class="filter-scroll" scroll-x show-scrollbar="false">
            <view
              class="filter-tag"
              :class="{ active: selectedDifficulty === '' }"
              @click="selectDifficulty('')"
            >
              全部
            </view>
            <view
              v-for="difficulty in difficultyLevels"
              :key="difficulty"
              class="filter-tag"
              :class="{ active: selectedDifficulty === difficulty }"
              @click="selectDifficulty(difficulty)"
            >
              {{ difficulty }}
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 动作列表 -->
    <scroll-view class="exercise-list" scroll-y show-scrollbar="false" @scrolltolower="loadMore">
      <view
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        class="exercise-card"
        @click="goToDetail(exercise.id)"
      >
        <view class="card-main">
          <view class="exercise-icon">{{ getExerciseIcon(exercise.part) }}</view>
          <view class="exercise-info">
            <view class="info-header">
              <text class="exercise-name">{{ exercise.name }}</text>
              <view class="difficulty-badge" :class="getDifficultyClass(exercise.difficulty)">
                {{ exercise.difficulty }}
              </view>
            </view>
            <view class="info-tags">
              <view class="info-tag">
                <text class="tag-text">{{ exercise.part }}</text>
              </view>
              <view class="info-tag">
                <text class="tag-text">{{ exercise.equipment }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="card-arrow">
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredExercises.length === 0" class="empty-state">
        <view class="empty-icon">🔍</view>
        <text class="empty-text">未找到匹配的动作</text>
        <text class="empty-hint">尝试调整筛选条件或搜索关键词</text>
      </view>

      <!-- 底部间距 -->
      <view class="list-footer"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getExercisesByMuscle,
  getExercisesByEquipment,
  searchExercises,
  getExerciseById
} from '@/utils/exerciseDatabase';

// 肌群选项
const muscleGroups = [
  { key: 'chest', label: '胸部' },
  { key: 'back', label: '背部' },
  { key: 'legs', label: '腿部' },
  { key: 'shoulders', label: '肩部' },
  { key: 'arms', label: '手臂' },
  { key: 'core', label: '核心' }
];

// 器械选项
const equipmentTypes = ['杠铃', '哑铃', '器械', '自重', '绳索', '壶铃'];

// 难度选项
const difficultyLevels = ['初级', '中级', '高级'];

// 响应式状态
const searchKeyword = ref('');
const selectedMuscle = ref('');
const selectedEquipment = ref('');
const selectedDifficulty = ref('');
const allExercises = ref([]);
const filtersFolded = ref(false);

// 获取所有动作数据
const loadAllExercises = () => {
  const muscles = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
  const exercises = [];
  muscles.forEach(muscle => {
    const muscleExercises = getExercisesByMuscle(muscle);
    exercises.push(...muscleExercises);
  });
  allExercises.value = exercises;
};

// 计算激活的筛选条件数量
const activeFilterCount = computed(() => {
  let count = 0;
  if (selectedMuscle.value) count++;
  if (selectedEquipment.value) count++;
  if (selectedDifficulty.value) count++;
  return count;
});

// 切换筛选器折叠状态
const toggleFilters = () => {
  filtersFolded.value = !filtersFolded.value;
};

// 获取动作图标
const getExerciseIcon = (part) => {
  const iconMap = {
    '胸部': '🏋️',
    '背部': '💪',
    '腿部': '🦵',
    '肩部': '🤷',
    '手臂': '💪',
    '核心': '🔥'
  };
  return iconMap[part] || '🏃';
};

// 筛选后的动作列表
const filteredExercises = computed(() => {
  let result = allExercises.value;

  // 搜索关键词筛选
  if (searchKeyword.value.trim()) {
    const searchResults = searchExercises(searchKeyword.value);
    // 将搜索结果与当前列表取交集
    const searchIds = new Set(searchResults.map(e => e.id));
    result = result.filter(e => searchIds.has(e.id));
  }

  // 肌群筛选
  if (selectedMuscle.value) {
    result = result.filter(e => {
      const muscleMap = {
        'chest': '胸部',
        'back': '背部',
        'legs': '腿部',
        'shoulders': '肩部',
        'arms': '手臂',
        'core': '核心'
      };
      return e.part === muscleMap[selectedMuscle.value];
    });
  }

  // 器械筛选
  if (selectedEquipment.value) {
    result = result.filter(e => e.equipment === selectedEquipment.value);
  }

  // 难度筛选
  if (selectedDifficulty.value) {
    result = result.filter(e => e.difficulty === selectedDifficulty.value);
  }

  return result;
});



// 清空搜索
const clearSearch = () => {
  searchKeyword.value = '';
};

// 选择肌群
const selectMuscle = (muscle) => {
  selectedMuscle.value = selectedMuscle.value === muscle ? '' : muscle;
};

// 选择器械
const selectEquipment = (equipment) => {
  selectedEquipment.value = selectedEquipment.value === equipment ? '' : equipment;
};

// 选择难度
const selectDifficulty = (difficulty) => {
  selectedDifficulty.value = selectedDifficulty.value === difficulty ? '' : difficulty;
};

// 处理搜索输入（添加防抖）
let searchTimeout = null;
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    // 搜索逻辑在 computed 中处理
  }, 300);
};

// 获取难度样式类
const getDifficultyClass = (difficulty) => {
  const classMap = {
    '初级': 'difficulty-beginner',
    '中级': 'difficulty-intermediate',
    '高级': 'difficulty-advanced'
  };
  return classMap[difficulty] || '';
};

// 跳转到详情页
const goToDetail = (id) => {
  const exercise = getExerciseById(id);
  if (exercise) {
    uni.navigateTo({
      url: `/pages/exercise-detail/exercise-detail?id=${id}`
    });
  }
};

// 加载更多（用于分页，当前为本地数据无需分页）
const loadMore = () => {
  // 本地数据无需分页加载
};

// 页面加载
onMounted(() => {
  loadAllExercises();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: var(--background) !important;
  padding: 0 32rpx 32rpx;
  box-sizing: border-box;
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

/* 搜索栏 */
.search-bar {
  margin-bottom: 24rpx;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3rpx var(--primary-light);
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--text);
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-icon {
  font-size: 32rpx;
  color: var(--text-secondary);
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
}

/* 筛选面板 */
.filter-panel {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  cursor: pointer;
}

.filter-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.filter-count {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.toggle-icon {
  font-size: 32rpx;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(90deg);
}

.filter-content {
  padding: 0 30rpx 24rpx;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 20rpx;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
  display: block;
  font-weight: 500;
}

.filter-scroll {
  white-space: nowrap;
  width: 100%;
}

.filter-tag {
  display: inline-block;
  padding: 14rpx 28rpx;
  margin-right: 12rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 50rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.filter-tag:last-child {
  margin-right: 0;
}

.filter-tag.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-color: var(--primary);
  color: #ffffff;
  font-weight: 500;
}

/* 动作列表 */
.exercise-list {
  height: calc(100vh - 520rpx);
}

.exercise-card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.exercise-card:active {
  transform: scale(0.98);
  background-color: var(--background-tertiary);
}

.card-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.exercise-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, var(--primary-light) 0%, rgba(14, 165, 233, 0.2) 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 24rpx;
}

.exercise-info {
  flex: 1;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.exercise-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  margin-right: 16rpx;
}

.difficulty-badge {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.difficulty-beginner {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.difficulty-intermediate {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.difficulty-advanced {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.info-tags {
  display: flex;
  gap: 12rpx;
}

.info-tag {
  padding: 8rpx 16rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
}

.tag-text {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.card-arrow {
  margin-left: 20rpx;
}

.arrow-icon {
  font-size: 40rpx;
  color: var(--text-tertiary);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: var(--text-tertiary);
  text-align: center;
}

/* 列表底部 */
.list-footer {
  height: 40rpx;
}
</style>
