<template>
  <view class="container" :style="themeStyle">
    <!-- 顶部栏：标题 + 我的计划 -->
    <view class="top-bar">
      <view class="header-section">
        <text class="title">减脂计划</text>
        <text class="subtitle">选择适合你的减脂方案</text>
      </view>
      
      <!-- 我的计划按钮 -->
      <view class="my-plans-btn" @click="showSavedPlans = !showSavedPlans">
        <text class="my-plans-text">我的计划</text>
        <text class="my-plans-count" v-if="savedPlans.length > 0">{{ savedPlans.length }}</text>
        <text class="my-plans-arrow">{{ showSavedPlans ? '▼' : '▶' }}</text>
      </view>
    </view>

    <!-- 我的计划展开列表 -->
    <view class="my-plans-expand" v-if="showSavedPlans">
      <view class="my-plans-header">
        <text class="my-plans-title">我的计划</text>
        <text class="my-plans-close" @click="showSavedPlans = false">×</text>
      </view>
      <view class="saved-plans-list" v-if="savedPlans.length > 0">
        <view class="saved-plan-item" v-for="plan in savedPlans" :key="plan.id">
          <view class="plan-info">
            <text class="plan-name">{{ plan.planName }}</text>
            <text class="plan-date">{{ new Date(plan.createTime).toLocaleDateString() }}</text>
          </view>
          <view class="plan-actions">
            <button class="btn-small btn-primary" @click="loadPlan(plan)">查看</button>
            <button class="btn-small btn-danger" @click="deletePlan(plan.id)">删除</button>
          </view>
        </view>
      </view>
      <view class="no-plans-tip" v-else>
        <text class="no-plans-text">暂无保存的计划</text>
        <text class="no-plans-desc">生成计划后会自动保存到这里</text>
      </view>
    </view>

    <!-- 方案选择 -->
    <view class="card plan-card">
      <view class="plan-options">
        <view 
          class="plan-option" 
          v-for="(plan, index) in fatlossPlans" 
          :key="index"
          :class="{ active: selectedPlanIndex === index }"
        >
          <view class="plan-content" @click="selectPlan(index)">
            <view class="plan-header">
              <text class="plan-name">{{ plan.name }}</text>
              <text class="plan-tag">{{ plan.type }}</text>
            </view>
            <view class="plan-desc">{{ plan.description }}</view>
          </view>
          <button class="detail-btn" @click.stop="showPlanDetail(plan)">
            <text class="detail-btn-text">详情</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 身体数据折叠卡片 -->
    <view class="card body-data-card" :class="{ expanded: showBodyData }">
      <view class="card-header-compact" @click="showBodyData = !showBodyData">
        <view class="header-left">
          <text class="card-title-small">身体数据</text>
          <text class="body-data-summary" v-if="!showBodyData && hasBodyData">
            {{ userData.height }}cm / {{ userData.weight }}kg / {{ userData.age }}岁
          </text>
          <text class="body-data-summary warning" v-if="!showBodyData && !hasBodyData">
            未填写
          </text>
        </view>
        <view class="header-right">
          <text class="toggle-text" v-if="!hasBodyData" @click.stop="goToProfile">去填写</text>
          <text class="toggle-icon">{{ showBodyData ? '▼' : '▶' }}</text>
        </view>
      </view>
      
      <!-- 身体数据展开内容 -->
      <view class="body-data-content" v-if="showBodyData">
        <!-- 未填写身体数据提示 -->
        <view class="empty-body-data" v-if="!hasBodyData">
          <view class="empty-icon">📝</view>
          <text class="empty-text">请先完善身体数据</text>
          <text class="empty-desc">生成减脂计划需要您的身高、体重等信息</text>
          <button class="btn-outline" @click="goToProfile">前往填写</button>
        </view>
        
        <!-- 已填写的身体数据展示 -->
        <view class="user-data-display" v-else>
          <view class="data-grid">
            <view class="data-item">
              <text class="data-item-label">性别</text>
              <text class="data-item-value">{{ userData.gender === 'male' ? '男' : '女' }}</text>
            </view>
            <view class="data-item">
              <text class="data-item-label">体型</text>
              <text class="data-item-value">{{ getSomatotypeText(userData.somatotype) }}</text>
            </view>
            <view class="data-item">
              <text class="data-item-label">年龄</text>
              <text class="data-item-value">{{ userData.age }}岁</text>
            </view>
            <view class="data-item">
              <text class="data-item-label">身高</text>
              <text class="data-item-value">{{ userData.height }}cm</text>
            </view>
            <view class="data-item">
              <text class="data-item-label">体重</text>
              <text class="data-item-value">{{ userData.weight }}kg</text>
            </view>
            <view class="data-item">
              <text class="data-item-label">活动水平</text>
              <text class="data-item-value">{{ getActivityLevelText(userData.activityLevel) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    


    <!-- 生成计划按钮 -->
    <view class="generate-section">
      <button class="btn-primary" :disabled="!isFormValid" @click="generatePlan">生成减脂计划</button>
    </view>
    
    <!-- 方案详情弹窗 -->
    <view class="modal-mask" v-if="showDetailModal" @click="closeDetailModal"></view>
    <view class="detail-modal" v-if="showDetailModal">
      <view class="modal-header">
        <text class="modal-title">{{ currentDetailPlan?.name }} - 详情</text>
        <text class="close-btn" @click="closeDetailModal">×</text>
      </view>
      <view class="modal-content">
        <view class="plan-info">
          <text class="info-label">类型</text>
          <text class="info-value">{{ currentDetailPlan?.type }}</text>
        </view>
        <view class="plan-info">
          <text class="info-label">描述</text>
          <text class="info-value">{{ currentDetailPlan?.description }}</text>
        </view>

        <!-- 核心要点 -->
        <view class="detail-section">
          <text class="section-title">核心要点</text>
          <view class="detail-list">
            <view class="detail-item" v-for="(point, index) in planDetails?.corePoints" :key="index">
              <text class="point-icon">•</text>
              <text class="point-text">{{ point }}</text>
            </view>
          </view>
        </view>

        <!-- 注意事项 -->
        <view class="detail-section">
          <text class="section-title">注意事项</text>
          <view class="detail-list">
            <view class="detail-item" v-for="(note, index) in planDetails?.notes" :key="index">
              <text class="note-icon">⚠️</text>
              <text class="note-text">{{ note }}</text>
            </view>
          </view>
        </view>

        <!-- 视频链接 -->
        <view class="detail-section video-section" v-if="planDetails?.videoLinks && planDetails.videoLinks.length > 0">
          <text class="section-title">参考视频</text>
          <view class="video-list">
            <view class="video-link-card" v-for="(video, index) in planDetails.videoLinks" :key="index" @click="openVideoLink(video.url)">
              <view class="video-platform">{{ video.platform }}</view>
              <view class="video-info">
                <text class="video-title">{{ video.title }}</text>
                <text class="video-url">{{ video.url }}</text>
              </view>
              <text class="video-arrow">→</text>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import FatlossManager from '../../utils/fatlossManager';

export default {
  data() {
    return {
      // 选择的减脂方案索引
      selectedPlanIndex: 0,
      // 减脂方案列表
      fatlossPlans: [
        {
          name: "凯圣王碳水循环",
          type: "科学循环",
          description: "根据不同体型和训练计划动态调整碳水摄入量，科学减脂，适合各种人群"
        },
        {
          name: "谭成义三个月减脂",
          type: "阶段性计划",
          description: "完整的三个月减脂计划，教会你了解食物以及吃多少、吃什么、如何调整，适合想要系统学习减脂的人群"
        }
      ],
      // 已保存的计划列表
      savedPlans: [],
      // 是否显示已保存计划列表
      showSavedPlans: false,
      // 是否显示身体数据
      showBodyData: false,
      // 方案详情弹窗
      showDetailModal: false,
      // 当前显示详情的方案
      currentDetailPlan: null,
      // 用户输入数据（从userProfile读取）
      userData: {
        gender: 'male',
        somatotype: 'mesomorph',
        age: null,
        height: null,
        weight: null,
        bodyFat: null,
        activityLevel: 1.2
      },
      // 活动水平选项
      activityLevels: [
        "久坐不动（几乎不运动）",
        "轻度活动（每周1-3次运动）",
        "中度活动（每周3-5次运动）",
        "高度活动（每周6-7次运动）",
        "极度活动（体力劳动或每日高强度运动）"
      ],
      // 活动水平系数
      activityLevelValues: [1.2, 1.375, 1.55, 1.725, 1.9],
      // 体型对应值
      somatotypeValues: ['ectomorph', 'mesomorph', 'endomorph'],
      // 计算结果
      calculatedData: {
        bmr: 0,
        tdee: 0,
        targetCalories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      // 是否显示结果
      showResult: false,
      // 饮食计划
      mealPlan: [],
      // 碳水循环饮食计划
      carbCycleMealPlan: [],
      // 当前选中的碳水循环日标签
      activeCycleTab: 0,
      // 运动建议
      exerciseSuggestions: [],
      // 当前方案详情
      planDetails: null
    };
  },

  created() {
    // 初始化当前方案的详情
    const selectedPlan = this.fatlossPlans[this.selectedPlanIndex];
    const allPlanDetails = FatlossManager.getPlanDetails();
    this.planDetails = allPlanDetails[selectedPlan.name];
    
    // 加载用户数据
    this.loadUserData();
    
    // 加载已保存的计划
    this.loadSavedPlans();
  },
  
  onShow() {
    // 每次显示页面时重新加载用户数据和计划列表
    this.loadUserData();
    this.loadSavedPlans();
  },
  

  
  computed: {
    // 是否已填写身体数据
    hasBodyData() {
      return (
        this.userData.age && this.userData.age > 0 &&
        this.userData.height && this.userData.height > 0 &&
        this.userData.weight && this.userData.weight > 0
      );
    },
    // 表单是否有效
    isFormValid() {
      return this.hasBodyData;
    }
  },

  methods: {
    // 加载用户数据（从userProfile读取）
    loadUserData() {
      try {
        const profile = uni.getStorageSync('userProfile');
        if (profile) {
          // 从profile映射到userData
          this.userData = {
            gender: profile.gender === '男' ? 'male' : 'female',
            somatotype: profile.somatotype || 'mesomorph',
            age: profile.age || null,
            height: profile.height || null,
            weight: profile.weight || null,
            activityLevel: profile.activityLevel || 1.2,
            bodyFat: null
          };
        } else {
          // 重置为默认值
          this.userData = {
            gender: 'male',
            somatotype: 'mesomorph',
            age: null,
            height: null,
            weight: null,
            activityLevel: 1.2,
            bodyFat: null
          };
        }
      } catch (e) {
        console.error('加载用户数据失败:', e);
      }
    },
    
    // 跳转到个人资料页面
    goToProfile() {
      uni.switchTab({
        url: '/pages/profile/profile'
      });
    },
    
    // 获取体型文本
    getSomatotypeText(somatotype) {
      const map = {
        'ectomorph': '外胚型',
        'mesomorph': '中胚型',
        'endomorph': '内胚型'
      };
      return map[somatotype] || '中胚型';
    },
    
    // 获取活动水平文本
    getActivityLevelText(activityLevel) {
      const index = this.activityLevelValues.indexOf(activityLevel);
      if (index !== -1) {
        return this.activityLevels[index];
      }
      return '久坐不动（几乎不运动）';
    },
    

    
    loadSavedPlans() {
      this.savedPlans = FatlossManager.getPlans();
    },
    // 选择减脂方案
    selectPlan(index) {
      this.selectedPlanIndex = index;
      // 获取当前方案的详情
      const selectedPlan = this.fatlossPlans[index];
      const allPlanDetails = FatlossManager.getPlanDetails();
      this.planDetails = allPlanDetails[selectedPlan.name];
    },

    // 验证输入
    validateInput() {
      // 可以添加更详细的输入验证
    },
    
    // 加载已保存的计划
    loadPlan(plan) {
      // 使用本地存储传递数据，避免URL过长
      uni.setStorageSync('tempFatlossPlan', plan);
      
      // 跳转到结果页面
      uni.navigateTo({
        url: `/pages/fatloss-result/fatloss-result`
      });
    },
    
    // 删除已保存的计划
    deletePlan(planId) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个计划吗？',
        success: (res) => {
          if (res.confirm) {
            FatlossManager.deletePlan(planId);
            this.loadSavedPlans(); // 重新加载计划列表
            uni.showToast({
              title: '计划已删除',
              icon: 'success',
              duration: 2000
            });
          }
        }
      });
    },
    
    // 显示方案详情
    showPlanDetail(plan) {
      this.currentDetailPlan = plan;
      // 获取当前方案的详情
      const allPlanDetails = FatlossManager.getPlanDetails();
      this.planDetails = allPlanDetails[plan.name];
      this.showDetailModal = true;
    },
    
    // 关闭方案详情
    closeDetailModal() {
      this.showDetailModal = false;
      this.currentDetailPlan = null;
    },

    // 复制视频链接
    openVideoLink(url) {
      uni.setClipboardData({
        data: url,
        success: () => {
          uni.showModal({
            title: '链接已复制',
            content: '抖音链接已复制到剪贴板，请打开抖音APP粘贴访问',
            showCancel: false,
            confirmText: '我知道了'
          });
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    },

    // 计算基础代谢率（BMR）
    calculateBMR() {
      const { gender, age, height, weight } = this.userData;
      if (gender === 'male') {
        // 男性公式：BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        // 女性公式：BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
    },
    
    // 自动计算体脂率（根据身高、体重和性别）
    calculateBodyFat() {
      const { gender, height, weight } = this.userData;
      
      // 使用BMI估算体脂率的方法
      // 注意：这是一个估算值，实际体脂率可能因个体差异而不同
      const bmi = weight / Math.pow(height / 100, 2);
      
      let bodyFat;
      if (gender === 'male') {
        // 男性体脂率估算公式：
        // 体脂率(%) = 1.20 * BMI + 0.23 * 年龄 - 16.2
        bodyFat = 1.20 * bmi + 0.23 * this.userData.age - 16.2;
      } else {
        // 女性体脂率估算公式：
        // 体脂率(%) = 1.20 * BMI + 0.23 * 年龄 - 5.4
        bodyFat = 1.20 * bmi + 0.23 * this.userData.age - 5.4;
      }
      
      // 确保体脂率在合理范围内（10-50%）
      return Math.max(10, Math.min(50, bodyFat));
    },

    // 生成减脂计划
    generatePlan() {
      // 检查是否已填写身体数据
      if (!this.hasBodyData) {
        uni.showModal({
          title: '提示',
          content: '请先完善身体数据后再生成减脂计划',
          confirmText: '去填写',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.goToProfile();
            }
          }
        });
        return;
      }

      // 自动计算体脂率
      this.userData.bodyFat = this.calculateBodyFat();

      // 计算BMR和TDEE
      const bmr = this.calculateBMR();
      const tdee = bmr * this.userData.activityLevel;
      
      // 根据选择的方案计算目标热量和宏量营养素
      let targetCalories, proteinRatio, carbsRatio, fatRatio;
      const selectedPlan = this.fatlossPlans[this.selectedPlanIndex];
      
      // 根据用户体脂率动态调整热量缺口（体脂率越高，缺口越大）
      // 体脂率 < 15%: 300千卡缺口
      // 体脂率 15-25%: 400千卡缺口
      // 体脂率 > 25%: 500千卡缺口
      let calorieDeficit;
      if (this.userData.bodyFat < 15) {
        calorieDeficit = 300;
      } else if (this.userData.bodyFat < 25) {
        calorieDeficit = 400;
      } else {
        calorieDeficit = 500;
      }
      
      // 根据选择的方案生成不同的计划
      if (selectedPlan.name === '凯圣王碳水循环') {
        // 生成碳水循环计划
        this.generateCarbCyclingPlan(bmr, tdee, calorieDeficit);
        return;
      } else if (selectedPlan.name === '谭成义三个月减脂') {
        // 生成谭成义三个月减脂计划
        this.generateTanChengyiPlan(bmr, tdee, calorieDeficit);
        return;
      }
    },
    
    // 生成碳水循环计划
    generateCarbCyclingPlan(bmr, tdee, calorieDeficit) {
      // 确保体脂率已经计算
      if (!this.userData.bodyFat) {
        this.userData.bodyFat = this.calculateBodyFat();
      }
      const { weight, somatotype, age, gender, activityLevel, bodyFat } = this.userData;
      
      // 计算BMI
      const bmi = weight / Math.pow(this.userData.height / 100, 2);
      
      // 基于凯圣王减脂计划核心逻辑（参考网站：https://design.liyao.sbs/posts/tanxunhuan）
      // 1. 确定基础代谢率（已通过BMR计算）
      // 2. 根据活动水平计算总消耗热量（已通过TDEE计算）
      // 3. 设定合理的热量缺口，根据体脂率动态调整
      // 4. 精确计算每日宏量营养素摄入量
      // 5. 以周为单位进行高、中、低碳日的循环安排
      
      // 基础目标热量
      const targetCalories = tdee - calorieDeficit;
      
      // 根据不同体型调整宏量营养素比例（凯圣王精确计算方法）
      let dailyCarbs, dailyFat, dailyProtein;
      
      // 碳水化合物：根据体型调整
      if (somatotype === 'ectomorph') {
        // 外胚型（不易胖体质）：每公斤体重 3克 碳水
        dailyCarbs = weight * 3;
      } else if (somatotype === 'endomorph') {
        // 内胚型（易胖体质）：每公斤体重 2克 碳水
        dailyCarbs = weight * 2;
      } else {
        // 中胚型：每公斤体重 2.5克 碳水
        dailyCarbs = weight * 2.5;
      }
      
      // 脂肪：根据体型调整
      if (somatotype === 'ectomorph') {
        // 外胚型：每公斤体重 1.0-1.2克 脂肪
        dailyFat = weight * 1.1;
      } else if (somatotype === 'endomorph') {
        // 内胚型：每公斤体重 0.8克 脂肪
        dailyFat = weight * 0.8;
      } else {
        // 中胚型：每公斤体重 0.9克 脂肪
        dailyFat = weight * 0.9;
      }
      
      // 蛋白质：根据训练强度调整
      // 健身初期/训练强度低：0.8-1克
      // 有训练基础：1.2-1.5克
      // 不建议过量摄入蛋白质（>1.5 克）
      if (activityLevel < 1.55) {
        // 轻度活动，训练强度低
        dailyProtein = weight * 1.0;
      } else {
        // 中度及以上活动，训练强度高
        dailyProtein = weight * 1.3;
      }
      // 确保蛋白质摄入量在合理范围内
      dailyProtein = Math.min(dailyProtein, weight * 1.5);
      
      // 计算周总摄入量（凯圣王核心：以周为单位进行循环）
      const weeklyCarbs = dailyCarbs * 7;
      const weeklyFat = dailyFat * 7;
      const weeklyProtein = dailyProtein * 7;
      
      // 周循环分配（凯圣王核心：高碳2天，低碳2天，中碳3天）
      // 高碳日：总碳水量的 50% ÷ 2，总脂肪量的 15% ÷ 2
      // 低碳日：总碳水量的 15% ÷ 2，总脂肪量的 50% ÷ 2
      // 中碳日：总碳水量的 35% ÷ 3，总脂肪量的 35% ÷ 3
      // 蛋白质按体重计算，分餐摄入，7天摄入量相同
      const highDayCarbs = Math.round((weeklyCarbs * 0.5) / 2);
      const highDayFat = Math.round((weeklyFat * 0.15) / 2);
      const lowDayCarbs = Math.round((weeklyCarbs * 0.15) / 2);
      const lowDayFat = Math.round((weeklyFat * 0.5) / 2);
      const mediumDayCarbs = Math.round((weeklyCarbs * 0.35) / 3);
      const mediumDayFat = Math.round((weeklyFat * 0.35) / 3);
      
      // 计算蛋白质（固定值，不随碳水循环变化，维持肌肉量）
      const protein = Math.round(dailyProtein);
      
      // 计算各循环日的总热量
      const highCalories = Math.round(protein * 4 + highDayCarbs * 4 + highDayFat * 9);
      const mediumCalories = Math.round(protein * 4 + mediumDayCarbs * 4 + mediumDayFat * 9);
      const lowCalories = Math.round(protein * 4 + lowDayCarbs * 4 + lowDayFat * 9);
      
      // 保存计算结果
      this.calculatedData = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        protein,
        carbCycle: {
          high: highDayCarbs,
          medium: mediumDayCarbs,
          low: lowDayCarbs
        },
        fatCycle: {
          high: highDayFat,
          medium: mediumDayFat,
          low: lowDayFat
        }
      };
      
      // 生成碳水循环饮食计划
      this.generateCarbCyclingMealPlan();
      
      // 生成凯圣王专属运动建议
      this.generateKaiShengWangExerciseSuggestions();
      
      // 准备基础计划数据，融入凯圣王核心思想
      const basePlanData = {
        planName: this.fatlossPlans[this.selectedPlanIndex].name,
        somatotype: this.userData.somatotype,
        somatotypeText: this.userData.somatotype === 'ectomorph' ? '外胚型' : this.userData.somatotype === 'mesomorph' ? '中胚型' : '内胚型',
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        bodyFat: Math.round(bodyFat),
        bmi: bmi.toFixed(1),
        carbsCycle: [
          {
            type: 'high',
            typeText: '高碳日',
            calories: highCalories,
            protein: protein,
            carbs: highDayCarbs,
            fat: highDayFat,
            tips: '高碳日适合安排强度较高的训练，如力量训练或HIIT。凯圣王建议：高碳日碳水应主要来自易消化吸收的碳水（米饭、面条、馒头），避免大量粗纤维食物。高碳日是肌肉合成的黄金期，训练后30分钟内补充快速吸收的碳水和蛋白质，促进肌肉修复。'
          },
          {
            type: 'medium',
            typeText: '中碳日',
            calories: mediumCalories,
            protein: protein,
            carbs: mediumDayCarbs,
            fat: mediumDayFat,
            tips: '中碳日适合中等强度训练，如常规力量训练或长时间有氧。凯圣王建议：中碳日碳水脂肪比例均衡，可适当增加膳食纤维摄入，帮助维持饱腹感，稳定血糖水平。'
          },
          {
            type: 'low',
            typeText: '低碳日',
            calories: lowCalories,
            protein: protein,
            carbs: lowDayCarbs,
            fat: lowDayFat,
            tips: '低碳日适合安排低强度训练或休息。凯圣王建议：低碳日应选择饱腹感强的粗纤维食物（玉米、红薯、山药、芋头、土豆、南瓜、魔芋），选择优质脂肪，如橄榄油、坚果、牛油果等。低碳日是脂肪燃烧的关键期，利用惯性减脂，恢复激素水平。'
          }
        ],
        workoutSuggestions: this.exerciseSuggestions,
        // 凯圣王专属减脂建议
        kaiShengWangTips: [
          '碳水循环的核心：高碳日和低碳日的总热量摄入基本一致，关键在于碳水和脂肪的比例调整',
          '高碳日不是欺骗日，仍需控制食物种类和摄入量',
          '计算的是碳水化合物的含量，而非主食重量',
          '每周安排2天高碳日，2天低碳日，3天中碳日',
          '高碳日安排在练腿或练背（大肌群训练）的日子',
          '低碳日安排在休息日',
          '不建议过量摄入蛋白质（>1.5克/公斤体重），增加肝肾负担',
          '蛋白质分餐摄入，每日3-5次，每次20-40克，间隔2-3小时'
        ]
      };
      
      // 生成30天的每日计划，采用凯圣王科学循环顺序
      // 凯圣王核心循环顺序：高-中-低-中-高-中-低，避免连续的高碳或低碳日
      const dailyPlans = this.generateScientificDailyPlans(basePlanData, 30);
      
      // 准备跳转到结果页面的数据
      const planData = {
        ...basePlanData,
        dailyPlans: dailyPlans
      };
      
      // 使用本地存储传递数据，避免URL过长
      uni.setStorageSync('tempFatlossPlan', planData);
      
      // 跳转到结果页面
      uni.navigateTo({
        url: `/pages/fatloss-result/fatloss-result`
      });
    },

    // 生成饮食计划
    generateMealPlan() {
      const { protein, carbs, fat } = this.calculatedData;
      
      // 按餐次分配（默认4餐）
      const meals = [
        { name: '早餐', ratio: 0.25 },
        { name: '午餐', ratio: 0.35 },
        { name: '晚餐', ratio: 0.30 },
        { name: '加餐', ratio: 0.10 }
      ];
      
      this.mealPlan = meals.map(meal => {
        return {
          name: meal.name,
          protein: Math.round(protein * meal.ratio),
          carbs: Math.round(carbs * meal.ratio),
          fat: Math.round(fat * meal.ratio),
          example: this.getMealExample(meal.name, this.selectedPlanIndex)
        };
      });
    },
    
    // 生成碳水循环饮食计划
    generateCarbCyclingMealPlan() {
      const { protein, carbCycle, fatCycle } = this.calculatedData;
      
      // 餐次分配比例
      const mealRatios = {
        '早餐': 0.25,
        '午餐': 0.35,
        '晚餐': 0.30,
        '加餐': 0.10
      };
      
      // 碳水循环日类型
      const cycleDays = ['high', 'medium', 'low'];
      
      // 生成各循环日的饮食计划
      this.carbCycleMealPlan = cycleDays.map(day => {
        const carbs = carbCycle[day];
        const fat = fatCycle[day];
        return {
          day: day,
          dayName: this.getCycleDayName(day),
          meals: Object.entries(mealRatios).map(([mealName, ratio]) => {
            return {
              name: mealName,
              protein: Math.round(protein * ratio),
              carbs: Math.round(carbs * ratio),
              fat: Math.round(fat * ratio),
              example: this.getCarbCycleMealExample(mealName, day)
            };
          })
        };
      });
    },
    
    // 生成科学的每日计划顺序
    generateScientificDailyPlans(basePlanData, days = 30) {
      const dailyPlans = [];
      const today = new Date();
      
      // 基于视频逻辑的科学循环顺序：避免连续的高碳或低碳日
      // 推荐的循环顺序：高-中-低-中-高-中-低，这样的顺序更符合人体代谢规律
      const scientificCycleOrder = ['high', 'medium', 'low', 'medium', 'high', 'medium', 'low'];
      
      // 获取星期几的辅助方法
      const getWeekDay = (date) => {
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekDays[date.getDay()];
      };
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        // 使用科学的循环顺序
        const cycleIndex = i % scientificCycleOrder.length;
        const cycleType = scientificCycleOrder[cycleIndex];
        
        // 找到对应的循环日数据
        const cycleDay = basePlanData.carbsCycle.find(day => day.type === cycleType);
        
        if (cycleDay) {
          dailyPlans.push({
            date: currentDate.toISOString().split('T')[0],
            dayIndex: i + 1,
            weekDay: getWeekDay(currentDate),
            cycleType: cycleType,
            cycleTypeText: cycleDay.typeText,
            calories: cycleDay.calories,
            protein: cycleDay.protein,
            carbs: cycleDay.carbs,
            fat: cycleDay.fat,
            tips: cycleDay.tips,
            isCompleted: false,
            notes: ''
          });
        }
      }
      
      return dailyPlans;
    },
    
    // 生成凯圣王专属每日计划顺序
    generateKaiShengWangDailyPlans(basePlanData, days = 30) {
      const dailyPlans = [];
      const today = new Date();
      
      // 凯圣王核心循环顺序：高-中-低-中-高-中-轻断食，7天一个周期
      // 这个顺序结合了碳水循环和轻断食，是凯圣王减脂计划的核心
      const kaiShengWangCycleOrder = ['high', 'medium', 'low', 'medium', 'high', 'medium', 'fasting'];
      
      // 获取星期几的辅助方法
      const getWeekDay = (date) => {
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekDays[date.getDay()];
      };
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        // 使用凯圣王核心循环顺序
        const cycleIndex = i % kaiShengWangCycleOrder.length;
        const cycleType = kaiShengWangCycleOrder[cycleIndex];
        
        // 找到对应的循环日数据
        const cycleDay = basePlanData.carbsCycle.find(day => day.type === cycleType);
        
        if (cycleDay) {
          // 添加凯圣王专属的每日训练建议
          let trainingSuggestion = '';
          switch (cycleType) {
            case 'high':
              trainingSuggestion = '建议进行高强度力量训练，如深蹲、硬拉、卧推等复合动作，训练后30分钟内补充快速吸收的碳水和蛋白质。';
              break;
            case 'medium':
              trainingSuggestion = '建议进行中等强度力量训练+20-30分钟有氧，力量训练可选择分化训练，重点锻炼某一肌群。';
              break;
            case 'low':
              trainingSuggestion = '建议进行低强度训练，如瑜伽、普拉提或30分钟快走，避免高强度训练导致肌肉流失。';
              break;
            case 'fasting':
              trainingSuggestion = '建议休息，或仅进行15-20分钟的拉伸运动，轻断食日身体处于能量赤字状态，避免过度训练。';
              break;
          }
          
          dailyPlans.push({
            date: currentDate.toISOString().split('T')[0],
            dayIndex: i + 1,
            weekDay: getWeekDay(currentDate),
            cycleType: cycleType,
            cycleTypeText: cycleDay.typeText,
            calories: cycleDay.calories,
            protein: cycleDay.protein,
            carbs: cycleDay.carbs,
            fat: cycleDay.fat,
            tips: cycleDay.tips,
            trainingSuggestion: trainingSuggestion,
            isCompleted: false,
            notes: ''
          });
        }
      }
      
      return dailyPlans;
    },
    
    // 获取循环日名称
    getCycleDayName(day) {
      const dayMap = {
        high: '高碳日',
        medium: '中碳日',
        low: '低碳日'
      };
      return dayMap[day];
    },
    
    // 获取碳水循环餐食示例
    getCarbCycleMealExample(mealName, dayType) {
      // 不同碳水日的餐食示例
      const examples = {
        high: {
          '早餐': '燕麦粥 + 鸡蛋 + 香蕉',
          '午餐': '鸡胸肉 + 糙米饭 + 蔬菜',
          '晚餐': '鱼 + 红薯 + 蔬菜',
          '加餐': '水果 + 坚果'
        },
        medium: {
          '早餐': '鸡蛋 + 全麦面包 + 水果',
          '午餐': '牛肉 + 糙米饭 + 蔬菜',
          '晚餐': '虾 + 玉米 + 蔬菜',
          '加餐': '希腊酸奶 + 少量坚果'
        },
        low: {
          '早餐': '鸡蛋 + 牛油果 + 蔬菜',
          '午餐': '烤鸡 + 蔬菜沙拉',
          '晚餐': '三文鱼 + 花椰菜',
          '加餐': '奶酪 + 黄瓜'
        }
      };
      return examples[dayType][mealName] || '';
    },

    // 获取餐食示例
    getMealExample(mealName, planIndex) {
      // 获取当前选中的方案名称
      const planName = this.fatlossPlans[planIndex].name;
      
      const examples = {
        '凯圣王碳水循环': {
          '早餐': '燕麦粥 + 鸡蛋 + 香蕉',
          '午餐': '鸡胸肉 + 糙米饭 + 蔬菜',
          '晚餐': '鱼 + 红薯 + 蔬菜',
          '加餐': '水果 + 坚果'
        },
        '谭成义三个月减脂': {
          '早餐': '全麦面包 + 鸡蛋 + 牛奶 + 水果',
          '午餐': '瘦肉 + 糙米饭 + 大量蔬菜',
          '晚餐': '鱼/虾 + 杂粮饭 + 蔬菜',
          '加餐': '酸奶 + 坚果 / 蛋白质奶昔'
        }
      };
      
      return examples[planName][mealName] || '';
    },

    // 生成凯圣王专属运动建议
    generateKaiShengWangExerciseSuggestions() {
      this.exerciseSuggestions = [
        '每周安排4-5次训练，其中2-3次力量训练，2次有氧训练',
        '高碳日：安排高强度力量训练，如深蹲、硬拉、卧推等复合动作',
        '中碳日：安排中等强度力量训练+20-30分钟有氧',
        '低碳日：安排低强度训练，如瑜伽、普拉提或30分钟快走',
        '轻断食日：建议休息，或仅进行15-20分钟的拉伸运动',
        '力量训练采用4-5组，每组8-12次的训练方案，重量选择能完成8-12次的最大重量',
        '有氧训练可选择HIIT（高碳日）或稳态有氧（中碳日）',
        '每天保证8小时睡眠，促进肌肉修复和生长激素分泌',
        '训练前充分热身，训练后认真拉伸，避免受伤',
        '定期测量围度和体重，而不仅仅关注体重变化'
      ];
    },
    
    // 生成运动建议（保留原有方法，兼容其他计划）
    generateExerciseSuggestions() {
      this.exerciseSuggestions = [
        '每周进行3-5次有氧运动，每次30-60分钟',
        '结合力量训练，每周2-3次，保留肌肉量',
        '增加日常活动量，如步行、爬楼梯等',
        '保证充足睡眠，有利于减脂和恢复',
        '多喝水，保持身体水分充足',
        '记录饮食和运动，监控进度' 
      ];
    },
    
    // 生成谭成义三个月减脂计划
    generateTanChengyiPlan(bmr, tdee, calorieDeficit) {
      // 确保体脂率已经计算
      if (!this.userData.bodyFat) {
        this.userData.bodyFat = this.calculateBodyFat();
      }
      
      // 谭成义三个月减脂计划特殊处理
      // 基础目标热量
      const targetCalories = tdee - calorieDeficit;
      
      // 蛋白质摄入量（根据体重计算）
      const protein = Math.round(this.userData.weight * 2.0); // 2.0g/kg体重
      
      // 脂肪摄入量（根据目标热量计算）
      const fat = Math.round(targetCalories * 0.25 / 9); // 25%热量来自脂肪
      
      // 碳水化合物摄入量（剩余热量）
      const carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
      
      // 保存计算结果
      this.calculatedData = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        protein,
        carbs,
        fat
      };
      
      // 生成饮食计划
      this.generateMealPlan();
      
      // 生成运动建议
      this.generateExerciseSuggestions();
      
      // 准备基础计划数据
      const basePlanData = {
        planName: this.fatlossPlans[this.selectedPlanIndex].name,
        somatotype: this.userData.somatotype,
        somatotypeText: this.userData.somatotype === 'ectomorph' ? '外胚型' : this.userData.somatotype === 'mesomorph' ? '中胚型' : '内胚型',
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        carbsCycle: [
          {
            type: 'month1',
            typeText: '第一个月',
            calories: Math.round(targetCalories),
            protein: protein,
            carbs: carbs,
            fat: fat,
            tips: '建立良好的饮食习惯，控制热量摄入，增加蛋白质摄入，减少精制碳水化合物和添加糖。' +
                  '每周进行3-4次有氧运动，每次30-45分钟。' +
                  '开始进行基础力量训练，每周2次，重点训练大肌群。'
          },
          {
            type: 'month2',
            typeText: '第二个月',
            calories: Math.round(targetCalories - 100),
            protein: protein + 10,
            carbs: carbs - 20,
            fat: fat,
            tips: '进一步调整饮食结构，增加膳食纤维摄入，减少脂肪摄入。' +
                  '增加有氧运动强度和时长，每周4-5次，每次45-60分钟。' +
                  '提高力量训练频率和强度，每周3次，增加训练容量。'
          },
          {
            type: 'month3',
            typeText: '第三个月',
            calories: Math.round(targetCalories - 150),
            protein: protein + 15,
            carbs: carbs - 30,
            fat: fat - 5,
            tips: '精细化饮食控制，根据身体反应调整热量摄入。' +
                  '结合HIIT训练和稳态有氧，提高脂肪燃烧效率。' +
                  '进行高强度力量训练，每周3-4次，保持肌肉量，塑造线条。' +
                  '关注睡眠和恢复，避免过度训练。'
          }
        ],
        workoutSuggestions: this.exerciseSuggestions
      };
      
      // 生成90天的每日计划（三个月）
      const dailyPlans = FatlossManager.generateDailyPlans(basePlanData, 90);
      
      // 准备跳转到结果页面的数据
      const planData = {
        ...basePlanData,
        dailyPlans: dailyPlans
      };
      
      // 使用本地存储传递数据，避免URL过长
      uni.setStorageSync('tempFatlossPlan', planData);
      
      // 跳转到结果页面
      uni.navigateTo({
        url: `/pages/fatloss-result/fatloss-result`
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: var(--background) !important;
  color: var(--text);
}

/* 顶部栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.header-section {
  flex: 1;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: var(--text);
  display: block;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  display: block;
  line-height: 1.4;
}

/* 我的计划按钮 */
.my-plans-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 30rpx;
  padding: 12rpx 20rpx;
  margin-left: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-plans-btn:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.my-plans-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
}

.my-plans-count {
  background-color: #ff4757;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.my-plans-arrow {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 4rpx;
}

/* 我的计划展开列表 */
.my-plans-expand {
  background-color: var(--background-secondary);
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid var(--border);
  overflow: hidden;
  animation: slideDown 0.3s ease;
  max-height: 400rpx;
}

.my-plans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.my-plans-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #ffffff;
}

