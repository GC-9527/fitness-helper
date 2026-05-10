/**
 * 智能渐进超负荷建议系统
 * Progressive Overload Suggestion System
 * 
 * 该系统根据用户的历史训练数据，智能推荐下一次训练的重量、组数和次数
 * 帮助用户科学地进行渐进超负荷训练，持续提升训练效果
 */

// ==================== 常量定义 ====================

// 默认建议配置（无历史记录时使用）
const DEFAULT_SUGGESTION = {
  weight: 10,           // 默认起始重量 10kg
  reps: 12,             // 默认每组次数 12次
  sets: 3,              // 默认组数 3组
  restSeconds: 60       // 默认休息时间 60秒
};

// 渐进超负荷调整参数
const OVERLOAD_PARAMS = {
  weightIncrement: 2.5,     // 重量增加幅度 (kg)
  weightDecreasePercent: 0.05,  // 重量降低百分比 (5%)
  repDecrement: 2,          // 次数减少量
  minReps: 6,               // 最小建议次数
  completionThreshold: 10   // 完成良好的次数阈值
};

// 鼓励性文案库
const ENCOURAGEMENT_MESSAGES = {
  firstTime: [
    "🌟 新的开始！从轻重量开始，建立正确的动作模式",
    "💪 万事开头难，循序渐进才能走得更远",
    "🎯 打好基础，未来的你会感谢现在的自己"
  ],
  increase: [
    "🔥 太棒了！你的身体已经适应，准备迎接新挑战吧！",
    "💪 进步明显！增加重量，继续突破自我！",
    "🚀 状态火热！是时候给自己加点难度了！",
    "⭐ 表现完美！渐进超负荷，你做到了！"
  ],
  decrease: [
    "😊 没关系，调整一下状态，下次会更好！",
    "💚 倾听身体的声音，适当调整也是智慧",
    "🌱 休息是为了更好的出发，降低强度恢复一下",
    "🔄 训练是波浪式前进的，调整后再战！"
  ],
  maintain: [
    "👍 保持住！稳定输出也是一种进步",
    "⚖️ 巩固当前强度，为下一次突破做准备",
    "📈 稳扎稳打，持续积累就能看到质变"
  ]
};

// ==================== 核心功能函数 ====================

/**
 * 智能建议下一次训练设置
 * @param {Array} exerciseHistory - 历史训练数据数组
 *   格式: [
 *     {
 *       date: '2024-01-15',
 *       weight: 20,        // 重量 (kg)
 *       reps: 10,          // 每组次数
 *       sets: 3,           // 组数
 *       completedSets: 3,  // 实际完成组数
 *       completedReps: [10, 10, 10]  // 每组实际完成次数
 *     }
 *   ]
 * @returns {Object} 建议对象
 *   {
 *     weight: number,           // 建议重量
 *     reps: number,             // 建议次数
 *     sets: number,             // 建议组数
 *     restSeconds: number,      // 建议休息时间
 *     message: string,          // 鼓励性文案
 *     reason: string,           // 建议原因
 *     trend: 'increase' | 'decrease' | 'maintain' | 'first'  // 趋势
 *   }
 */
function suggestNextSet(exerciseHistory) {
  // 检查历史记录是否有效
  if (!exerciseHistory || !Array.isArray(exerciseHistory) || exerciseHistory.length === 0) {
    return {
      ...DEFAULT_SUGGESTION,
      message: getRandomMessage('firstTime'),
      reason: '首次训练，建议从轻重量开始，建立正确的动作模式',
      trend: 'first'
    };
  }

  // 获取最近一次训练记录
  const lastWorkout = exerciseHistory[exerciseHistory.length - 1];
  
  // 验证最近一次记录的数据完整性
  if (!isValidWorkoutRecord(lastWorkout)) {
    console.warn('[ProgressiveOverload] 历史记录数据不完整，使用默认建议');
    return {
      ...DEFAULT_SUGGESTION,
      message: getRandomMessage('firstTime'),
      reason: '历史记录数据不完整，建议重新开始',
      trend: 'first'
    };
  }

  // 分析上次训练完成情况
  const performance = analyzePerformance(lastWorkout);

  // 根据表现生成建议
  if (performance.isExcellent) {
    // 上次完成很好：增加重量
    return generateIncreaseSuggestion(lastWorkout);
  } else if (performance.isIncomplete) {
    // 上次未完成：降低重量和次数
    return generateDecreaseSuggestion(lastWorkout);
  } else {
    // 其他情况：保持当前设置
    return generateMaintainSuggestion(lastWorkout);
  }
}

/**
 * 分析训练表现
 * @param {Object} workout - 训练记录
 * @returns {Object} 表现分析结果
 */
