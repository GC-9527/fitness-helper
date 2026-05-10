/**
 * 训练数据分析模块
 * Workout Analytics Module
 * 
 * 提供科学的训练数据分析功能，包括：
 * - 训练量计算与分析
 * - 训练强度评估
 * - 进步趋势分析
 * - 训练频率统计
 * - 肌肉群平衡分析
 * - 恢复状态评估
 * - 训练效果预测
 */

// ==================== 常量定义 ====================

// 训练强度等级
const INTENSITY_LEVELS = {
  LOW: { min: 0, max: 50, label: '低强度', color: '#4ade80' },
  MODERATE: { min: 50, max: 70, label: '中等强度', color: '#fbbf24' },
  HIGH: { min: 70, max: 85, label: '高强度', color: '#f97316' },
  VERY_HIGH: { min: 85, max: 100, label: '极高强度', color: '#ef4444' }
};

// RPE (Rate of Perceived Exertion) 等级
const RPE_LEVELS = {
  6: { label: '非常轻松', description: '可以持续对话' },
  7: { label: '轻松', description: '呼吸略微加快' },
  8: { label: '中等', description: '呼吸加快，仍能说话' },
  9: { label: '困难', description: '说话困难' },
  10: { label: '极限', description: '无法说话，接近力竭' }
};

// 肌肉群分类
const MUSCLE_GROUPS = {
  chest: { name: '胸部', exercises: ['俯卧撑', '哑铃飞鸟', '卧推', '夹胸', '双杠臂屈伸'] },
  back: { name: '背部', exercises: ['引体向上', '硬拉', '划船', '下拉', '山羊挺身'] },
  shoulders: { name: '肩部', exercises: ['推举', '侧平举', '前平举', '飞鸟', '面拉'] },
  arms: { name: '手臂', exercises: ['弯举', '臂屈伸', '下压', '锤式弯举'] },
  legs: { name: '腿部', exercises: ['深蹲', '箭步蹲', '腿举', '腿弯举', '腿屈伸', '保加利亚深蹲'] },
  core: { name: '核心', exercises: ['平板支撑', '卷腹', '侧平板', '登山跑', '桥式'] },
  glutes: { name: '臀部', exercises: ['臀桥', '臀推', '后踢', '髋外展'] }
};

// ==================== 核心计算函数 ====================

/**
 * 计算单次训练的总容量
 * @param {Object} workout - 训练记录
 * @returns {number} 总容量 (kg)
 */
function calculateTotalVolume(workout) {
  if (!workout || !workout.exercises) return 0;
  
  let totalVolume = 0;
  workout.exercises.forEach(exercise => {
    if (exercise.sets && Array.isArray(exercise.sets)) {
      exercise.sets.forEach(set => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
        }
      });
    }
  });
  
  return Math.round(totalVolume);
}

/**
 * 计算训练强度指数 (Training Intensity Index)
 * 基于重量、次数和RPE的综合评估
 * @param {Object} workout - 训练记录
 * @returns {Object} 强度分析结果
 */
function calculateIntensityIndex(workout) {
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return { index: 0, level: '未知', color: '#9ca3af' };
  }
  
  let totalIntensity = 0;
  let exerciseCount = 0;
  
  workout.exercises.forEach(exercise => {
    if (exercise.sets && exercise.sets.length > 0) {
      exercise.sets.forEach(set => {
        if (set.weight && set.reps) {
          // 强度公式: 重量 × 次数 × RPE系数 / 100
          const rpeFactor = set.rpe ? (set.rpe / 10) : 0.8;
          const intensity = (set.weight * set.reps * rpeFactor) / 100;
          totalIntensity += intensity;
          exerciseCount++;
        }
      });
    }
  });
  
  const avgIntensity = exerciseCount > 0 ? (totalIntensity / exerciseCount) : 0;
  const normalizedIndex = Math.min(100, Math.round(avgIntensity * 10));
  
  // 确定强度等级
  let level = INTENSITY_LEVELS.LOW;
  if (normalizedIndex >= INTENSITY_LEVELS.VERY_HIGH.min) {
    level = INTENSITY_LEVELS.VERY_HIGH;
  } else if (normalizedIndex >= INTENSITY_LEVELS.HIGH.min) {
    level = INTENSITY_LEVELS.HIGH;
  } else if (normalizedIndex >= INTENSITY_LEVELS.MODERATE.min) {
    level = INTENSITY_LEVELS.MODERATE;
  }
  
  return {
    index: normalizedIndex,
    level: level.label,
    color: level.color,
    rawValue: avgIntensity
  };
}

