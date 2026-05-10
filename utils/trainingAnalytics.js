/**
 * 训练数据分析模块 - Training Analytics Module
 * 
 * 基于科学计算函数，分析用户训练数据，提供专业的训练洞察
 * 包括：容量分析、强度分析、频率分析、趋势预测、效果评估等
 */

// ==================== 常量定义 ====================

// 训练强度等级划分
const INTENSITY_LEVELS = {
  LOW: { min: 0, max: 60, label: '低强度', color: '#4ade80' },
  MODERATE: { min: 60, max: 75, label: '中等强度', color: '#f59e0b' },
  HIGH: { min: 75, max: 85, label: '高强度', color: '#f97316' },
  VERY_HIGH: { min: 85, max: 95, label: '极高强度', color: '#ef4444' },
  MAXIMAL: { min: 95, max: 100, label: '极限强度', color: '#dc2626' }
};

// 训练频率评估标准（每周训练天数）
const FREQUENCY_STANDARDS = {
  BEGINNER: { min: 2, max: 3, label: '初学者', description: '适合建立训练习惯' },
  INTERMEDIATE: { min: 3, max: 5, label: '进阶者', description: '平衡训练与恢复' },
  ADVANCED: { min: 5, max: 6, label: '高级训练者', description: '高强度训练计划' },
  ELITE: { min: 6, max: 7, label: '精英运动员', description: '需要精细恢复管理' }
};

// 容量计算参数
const VOLUME_PARAMS = {
  // 每周推荐容量范围（基于MEV-MRV理论）
  MEV: 10, // 最小有效容量
  MAV: 20, // 适应性容量
  MRV: 30, // 最大可恢复容量
  // 容量增长建议
  WEEKLY_INCREASE_RATE: 0.05 // 每周建议增长5%
};

// 恢复评估参数
const RECOVERY_PARAMS = {
  // 肌群恢复时间（小时）
  MUSCLE_RECOVERY_TIME: {
    small: 24,   // 小肌群（手臂、小腿）
    medium: 48,  // 中肌群（胸、肩、背）
    large: 72    // 大肌群（腿、臀）
  },
  // 训练间隔建议
  MIN_REST_DAYS: 1,
  OPTIMAL_REST_DAYS: 2
};

// ==================== 辅助函数 ====================

/**
 * 获取动作的组详情数组
 * 兼容不同数据结构：setDetails（新）是数组，sets（旧）可能是数字或数组
 * @param {Object} exercise - 训练动作对象
 * @returns {Array} 组详情数组
 */
function getSetDetails(exercise) {
  if (!exercise) return [];
  
  // 优先使用 setDetails（新的数据结构）
  if (exercise.setDetails && Array.isArray(exercise.setDetails)) {
    return exercise.setDetails;
  }
  
  // 兼容旧数据结构：sets 可能是数组
  if (Array.isArray(exercise.sets)) {
    return exercise.sets;
  }
  
  // 如果 sets 是数字（表示组数），返回空数组
  return [];
}

// ==================== 核心分析函数 ====================

/**
 * 计算训练容量（Volume）
 * 科学公式：容量 = 重量 × 次数 × 组数
 * @param {Array} exercises - 训练动作数组
 * @returns {Object} 容量分析结果
 */
function calculateTrainingVolume(exercises) {
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    return {
      totalVolume: 0,
      volumeByExercise: {},
      volumeByMuscle: {},
      relativeVolume: 0
    };
  }

  let totalVolume = 0;
  const volumeByExercise = {};
  const volumeByMuscle = {};

  exercises.forEach(exercise => {
    const setDetails = getSetDetails(exercise);
    let exerciseVolume = 0;

    setDetails.forEach(set => {
      if (set.weight && set.reps) {
        const setVolume = set.weight * set.reps;
        exerciseVolume += setVolume;
        totalVolume += setVolume;
      }
    });

    // 按动作统计
    volumeByExercise[exercise.name || exercise.id] = exerciseVolume;

    // 按肌群统计
    const muscleGroups = exercise.muscleGroups || ['unknown'];
    muscleGroups.forEach(muscle => {
      if (!volumeByMuscle[muscle]) {
        volumeByMuscle[muscle] = 0;
      }
      volumeByMuscle[muscle] += exerciseVolume;
    });
  });

  return {
    totalVolume,
    volumeByExercise,
    volumeByMuscle,
    relativeVolume: totalVolume / (exercises.length || 1) // 平均每个动作的容量
  };
}