.my-plans-close {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.my-plans-close:active {
  color: #ffffff;
}

.saved-plans-list {
  padding: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  max-height: 300rpx;
  overflow-y: auto;
}

.no-plans-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 30rpx;
  text-align: center;
}

.no-plans-text {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6rpx;
}

.no-plans-desc {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.card {
  background-color: var(--background-secondary);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  border: 1rpx solid var(--border);
}

/* 方案卡片 */
.plan-card {
  padding: 20rpx;
}

/* 身体数据折叠卡片 */
.body-data-card {
  padding: 0;
  overflow: hidden;
}

.body-data-card.expanded {
  padding: 0 0 20rpx 0;
}

.card-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  cursor: pointer;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.card-title-small {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.body-data-summary {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.body-data-summary.warning {
  color: #f59e0b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.toggle-text {
  font-size: 24rpx;
  color: var(--primary);
  font-weight: 500;
}

.body-data-content {
  padding: 0 24rpx;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  margin-bottom: 24rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
  display: block;
}

.card-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  display: block;
  margin-top: 8rpx;
}

/* 方案选择 */
.plan-options {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.plan-option {
  position: relative;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
  transition: all 0.3s ease;
  border: 2rpx solid var(--border);
}

.plan-option.active {
  background-color: var(--surface-hover);
  color: var(--text);
  border-color: var(--border-light);
}

.plan-content {
  cursor: pointer;
}

/* 详情按钮样式 */
.detail-btn {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background-color: var(--surface-hover);
  color: var(--text);
  border: 1rpx solid var(--border-light);
  border-radius: 20rpx;
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: auto;
  line-height: 1;
}

.detail-btn:active {
  opacity: 0.8;
  transform: scale(0.95);
}

.detail-btn-text {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text);
}

.plan-option.active .detail-btn {
  background-color: var(--border-light);
  color: var(--text);
  border-color: var(--primary);
}

/* 方案详情弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 998;
}

.detail-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-height: 80%;
  background-color: var(--background-secondary);
  border: 1rpx solid var(--border);
  border-radius: 20rpx;
  z-index: 999;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  color: var(--text);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
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
}

.close-btn:active {
  color: var(--text);
}

.modal-content {
  padding: 24rpx;
  overflow-y: auto;
  flex: 1;
}

.plan-info {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 20rpx;
  background-color: var(--background-tertiary);
  border-radius: 12rpx;
  border: 1rpx solid var(--border);
}

.info-label {
  width: 100rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
}

.info-value {
  flex: 1;
  font-size: 28rpx;
  color: var(--text-secondary);
}

/* 弹窗内的详情列表样式 */
.modal-content .detail-section {
  margin-bottom: 30rpx;
}

.modal-content .section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20rpx;
  display: block;
}

.modal-content .detail-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.modal-content .detail-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 16rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.modal-content .point-icon {
  font-size: 36rpx;
  color: var(--text-secondary);
  line-height: 40rpx;
  flex-shrink: 0;
}

.modal-content .note-icon {
  font-size: 28rpx;
  line-height: 40rpx;
  flex-shrink: 0;
}

.modal-content .point-text, .modal-content .note-text {
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.6;
  flex: 1;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.plan-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
}

.plan-option.active .plan-name {
  color: var(--text);
}

.plan-tag {
  padding: 6rpx 16rpx;
  background-color: var(--surface-hover);
  color: var(--text);
  border: 1rpx solid var(--border-light);
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.plan-option.active .plan-tag {
  background-color: var(--border-light);
  color: var(--text);
  border-color: var(--primary);
}

.plan-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}

.plan-option.active .plan-desc {
  color: var(--text);
}

/* 表单样式 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text);
}

.form-input {
  padding: 24rpx;
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: var(--text);
  background-color: var(--background-tertiary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--surface-hover);
}

/* 性别选择 */
.radio-group {
  display: flex;
  gap: 20rpx;
}

.radio-item {
  flex: 1;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text);
  transition: all 0.3s ease;
}