function analyzePerformance(workout) {
  const targetSets = workout.sets || 3;
  const targetReps = workout.reps || 10;
  const completedSets = workout.completedSets || 0;
  
  // 检查是否完成所有组数
  const allSetsCompleted = completedSets >= targetSets;
  
  // 计算平均完成次数
  let avgCompletedReps = targetReps;
  if (workout.completedReps && Array.isArray(workout.completedReps)) {
    const totalReps = workout.completedReps.reduce((sum, reps) => sum + reps, 0);
    avgCompletedReps = totalReps / workout.completedReps.length;
  }

  // 判断表现等级
  const isExcellent = allSetsCompleted && avgCompletedReps >= OVERLOAD_PARAMS.completionThreshold;
  const isIncomplete = completedSets < targetSets || avgCompletedReps < targetReps - 2;

  return {
    isExcellent,
    isIncomplete,
    allSetsCompleted,
    avgCompletedReps,
    completionRate: (completedSets / targetSets) * 100
  };
}

/**
 * 生成增加强度的建议
 * @param {Object} lastWorkout - 上次训练记录
 * @returns {Object} 建议对象
 */
function generateIncreaseSuggestion(lastWorkout) {
  const newWeight = roundWeight(lastWorkout.weight + OVERLOAD_PARAMS.weightIncrement);
  
  return {
    weight: newWeight,
    reps: lastWorkout.reps,
    sets: lastWorkout.sets,
    restSeconds: lastWorkout.restSeconds || 60,
    message: getRandomMessage('increase'),
    reason: `上次训练表现出色，完成所有 ${lastWorkout.sets} 组且次数达标，建议增加 ${OVERLOAD_PARAMS.weightIncrement}kg 重量`,
    trend: 'increase',
    previousWeight: lastWorkout.weight,
    weightChange: `+${OVERLOAD_PARAMS.weightIncrement}kg`
  };
}

/**
 * 生成降低强度的建议
 * @param {Object} lastWorkout - 上次训练记录
 * @returns {Object} 建议对象
 */
function generateDecreaseSuggestion(lastWorkout) {
  const weightDecrease = lastWorkout.weight * OVERLOAD_PARAMS.weightDecreasePercent;
  const newWeight = roundWeight(Math.max(5, lastWorkout.weight - weightDecrease));
  const newReps = Math.max(OVERLOAD_PARAMS.minReps, lastWorkout.reps - OVERLOAD_PARAMS.repDecrement);
  
  return {
    weight: newWeight,
    reps: newReps,
    sets: lastWorkout.sets,
    restSeconds: (lastWorkout.restSeconds || 60) + 15,  // 增加休息时间
    message: getRandomMessage('decrease'),
    reason: `上次训练未完成目标，建议降低 ${(OVERLOAD_PARAMS.weightDecreasePercent * 100).toFixed(0)}% 重量并减少 ${OVERLOAD_PARAMS.repDecrement} 次，让身体充分恢复`,
    trend: 'decrease',
    previousWeight: lastWorkout.weight,
    weightChange: `-${weightDecrease.toFixed(1)}kg`
  };
}

/**
 * 生成保持当前强度的建议
 * @param {Object} lastWorkout - 上次训练记录
 * @returns {Object} 建议对象
 */
function generateMaintainSuggestion(lastWorkout) {
  return {
    weight: lastWorkout.weight,
    reps: lastWorkout.reps,
    sets: lastWorkout.sets,
    restSeconds: lastWorkout.restSeconds || 60,
    message: getRandomMessage('maintain'),
    reason: '上次训练表现正常，建议保持当前设置，巩固训练效果',
    trend: 'maintain',
    previousWeight: lastWorkout.weight,
    weightChange: '0kg'
  };
}

// ==================== 辅助函数 ====================

/**
 * 计算训练容量（Volume）
 * 训练容量 = 重量 × 次数 × 组数
 * @param {Object} workout - 训练记录
 *   {
 *     weight: number,      // 重量 (kg)
 *     reps: number,        // 每组次数
 *     sets: number,        // 组数
 *     completedReps: Array // 每组实际完成次数（可选）
 *   }
 * @returns {Object} 容量计算结果
 *   {
 *     totalVolume: number,     // 总容量 (kg)
 *     targetVolume: number,    // 目标容量 (kg)
 *     actualVolume: number,    // 实际完成容量 (kg)
 *     completionRate: number   // 完成率 (%)
 *   }
 */
function calculateWorkoutVolume(workout) {
  if (!isValidWorkoutRecord(workout)) {
    console.error('[ProgressiveOverload] 无效的训练记录，无法计算容量');
    return {
      totalVolume: 0,
      targetVolume: 0,
      actualVolume: 0,
      completionRate: 0
    };
  }

  const { weight, reps, sets } = workout;
  
  // 计算目标容量
  const targetVolume = weight * reps * sets;
  
  // 计算实际完成容量
  let actualVolume = 0;
  if (workout.completedReps && Array.isArray(workout.completedReps)) {
    actualVolume = workout.completedReps.reduce((sum, rep) => sum + (weight * rep), 0);
  } else if (workout.completedSets) {
    actualVolume = weight * reps * workout.completedSets;
  }

  // 计算完成率
  const completionRate = targetVolume > 0 ? (actualVolume / targetVolume) * 100 : 0;

  return {
    totalVolume: Math.round(targetVolume),
    targetVolume: Math.round(targetVolume),
    actualVolume: Math.round(actualVolume),
    completionRate: Math.round(completionRate * 10) / 10  // 保留一位小数
  };
}