/**
 * 计算训练强度（Intensity）
 * 基于1RM百分比和RPE（主观用力程度）
 * @param {Array} exercises - 训练动作数组
 * @param {Object} oneRMData - 各动作的1RM数据
 * @returns {Object} 强度分析结果
 */
function calculateTrainingIntensity(exercises, oneRMData = {}) {
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    return {
      averageIntensity: 0,
      intensityByExercise: {},
      intensityLevel: 'unknown',
      rpe: 0
    };
  }

  const intensityByExercise = {};
  let totalIntensity = 0;
  let validExercises = 0;

  exercises.forEach(exercise => {
    const oneRM = oneRMData[exercise.id] || estimateOneRM(exercise);
    if (!oneRM) return;

    // 计算该动作的平均使用重量
    const setDetails = getSetDetails(exercise);
    let avgWeight = 0;
    let validSets = 0;

    setDetails.forEach(set => {
      if (set.weight) {
        avgWeight += set.weight;
        validSets++;
      }
    });

    if (validSets > 0) {
      avgWeight /= validSets;
      const intensityPercent = (avgWeight / oneRM) * 100;
      intensityByExercise[exercise.name || exercise.id] = {
        percentage: intensityPercent,
        avgWeight,
        oneRM,
        level: getIntensityLevel(intensityPercent)
      };
      totalIntensity += intensityPercent;
      validExercises++;
    }
  });

  const averageIntensity = validExercises > 0 ? totalIntensity / validExercises : 0;

  return {
    averageIntensity,
    intensityByExercise,
    intensityLevel: getIntensityLevel(averageIntensity),
    rpe: intensityToRPE(averageIntensity)
  };
}

/**
 * 估算1RM（一次最大重量）
 * 使用Epley公式：1RM = 重量 × (1 + 次数/30)
 * @param {Object} exercise - 训练动作
 * @returns {number} 估算的1RM
 */
function estimateOneRM(exercise) {
  const setDetails = getSetDetails(exercise);
  if (setDetails.length === 0) return 0;

  // 找到重量最大的一组
  let maxSet = null;
  let maxWeight = 0;

  setDetails.forEach(set => {
    if (set.weight && set.weight > maxWeight) {
      maxWeight = set.weight;
      maxSet = set;
    }
  });

  if (!maxSet || !maxSet.reps) return maxWeight;

  // Epley公式
  return maxSet.weight * (1 + maxSet.reps / 30);
}

/**
 * 获取强度等级
 * @param {number} percentage - 强度百分比
 * @returns {string} 强度等级
 */
function getIntensityLevel(percentage) {
  for (const [level, range] of Object.entries(INTENSITY_LEVELS)) {
    if (percentage >= range.min && percentage < range.max) {
      return level;
    }
  }
  return 'MAXIMAL';
}

/**
 * 强度转换为RPE（主观用力程度）
 * @param {number} intensity - 强度百分比
 * @returns {number} RPE值（1-10）
 */
function intensityToRPE(intensity) {
  // 简化的转换公式
  if (intensity >= 95) return 10;
  if (intensity >= 90) return 9;
  if (intensity >= 85) return 8;
  if (intensity >= 80) return 7;
  if (intensity >= 75) return 6;
  if (intensity >= 70) return 5;
  if (intensity >= 60) return 4;
  return 3;
}

/**
 * 分析训练频率
 * @param {Array} workoutHistory - 训练历史记录
 * @param {number} days - 分析天数范围
 * @returns {Object} 频率分析结果
 */