.radio-item.selected {
  background-color: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

/* 选择器样式 */
.picker-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
  color: var(--text);
}

.picker-arrow {
  font-size: 24rpx;
  color: var(--text-secondary);
}

/* 生成按钮 */
.generate-section {
  margin: 24rpx 0 40rpx 0;
}

.btn-primary {
  width: 100%;
  padding: 24rpx;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
  border-radius: 14rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:disabled {
  background: var(--surface-hover);
  color: var(--text-tertiary);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

/* 结果样式 */
.result-summary {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 30rpx;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 12rpx;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 28rpx;
  color: var(--text-secondary);
}

.summary-value {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text);
}

.summary-value.highlight {
  color: var(--text-secondary);
}

/* 宏量营养素 */
.macros-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20rpx;
  display: block;
}

.section-subtitle {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 20rpx;
  display: block;
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
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

.macro-name {
  font-size: 26rpx;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8rpx;
}

.macro-value {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4rpx;
}

.macro-calories {
  font-size: 22rpx;
  color: var(--text-tertiary);
  margin-bottom: 16rpx;
}

.macro-bar {
  width: 100%;
  height: 12rpx;
  border-radius: 6rpx;
}

.macro-bar.protein {
  background-color: var(--primary);
}

.macro-bar.carbs {
  background-color: var(--success);
}

.macro-bar.fat {
  background-color: var(--warning);
}

/* 碳水循环样式 */
.carb-cycle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
}