/**
 * 从本地存储获取动作历史记录
 * @param {string} exerciseId - 动作ID
 * @returns {Array} 历史记录数组
 */
function getExerciseHistory(exerciseId) {
  if (!exerciseId) {
    console.error('[ProgressiveOverload] 动作ID不能为空');
    return [];
  }

  try {
    // 尝试从本地存储读取（适配 UniApp 环境）
    const storageKey = `exercise_history_${exerciseId}`;
    let historyData = null;

    // 检查是否在 UniApp 环境中
    if (typeof uni !== 'undefined' && uni.getStorageSync) {
      historyData = uni.getStorageSync(storageKey);
    } else if (typeof wx !== 'undefined' && wx.getStorageSync) {
      historyData = wx.getStorageSync(storageKey);
    } else if (typeof localStorage !== 'undefined') {
      // 浏览器环境
      historyData = localStorage.getItem(storageKey);
      if (historyData) {
        historyData = JSON.parse(historyData);
      }
    }

    // 返回解析后的数据或空数组
    if (historyData && Array.isArray(historyData)) {
      return historyData;
    }
    
    return [];
  } catch (error) {
    console.error('[ProgressiveOverload] 获取历史记录失败:', error);
    return [];
  }
}

/**
 * 保存训练记录到本地存储
 * @param {Object} record - 训练记录
 *   {
 *     exerciseId: string,   // 动作ID（必填）
 *     date: string,         // 日期（可选，默认当前日期）
 *     weight: number,       // 重量
 *     reps: number,         // 目标次数
 *     sets: number,         // 目标组数
 *     completedSets: number,// 完成组数
 *     completedReps: Array, // 每组完成次数
 *     restSeconds: number,  // 休息时间
 *     notes: string         // 备注
 *   }
 * @returns {boolean} 是否保存成功
 */
function saveExerciseRecord(record) {
  if (!record || !record.exerciseId) {
    console.error('[ProgressiveOverload] 保存失败：动作ID不能为空');
    return false;
  }

  try {
    // 构建完整记录
    const completeRecord = {
      ...record,
      date: record.date || formatDate(new Date()),
      timestamp: Date.now()
    };

    // 获取现有历史记录
    const storageKey = `exercise_history_${record.exerciseId}`;
    let history = getExerciseHistory(record.exerciseId);

    // 添加新记录
    history.push(completeRecord);

    // 限制历史记录数量（保留最近50条）
    if (history.length > 50) {
      history = history.slice(-50);
    }

    // 保存到本地存储
    if (typeof uni !== 'undefined' && uni.setStorageSync) {
      uni.setStorageSync(storageKey, history);
    } else if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(storageKey, history);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } else {
      console.warn('[ProgressiveOverload] 未找到可用的存储接口');
      return false;
    }

    return true;
  } catch (error) {
    console.error('[ProgressiveOverload] 保存训练记录失败:', error);
    return false;
  }
}

// ==================== 工具函数 ====================

/**
 * 验证训练记录是否有效
 * @param {Object} record - 训练记录
 * @returns {boolean} 是否有效
 */
function isValidWorkoutRecord(record) {
  if (!record || typeof record !== 'object') {
    return false;
  }
  
  // 检查必需字段
  const hasWeight = typeof record.weight === 'number' && record.weight > 0;
  const hasReps = typeof record.reps === 'number' && record.reps > 0;
  const hasSets = typeof record.sets === 'number' && record.sets > 0;
  
  return hasWeight && hasReps && hasSets;
}

/**
 * 重量数值四舍五入（保留0.5精度）
 * @param {number} weight - 原始重量
 * @returns {number} 四舍五入后的重量
 */
function roundWeight(weight) {
  // 将重量四舍五入到最接近的 0.5
  return Math.round(weight * 2) / 2;
}

/**
 * 获取随机鼓励消息
 * @param {string} category - 消息类别
 * @returns {string} 随机消息
 */
function getRandomMessage(category) {
  const messages = ENCOURAGEMENT_MESSAGES[category];
  if (!messages || messages.length === 0) {
    return '💪 加油！';
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==================== 导出模块 ====================

// 使用 ES6 模块导出，兼容 uni-app
export {
  suggestNextSet,
  calculateWorkoutVolume,
  getExerciseHistory,
  saveExerciseRecord,
  analyzePerformance,
  formatDate,
  DEFAULT_SUGGESTION,
  OVERLOAD_PARAMS
};

// 默认导出
export default {
  suggestNextSet,
  calculateWorkoutVolume,
  getExerciseHistory,
  saveExerciseRecord,
  analyzePerformance,
  formatDate,
  DEFAULT_SUGGESTION,
  OVERLOAD_PARAMS
};