function analyzeTrainingFrequency(workoutHistory, days = 30) {
  if (!workoutHistory || !Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return {
      totalWorkouts: 0,
      frequencyPerWeek: 0,
      frequencyLevel: 'unknown',
      restDays: [],
      consistency: 0
    };
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // 过滤最近days天的记录
  const recentWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= cutoffDate;
  });

  // 计算频率
  const totalWorkouts = recentWorkouts.length;
  const frequencyPerWeek = (totalWorkouts / days) * 7;

  // 分析训练日期分布
  const workoutDates = recentWorkouts.map(w => new Date(w.date).toDateString());
  const uniqueDates = [...new Set(workoutDates)];

  // 计算连续训练天数和休息日
  const restDays = calculateRestDays(uniqueDates);

  // 评估一致性（训练日期的标准差）
  const consistency = calculateConsistency(uniqueDates);

  // 确定频率等级
  let frequencyLevel = 'BEGINNER';
  for (const [level, standard] of Object.entries(FREQUENCY_STANDARDS)) {
    if (frequencyPerWeek >= standard.min && frequencyPerWeek <= standard.max) {
      frequencyLevel = level;
      break;
    }
  }

  return {
    totalWorkouts,
    frequencyPerWeek: Math.round(frequencyPerWeek * 10) / 10,
    frequencyLevel,
    restDays,
    consistency: Math.round(consistency * 100),
    uniqueDates: uniqueDates.length
  };
}

/**
 * 计算休息日分布
 * @param {Array} workoutDates - 训练日期数组
 * @returns {Array} 休息日信息
 */
function calculateRestDays(workoutDates) {
  if (workoutDates.length < 2) return [];

  const sortedDates = workoutDates
    .map(d => new Date(d))
    .sort((a, b) => a - b);

  const restDays = [];
  for (let i = 1; i < sortedDates.length; i++) {
    const diffTime = sortedDates[i] - sortedDates[i - 1];
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      restDays.push({
        start: sortedDates[i - 1],
        end: sortedDates[i],
        days: diffDays - 1
      });
    }
  }

  return restDays;
}

/**
 * 计算训练一致性
 * @param {Array} workoutDates - 训练日期数组
 * @returns {number} 一致性评分（0-1）
 */
function calculateConsistency(workoutDates) {
  if (workoutDates.length < 2) return 1;

  const sortedDates = workoutDates
    .map(d => new Date(d).getTime())
    .sort((a, b) => a - b);

  // 计算间隔
  const intervals = [];
  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    intervals.push(diffDays);
  }

  // 计算标准差
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  // 一致性评分（标准差越小，一致性越高）
  const consistency = Math.max(0, 1 - (stdDev / 7));
  return consistency;
}

/**
 * 分析训练趋势
 * @param {Array} workoutHistory - 训练历史记录
 * @param {string} metric - 分析指标（volume/intensity/frequency）
 * @param {number} period - 分析周期（天）
 * @returns {Object} 趋势分析结果
 */
function analyzeTrainingTrend(workoutHistory, metric = 'volume', period = 30) {
  if (!workoutHistory || !Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return {
      trend: 'stable',
      trendRate: 0,
      prediction: null,
      dataPoints: []
    };
  }

  // 按日期分组数据
  const dataByDate = {};
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - period);

  workoutHistory.forEach(workout => {
    const workoutDate = new Date(workout.date);
    if (workoutDate < cutoffDate) return;

    const dateKey = workout.date;
    if (!dataByDate[dateKey]) {
      dataByDate[dateKey] = [];
    }
    dataByDate[dateKey].push(workout);
  });

  // 计算每日指标
  const dataPoints = [];
  Object.keys(dataByDate).sort().forEach(date => {
    const workouts = dataByDate[date];
    let value = 0;

    switch (metric) {
      case 'volume':
        value = workouts.reduce((sum, w) => {
          const vol = calculateTrainingVolume(w.exercises || []);
          return sum + vol.totalVolume;
        }, 0);
        break;
      case 'duration':
        value = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        break;
      case 'frequency':
        value = workouts.length;
        break;
      default:
        value = workouts.length;
    }

    dataPoints.push({ date, value });
  });

  // 线性回归分析趋势
  const trend = calculateLinearRegression(dataPoints);

  // 预测未来值
  const prediction = predictFutureValue(dataPoints, trend.slope, 7);

  return {
    trend: trend.slope > 0.05 ? 'increasing' : trend.slope < -0.05 ? 'decreasing' : 'stable',
    trendRate: Math.round(trend.slope * 100) / 100,
    correlation: trend.correlation,
    prediction,
    dataPoints
  };
}

