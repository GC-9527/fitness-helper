<template>
  <view class="container" :style="themeStyle">
    <!-- 自定义导航栏 -->
    <custom-navbar title="我的"></custom-navbar>

    <view class="card profile-card">
      <view class="avatar-section">
        <view class="avatar">💪</view>
        <view class="nickname">{{profile.nickname || '健身达人'}}</view>
      </view>
    </view>

    <view class="card">
      <view class="header">
        <text class="title">身体数据</text>
        <view class="edit-button" @click="showEditModal">
          <text class="edit-button-text">编辑</text>
        </view>
      </view>
      <view class="data-grid">
        <view class="data-item">
          <view class="data-label">身高</view>
          <view class="data-value-row">
            <text class="data-value">{{profile.height || 170}}</text>
            <text class="data-unit">cm</text>
          </view>
        </view>
        <view class="data-item">
          <view class="data-label">体重</view>
          <view class="data-value-row">
            <text class="data-value">{{profile.weight || 65}}</text>
            <text class="data-unit">kg</text>
          </view>
        </view>
        <view class="data-item">
          <view class="data-label">年龄</view>
          <view class="data-value-row">
            <text class="data-value">{{profile.age || 25}}</text>
            <text class="data-unit">岁</text>
          </view>
        </view>
        <view class="data-item">
          <view class="data-label">性别</view>
          <view class="data-value-row">
            <text class="data-value">{{profile.gender || '男'}}</text>
          </view>
        </view>
        <view class="data-item">
          <view class="data-label-container">
            <text class="data-label">体型</text>
            <view class="question-mark" @click="toggleSomatotypeTips">
              <text class="question-mark-text">?</text>
            </view>
          </view>
          <view class="data-value-row">
            <text class="data-value">{{profile.somatotypeText || '中胚型'}}</text>
          </view>
        </view>
        <view class="data-item">
          <view class="data-label">活动水平</view>
          <view class="data-value-row">
            <text class="data-value">{{profile.activityLevelText || '久坐不动'}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能入口卡片 -->
    <view class="card feature-card">
      <view class="header">
        <text class="title">功能入口</text>
      </view>
      <view class="feature-grid">
        <view class="feature-item" @click="goToAnalytics">
          <view class="feature-icon">📊</view>
          <text class="feature-text">数据分析</text>
        </view>
        <view class="feature-item" @click="goToAchievements">
          <view class="feature-icon">🏆</view>
          <text class="feature-text">成就系统</text>
        </view>
        <view class="feature-item" @click="goToSettings">
          <view class="feature-icon">⚙️</view>
          <text class="feature-text">设置</text>
        </view>
        <view class="feature-item" @click="showHelp">
          <view class="feature-icon">📖</view>
          <text class="feature-text">使用帮助</text>
        </view>
      </view>
    </view>
    
    <!-- 编辑资料弹窗 -->
    <view class="modal-mask" v-if="showEdit">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">编辑身体数据</text>
          <text class="close-btn" @click="hideEditModal">×</text>
        </view>
        <view class="modal-content">
          <view class="form-list">
            <view class="form-item">
              <text class="form-label">昵称</text>
              <view class="input-container" @click="focusInput('nickname')">
                <input 
                  id="profile-nickname"
                  name="nickname"
                  class="form-input" 
                  v-model="profile.nickname" 
                  placeholder="请输入昵称" 
                  :focus="focusIndex === 'nickname'"
                  @blur="blurInput"
                />
              </view>
            </view>
            <view class="form-item">
              <text class="form-label">身高</text>
              <view class="input-container" @click="focusInput('height')">
                <input 
                  id="profile-height"
                  name="height"
                  class="form-input" 
                  type="number" 
                  v-model="profile.height" 
                  placeholder="170" 
                  :focus="focusIndex === 'height'"
                  @blur="blurInput"
                />
              </view>
            </view>
            <view class="form-item">
              <text class="form-label">体重</text>
              <view class="input-container" @click="focusInput('weight')">
                <input 
                  id="profile-weight"
                  name="weight"
                  class="form-input" 
                  type="number" 
                  v-model="profile.weight" 
                  placeholder="65" 
                  :focus="focusIndex === 'weight'"
                  @blur="blurInput"
                />
              </view>
            </view>
            <view class="form-item">
              <text class="form-label">年龄</text>
              <view class="input-container" @click="focusInput('age')">
                <input 
                  id="profile-age"
                  name="age"
                  class="form-input" 
                  type="number" 
                  v-model="profile.age" 
                  placeholder="25" 
                  :focus="focusIndex === 'age'"
                  @blur="blurInput"
                />
              </view>
            </view>
            <view class="form-item">
              <text class="form-label">性别</text>
              <view class="input-container">
                <picker mode="selector" :range="genders" :value="genderIndex" @change="onGenderChange">
                  <view class="picker">{{profile.gender || '请选择'}}</view>
                </picker>
              </view>
            </view>
            <view class="form-item">
              <view class="form-label-container">
                <text class="form-label">体型</text>
                <view class="question-mark" @click="showSomatotypeTips = true">
                  <text class="question-mark-text">?</text>
                </view>
              </view>
              <view class="input-container">
                <picker mode="selector" :range="somatotypes" :value="somatotypeIndex" @change="onSomatotypeChange">
                  <view class="picker">{{profile.somatotypeText || '请选择'}}</view>
                </picker>
              </view>
            </view>
            <view class="form-item">
              <text class="form-label">活动水平</text>
              <view class="input-container">
                <picker mode="selector" :range="activityLevels" :value="activityLevelIndex" @change="onActivityLevelChange">
                  <view class="picker">{{profile.activityLevelText || '请选择'}}</view>
                </picker>
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="hideEditModal">取消</button>
          <button class="modal-btn confirm-btn" @click="saveEdit">保存</button>
        </view>
      </view>
    </view>
    
    <!-- 体型判断标准弹窗 -->
    <view class="modal-mask" v-if="showSomatotypeTips">
      <view class="somatotype-tips-modal">
        <view class="modal-header">
          <text class="modal-title">体型判断标准</text>
          <text class="close-btn" @click="showSomatotypeTips = false">×</text>
        </view>
        <view class="modal-content">
          <view class="tips-content">
            <view class="tip-section">
              <text class="tip-title">手腕环绕测试（10秒自测）</text>
              <text class="tip-text">用一只手的中指 + 拇指，环绕另一只手的手腕最细处（尺骨/桡骨突出点）：</text>
              <text class="tip-text">- 两指能重叠 → 外胚型倾向（骨架小、关节细）</text>
              <text class="tip-text">- 两指刚好相触 → 中胚型倾向（骨架匀称）</text>
              <text class="tip-text">- 两指碰不到 → 内胚型倾向（骨架大、关节粗）</text>
            </view>
            <view class="tip-section">
              <text class="tip-title">外胚型（瘦长型）</text>
              <text class="tip-text">- 体型瘦长，骨架小</text>
              <text class="tip-text">- 难以增重，肌肉增长缓慢</text>
              <text class="tip-text">- 代谢率高，容易保持低体脂</text>
              <text class="tip-text">- 肩膀窄，四肢修长</text>
            </view>
            <view class="tip-section">
              <text class="tip-title">中胚型（肌肉型）</text>
              <text class="tip-text">- 体型匀称，骨架适中</text>
              <text class="tip-text">- 容易增肌，肌肉增长迅速</text>
              <text class="tip-text">- 代谢率中等，体脂容易控制</text>
              <text class="tip-text">- 肩膀宽，四肢健壮</text>
            </view>
            <view class="tip-section">
              <text class="tip-title">内胚型（肥胖型）</text>
              <text class="tip-text">- 体型圆润，骨架较大</text>
              <text class="tip-text">- 容易增重，包括肌肉和脂肪</text>
              <text class="tip-text">- 代谢率较低，容易储存脂肪</text>
              <text class="tip-text">- 肩膀宽，四肢粗壮</text>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn confirm-btn" @click="showSomatotypeTips = false">我知道了</button>
        </view>
      </view>
    </view>

    <view class="card bmi-card">
      <view class="header">
        <text class="title">BMI 指数</text>
      </view>
      <view class="bmi-content">
        <view class="bmi-circle" :class="bmiClass">
          <text class="bmi-value">{{bmi}}</text>
          <text class="bmi-label">{{bmiStatus}}</text>
        </view>
        <view class="bmi-scale">
          <view class="scale-bar">
            <view class="scale-indicator" :style="{left: bmiPosition + '%'}"></view>
          </view>
          <view class="scale-labels">
            <text>偏瘦</text>
            <text>正常</text>
            <text>超重</text>
            <text>肥胖</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="header">
        <text class="title">健身目标</text>
      </view>
      <view class="goal-list">
        <view 
          class="goal-item" 
          :class="profile.goal === item.value ? 'active' : ''"
          v-for="item in goals" 
          :key="item.value"
          @click="setGoal(item.value)"
        >
          <text class="goal-icon">{{item.icon}}</text>
          <text class="goal-text">{{item.text}}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="header" @click="toggleStats">
        <text class="title">训练统计</text>
        <view class="toggle-btn">
          <text>{{ showStats ? '收起' : '展开' }}</text>
          <text class="toggle-icon">{{ showStats ? '▼' : '▶' }}</text>
        </view>
      </view>
      <view class="stats-grid" v-if="showStats">
        <view class="stat-item">
          <text class="stat-value">{{totalWorkouts}}</text>
          <text class="stat-label">总训练次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{totalDuration}}</text>
          <text class="stat-label">总时长(分钟)</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{totalCalories}}</text>
          <text class="stat-label">消耗卡路里</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{longestStreak}}</text>
          <text class="stat-label">最长连续(天)</text>
        </view>
      </view>
    </view>



    <view class="card tips-card">
      <view class="tips-title">💡 健身小贴士</view>
      <view class="tips-content">{{currentTip}}</view>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        nickname: '',
        height: 170,
        weight: 65,
        age: 25,
        gender: '男',
        goal: 'keep',
        somatotype: 'mesomorph',
        somatotypeText: '中胚型',
        activityLevel: 1.2,
        activityLevelText: '久坐不动（几乎不运动）'
      },
      goals: [
        { value: 'lose', text: '减脂塑形', icon: '🔥' },
        { value: 'gain', text: '增肌增重', icon: '💪' },
        { value: 'keep', text: '保持健康', icon: '❤️' },
        { value: 'strength', text: '提升力量', icon: '🏋️' }
      ],
      genders: ['男', '女'],
      somatotypes: ['外胚型', '中胚型', '内胚型'],
      somatotypeValues: ['ectomorph', 'mesomorph', 'endomorph'],
      activityLevels: [
        '久坐不动（几乎不运动）',
        '轻度活动（每周1-3次运动）',
        '中度活动（每周3-5次运动）',
        '高度活动（每周6-7次运动）',
        '极度活动（体力劳动或每日高强度运动）'
      ],
      activityLevelValues: [1.2, 1.375, 1.55, 1.725, 1.9],
      // 选择器索引
      genderIndex: 0,
      somatotypeIndex: 1,
      activityLevelIndex: 0,
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0,
      longestStreak: 0,
      tips: [
        '每天保持7-8小时睡眠，有助于肌肉恢复',
        '训练前后要充分热身和拉伸',
        '保持每天2-3升的水分摄入',
        '蛋白质摄入要充足，每公斤体重1.5-2克',
        '循序渐进，不要急于求成',
        '记录训练进度，见证自己的成长',
        '适当休息，过度训练反而有害',
        '保持积极心态，享受健身过程'
      ],
      currentTip: '',
      focusIndex: '',
      showEdit: false,
      showSomatotypeTips: false,
      showStats: false
    };
  },

  computed: {
    bmi() {
      const height = this.profile.height / 100;
      const weight = this.profile.weight;
      if (height > 0 && weight > 0) {
        return (weight / (height * height)).toFixed(1);
      }
      return '0.0';
    },
    bmiStatus() {
      const bmi = parseFloat(this.bmi);
      if (bmi < 18.5) return '偏瘦';
      if (bmi < 24) return '正常';
      if (bmi < 28) return '超重';
      return '肥胖';
    },
    bmiClass() {
      const bmi = parseFloat(this.bmi);
      if (bmi < 18.5) return 'underweight';
      if (bmi < 24) return 'normal';
      if (bmi < 28) return 'overweight';
      return 'obese';
    },
    bmiPosition() {
      const bmi = parseFloat(this.bmi);
      if (bmi <= 18.5) return (bmi / 18.5) * 25;
      if (bmi <= 24) return 25 + ((bmi - 18.5) / 5.5) * 25;
      if (bmi <= 28) return 50 + ((bmi - 24) / 4) * 25;
      return 75 + Math.min(((bmi - 28) / 10) * 25, 25);
    }
  },

  onLoad() {
    this.loadProfile();
    this.loadStats();
    this.randomTip();
  },

  onShow() {
    this.loadStats();
  },

  methods: {
    loadProfile() {
      try {
        const profile = uni.getStorageSync('userProfile');
        if (profile) {
          this.profile = { ...this.profile, ...profile };
          
          // 设置选择器索引
          this.genderIndex = this.genders.indexOf(this.profile.gender) || 0;
          this.somatotypeIndex = this.somatotypes.indexOf(this.profile.somatotypeText) || 1;
          this.activityLevelIndex = this.activityLevels.indexOf(this.profile.activityLevelText) || 0;
        }
      } catch (e) {
        console.error('加载资料失败:', e);
      }
    },

    saveProfile() {
      try {
        uni.setStorageSync('userProfile', this.profile);
        uni.showToast({ title: '已保存', icon: 'success' });
      } catch (e) {
        console.error('保存资料失败:', e);
      }
    },

    loadStats() {
      try {
        const history = uni.getStorageSync('workoutHistory') || [];
        const checkIns = uni.getStorageSync('checkIns') || {};
        
        this.totalWorkouts = history.length;
        this.totalDuration = history.reduce((sum, item) => sum + (item.duration || 0), 0);
        this.totalCalories = Math.round(this.totalDuration * 7);
        
        let maxStreak = 0;
        let currentStreak = 0;
        const dates = Object.keys(checkIns).sort();
        for (let i = 0; i < dates.length; i++) {
          if (i === 0) {
            currentStreak = 1;
          } else {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
          }
          maxStreak = Math.max(maxStreak, currentStreak);
        }
        this.longestStreak = maxStreak;
      } catch (e) {
        console.error('加载统计失败:', e);
      }
    },

    setGoal(goal) {
      this.profile.goal = goal;
      this.saveProfile();
    },

    onGenderChange(e) {
      const index = e.detail.value;
      this.genderIndex = index;
      this.profile.gender = this.genders[index];
    },
    
    onSomatotypeChange(e) {
      const index = e.detail.value;
      this.somatotypeIndex = index;
      this.profile.somatotype = this.somatotypeValues[index];
      this.profile.somatotypeText = this.somatotypes[index];
    },
    
    onActivityLevelChange(e) {
      const index = e.detail.value;
      this.activityLevelIndex = index;
      this.profile.activityLevel = this.activityLevelValues[index];
      this.profile.activityLevelText = this.activityLevels[index];
    },

    randomTip() {
      this.currentTip = this.tips[Math.floor(Math.random() * this.tips.length)];
    },

    toggleStats() {
      this.showStats = !this.showStats;
    },

    focusInput(field) {
      this.focusIndex = field;
    },

    blurInput() {
      setTimeout(() => {
        this.focusIndex = '';
      }, 200);
    },

    // 跳转到数据分析页面
    goToAnalytics() {
      uni.navigateTo({
        url: '/pages/analytics/analytics'
      });
    },

    // 跳转到成就系统页面
    goToAchievements() {
      uni.navigateTo({
        url: '/pages/achievements/achievements'
      });
    },

    // 跳转到设置页面
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      });
    },

    // 显示使用帮助
    showHelp() {
      uni.showModal({
        title: '使用帮助',
        content: '欢迎使用健身助手！\n\n1. 记录每日训练计划和完成情况\n2. 查看身体数据和BMI指数\n3. 追踪训练统计和连续打卡\n4. 个性化设置启动图片\n\n如有问题请联系客服。',
        showCancel: false,
        confirmText: '我知道了'
      });
    },
    
    // 显示编辑弹窗
    showEditModal() {
      this.showEdit = true;
    },
    
    // 隐藏编辑弹窗
    hideEditModal() {
      this.showEdit = false;
    },
    
    // 保存编辑数据
    saveEdit() {
      this.saveProfile();
      this.hideEditModal();
    },
    
    // 显示体型判断标准
    toggleSomatotypeTips() {
      this.showSomatotypeTips = true;
    }
  }
};
</script>