/**
 * 计算训练密度 (Training Density)
 * 单位时间内的训练容量
 * @param {Object} workout - 训练记录
 * @returns {Object} 密度分析结果
 */
function calculateTrainingDensity(workout) {
  if (!workout || !workout.duration) {
    return { density: 0, volumePerMinute: 0, efficiency: 0 };
  }
  
  const totalVolume = calculateTotalVolume(workout);
  const duration = workout.duration || 1; // 避免除以0
  
  const volumePerMinute = totalVolume / duration;
  
  // 训练效率: 基于容量和时间的综合评分
  const efficiency = Math.min(100, Math.round((volumePerMinute / 50) * 100));
  
  return {
    density: Math.round(volumePerMinute * 10) / 10,
    volumePerMinute: Math.round(volumePerMinute * 10) / 10,
    totalVolume,
    duration,
    efficiency,
    efficiencyLevel: getEfficiencyLevel(efficiency)
  };
}

/**
 * 分析训练频率模式
 * @param {Array} workoutHistory - 训练历史记录数组
 * @returns {Object} 频率分析结果
 */
function analyzeTrainingFrequency(workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) {
    return {
      totalWorkouts: 0,
      weeklyAverage: 0,
      consistency: 0,
      pattern: '无数据'
    };
  }
  
  const sortedHistory = [...workoutHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  const firstDate = new Date(sortedHistory[0].date);
  const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date);
  const daysDiff = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24));
  const weeksDiff = daysDiff / 7;
  
  const totalWorkouts = workoutHistory.length;
  const weeklyAverage = weeksDiff > 0 ? (totalWorkouts / weeksDiff) : totalWorkouts;
  
  // 计算训练一致性 (标准差越小越一致)
  const workoutDates = sortedHistory.map(w => new Date(w.date).getTime());
  const intervals = [];
  for (let i = 1; i < workoutDates.length; i++) {
    intervals.push((workoutDates[i] - workoutDates[i-1]) / (1000 * 60 * 60 * 24));
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length || 1;
  const variance = intervals.reduce((sum, interval) => 
    sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length || 0;
  const stdDev = Math.sqrt(variance);
  
  // 一致性评分 (0-100)
  const consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev * 10))));
  
  // 训练模式判断
  let pattern = '不规律';
  if (weeklyAverage >= 5) pattern = '高频训练';
  else if (weeklyAverage >= 3) pattern = '规律训练';
  else if (weeklyAverage >= 1) pattern = '低频训练';
  
  return {
    totalWorkouts,
    weeklyAverage: Math.round(weeklyAverage * 10) / 10,
    consistency,
    pattern,
    avgInterval: Math.round(avgInterval * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10
  };
}

/**
 * 分析进步趋势
 * @param {Array} exerciseHistory - 单个动作的历史记录
 * @returns {Object} 趋势分析结果
 */