/**
 * 线性回归计算
 * @param {Array} dataPoints - 数据点数组
 * @returns {Object} 回归结果
 */
function calculateLinearRegression(dataPoints) {
  const n = dataPoints.length;
  if (n < 2) return { slope: 0, intercept: 0, correlation: 0 };

  const x = dataPoints.map((_, i) => i);
  const y = dataPoints.map(p => p.value);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // 计算相关系数
  const correlation = (n * sumXY - sumX * sumY) / 
    Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return { slope, intercept, correlation: correlation || 0 };
}

/**
 * 预测未来值
 * @param {Array} dataPoints - 历史数据点
 * @param {number} slope - 趋势斜率
 * @param {number} days - 预测天数
 * @returns {Object} 预测结果
 */
function predictFutureValue(dataPoints, slope, days) {
  if (dataPoints.length === 0) return null;

  const lastValue = dataPoints[dataPoints.length - 1].value;
  const predictedValue = lastValue + slope * days;

  return {
    days,
    currentValue: lastValue,
    predictedValue: Math.max(0, predictedValue),
    change: Math.round((predictedValue - lastValue) / lastValue * 100) || 0
  };
}

/**
 * 评估训练效果
 * @param {Array} workoutHistory - 训练历史记录
 * @param {number} period - 评估周期（天）
 * @returns {Object} 效果评估结果
 */
function evaluateTrainingEffectiveness(workoutHistory, period = 30) {
  if (!workoutHistory || !Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return {
      overall: 0,
      categories: {},
      recommendations: []
    };
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - period);

  const recentWorkouts = workoutHistory.filter(w => new Date(w.date) >= cutoffDate);

  // 计算各项指标
  const volumeAnalysis = analyzeVolumeProgression(recentWorkouts);
  const consistencyAnalysis = analyzeConsistency(recentWorkouts);
  const balanceAnalysis = analyzeMuscleBalance(recentWorkouts);
  const recoveryAnalysis = analyzeRecovery(recentWorkouts);

  // 综合评分
  const overall = Math.round(
    (volumeAnalysis.score * 0.3 +
    consistencyAnalysis.score * 0.3 +
    balanceAnalysis.score * 0.2 +
    recoveryAnalysis.score * 0.2) * 10
  ) / 10;

  // 生成建议
  const recommendations = generateRecommendations({
    volume: volumeAnalysis,
    consistency: consistencyAnalysis,
    balance: balanceAnalysis,
    recovery: recoveryAnalysis
  });

  return {
    overall,
    categories: {
      volume: volumeAnalysis,
      consistency: consistencyAnalysis,
      balance: balanceAnalysis,
      recovery: recoveryAnalysis
    },
    recommendations
  };
}

/**
 * 分析容量进展
 * @param {Array} workouts - 训练记录
 * @returns {Object} 容量分析结果
 */