<style scoped>
@import '../../static/css/variables.css';

.container {
  padding: 0 20rpx 20rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
}

.card {
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  margin-top: 20rpx;
}

.card:first-of-type {
  margin-top: 20rpx;
}

.profile-card {
  text-align: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 40rpx 30rpx;
  margin-bottom: 24rpx;
}

.avatar-section {
  padding: 0;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  background-color: var(--surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin: 0 auto 12rpx;
  border: 3rpx solid var(--border-light);
}

.nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.header {
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.data-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
    margin: 0;
  }

  .data-item {
    background-color: var(--background-tertiary);
    border: 1rpx solid var(--border);
    padding: 16rpx 8rpx;
    border-radius: 10rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100rpx;
  }

  .data-label {
    font-size: 20rpx;
    color: var(--text-secondary);
    margin-bottom: 6rpx;
    font-weight: 500;
  }

  .data-value-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: wrap;
  }

  .data-value {
    font-size: 28rpx;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .data-unit {
    font-size: 18rpx;
    color: var(--text-secondary);
    margin-left: 2rpx;
    font-weight: 400;
  }

.bmi-card {
  background-color: var(--background-secondary);
  padding: 24rpx;
}

.bmi-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30rpx;
}

.bmi-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bmi-circle.underweight {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.bmi-circle.normal {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.bmi-circle.overweight {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.bmi-circle.obese {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.bmi-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--text);
}

.bmi-label {
  font-size: 20rpx;
  color: var(--text-secondary);
  margin-top: 4rpx;
}

.bmi-scale {
  flex: 1;
}

.scale-bar {
  height: 12rpx;
  background: linear-gradient(90deg, var(--info) 0%, var(--success) 33%, var(--warning) 66%, var(--danger) 100%);
  border-radius: 6rpx;
  position: relative;
}

.scale-indicator {
  position: absolute;
  top: -6rpx;
  width: 24rpx;
  height: 24rpx;
  background-color: var(--text);
  border-radius: 50%;
  border: 3rpx solid var(--primary);
  transform: translateX(-50%);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  font-size: 18rpx;
  color: var(--text-secondary);
}

.goal-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.goal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 8rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 10rpx;
  transition: all 0.2s ease;
}

.goal-item.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-color: var(--primary);
}