function analyzeProgressTrend(exerciseHistory) {
  if (!exerciseHistory || exerciseHistory.length < 2) {
    return {
      trend: 'insufficient_data',
      trendLabel: '数据不足',
      progressRate: 0,
      predictedNext: null
    };
  }
  
  const sorted = [...exerciseHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // 提取重量数据
  const weights = sorted.map(record => record.weight || 0);
  const firstWeight = weights[0];
  const lastWeight = weights[weights.length - 1];
  
  // 计算线性回归
  const n = weights.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = weights.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * weights[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
  const intercept = (sumY - slope * sumX) / n;
  
  // 计算R² (决定系数)
  const yMean = sumY / n;
  const ssTotal = weights.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = weights.reduce((sum, y, i) => {
    const predicted = slope * i + intercept;
    return sum + Math.pow(y - predicted, 2);
  }, 0);
  const rSquared = ssTotal > 0 ? (1 - ssResidual / ssTotal) : 0;
  
  // 进步率 (%)
  const progressRate = firstWeight > 0 
    ? ((lastWeight - firstWeight) / firstWeight) * 100 
    : 0;
  
  // 判断趋势
  let trend = 'stable';
  let trendLabel = '稳定';
  
  if (slope > 0.5 && rSquared > 0.3) {
    trend = 'improving';
    trendLabel = '进步中';
  } else if (slope < -0.5 && rSquared > 0.3) {
    trend = 'declining';
    trendLabel = '退步中';
  } else if (Math.abs(slope) < 0.5) {
    trend = 'plateau';
    trendLabel = '平台期';
  }
  
  // 预测下次重量
  const predictedNext = Math.max(0, Math.round((slope * n + intercept) * 10) / 10);
  
  return {
    trend,
    trendLabel,
    progressRate: Math.round(progressRate * 10) / 10,
    slope: Math.round(slope * 100) / 100,
    rSquared: Math.round(rSquared * 100) / 100,
    predictedNext,
    firstWeight,
    lastWeight,
    dataPoints: n
  };
}

/**
 * 分析肌肉群训练分布
 * @param {Array} workoutHistory - 训练历史记录数组
 * @returns {Object} 肌肉群分析结果
 */
function analyzeMuscleGroupDistribution(workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) {
    return { distribution: {}, balance: 0, recommendations: [] };
  }
  
  const groupCounts = {};
  const groupVolume = {};
  
  // 初始化
  Object.keys(MUSCLE_GROUPS).forEach(key => {
    groupCounts[key] = 0;
    groupVolume[key] = 0;
  });
  
  // 统计各肌肉群训练次数和容量
  workoutHistory.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        const exerciseName = exercise.name || '';
        
        Object.keys(MUSCLE_GROUPS).forEach(groupKey => {
          const group = MUSCLE_GROUPS[groupKey];
          const isMatch = group.exercises.some(keyword => 
            exerciseName.includes(keyword)
          );
          
          if (isMatch) {
            groupCounts[groupKey]++;
            
            // 计算该动作的容量
            if (exercise.sets) {
              exercise.sets.forEach(set => {
                if (set.weight && set.reps) {
                  groupVolume[groupKey] += set.weight * set.reps;
                }
              });
            }
          }
        });
      });
    }
  });
  
  // 计算分布百分比
  const totalCount = Object.values(groupCounts).reduce((a, b) => a + b, 0);
  const distribution = {};
  
  Object.keys(groupCounts).forEach(key => {
    distribution[key] = {
      name: MUSCLE_GROUPS[key].name,
      count: groupCounts[key],
      percentage: totalCount > 0 ? Math.round((groupCounts[key] / totalCount) * 100) : 0,
      volume: Math.round(groupVolume[key])
    };
  });
  
  // 计算平衡度 (标准差越小越平衡)
  const percentages = Object.values(distribution).map(d => d.percentage);
  const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const variance = percentages.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / percentages.length;
  const balance = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance))));
  
  // 生成建议
  const recommendations = generateMuscleGroupRecommendations(distribution);
  
  return {
    distribution,
    balance,
    recommendations
  };
}

/**
 * 计算恢复状态评估
 * @param {Array} workoutHistory - 训练历史记录数组
 * @returns {Object} 恢复状态分析
 */