.carb-cycle-item {
  padding: 24rpx;
  border: 1rpx solid var(--border);
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--background-tertiary);
  color: var(--text);
}

.carb-cycle-item:nth-child(1) {
  background-color: var(--background-tertiary);
  color: var(--text);
}

.carb-cycle-item:nth-child(2) {
  background-color: var(--background-tertiary);
  color: var(--text);
}

.carb-cycle-item:nth-child(3) {
  background-color: var(--background-tertiary);
  color: var(--text);
}

.cycle-day {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
}

.cycle-carbs {
  font-size: 44rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
  display: block;
}

.cycle-desc {
  font-size: 22rpx;
  opacity: 0.9;
  color: var(--text-secondary);
  display: block;
}

/* 碳水循环标签页 */
.carb-cycle-tabs {
  display: flex;
  gap: 10rpx;
  margin-bottom: 24rpx;
  background-color: var(--surface-hover);
  padding: 8rpx;
  border-radius: 12rpx;
  border: 1rpx solid var(--border);
}

.tab-item {
  flex: 1;
  padding: 16rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.tab-item.active {
  background-color: var(--primary);
  color: #ffffff;
  font-weight: 600;
}

/* 碳水循环提示 */
.carb-cycle-tips {
  margin-top: 30rpx;
  padding: 24rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 12rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16rpx;
  display: block;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tip-item {
  font-size: 24rpx;
  color: var(--text-secondary);
  line-height: 1.5;
}


/* 已保存计划样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: var(--primary);
  font-size: 28rpx;
  font-weight: 600;
  cursor: pointer;
}

/* 编辑操作栏样式 */
.edit-actions {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6rpx 12rpx;
}

.edit-link-text {
  font-size: 26rpx;
  color: var(--primary);
  font-weight: 500;
}

.edit-actions:active {
  opacity: 0.8;
}

/* 空状态样式 */
.empty-body-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 30rpx;
  text-align: center;
}

.empty-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8rpx;
  display: block;
}