function analyzeVolumeProgression(workouts) {
  if (workouts.length < 2) {
    return { score: 5, status: 'insufficient_data', trend: 'stable' };
  }

  // 按周分组计算容量
  const weeklyVolumes = {};
  workouts.forEach(workout => {
    const date = new Date(workout.date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    
    if (!weeklyVolumes[weekKey]) {
      weeklyVolumes[weekKey] = 0;
    }
    
    const vol = calculateTrainingVolume(workout.exercises || []);
    weeklyVolumes[weekKey] += vol.totalVolume;
  });

  const volumes = Object.values(weeklyVolumes);
  if (volumes.length < 2) {
    return { score: 5, status: 'insufficient_data', trend: 'stable' };
  }

  // 计算趋势
  const firstHalf = volumes.slice(0, Math.floor(volumes.length / 2));
  const secondHalf = volumes.slice(Math.floor(volumes.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  let score = 5;
  let trend = 'stable';
  
  if (change > 10) {
    score = 8;
    trend = 'increasing_well';
  } else if (change > 5) {
    score = 7;
    trend = 'increasing';
  } else if (change > -5) {
    score = 6;
    trend = 'stable';
  } else {
    score = 4;
    trend = 'decreasing';
  }

  return {
    score,
    trend,
    change: Math.round(change * 10) / 10,
    weeklyVolumes: volumes
  };
}

/**
 * 获取周数
 * @param {Date} date - 日期
 * @returns {number} 周数
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * 分析训练一致性
 * @param {Array} workouts - 训练记录
 * @returns {Object} 一致性分析结果
 */
function analyzeConsistency(workouts) {
  if (workouts.length === 0) {
    return { score: 0, status: 'no_data' };
  }

  const dates = workouts.map(w => new Date(w.date));
  const consistency = calculateConsistency(dates);
  
  const score = Math.round(consistency * 10);
  
  return {
    score,
    consistency: Math.round(consistency * 100),
    status: score >= 7 ? 'good' : score >= 5 ? 'average' : 'needs_improvement'
  };
}

/**
 * 分析肌群平衡
 * @param {Array} workouts - 训练记录
 * @returns {Object} 平衡分析结果
 */
function analyzeMuscleBalance(workouts) {
  const muscleVolumes = {};
  
  workouts.forEach(workout => {
    const vol = calculateTrainingVolume(workout.exercises || []);
    Object.entries(vol.volumeByMuscle).forEach(([muscle, volume]) => {
      if (!muscleVolumes[muscle]) {
        muscleVolumes[muscle] = 0;
      }
      muscleVolumes[muscle] += volume;
    });
  });

  const volumes = Object.values(muscleVolumes);
  if (volumes.length < 2) {
    return { score: 5, status: 'insufficient_data' };
  }

  // 计算变异系数（标准差/平均值）
  const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const variance = volumes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / volumes.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  // CV越小，平衡性越好
  let score = Math.round((1 - Math.min(cv, 1)) * 10);
  
  return {
    score,
    muscleVolumes,
    balance: Math.round((1 - cv) * 100),
    status: score >= 7 ? 'balanced' : score >= 5 ? 'moderate' : 'imbalanced'
  };
}

/**
 * 分析恢复情况
 * @param {Array} workouts - 训练记录
 * @returns {Object} 恢复分析结果
 */
function analyzeRecovery(workouts) {
  if (workouts.length < 2) {
    return { score: 5, status: 'insufficient_data' };
  }

  const restDays = calculateRestDays(workouts.map(w => w.date));
  const avgRestDays = restDays.length > 0 
    ? restDays.reduce((sum, r) => sum + r.days, 0) / restDays.length 
    : 0;

  let score = 5;
  if (avgRestDays >= 2 && avgRestDays <= 3) {
    score = 8;
  } else if (avgRestDays >= 1 && avgRestDays < 2) {
    score = 6;
  } else if (avgRestDays > 3) {
    score = 5;
  } else {
    score = 4;
  }

  return {
    score,
    avgRestDays: Math.round(avgRestDays * 10) / 10,
    restPeriods: restDays.length,
    status: score >= 7 ? 'good' : score >= 5 ? 'adequate' : 'insufficient'
  };
}

/**
 * 生成训练建议
 * @param {Object} analyses - 各项分析结果
 * @returns {Array} 建议列表
 */
function generateRecommendations(analyses) {
  const recommendations = [];

  // 容量建议
  if (analyses.volume.score < 5) {
    recommendations.push({
      type: 'volume',
      priority: 'high',
      message: '训练容量呈下降趋势，建议逐步增加训练量或检查恢复情况',
      action: '考虑增加每组的次数或组数'
    });
  } else if (analyses.volume.score >= 8) {
    recommendations.push({
      type: 'volume',
      priority: 'low',
      message: '容量进展良好，保持当前训练节奏',
      action: '继续渐进超负荷原则'
    });
  }

  // 一致性建议
  if (analyses.consistency.score < 5) {
    recommendations.push({
      type: 'consistency',
      priority: 'high',
      message: '训练频率不够稳定，建议制定固定的训练计划',
      action: '设定每周固定的训练日'
    });
  }

  // 平衡性建议
  if (analyses.balance.score < 5) {
    recommendations.push({
      type: 'balance',
      priority: 'medium',
      message: '肌群训练不够均衡，注意全面发展',
      action: '增加弱势肌群的训练量'
    });
  }

  // 恢复建议
  if (analyses.recovery.score < 5) {
    recommendations.push({
      type: 'recovery',
      priority: 'high',
      message: '恢复时间可能不足，注意过度训练风险',
      action: '增加休息日或降低训练强度'
    });
  }

  return recommendations;
}

// ==================== 数据格式化函数 ====================

/**
 * 格式化训练数据用于图表展示
 * @param {Array} workoutHistory - 训练历史
 * @param {string} chartType - 图表类型
 * @param {string} selectedExerciseName - 选中的动作名称（用于力量图表）
 * @returns {Object} 格式化后的数据
 */
function formatDataForChart(workoutHistory, chartType = 'volume', selectedExerciseName = null) {
  switch (chartType) {
    case 'volume':
      return formatVolumeChartData(workoutHistory);
    case 'strength':
      return formatStrengthChartData(workoutHistory, selectedExerciseName);
    case 'frequency':
      return formatFrequencyChartData(workoutHistory);
    case 'muscle':
      return formatMuscleDistributionData(workoutHistory);
    default:
      return formatVolumeChartData(workoutHistory);
  }
}

/**
 * 格式化容量图表数据
 * @param {Array} workoutHistory - 训练历史
 * @returns {Object} 图表数据
 */
function formatVolumeChartData(workoutHistory) {
  const dataByDate = {};
  
  workoutHistory.forEach(workout => {
    const date = workout.date;
    if (!dataByDate[date]) {
      dataByDate[date] = 0;
    }
    const vol = calculateTrainingVolume(workout.exercises || []);
    dataByDate[date] += vol.totalVolume;
  });

  const sortedDates = Object.keys(dataByDate).sort();
  
  return {
    categories: sortedDates.map(date => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    series: [{
      name: '训练容量',
      data: sortedDates.map(date => dataByDate[date])
    }]
  };
}

/**
 * 格式化力量图表数据
 * @param {Array} workoutHistory - 训练历史
 * @param {string} selectedExerciseName - 选中的动作名称（可选）
 * @returns {Object} 图表数据
 */
function formatStrengthChartData(workoutHistory, selectedExerciseName = null) {
  const dataByExercise = {};
  
  workoutHistory.forEach(workout => {
    const exercises = workout.exercises || [];
    exercises.forEach(exercise => {
      const name = exercise.name || exercise.id;
      if (!dataByExercise[name]) {
        dataByExercise[name] = [];
      }
      
      // 收集该动作的所有组数据
      const setDetails = getSetDetails(exercise);
      if (setDetails.length > 0) {
        // 过滤掉重量为0的组（热身组或空杆）
        const validSets = setDetails.filter(s => (s.weight || 0) > 0 && (s.reps || 0) > 0);
        
        if (validSets.length > 0) {
          validSets.forEach(set => {
            dataByExercise[name].push({
              date: workout.date,
              weight: set.weight,
              reps: set.reps
            });
          });
        }
      }
    });
  });

  // 如果指定了选中的动作，使用该动作；否则选择数据最多的动作
  let targetExercise = selectedExerciseName;
  if (!targetExercise || !dataByExercise[targetExercise]) {
    targetExercise = Object.keys(dataByExercise)
      .sort((a, b) => dataByExercise[b].length - dataByExercise[a].length)[0];
  }

  if (!targetExercise || !dataByExercise[targetExercise]) {
    return { categories: [], series: [], details: [] };
  }

  // 按日期排序，然后按重量排序（同一日期内按重量从小到大）
  let allData = dataByExercise[targetExercise].sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date);
    if (dateDiff !== 0) return dateDiff;
    return a.weight - b.weight; // 同一日期内按重量从小到大
  });

  // 按日期分组，计算每天的最小重量和最大重量
  const dataByDate = {};
  allData.forEach(item => {
    if (!dataByDate[item.date]) {
      dataByDate[item.date] = {
        weights: [],
        minWeight: item.weight,
        maxWeight: item.weight
      };
    }
    dataByDate[item.date].weights.push(item.weight);
    if (item.weight < dataByDate[item.date].minWeight) {
      dataByDate[item.date].minWeight = item.weight;
    }
    if (item.weight > dataByDate[item.date].maxWeight) {
      dataByDate[item.date].maxWeight = item.weight;
    }
  });

  // 按日期排序
  const sortedDates = Object.keys(dataByDate).sort((a, b) => new Date(a) - new Date(b));

  console.log('[TrainingAnalytics] 力量图表数据:', {
    targetExercise,
    totalSets: allData.length,
    dates: sortedDates,
    minWeights: sortedDates.map(d => dataByDate[d].minWeight),
    maxWeights: sortedDates.map(d => dataByDate[d].maxWeight)
  });

  return {
    categories: sortedDates.map(date => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    series: [
      {
        name: '起始重量',
        data: sortedDates.map(d => dataByDate[d].minWeight)
      },
      {
        name: '结束重量',
        data: sortedDates.map(d => dataByDate[d].maxWeight)
      }
    ],
    details: allData
  };
}

/**
 * 格式化频率图表数据
 * @param {Array} workoutHistory - 训练历史
 * @returns {Object} 图表数据
 */
function formatFrequencyChartData(workoutHistory) {
  const dataByWeek = {};
  
  workoutHistory.forEach(workout => {
    const date = new Date(workout.date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    
    if (!dataByWeek[weekKey]) {
      dataByWeek[weekKey] = 0;
    }
    dataByWeek[weekKey]++;
  });

  const sortedWeeks = Object.keys(dataByWeek).sort();
  
  return {
    categories: sortedWeeks,
    series: [{
      name: '训练次数',
      data: sortedWeeks.map(week => dataByWeek[week])
    }]
  };
}

/**
 * 格式化肌群分布数据
 * @param {Array} workoutHistory - 训练历史
 * @returns {Object} 图表数据
 */
function formatMuscleDistributionData(workoutHistory) {
  const muscleVolumes = {};
  
  workoutHistory.forEach(workout => {
    const vol = calculateTrainingVolume(workout.exercises || []);
    Object.entries(vol.volumeByMuscle).forEach(([muscle, volume]) => {
      if (!muscleVolumes[muscle]) {
        muscleVolumes[muscle] = 0;
      }
      muscleVolumes[muscle] += volume;
    });
  });

  const series = Object.entries(muscleVolumes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return { series };
}

// ==================== 导出模块 ====================

export {
  // 核心分析函数
  calculateTrainingVolume,
  calculateTrainingIntensity,
  analyzeTrainingFrequency,
  analyzeTrainingTrend,
  evaluateTrainingEffectiveness,
  
  // 辅助函数
  estimateOneRM,
  getIntensityLevel,
  intensityToRPE,
  calculateConsistency,
  calculateLinearRegression,
  predictFutureValue,
  getSetDetails,
  
  // 数据格式化
  formatDataForChart,
  formatVolumeChartData,
  formatStrengthChartData,
  formatFrequencyChartData,
  formatMuscleDistributionData,
  
  // 常量
  INTENSITY_LEVELS,
  FREQUENCY_STANDARDS,
  VOLUME_PARAMS,
  RECOVERY_PARAMS
};

export default {
  calculateTrainingVolume,
  calculateTrainingIntensity,
  analyzeTrainingFrequency,
  analyzeTrainingTrend,
  evaluateTrainingEffectiveness,
  formatDataForChart
};