function calculateRecoveryStatus(workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) {
    return {
      status: 'unknown',
      statusLabel: '未知',
      lastWorkoutDays: null,
      recommendation: '开始记录训练数据'
    };
  }
  
  const sorted = [...workoutHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const lastWorkout = sorted[0];
  const lastDate = new Date(lastWorkout.date);
  const today = new Date();
  const daysSinceLastWorkout = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  
  // 计算最近7天的训练强度
  const last7Days = sorted.filter(w => {
    const workoutDate = new Date(w.date);
    const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });
  
  const recentIntensity = last7Days.reduce((sum, w) => {
    const intensity = calculateIntensityIndex(w);
    return sum + intensity.index;
  }, 0) / (last7Days.length || 1);
  
  // 判断恢复状态
  let status = 'recovered';
  let statusLabel = '已恢复';
  let recommendation = '可以进行下一次训练';
  
  if (daysSinceLastWorkout === 0) {
    status = 'just_trained';
    statusLabel = '刚训练完';
    recommendation = '今天已经训练过，建议休息或进行轻度活动';
  } else if (daysSinceLastWorkout === 1 && recentIntensity > 70) {
    status = 'recovering';
    statusLabel = '恢复中';
    recommendation = '昨天进行了高强度训练，建议今天休息或进行主动恢复';
  } else if (daysSinceLastWorkout >= 3 && recentIntensity < 50) {
    status = 'undertrained';
    statusLabel = '训练不足';
    recommendation = '已经休息较长时间，建议安排训练';
  }
  
  return {
    status,
    statusLabel,
    lastWorkoutDays: daysSinceLastWorkout,
    recentIntensity: Math.round(recentIntensity),
    workoutsLast7Days: last7Days.length,
    recommendation
  };
}

/**
 * 计算训练周期化分析
 * @param {Array} workoutHistory - 训练历史记录数组
 * @param {number} periodDays - 周期天数 (默认28天)
 * @returns {Object} 周期化分析结果
 */
function analyzePeriodization(workoutHistory, periodDays = 28) {
  if (!workoutHistory || workoutHistory.length === 0) {
    return { periods: [], currentPhase: 'unknown' };
  }
  
  const today = new Date();
  const periods = [];
  
  // 按周期分组
  for (let i = 0; i < 3; i++) {
    const periodEnd = new Date(today);
    periodEnd.setDate(today.getDate() - (i * periodDays));
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodEnd.getDate() - periodDays);
    
    const periodWorkouts = workoutHistory.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= periodStart && workoutDate < periodEnd;
    });
    
    if (periodWorkouts.length > 0) {
      const totalVolume = periodWorkouts.reduce((sum, w) => sum + calculateTotalVolume(w), 0);
      const avgIntensity = periodWorkouts.reduce((sum, w) => {
        return sum + calculateIntensityIndex(w).index;
      }, 0) / periodWorkouts.length;
      
      periods.push({
        period: i === 0 ? '当前周期' : `前${i + 1}周期`,
        startDate: formatDate(periodStart),
        endDate: formatDate(periodEnd),
        workoutCount: periodWorkouts.length,
        totalVolume,
        avgIntensity: Math.round(avgIntensity),
        trend: 'stable'
      });
    }
  }
  
  // 判断当前训练阶段
  let currentPhase = 'maintenance';
  if (periods.length >= 2) {
    const current = periods[0];
    const previous = periods[1];
    
    if (current.totalVolume > previous.totalVolume * 1.1) {
      currentPhase = 'progression';
    } else if (current.totalVolume < previous.totalVolume * 0.9) {
      currentPhase = 'deload';
    }
  }
  
  return {
    periods,
    currentPhase,
    phaseLabel: getPhaseLabel(currentPhase)
  };
}

/**
 * 生成综合训练报告
 * @param {Array} workoutHistory - 训练历史记录数组
 * @returns {Object} 综合训练报告
 */