.empty-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-bottom: 24rpx;
  display: block;
  line-height: 1.4;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 2rpx solid var(--primary);
  padding: 16rpx 48rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.btn-outline:active {
  background-color: var(--surface-hover);
}

/* 数据展示网格 */
.user-data-display {
  padding: 10rpx 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.data-item {
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 10rpx;
  padding: 16rpx 8rpx;
  text-align: center;
}

.data-item-label {
  font-size: 20rpx;
  color: var(--text-secondary);
  margin-bottom: 6rpx;
  display: block;
}

.data-item-value {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
  display: block;
}

.toggle-icon {
  font-size: 24rpx;
  transition: transform 0.3s ease;
}

.saved-plan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14rpx 16rpx;
  background-color: var(--background-tertiary);
  border: 1rpx solid var(--border);
  border-radius: 10rpx;
  transition: all 0.3s ease;
  min-height: 80rpx;
}

.saved-plan-item:active {
  background-color: var(--surface-hover);
  transform: scale(0.98);
}

.plan-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.plan-name {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}

.plan-date {
  font-size: 20rpx;
  color: var(--text-secondary);
}

.plan-actions {
  display: flex;
  gap: 8rpx;
}

.btn-small {
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: #ffffff;
  border: 1rpx solid var(--primary);
}

