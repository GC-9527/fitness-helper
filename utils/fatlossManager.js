// 减脂计划管理工具类
// 用于本地存储和管理减脂计划

const FATLOSS_PLAN_KEY = 'savedFatlossPlans';

class FatlossManager {
  /**
   * 保存减脂计划
   * @param {Object} planData - 减脂计划数据
   * @returns {Object} 保存的计划对象（包含id和创建时间）
   */
  static savePlan(planData) {
    try {
      // 获取已保存的计划
      const savedPlans = this.getPlans();
      
      // 生成唯一ID和创建时间
      const planToSave = {
        id: Date.now().toString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        ...planData
      };
      
      // 添加到计划列表（最新的在前面）
      savedPlans.unshift(planToSave);
      
      // 保存到本地存储
      uni.setStorageSync(FATLOSS_PLAN_KEY, savedPlans);
      
      return planToSave;
    } catch (error) {
      console.error('保存减脂计划失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有保存的减脂计划
   * @returns {Array} 减脂计划列表
   */
  static getPlans() {
    try {
      const savedPlans = uni.getStorageSync(FATLOSS_PLAN_KEY);
      return savedPlans || [];
    } catch (error) {
      console.error('获取减脂计划失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取减脂计划
   * @param {string} planId - 计划ID
   * @returns {Object|null} 找到的计划对象或null
   */
  static getPlanById(planId) {
    try {
      const plans = this.getPlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error('根据ID获取减脂计划失败:', error);
      return null;
    }
  }

  /**
   * 更新减脂计划
   * @param {string} planId - 计划ID
   * @param {Object} updateData - 要更新的数据
   * @returns {boolean} 更新是否成功
   */
  static updatePlan(planId, updateData) {
    try {
      const plans = this.getPlans();
      const planIndex = plans.findIndex(plan => plan.id === planId);
      
      if (planIndex === -1) {
        return false;
      }
      
      // 更新计划数据
      plans[planIndex] = {
        ...plans[planIndex],
        ...updateData,
        updateTime: new Date().toISOString()
      };
      
      // 保存到本地存储
      uni.setStorageSync(FATLOSS_PLAN_KEY, plans);
      return true;
    } catch (error) {
      console.error('更新减脂计划失败:', error);
      return false;
    }
  }

  /**
   * 删除减脂计划
   * @param {string} planId - 计划ID
   * @returns {boolean} 删除是否成功
   */
  static deletePlan(planId) {
    try {
      let plans = this.getPlans();
      plans = plans.filter(plan => plan.id !== planId);
      
      // 保存到本地存储
      uni.setStorageSync(FATLOSS_PLAN_KEY, plans);
      return true;
    } catch (error) {
      console.error('删除减脂计划失败:', error);
      return false;
    }
  }

  /**
   * 清空所有保存的减脂计划
   * @returns {boolean} 清空是否成功
   */
  static clearAllPlans() {
    try {
      uni.removeStorageSync(FATLOSS_PLAN_KEY);
      return true;
    } catch (error) {
      console.error('清空减脂计划失败:', error);
      return false;
    }
  }

  /**
   * 生成每日计划数据
   * @param {Object} planData - 基本计划数据
   * @param {number} days - 生成天数
   * @returns {Array} 每日计划数组
   */
  static generateDailyPlans(planData, days = 30) {
    const dailyPlans = [];
    const today = new Date();
    
    // 根据不同的计划类型生成不同的每日计划
    if (planData.planName === '凯圣王碳水循环') {
      // 碳水循环计划：高碳日、中碳日、低碳日循环
      const cycleOrder = ['high', 'medium', 'low'];
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const cycleIndex = i % 3;
        const cycleType = cycleOrder[cycleIndex];
        
        // 找到对应的循环日数据
        const cycleDay = planData.carbsCycle.find(day => day.type === cycleType);
        
        if (cycleDay) {
          dailyPlans.push({
            date: currentDate.toISOString().split('T')[0],
            dayIndex: i + 1,
            weekDay: this.getWeekDay(currentDate),
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
    } else if (planData.planName === '谭成义三个月减脂') {
      // 谭成义三个月减脂计划：按月分阶段
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        let stageData;
        if (i < 30) {
          // 第一个月
          stageData = planData.carbsCycle.find(day => day.type === 'month1');
        } else if (i < 60) {
          // 第二个月
          stageData = planData.carbsCycle.find(day => day.type === 'month2');
        } else {
          // 第三个月
          stageData = planData.carbsCycle.find(day => day.type === 'month3');
        }
        
        if (stageData) {
          dailyPlans.push({
            date: currentDate.toISOString().split('T')[0],
            dayIndex: i + 1,
            weekDay: this.getWeekDay(currentDate),
            stage: stageData.type,
            stageText: stageData.typeText,
            calories: stageData.calories,
            protein: stageData.protein,
            carbs: stageData.carbs,
            fat: stageData.fat,
            tips: stageData.tips,
            isCompleted: false,
            notes: ''
          });
        }
      }
    }
    
    return dailyPlans;
  }

  /**
   * 获取星期几
   * @param {Date} date - 日期对象
   * @returns {string} 星期几的中文名称
   */
  static getWeekDay(date) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDays[date.getDay()];
  }

  /**
   * 从视频中提取的核心要点和注意事项
   */
  static getPlanDetails() {
    return {
      '凯圣王碳水循环': {
        corePoints: [
          '根据不同体型（外胚型、中胚型、内胚型）调整宏量营养素比例',
          '采用高碳日、中碳日、低碳日循环的方式，避免身体适应',
          '高碳日适合安排强度较高的训练，如力量训练或HIIT',
          '低碳日适合安排低强度训练或休息，让身体利用脂肪供能',
          '蛋白质摄入量保持稳定，维持肌肉量',
          '脂肪摄入量根据体型调整，内胚型需要较低的脂肪摄入'
        ],
        notes: [
          '注意补充足够的水分，每天至少2000ml',
          '保证充足的睡眠，每天7-8小时',
          '定期测量体重和体脂率，调整计划',
          '避免过度节食，保持健康的热量缺口',
          '结合力量训练，防止肌肉流失'
        ],
        videoLinks: [
          {
            title: '凯圣王碳水循环减脂法（上）',
            url: 'https://www.douyin.com/search/%E5%87%AF%E5%9C%A3%E7%8E%8B%E7%A2%B3%E6%B0%B4%E5%BE%AA%E7%8E%AF?aid=ca51ca27-7766-4d2b-aaa0-c002dd5ea3a5&modal_id=7271481155805875513&type=general',
            platform: '抖音'
          },
          {
            title: '凯圣王碳水循环减脂法（下）',
            url: 'https://www.douyin.com/search/%E5%87%AF%E5%9C%A3%E7%8E%8B%E7%A2%B3%E6%B0%B4%E5%BE%AA%E7%8E%AF?aid=ca51ca27-7766-4d2b-aaa0-c002dd5ea3a5&modal_id=7271844630079999290&type=general',
            platform: '抖音'
          }
        ]
      },
      '谭成义三个月减脂': {
        corePoints: [
          '三个月分阶段减脂，逐步调整饮食和训练',
          '第一个月建立良好的饮食习惯，控制热量摄入',
          '第二个月进一步调整饮食结构，增加膳食纤维',
          '第三个月精细化饮食控制，提高训练强度',
          '强调蛋白质的摄入，保护肌肉量',
          '结合有氧运动和力量训练，提高脂肪燃烧效率'
        ],
        notes: [
          '饮食要多样化，保证营养均衡',
          '避免暴饮暴食，控制餐量',
          '训练要循序渐进，避免受伤',
          '保持良好的心态，减脂是一个长期过程',
          '定期休息，给身体恢复的时间'
        ],
        videoLinks: [
          {
            title: '谭成义三个月减脂计划',
            url: 'https://www.douyin.com/jingxuan/search/%E8%B0%AD%E6%88%90%E4%B9%89%E5%87%8F%E8%84%82?aid=c8e0c574-ebb0-4a7e-9015-63464cf3dc0b&modal_id=7618962209967965617&type=general',
            platform: '抖音'
          }
        ]
      }
    };
  }
}

export default FatlossManager;