function generateComprehensiveReport(workoutHistory) {
  if (!workoutHistory || workoutHistory.length === 0) {
    return {
      summary: '暂无训练数据',
      recommendations: ['开始记录你的第一次训练吧！']
    };
  }
  
  const frequency = analyzeTrainingFrequency(workoutHistory);
  const muscleDistribution = analyzeMuscleGroupDistribution(workoutHistory);
  const recovery = calculateRecoveryStatus(workoutHistory);
  const periodization = analyzePeriodization(workoutHistory);
  
  // 计算总体评分
  const consistencyScore = frequency.consistency;
  const balanceScore = muscleDistribution.balance;
  const recoveryScore = recovery.status === 'recovered' ? 100 : 
                       recovery.status === 'recovering' ? 70 : 50;
  
  const overallScore = Math.round((consistencyScore + balanceScore + recoveryScore) / 3);
  
  // 生成个性化建议
  const recommendations = [];
  
  if (frequency.weeklyAverage < 2) {
    recommendations.push('建议增加训练频率，每周至少训练2-3次');
  }
  
  if (muscleDistribution.balance < 60) {
    recommendations.push('肌肉群训练不够均衡，建议调整训练计划');
  }
  
  if (recovery.status === 'undertrained') {
    recommendations.push('休息已久，是时候开始新的训练了！');
  } else if (recovery.status === 'just_trained') {
    recommendations.push('今天已经训练过，注意充分休息和恢复');
  }
  
  return {
    overallScore,
    scoreLevel: getScoreLevel(overallScore),
    frequency,
    muscleDistribution,
    recovery,
    periodization,
    recommendations: recommendations.length > 0 ? recommendations : ['继续保持良好的训练习惯！'],
    summary: generateSummary(frequency, muscleDistribution, recovery)
  };
}

// ==================== 辅助函数 ====================

function getEfficiencyLevel(efficiency) {
  if (efficiency >= 80) return { label: '高效', color: '#4ade80' };
  if (efficiency >= 60) return { label: '良好', color: '#fbbf24' };
  if (efficiency >= 40) return { label: '一般', color: '#f97316' };
  return { label: '需改进', color: '#ef4444' };
}

function getPhaseLabel(phase) {
  const labels = {
    progression: '增肌期',
    maintenance: '维持期',
    deload: '减载期',
    unknown: '未知'
  };
  return labels[phase] || '未知';
}

function getScoreLevel(score) {
  if (score >= 90) return { label: '优秀', color: '#4ade80' };
  if (score >= 75) return { label: '良好', color: '#60a5fa' };
  if (score >= 60) return { label: '及格', color: '#fbbf24' };
  return { label: '需改进', color: '#ef4444' };
}

function generateMuscleGroupRecommendations(distribution) {
  const recommendations = [];
  const groups = Object.values(distribution);
  const avgPercentage = groups.reduce((sum, g) => sum + g.percentage, 0) / groups.length;
  
  groups.forEach(group => {
    if (group.percentage < avgPercentage * 0.5 && group.percentage < 10) {
      recommendations.push(`建议增加${group.name}的训练，目前占比偏低`);
    }
  });
  
  return recommendations;
}

function generateSummary(frequency, muscleDistribution, recovery) {
  const parts = [];
  
  parts.push(`训练频率: ${frequency.pattern}`);
  parts.push(`肌肉平衡: ${muscleDistribution.balance >= 70 ? '良好' : '需改善'}`);
  parts.push(`恢复状态: ${recovery.statusLabel}`);
  
  return parts.join('，');
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==================== 导出模块 ====================

export {
  calculateTotalVolume,
  calculateIntensityIndex,
  calculateTrainingDensity,
  analyzeTrainingFrequency,
  analyzeProgressTrend,
  analyzeMuscleGroupDistribution,
  calculateRecoveryStatus,
  analyzePeriodization,
  generateComprehensiveReport,
  INTENSITY_LEVELS,
  RPE_LEVELS,
  MUSCLE_GROUPS
};

export default {
  calculateTotalVolume,
  calculateIntensityIndex,
  calculateTrainingDensity,
  analyzeTrainingFrequency,
  analyzeProgressTrend,
  analyzeMuscleGroupDistribution,
  calculateRecoveryStatus,
  analyzePeriodization,
  generateComprehensiveReport,
  INTENSITY_LEVELS,
  RPE_LEVELS,
  MUSCLE_GROUPS
};