.btn-danger {
  background-color: var(--danger);
  color: #ffffff;
  border: 1rpx solid var(--danger);
}

.btn-primary:active,
.btn-danger:active {
  opacity: 0.8;
}

/* 方案详情样式 */
.detail-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 20rpx;
  display: block;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 16rpx;
  background-color: #2a2a2a;
  border: 1rpx solid #333333;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.detail-item:active {
  transform: scale(0.98);
}

.point-icon {
  font-size: 36rpx;
  color: #aaaaaa;
  line-height: 40rpx;
  flex-shrink: 0;
}

.note-icon {
  font-size: 28rpx;
  line-height: 40rpx;
  flex-shrink: 0;
}

.point-text, .note-text {
  font-size: 26rpx;
  color: #ffffff;
  line-height: 1.6;
  flex: 1;
}

/* 视频链接区域 */
.video-section {
  margin-top: 30rpx;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.video-link-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2rpx solid #ff0050;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-link-card:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.video-platform {
  background: linear-gradient(135deg, #ff0050 0%, #ff6b9d 100%);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.video-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.video-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-url {
  font-size: 22rpx;
  color: #888888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-arrow {
  font-size: 32rpx;
  color: #ff0050;
  flex-shrink: 0;
}

/* 表格样式 */
.table-section {
  margin-bottom: 30rpx;
}

.table-container {
  background-color: #2a2a2a;
  border: 1rpx solid #333333;
  border-radius: 12rpx;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  background-color: #4a5568;
  color: #ffffff;
  font-weight: 600;
}

.table-col {
  padding: 20rpx;
  font-size: 26rpx;
  text-align: center;
  border-right: 2rpx solid rgba(255, 255, 255, 0.2);
}

.table-col:last-child {
  border-right: none;
}

.table-body {
  max-height: 400rpx;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  border-bottom: 2rpx solid #333333;
  background-color: #1e1e1e;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .table-col {
  color: #ffffff;
  font-weight: 400;
  border-right: 2rpx solid #333333;
}

.table-row .table-col.example {
  text-align: left;
  font-size: 24rpx;
  color: #aaaaaa;
}

/* 运动建议 */
.exercise-section {
  margin-top: 30rpx;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #2a2a2a;
  border: 1rpx solid #333333;
  border-radius: 12rpx;
}

.exercise-icon {
  font-size: 32rpx;
}

.exercise-text {
  font-size: 26rpx;
  color: var(--text);
  line-height: 1.5;
}
</style>