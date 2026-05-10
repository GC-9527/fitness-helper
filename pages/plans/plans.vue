<template>
  <view class="container" :style="themeStyle">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="greeting">训练计划</text>
      <text class="page-subtitle">制定目标，坚持执行</text>
    </view>

    <!-- 创建按钮 -->
    <view class="create-section">
      <button class="create-btn" @click="createPlan">
        <text class="btn-icon">+</text>
        <text class="btn-text">创建新计划</text>
      </button>
    </view>

    <!-- 我的计划 -->
    <view class="section" v-if="plans.length > 0">
      <view class="section-header">
        <text class="section-title">我的计划</text>
        <text class="section-count">{{plans.length}} 个</text>
      </view>
      
      <view class="plan-list">
        <view 
          class="plan-card" 
          v-for="(plan, index) in plans" 
          :key="plan.id"
          :class="{ expanded: expandedPlanIndex === index }"
        >
          <view class="plan-main" @click="togglePlanExpand(index)">
            <view class="plan-icon" :class="plan.difficulty">
              <text>{{getPlanIcon(plan.difficulty)}}</text>
            </view>
            <view class="plan-info">
              <view class="plan-header-row">
                <text class="plan-name">{{plan.name}}</text>
                <view class="plan-tag" :class="plan.difficulty">{{getDifficultyText(plan.difficulty)}}</view>
              </view>
              <view class="plan-stats">
                <view class="stat-item">
                  <text class="stat-icon">🏋️</text>
                  <text class="stat-text">{{plan.exercises.length}}个动作</text>
                </view>
                <view class="stat-item">
                  <text class="stat-icon">⏱️</text>
                  <text class="stat-text">{{plan.duration}}分钟</text>
                </view>
                <view class="stat-item">
                  <text class="stat-icon">🔥</text>
                  <text class="stat-text">{{plan.calories}}卡</text>
                </view>
              </view>
            </view>
            <view class="expand-icon">
              <text :class="{ rotated: expandedPlanIndex === index }">›</text>
            </view>
          </view>

          <!-- 展开详情 -->
          <view class="plan-detail" v-if="expandedPlanIndex === index">
            <text class="plan-desc">{{plan.description || '暂无描述'}}</text>
            <view class="exercise-preview">
              <text class="preview-title">包含动作</text>
              <view class="preview-list">
                <text class="preview-item" v-for="(ex, exIndex) in plan.exercises.slice(0, 5)" :key="exIndex">
                  {{ex.name}}
                </text>
                <text class="preview-more" v-if="plan.exercises.length > 5">+{{plan.exercises.length - 5}}个</text>
              </view>
            </view>
            <view class="plan-actions">
              <button class="action-btn secondary" @click.stop="editPlan(plan)">编辑</button>
              <button class="action-btn danger" @click.stop="deletePlan(plan)">删除</button>
              <button class="action-btn primary" @click.stop="usePlan(plan)">开始训练</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-icon">📋</view>
      <view class="empty-text">暂无训练计划</view>
      <view class="empty-hint">创建一个计划开始训练吧</view>
    </view>

    <!-- 推荐计划 -->
    <view class="section recommend-section">
      <view class="section-header">
        <text class="section-title">推荐计划</text>
      </view>
      <view class="recommend-grid">
        <view class="recommend-card" v-for="(item, index) in recommendPlans" :key="index" @click="useRecommendPlan(item)">
          <view class="rec-icon">{{getRecIcon(index)}}</view>
          <view class="rec-content">
            <text class="rec-name">{{item.name}}</text>
            <text class="rec-desc">{{item.description}}</text>
            <view class="rec-meta">
              <text class="rec-tag" :class="item.difficulty">{{item.difficulty}}</text>
              <text class="rec-info">{{item.exercises.length}}个动作 · {{item.duration}}分钟</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 创建/编辑计划弹窗 -->
    <view class="modal" v-if="showPlanModal" @click="hidePlanModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{isEditing ? '编辑计划' : '创建计划'}}</text>
          <view class="close-btn" @click="hidePlanModal">×</view>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">计划名称</text>
            <input class="form-input" placeholder="如：减脂训练、增肌计划" v-model="currentPlan.name" maxlength="50"/>
          </view>
          <view class="form-item">
            <text class="form-label">难度等级</text>
            <picker :range="difficultyOptions" @change="onDifficultyChange">
              <view class="picker">{{getDifficultyText(currentPlan.difficulty)}}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">预计时长</text>
            <input class="form-input" type="number" placeholder="分钟" v-model="currentPlan.duration" maxlength="3"/>
          </view>
          <view class="form-item">
            <text class="form-label">计划描述</text>
            <textarea class="form-textarea" placeholder="简单描述这个计划" v-model="currentPlan.description" maxlength="200"/>
          </view>
          <view class="form-item">
            <text class="form-label">选择动作</text>
            <button class="select-btn" @click="selectExercises">选择动作 ({{currentPlan.exercises.length}})</button>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-secondary" @click="hidePlanModal">取消</button>
          <button class="btn-primary" @click="savePlan">保存</button>
        </view>
      </view>
    </view>

    <!-- 选择动作弹窗 -->
    <view class="modal" v-if="showExerciseSelectModal" @click="hideExerciseSelectModal">
      <view class="modal-content exercise-select-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择动作</text>
          <view class="close-btn" @click="hideExerciseSelectModal">×</view>
        </view>
        <view class="modal-body">
          <view class="exercise-select-list">
            <view class="exercise-select-item" v-for="ex in allExercises" :key="ex.id" @click="toggleExercise(ex)">
              <view class="exercise-info">
                <text class="exercise-name">{{ex.name}}</text>
                <text class="exercise-part">{{ex.part}}</text>
              </view>
              <view class="check-mark" :class="{checked: isSelected(ex)}">✓</view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-secondary" @click="hideExerciseSelectModal">取消</button>
          <button class="btn-primary" @click="confirmExerciseSelect">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getExercises, generateId } from '../../utils/index';