.goal-icon {
  font-size: 28rpx;
  margin-bottom: 6rpx;
}

.goal-text {
  font-size: 20rpx;
  color: var(--text);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  margin-top: 16rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 10rpx;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 18rpx;
  color: var(--text-secondary);
  text-align: center;
}

.form-list {
  padding: 10rpx 0;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 120rpx;
  font-size: 28rpx;
  color: var(--text);
}

.input-container {
  flex: 1;
  background-color: var(--background-tertiary);
}

.input-container input {
  width: 100%;
  text-align: right;
  font-size: 28rpx;
  color: var(--text);
  caret-color: var(--text-secondary);
}

.form-input {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: var(--text);
}

.picker {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: var(--text);
  padding: 10rpx 0;
}

.tips-card {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 20rpx 24rpx;
}

.tips-title {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.tips-content {
  font-size: 22rpx;
  color: var(--text);
  line-height: 1.5;
  opacity: 0.95;
}

  /* 编辑弹窗样式 */
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    backdrop-filter: blur(8rpx);
  }

  .edit-modal {
    width: 85%;
    max-width: 550rpx;
    background-color: var(--background-secondary);
    border: 1rpx solid var(--border);
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    z-index: 999999;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid var(--border);
    background-color: var(--background-secondary);
  }

  .modal-title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--text);
  }

  .close-btn {
    font-size: 40rpx;
    color: var(--text-secondary);
    line-height: 1;
  }

  .modal-content {
    padding: 24rpx;
    background-color: var(--background-secondary);
  }

  .form-list {
    padding: 8rpx 0;
  }

  .form-item {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1rpx solid var(--border);
  }

  .form-item:last-child {
    border-bottom: none;
  }

  .form-label {
    width: 100rpx;
    font-size: 24rpx;
    color: var(--text);
  }

  .input-container {
    flex: 1;
    background-color: var(--background-tertiary);
    border: 1rpx solid var(--border);
    border-radius: 6rpx;
    padding: 12rpx;
  }

  .form-input {
    width: 100%;
    text-align: right;
    font-size: 24rpx;
    color: var(--text);
    caret-color: var(--text-secondary);
    background-color: var(--background-tertiary);
    border: none;
  }

  .picker {
    flex: 1;
    text-align: right;
    font-size: 24rpx;
    color: var(--text);
    padding: 8rpx 0;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 24rpx;
    border-top: 1rpx solid var(--border);
    background-color: var(--background-secondary);
  }

  .modal-btn {
    flex: 1;
    padding: 16rpx;
    border-radius: 10rpx;
    font-size: 24rpx;
    font-weight: 600;
    border: none;
  }

  .cancel-btn {
    margin-right: 16rpx;
    background-color: var(--border);
    color: var(--text);
  }

  .confirm-btn {
    background-color: var(--primary);
    color: var(--text);
  }

  /* 编辑按钮样式 */
  .edit-button {
    padding: 6rpx 12rpx;
    background-color: var(--primary);
    border-radius: 6rpx;
  }

  .edit-button-text {
    font-size: 20rpx;
    color: var(--text);
  }

  /* 体型判断标准相关样式 */
  .data-label-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .form-label-container {
    display: flex;
    align-items: center;
    width: 100rpx;
  }

  .question-mark {
    width: 28rpx;
    height: 28rpx;
    border-radius: 50%;
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8rpx;
    cursor: pointer;
  }

  .question-mark-text {
    font-size: 20rpx;
    font-weight: bold;
    color: var(--text);
  }

  .somatotype-tips-modal {
    width: 85%;
    max-width: 600rpx;
    background-color: var(--background-secondary);
    border: 1rpx solid var(--border);
    border-radius: 16rpx;
    overflow: hidden;
    position: relative;
    z-index: 999999;
  }

  .tips-content {
    padding: 20rpx 0;
  }

  .tip-section {
    margin-bottom: 24rpx;
    padding: 16rpx;
    background-color: var(--background-tertiary);
    border-radius: 12rpx;
  }

  .tip-title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12rpx;
    display: block;
  }

  .tip-text {
    font-size: 24rpx;
    color: var(--text-secondary);
    line-height: 1.6;
    display: block;
    margin-bottom: 8rpx;
  }

  .tip-text:last-child {
    margin-bottom: 0;
  }

  /* 功能入口卡片样式 */
  .feature-card {
    background-color: var(--background-secondary);
    padding: 24rpx;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12rpx;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20rpx 8rpx;
    background-color: var(--background-tertiary);
    border: 1rpx solid var(--border);
    border-radius: 12rpx;
    transition: all 0.2s ease;
  }

  .feature-item:active {
    background-color: var(--surface-hover);
    transform: scale(0.95);
  }

  .feature-icon {
    font-size: 36rpx;
    margin-bottom: 8rpx;
  }

  .feature-text {
    font-size: 22rpx;
    color: var(--text);
    font-weight: 500;
  }

  /* 折叠按钮样式 */
  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    color: var(--primary);
    font-size: 28rpx;
    font-weight: 600;
    cursor: pointer;
  }

  .toggle-icon {
    font-size: 24rpx;
    transition: transform 0.3s ease;
  }

</style>