export default {
  data() {
    return {
      plans: [],
      showPlanModal: false,
      showExerciseSelectModal: false,
      isEditing: false,
      expandedPlanIndex: -1,
      currentPlan: {
        id: '',
        name: '',
        difficulty: 'beginner',
        duration: 30,
        description: '',
        exercises: [],
        calories: 0
      },
      allExercises: [],
      difficultyOptions: ['入门', '初级', '中级', '高级'],
      recommendPlans: [
        {
          name: '全身燃脂',
          difficulty: '初级',
          description: '适合新手，快速燃脂',
          duration: 20,
          exercises: [1, 2, 3, 4]
        },
        {
          name: '核心强化',
          difficulty: '中级',
          description: '锻炼核心肌群，增强稳定性',
          duration: 25,
          exercises: [2, 4, 11, 16]
        },
        {
          name: '上肢力量',
          difficulty: '中级',
          description: '锻炼胸、背、手臂',
          duration: 30,
          exercises: [1, 6, 7, 9]
        },
        {
          name: '下肢塑形',
          difficulty: '初级',
          description: '腿部臀部训练',
          duration: 25,
          exercises: [3, 5, 8, 12]
        }
      ]
    };
  },

  onLoad() {
    this.loadPlans();
    this.loadExercises();
  },

  onShow() {
    this.loadPlans();
  },

  methods: {
    loadPlans() {
      try {
        const plans = uni.getStorageSync('workoutPlans') || [];
        this.plans = plans;
      } catch (e) {
        console.error('加载计划失败:', e);
      }
    },

    loadExercises() {
      this.allExercises = getExercises();
    },

    getPlanIcon(difficulty) {
      const icons = {
        'beginner': '🌱',
        'intermediate': '💪',
        'advanced': '🔥',
        'expert': '👑'
      };
      return icons[difficulty] || '📋';
    },

    getRecIcon(index) {
      const icons = ['🔥', '💪', '🏋️', '🦵'];
      return icons[index] || '📋';
    },

    togglePlanExpand(index) {
      this.expandedPlanIndex = this.expandedPlanIndex === index ? -1 : index;
    },

    createPlan() {
      this.isEditing = false;
      this.currentPlan = {
        id: '',
        name: '',
        difficulty: 'beginner',
        duration: 30,
        description: '',
        exercises: [],
        calories: 0
      };
      this.showPlanModal = true;
    },

    editPlan(plan) {
      this.isEditing = true;
      this.currentPlan = {
        id: plan.id,
        name: plan.name,
        difficulty: plan.difficulty,
        duration: plan.duration,
        description: plan.description,
        exercises: plan.exercises || [],
        calories: plan.calories || 0
      };
      this.showPlanModal = true;
    },

    deletePlan(plan) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个计划吗？',
        success: (res) => {
          if (res.confirm) {
            const plans = this.plans.filter((p) => p.id !== plan.id);
            this.plans = plans;
            uni.setStorageSync('workoutPlans', plans);
            uni.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },

    savePlan() {
      if (!this.currentPlan.name.trim()) {
        uni.showToast({
          title: '请输入计划名称',
          icon: 'none'
        });
        return;
      }

      if (this.currentPlan.exercises.length === 0) {
        uni.showToast({
          title: '请选择至少一个动作',
          icon: 'none'
        });
        return;
      }

      const plan = {
        id: this.currentPlan.id || generateId(),
        name: this.currentPlan.name,
        difficulty: this.currentPlan.difficulty,
        duration: parseInt(this.currentPlan.duration) || 30,
        description: this.currentPlan.description,
        exercises: this.currentPlan.exercises,
        calories: this.currentPlan.exercises.length * 50,
        createdAt: Date.now()
      };

      let plans;
      if (this.isEditing) {
        plans = this.plans.map((p) => {
          return p.id === plan.id ? plan : p;
        });
      } else {
        plans = this.plans;
        plans.push(plan);
      }

      this.plans = plans;
      uni.setStorageSync('workoutPlans', plans);
      this.hidePlanModal();
      
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
    },

    selectExercises() {
      this.showExerciseSelectModal = true;
    },

    toggleExercise(exercise) {
      const index = this.currentPlan.exercises.findIndex((ex) => ex.id === exercise.id);

      if (index > -1) {
        this.currentPlan.exercises.splice(index, 1);
      } else {
        const sets = 4;
        const reps = 12;
        const weight = 0;
        // 初始化组详情
        const setDetails = [];
        for (let i = 0; i < sets; i++) {
          setDetails.push({
            weight: weight,
            reps: reps
          });
        }
        this.currentPlan.exercises.push({
          id: exercise.id,
          name: exercise.name,
          part: exercise.part,
          sets: sets,
          reps: reps,
          weight: weight,
          exerciseType: 'freeweight',
          setDetails: setDetails
        });
      }
    },

    isSelected(exercise) {
      return this.currentPlan.exercises.some((ex) => ex.id === exercise.id);
    },

    confirmExerciseSelect() {
      this.showExerciseSelectModal = false;
    },

    onDifficultyChange(e) {
      this.currentPlan.difficulty = ['beginner', 'intermediate', 'advanced', 'expert'][e.detail.value];
    },

    getDifficultyText(difficulty) {
      const map = {
        'beginner': '入门',
        'intermediate': '中级',
        'advanced': '高级',
        'expert': '专家'
      };
      return map[difficulty] || difficulty;
    },

    usePlan(plan) {
      uni.showModal({
        title: '开始计划',
        content: `确定要开始 "${plan.name}" 这个训练计划吗？`,
        success: (res) => {
          if (res.confirm) {
            const currentWorkout = {
              exercises: plan.exercises.map((ex) => {
                const sets = ex.sets || 4;
                const reps = ex.reps || 12;
                const weight = ex.weight || 0;
                // 初始化组详情
                const setDetails = [];
                for (let i = 0; i < sets; i++) {
                  setDetails.push({
                    weight: weight,
                    reps: reps
                  });
                }
                return {
                  id: ex.id,
                  name: ex.name,
                  part: ex.part,
                  sets: sets,
                  reps: reps,
                  weight: weight,
                  exerciseType: ex.exerciseType || 'freeweight',
                  completedSets: 0,
                  folded: true,
                  setDetails: setDetails
                };
              })
            };
            uni.setStorageSync('currentWorkout', currentWorkout);
            uni.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      });
    },

    useRecommendPlan(item) {
      const exercises = item.exercises.map((exId) => {
        const exercise = this.allExercises.find((ex) => ex.id === exId);
        if (exercise) {
          const sets = 4;
          const reps = 12;
          const weight = 0;
          // 初始化组详情
          const setDetails = [];
          for (let i = 0; i < sets; i++) {
            setDetails.push({
              weight: weight,
              reps: reps
            });
          }
          return {
            id: exercise.id,
            name: exercise.name,
            part: exercise.part,
            sets: sets,
            reps: reps,
            weight: weight,
            exerciseType: 'freeweight',
            completedSets: 0,
            folded: true,
            setDetails: setDetails
          };
        }
        return null;
      }).filter((ex) => ex !== null);

      uni.showModal({
        title: '开始计划',
        content: `确定要开始 "${item.name}" 这个训练计划吗？`,
        success: (res) => {
          if (res.confirm) {
            const currentWorkout = { exercises: exercises };
            uni.setStorageSync('currentWorkout', currentWorkout);
            uni.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      });
    },

    hidePlanModal() {
      this.showPlanModal = false;
    },

    hideExerciseSelectModal() {
      this.showExerciseSelectModal = false;
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  padding: 32rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24rpx;
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

/* 创建按钮 */
.create-section {
  margin-bottom: 32rpx;
}

.create-btn {
  width: 100%;
  padding: 28rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.btn-icon {
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 300;
}

.btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 区域 */
.section {
  margin-bottom: 32rpx;
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

/* 计划列表 */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.plan-card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  overflow: hidden;
  transition: all 0.3s ease;
}

.plan-main {
  display: flex;
  align-items: center;
  padding: 24rpx;
}

.plan-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.plan-icon.beginner {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
}

.plan-icon.intermediate {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
}

.plan-icon.advanced {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.plan-icon.expert {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.plan-info {
  flex: 1;
}

.plan-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.plan-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  margin-right: 16rpx;
}

.plan-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.plan-tag.beginner {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.plan-tag.intermediate {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.plan-tag.advanced {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.plan-tag.expert {
  background-color: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.plan-stats {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  font-size: 24rpx;
}

.stat-text {
  font-size: 24rpx;
  color: var(--text-secondary);
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

/* 计划详情 */
.plan-detail {
  padding: 0 24rpx 24rpx;
  border-top: 1rpx solid var(--border);
}

.plan-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  padding: 20rpx 0;
  display: block;
}

.exercise-preview {
  margin-bottom: 20rpx;
}

.preview-title {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
  display: block;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.preview-item {
  padding: 10rpx 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
  font-size: 24rpx;
  color: var(--text);
}

.preview-more {
  padding: 10rpx 20rpx;
  background-color: var(--primary-light);
  border-radius: 12rpx;
  font-size: 24rpx;
  color: var(--primary);
}

.plan-actions {
  display: flex;
  gap: 16rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid var(--border);
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  font-size: 26rpx;
  border-radius: 50rpx;
  border: none;
}

.action-btn.secondary {
  background-color: var(--background-tertiary);
  color: var(--text);
}

.action-btn.danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.action-btn.primary {
  flex: 2;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #ffffff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: var(--text);
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 推荐区域 */
.recommend-section {
  margin-top: 40rpx;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.recommend-card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 20rpx;
  padding: 24rpx;
  transition: all 0.2s ease;
}

.recommend-card:active {
  transform: scale(0.98);
  background-color: var(--background-tertiary);
}

.rec-icon {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, var(--primary-light) 0%, rgba(14, 165, 233, 0.2) 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.rec-content {
  display: flex;
  flex-direction: column;
}

.rec-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8rpx;
}

.rec-desc {
  font-size: 22rpx;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.rec-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.rec-tag {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  align-self: flex-start;
}

.rec-tag.初级 {
  background-color: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.rec-tag.中级 {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.rec-tag.高级 {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.rec-info {
  font-size: 20rpx;
  color: var(--text-tertiary);
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 32rpx 32rpx 0 0;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  color: var(--text);
}

.exercise-select-content {
  max-height: 90vh;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid var(--border);
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
}

.close-btn {
  font-size: 48rpx;
  color: var(--text-secondary);
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 12rpx;
  display: block;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background-color: var(--background-tertiary);
  color: var(--text);
}

.form-textarea {
  width: 100%;
  padding: 24rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  font-size: 28rpx;
  min-height: 160rpx;
  box-sizing: border-box;
  background-color: var(--background-tertiary);
  color: var(--text);
}

.picker {
  padding: 24rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  font-size: 28rpx;
  color: var(--text);
  background-color: var(--background-tertiary);
}

.select-btn {
  width: 100%;
  padding: 24rpx;
  font-size: 28rpx;
  background-color: var(--background-tertiary);
  color: var(--text);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid var(--border);
  display: flex;
  gap: 20rpx;
}

.modal-footer button {
  flex: 1;
  padding: 24rpx;
  font-size: 28rpx;
  border-radius: 50rpx;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #ffffff;
}

.btn-secondary {
  background-color: var(--background-tertiary);
  color: var(--text);
}

.exercise-select-list {
  max-height: 500rpx;
  overflow-y: auto;
}

.exercise-select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid var(--border);
}

.exercise-select-item:last-child {
  border-bottom: none;
}

.exercise-info {
  display: flex;
  flex-direction: column;
}

.exercise-info .exercise-name {
  font-size: 28rpx;
  color: var(--text);
  margin-bottom: 4rpx;
}

.exercise-info .exercise-part {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.check-mark {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 2rpx solid var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  font-size: 24rpx;
  background-color: transparent;
}

.check-mark.checked {
  background: linear-gradient(135deg, var(--success) 0%, #16a34a 100%);
  border-color: var(--success);
  color: #ffffff;
}
</style>
