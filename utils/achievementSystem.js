/**
 * 成就系统
 * 用于管理用户健身成就的解锁和展示
 * 
 * 成就类型：
 * 1. 普通成就 - 基础训练成就
 * 2. 阶段性成就 - 分多个阶段解锁（如连续训练3/7/30/100天）
 * 3. 隐藏成就 - 特殊条件触发，未解锁前不显示详情
 * 4. 彩蛋成就 - 趣味性成就，如特殊时间训练等
 */

// ==================== 成就配置定义 ====================

// 普通成就
const NORMAL_ACHIEVEMENTS = {
  // 初出茅庐 - 完成第一次训练
  first_workout: {
    id: 'first_workout',
    name: '初出茅庐',
    description: '完成第一次训练',
    icon: '/static/achievements/first_workout.png',
    category: 'training',
    type: 'normal',
    points: 10,
    condition: (workoutData, history) => {
      return history.length >= 1;
    }
  },

  // 容量之王 - 单次训练总容量超过 10000kg
  volume_king: {
    id: 'volume_king',
    name: '容量之王',
    description: '单次训练总容量超过 10000kg',
    icon: '/static/achievements/volume_king.png',
    category: 'training',
    type: 'normal',
    points: 30,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.exercises) return false;
      const totalVolume = calculateWorkoutVolume(workoutData);
      return totalVolume >= 10000;
    }
  },

  // 突破自我 - 打破个人记录
  personal_record: {
    id: 'personal_record',
    name: '突破自我',
    description: '打破个人记录',
    icon: '/static/achievements/personal_record.png',
    category: 'training',
    type: 'normal',
    points: 25,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.exercises) return false;
      return workoutData.exercises.some(exercise => {
        return Array.isArray(exercise.sets) && exercise.sets.some(set => set.isPersonalRecord);
      });
    }
  },

  // 百炼成钢 - 累计训练100次
  centurion: {
    id: 'centurion',
    name: '百炼成钢',
    description: '累计完成100次训练',
    icon: '/static/achievements/centurion.png',
    category: 'training',
    type: 'normal',
    points: 50,
    condition: (workoutData, history) => {
      return history.length >= 100;
    }
  },

  // 千锤百炼 - 累计训练500次
  millennium: {
    id: 'millennium',
    name: '千锤百炼',
    description: '累计完成500次训练',
    icon: '/static/achievements/millennium.png',
    category: 'training',
    type: 'normal',
    points: 100,
    condition: (workoutData, history) => {
      return history.length >= 500;
    }
  },

  // 减脂达人 - 完成一个完整的减脂计划
  fat_loss: {
    id: 'fat_loss',
    name: '减脂达人',
    description: '完成一个完整的减脂计划（连续30天有氧训练）',
    icon: '/static/achievements/fat_loss.png',
    category: 'specialist',
    type: 'normal',
    points: 50,
    condition: (workoutData, history) => {
      return isFatLossPlanCompleted(history);
    }
  }
};

// 阶段性成就 - 胸部训练（4个阶段）
const STAGE_ACHIEVEMENTS_CHEST = {
  chest_beginner: {
    id: 'chest_beginner',
    name: '胸肌入门',
    description: '累计完成 20 组胸部训练',
    icon: '/static/achievements/chest_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'chest_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'chest') >= 20;
    }
  },
  chest_intermediate: {
    id: 'chest_intermediate',
    name: '胸肌进阶',
    description: '累计完成 50 组胸部训练',
    icon: '/static/achievements/chest_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'chest_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'chest') >= 50;
    }
  },
  chest_advanced: {
    id: 'chest_advanced',
    name: '胸肌精英',
    description: '累计完成 100 组胸部训练',
    icon: '/static/achievements/chest_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'chest_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'chest') >= 100;
    }
  },
  chest_master: {
    id: 'chest_master',
    name: '胸肌大师',
    description: '累计完成 200 组胸部训练',
    icon: '/static/achievements/chest_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'chest_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'chest') >= 200;
    }
  }
};

// 阶段性成就 - 背部训练（4个阶段）
const STAGE_ACHIEVEMENTS_BACK = {
  back_beginner: {
    id: 'back_beginner',
    name: '背部入门',
    description: '累计完成 20 组背部训练',
    icon: '/static/achievements/back_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'back_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'back') >= 20;
    }
  },
  back_intermediate: {
    id: 'back_intermediate',
    name: '背部进阶',
    description: '累计完成 50 组背部训练',
    icon: '/static/achievements/back_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'back_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'back') >= 50;
    }
  },
  back_advanced: {
    id: 'back_advanced',
    name: '背部精英',
    description: '累计完成 100 组背部训练',
    icon: '/static/achievements/back_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'back_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'back') >= 100;
    }
  },
  back_master: {
    id: 'back_master',
    name: '背部王者',
    description: '累计完成 200 组背部训练',
    icon: '/static/achievements/back_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'back_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'back') >= 200;
    }
  }
};

// 阶段性成就 - 腿部训练（4个阶段）
const STAGE_ACHIEVEMENTS_LEGS = {
  leg_beginner: {
    id: 'leg_beginner',
    name: '腿部入门',
    description: '累计完成 20 组腿部训练',
    icon: '/static/achievements/leg_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'leg_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'legs') >= 20;
    }
  },
  leg_intermediate: {
    id: 'leg_intermediate',
    name: '腿部进阶',
    description: '累计完成 50 组腿部训练',
    icon: '/static/achievements/leg_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'leg_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'legs') >= 50;
    }
  },
  leg_advanced: {
    id: 'leg_advanced',
    name: '腿部精英',
    description: '累计完成 100 组腿部训练',
    icon: '/static/achievements/leg_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'leg_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'legs') >= 100;
    }
  },
  leg_master: {
    id: 'leg_master',
    name: '腿部怪兽',
    description: '累计完成 200 组腿部训练',
    icon: '/static/achievements/leg_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'leg_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'legs') >= 200;
    }
  }
};

// 阶段性成就 - 肩部训练（4个阶段）
const STAGE_ACHIEVEMENTS_SHOULDERS = {
  shoulder_beginner: {
    id: 'shoulder_beginner',
    name: '肩部入门',
    description: '累计完成 20 组肩部训练',
    icon: '/static/achievements/shoulder_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'shoulder_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'shoulders') >= 20;
    }
  },
  shoulder_intermediate: {
    id: 'shoulder_intermediate',
    name: '肩部进阶',
    description: '累计完成 50 组肩部训练',
    icon: '/static/achievements/shoulder_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'shoulder_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'shoulders') >= 50;
    }
  },
  shoulder_advanced: {
    id: 'shoulder_advanced',
    name: '肩部精英',
    description: '累计完成 100 组肩部训练',
    icon: '/static/achievements/shoulder_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'shoulder_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'shoulders') >= 100;
    }
  },
  shoulder_master: {
    id: 'shoulder_master',
    name: '肩部专家',
    description: '累计完成 200 组肩部训练',
    icon: '/static/achievements/shoulder_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'shoulder_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'shoulders') >= 200;
    }
  }
};

// 阶段性成就 - 手臂训练（4个阶段）
const STAGE_ACHIEVEMENTS_ARMS = {
  arm_beginner: {
    id: 'arm_beginner',
    name: '手臂入门',
    description: '累计完成 20 组手臂训练',
    icon: '/static/achievements/arm_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'arm_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'arms') >= 20;
    }
  },
  arm_intermediate: {
    id: 'arm_intermediate',
    name: '手臂进阶',
    description: '累计完成 50 组手臂训练',
    icon: '/static/achievements/arm_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'arm_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'arms') >= 50;
    }
  },
  arm_advanced: {
    id: 'arm_advanced',
    name: '手臂精英',
    description: '累计完成 100 组手臂训练',
    icon: '/static/achievements/arm_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'arm_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'arms') >= 100;
    }
  },
  arm_master: {
    id: 'arm_master',
    name: '手臂终结者',
    description: '累计完成 200 组手臂训练',
    icon: '/static/achievements/arm_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'arm_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'arms') >= 200;
    }
  }
};

// 阶段性成就 - 核心训练（4个阶段）
const STAGE_ACHIEVEMENTS_CORE = {
  core_beginner: {
    id: 'core_beginner',
    name: '核心入门',
    description: '累计完成 20 组核心训练',
    icon: '/static/achievements/core_beginner.png',
    category: 'specialist',
    type: 'stage',
    stage: 1,
    stageGroup: 'core_training',
    maxStage: 4,
    points: 10,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'core') >= 20;
    }
  },
  core_intermediate: {
    id: 'core_intermediate',
    name: '核心进阶',
    description: '累计完成 50 组核心训练',
    icon: '/static/achievements/core_intermediate.png',
    category: 'specialist',
    type: 'stage',
    stage: 2,
    stageGroup: 'core_training',
    maxStage: 4,
    points: 20,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'core') >= 50;
    }
  },
  core_advanced: {
    id: 'core_advanced',
    name: '核心精英',
    description: '累计完成 100 组核心训练',
    icon: '/static/achievements/core_advanced.png',
    category: 'specialist',
    type: 'stage',
    stage: 3,
    stageGroup: 'core_training',
    maxStage: 4,
    points: 35,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'core') >= 100;
    }
  },
  core_master: {
    id: 'core_master',
    name: '核心大师',
    description: '累计完成 200 组核心训练',
    icon: '/static/achievements/core_master.png',
    category: 'specialist',
    type: 'stage',
    stage: 4,
    stageGroup: 'core_training',
    maxStage: 4,
    points: 60,
    condition: (workoutData, history) => {
      return getMuscleGroupSets(history, 'core') >= 200;
    }
  }
};

// 阶段性成就 - 总训练量（4个阶段）
const STAGE_ACHIEVEMENTS_TOTAL = {
  total_beginner: {
    id: 'total_beginner',
    name: '健身新手',
    description: '累计完成 50 组训练',
    icon: '/static/achievements/total_beginner.png',
    category: 'training',
    type: 'stage',
    stage: 1,
    stageGroup: 'total_training',
    maxStage: 4,
    points: 15,
    condition: (workoutData, history) => {
      return getTotalStrengthSets(history) >= 50;
    }
  },
  total_intermediate: {
    id: 'total_intermediate',
    name: '健身达人',
    description: '累计完成 100 组训练',
    icon: '/static/achievements/total_intermediate.png',
    category: 'training',
    type: 'stage',
    stage: 2,
    stageGroup: 'total_training',
    maxStage: 4,
    points: 25,
    condition: (workoutData, history) => {
      return getTotalStrengthSets(history) >= 100;
    }
  },
  total_advanced: {
    id: 'total_advanced',
    name: '健身专家',
    description: '累计完成 300 组训练',
    icon: '/static/achievements/total_advanced.png',
    category: 'training',
    type: 'stage',
    stage: 3,
    stageGroup: 'total_training',
    maxStage: 4,
    points: 45,
    condition: (workoutData, history) => {
      return getTotalStrengthSets(history) >= 300;
    }
  },
  total_master: {
    id: 'total_master',
    name: '健身大师',
    description: '累计完成 500 组训练',
    icon: '/static/achievements/total_master.png',
    category: 'training',
    type: 'stage',
    stage: 4,
    stageGroup: 'total_training',
    maxStage: 4,
    points: 80,
    condition: (workoutData, history) => {
      return getTotalStrengthSets(history) >= 500;
    }
  }
};

// 阶段性成就 - 连续训练天数
const STAGE_ACHIEVEMENTS_CONSISTENT = {
  // 阶段1: 连续3天
  consistent_3: {
    id: 'consistent_3',
    name: '初露锋芒',
    description: '连续训练 3 天',
    icon: '/static/achievements/consistent_3.png',
    category: 'persistence',
    type: 'stage',
    stage: 1,
    stageGroup: 'consistent',
    maxStage: 5,
    points: 10,
    condition: (workoutData, history) => {
      return getConsecutiveDays(history) >= 3;
    }
  },

  // 阶段2: 连续7天
  consistent_7: {
    id: 'consistent_7',
    name: '持之以恒',
    description: '连续训练 7 天',
    icon: '/static/achievements/consistent_7.png',
    category: 'persistence',
    type: 'stage',
    stage: 2,
    stageGroup: 'consistent',
    maxStage: 5,
    points: 20,
    condition: (workoutData, history) => {
      return getConsecutiveDays(history) >= 7;
    }
  },

  // 阶段3: 连续14天
  consistent_14: {
    id: 'consistent_14',
    name: '坚持不懈',
    description: '连续训练 14 天',
    icon: '/static/achievements/consistent_14.png',
    category: 'persistence',
    type: 'stage',
    stage: 3,
    stageGroup: 'consistent',
    maxStage: 5,
    points: 35,
    condition: (workoutData, history) => {
      return getConsecutiveDays(history) >= 14;
    }
  },

  // 阶段4: 连续30天
  consistent_30: {
    id: 'consistent_30',
    name: '自律达人',
    description: '连续训练 30 天',
    icon: '/static/achievements/consistent_30.png',
    category: 'persistence',
    type: 'stage',
    stage: 4,
    stageGroup: 'consistent',
    maxStage: 5,
    points: 60,
    condition: (workoutData, history) => {
      return getConsecutiveDays(history) >= 30;
    }
  },

  // 阶段5: 连续100天
  consistent_100: {
    id: 'consistent_100',
    name: '健身传奇',
    description: '连续训练 100 天',
    icon: '/static/achievements/consistent_100.png',
    category: 'persistence',
    type: 'stage',
    stage: 5,
    stageGroup: 'consistent',
    maxStage: 5,
    points: 150,
    condition: (workoutData, history) => {
      return getConsecutiveDays(history) >= 100;
    }
  }
};

// 阶段性成就 - 早起训练
const STAGE_ACHIEVEMENTS_EARLY = {
  // 阶段1: 连续3天早起
  early_bird_3: {
    id: 'early_bird_3',
    name: '早起尝试',
    description: '连续 3 天早上 6 点前训练',
    icon: '/static/achievements/early_bird_3.png',
    category: 'persistence',
    type: 'stage',
    stage: 1,
    stageGroup: 'early_bird',
    maxStage: 4,
    points: 15,
    condition: (workoutData, history) => {
      return getConsecutiveEarlyWorkouts(history, 6) >= 3;
    }
  },

  // 阶段2: 连续7天早起
  early_bird: {
    id: 'early_bird',
    name: '早起鸟儿',
    description: '连续 7 天早上 6 点前训练',
    icon: '/static/achievements/early_bird.png',
    category: 'persistence',
    type: 'stage',
    stage: 2,
    stageGroup: 'early_bird',
    maxStage: 4,
    points: 30,
    condition: (workoutData, history) => {
      return getConsecutiveEarlyWorkouts(history, 6) >= 7;
    }
  },

  // 阶段3: 连续14天早起
  early_bird_14: {
    id: 'early_bird_14',
    name: '晨光战士',
    description: '连续 14 天早上 6 点前训练',
    icon: '/static/achievements/early_bird_14.png',
    category: 'persistence',
    type: 'stage',
    stage: 3,
    stageGroup: 'early_bird',
    maxStage: 4,
    points: 50,
    condition: (workoutData, history) => {
      return getConsecutiveEarlyWorkouts(history, 6) >= 14;
    }
  },

  // 阶段4: 连续30天早起
  early_bird_30: {
    id: 'early_bird_30',
    name: '黎明守护者',
    description: '连续 30 天早上 6 点前训练',
    icon: '/static/achievements/early_bird_30.png',
    category: 'persistence',
    type: 'stage',
    stage: 4,
    stageGroup: 'early_bird',
    maxStage: 4,
    points: 100,
    condition: (workoutData, history) => {
      return getConsecutiveEarlyWorkouts(history, 6) >= 30;
    }
  }
};

// 阶段性成就 - 周末战士
const STAGE_ACHIEVEMENTS_WEEKEND = {
  // 阶段1: 连续2周
  week_warrior_2: {
    id: 'week_warrior_2',
    name: '周末新手',
    description: '连续 2 周周末训练',
    icon: '/static/achievements/week_warrior_2.png',
    category: 'persistence',
    type: 'stage',
    stage: 1,
    stageGroup: 'week_warrior',
    maxStage: 4,
    points: 15,
    condition: (workoutData, history) => {
      return getConsecutiveWeekendWorkouts(history) >= 2;
    }
  },

  // 阶段2: 连续4周
  week_warrior: {
    id: 'week_warrior',
    name: '周末战士',
    description: '连续 4 周周末训练',
    icon: '/static/achievements/week_warrior.png',
    category: 'persistence',
    type: 'stage',
    stage: 2,
    stageGroup: 'week_warrior',
    maxStage: 4,
    points: 30,
    condition: (workoutData, history) => {
      return getConsecutiveWeekendWorkouts(history) >= 4;
    }
  },

  // 阶段3: 连续8周
  week_warrior_8: {
    id: 'week_warrior_8',
    name: '周末专家',
    description: '连续 8 周周末训练',
    icon: '/static/achievements/week_warrior_8.png',
    category: 'persistence',
    type: 'stage',
    stage: 3,
    stageGroup: 'week_warrior',
    maxStage: 4,
    points: 50,
    condition: (workoutData, history) => {
      return getConsecutiveWeekendWorkouts(history) >= 8;
    }
  },

  // 阶段4: 连续12周
  week_warrior_12: {
    id: 'week_warrior_12',
    name: '周末传奇',
    description: '连续 12 周周末训练',
    icon: '/static/achievements/week_warrior_12.png',
    category: 'persistence',
    type: 'stage',
    stage: 4,
    stageGroup: 'week_warrior',
    maxStage: 4,
    points: 80,
    condition: (workoutData, history) => {
      return getConsecutiveWeekendWorkouts(history) >= 12;
    }
  }
};

// 隐藏成就 - 特殊条件触发，未解锁前不显示详情
const HIDDEN_ACHIEVEMENTS = {
  // 深夜修炼者 - 凌晨12点后训练
  night_owl: {
    id: 'night_owl',
    name: '深夜修炼者',
    description: '???',
    realDescription: '在凌晨12点后完成训练',
    hint: '夜深人静时，也有人在努力...',
    icon: '/static/achievements/night_owl.png',
    category: 'hidden',
    type: 'hidden',
    points: 25,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      const hour = new Date(workoutData.date).getHours();
      return hour >= 0 && hour < 5;
    }
  },

  // 完美一周 - 一周每天都训练
  perfect_week: {
    id: 'perfect_week',
    name: '完美一周',
    description: '???',
    realDescription: '一周内每天都完成训练',
    hint: '坚持不懈，每一天都不落下...',
    icon: '/static/achievements/perfect_week.png',
    category: 'hidden',
    type: 'hidden',
    points: 40,
    condition: (workoutData, history) => {
      return hasPerfectWeek(history);
    }
  },

  // 全勤奖 - 一个月每天都训练
  perfect_month: {
    id: 'perfect_month',
    name: '全勤奖',
    description: '???',
    realDescription: '一个月内每天都完成训练',
    hint: '整整一个月，风雨无阻...',
    icon: '/static/achievements/perfect_month.png',
    category: 'hidden',
    type: 'hidden',
    points: 100,
    condition: (workoutData, history) => {
      return hasPerfectMonth(history);
    }
  },

  // 逆袭者 - 从连续7天不训练到连续7天训练
  comeback_king: {
    id: 'comeback_king',
    name: '逆袭者',
    description: '???',
    realDescription: '从连续7天不训练恢复到连续7天训练',
    hint: '跌倒不可怕，重要的是重新站起来...',
    icon: '/static/achievements/comeback_king.png',
    category: 'hidden',
    type: 'hidden',
    points: 50,
    condition: (workoutData, history) => {
      return hasComeback(history);
    }
  },

  // 孤勇者 - 连续30天独自训练（没有伙伴）
  lone_warrior: {
    id: 'lone_warrior',
    name: '孤勇者',
    description: '???',
    realDescription: '连续30天独自完成训练',
    hint: '一个人的战斗，也是一种荣耀...',
    icon: '/static/achievements/lone_warrior.png',
    category: 'hidden',
    type: 'hidden',
    points: 60,
    condition: (workoutData, history) => {
      return isLoneWarrior(history);
    }
  },

  // 数据狂魔 - 记录超过50个不同的动作
  exercise_collector: {
    id: 'exercise_collector',
    name: '动作百科',
    description: '???',
    realDescription: '累计记录超过50个不同的训练动作',
    hint: '尝试更多的训练动作吧...',
    icon: '/static/achievements/exercise_collector.png',
    category: 'hidden',
    type: 'hidden',
    points: 45,
    condition: (workoutData, history) => {
      return getUniqueExerciseCount(history) >= 50;
    }
  },

  // 极限挑战者 - 单次训练超过2小时
  endurance_master: {
    id: 'endurance_master',
    name: '极限挑战者',
    description: '???',
    realDescription: '单次训练时长超过2小时',
    hint: '挑战自己的极限...',
    icon: '/static/achievements/endurance_master.png',
    category: 'hidden',
    type: 'hidden',
    points: 35,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.duration) return false;
      return workoutData.duration >= 120; // 2小时 = 120分钟
    }
  },

  // 重量突破 - 深蹲/硬拉/卧推超过体重2倍
  strength_beast: {
    id: 'strength_beast',
    name: '力量野兽',
    description: '???',
    realDescription: '深蹲、硬拉或卧推重量超过体重2倍',
    hint: '突破极限，超越自我...',
    icon: '/static/achievements/strength_beast.png',
    category: 'hidden',
    type: 'hidden',
    points: 80,
    condition: (workoutData, history) => {
      return hasSuperLift(workoutData, history);
    }
  }
};

// 彩蛋成就 - 趣味性成就
const EASTER_EGG_ACHIEVEMENTS = {
  // 午夜健身 - 在跨年夜训练
  new_year_workout: {
    id: 'new_year_workout',
    name: '新年第一练',
    description: '在新年的第一天完成训练',
    icon: '/static/achievements/new_year_workout.png',
    category: 'easter',
    type: 'easter',
    points: 30,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      const date = new Date(workoutData.date);
      return date.getMonth() === 0 && date.getDate() === 1;
    }
  },

  // 生日健身 - 在生日当天训练
  birthday_workout: {
    id: 'birthday_workout',
    name: '生日特别训练',
    description: '在生日当天完成训练',
    icon: '/static/achievements/birthday_workout.png',
    category: 'easter',
    type: 'easter',
    points: 25,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      // 从本地存储获取用户设置的生日
      try {
        const userBirthday = uni.getStorageSync('user_birthday');
        if (!userBirthday) return false;
        const workoutDate = new Date(workoutData.date);
        const birthday = new Date(userBirthday);
        return workoutDate.getMonth() === birthday.getMonth() && 
               workoutDate.getDate() === birthday.getDate();
      } catch (e) {
        return false;
      }
    }
  },

  // 情人节健身 - 在2月14日训练
  valentine_workout: {
    id: 'valentine_workout',
    name: '爱健身更爱你',
    description: '在情人节完成训练',
    icon: '/static/achievements/valentine_workout.png',
    category: 'easter',
    type: 'easter',
    points: 25,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      const date = new Date(workoutData.date);
      return date.getMonth() === 1 && date.getDate() === 14;
    }
  },

  // 光棍节健身 - 在11月11日训练
  singles_day_workout: {
    id: 'singles_day_workout',
    name: '单身也精彩',
    description: '在双十一完成训练',
    icon: '/static/achievements/singles_day_workout.png',
    category: 'easter',
    type: 'easter',
    points: 25,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      const date = new Date(workoutData.date);
      return date.getMonth() === 10 && date.getDate() === 11;
    }
  },

  // 凌晨4点 - 在凌晨4:44开始训练
  devil_hour: {
    id: 'devil_hour',
    name: '魔鬼时刻',
    description: '在凌晨4:44开始训练',
    icon: '/static/achievements/devil_hour.png',
    category: 'easter',
    type: 'easter',
    points: 44,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.date) return false;
      const date = new Date(workoutData.date);
      return date.getHours() === 4 && date.getMinutes() === 44;
    }
  },

  // 1314 - 训练时长13分14秒
  forever_love: {
    id: 'forever_love',
    name: '一生一世',
    description: '训练时长恰好为13分14秒',
    icon: '/static/achievements/forever_love.png',
    category: 'easter',
    type: 'easter',
    points: 13,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.duration) return false;
      return workoutData.duration === 13.14;
    }
  },

  // 666 - 单次训练总容量6666kg
  lucky_666: {
    id: 'lucky_666',
    name: '六六大顺',
    description: '单次训练总容量恰好为6666kg',
    icon: '/static/achievements/lucky_666.png',
    category: 'easter',
    type: 'easter',
    points: 20,
    condition: (workoutData, history) => {
      if (!workoutData || !workoutData.exercises) return false;
      const volume = calculateWorkoutVolume(workoutData);
      return volume >= 6660 && volume <= 6670;
    }
  },

  // 520 - 训练消耗520卡路里
  love_calories: {
    id: 'love_calories',
    name: '爱的卡路里',
    description: '单次训练消耗恰好520卡路里',
    icon: '/static/achievements/love_calories.png',
    category: 'easter',
    type: 'easter',
    points: 20,
    condition: (workoutData, history) => {
      // 估算卡路里：每分钟约消耗10-15卡路里
      if (!workoutData || !workoutData.duration) return false;
      // 使用中等强度估算：每分钟12卡路里
      const estimatedCalories = Math.round(workoutData.duration * 12);
      return estimatedCalories === 520;
    }
  },

  // 连续3天同一时间训练（精确到分钟）
  precision_master: {
    id: 'precision_master',
    name: '精准大师',
    description: '连续3天在同一时间（精确到分钟）开始训练',
    icon: '/static/achievements/precision_master.png',
    category: 'easter',
    type: 'easter',
    points: 35,
    condition: (workoutData, history) => {
      return hasPrecisionTiming(history);
    }
  },

  // 一周七天每天不同时间段训练
  time_explorer: {
    id: 'time_explorer',
    name: '时间探索者',
    description: '一周七天在不同时间段完成训练',
    icon: '/static/achievements/time_explorer.png',
    category: 'easter',
    type: 'easter',
    points: 40,
    condition: (workoutData, history) => {
      return hasAllTimeSlots(history);
    }
  }
};

// 合并所有成就配置
const ACHIEVEMENTS_CONFIG = {
  ...NORMAL_ACHIEVEMENTS,
  ...STAGE_ACHIEVEMENTS_CONSISTENT,
  ...STAGE_ACHIEVEMENTS_EARLY,
  ...STAGE_ACHIEVEMENTS_WEEKEND,
  ...STAGE_ACHIEVEMENTS_CHEST,
  ...STAGE_ACHIEVEMENTS_BACK,
  ...STAGE_ACHIEVEMENTS_LEGS,
  ...STAGE_ACHIEVEMENTS_SHOULDERS,
  ...STAGE_ACHIEVEMENTS_ARMS,
  ...STAGE_ACHIEVEMENTS_CORE,
  ...STAGE_ACHIEVEMENTS_TOTAL,
  ...HIDDEN_ACHIEVEMENTS,
  ...EASTER_EGG_ACHIEVEMENTS
};

// 调试：检查成就配置
console.log('成就系统初始化，配置数量:', Object.keys(ACHIEVEMENTS_CONFIG).length);
if (Object.keys(ACHIEVEMENTS_CONFIG).length === 0) {
  console.error('警告：ACHIEVEMENTS_CONFIG 为空！');
}

// 存储键名
const STORAGE_KEY = 'achievement_system_data';

// ==================== 工具函数 ====================

/**
 * 获取成就数据存储
 * @returns {Object} 成就数据
 */
function getStorageData() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY);
    return data || { unlockedAchievements: [], unlockDates: {}, totalPoints: 0 };
  } catch (e) {
    console.error('获取成就数据失败:', e);
    return { unlockedAchievements: [], unlockDates: {}, totalPoints: 0 };
  }
}

/**
 * 保存成就数据到存储
 * @param {Object} data 成就数据
 */
function setStorageData(data) {
  try {
    uni.setStorageSync(STORAGE_KEY, data);
  } catch (e) {
    console.error('保存成就数据失败:', e);
  }
}

/**
 * 计算单次训练总容量
 * @param {Object} workoutData 训练数据
 * @returns {number} 总容量(kg)
 */
function calculateWorkoutVolume(workoutData) {
  if (!workoutData || !workoutData.exercises) return 0;

  let totalVolume = 0;
  workoutData.exercises.forEach(exercise => {
    // 检查 sets 是否是数组
    if (Array.isArray(exercise.sets)) {
      exercise.sets.forEach(set => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
        }
      });
    }
  });
  return totalVolume;
}

/**
 * 获取连续训练天数
 * @param {Array} history 训练历史
 * @returns {number} 连续天数
 */
function getConsecutiveDays(history) {
  if (!history || history.length === 0) return 0;

  const sortedHistory = [...history].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  let consecutiveDays = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkoutDate = new Date(sortedHistory[0].date);
  lastWorkoutDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  const dateSet = new Set();
  sortedHistory.forEach(workout => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    dateSet.add(date.getTime());
  });

  const uniqueDates = Array.from(dateSet).sort((a, b) => b - a);

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);
    const diff = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
}

/**
 * 获取连续早起训练天数
 * @param {Array} history 训练历史
 * @param {number} hour 早起时间(小时)
 * @returns {number} 连续早起天数
 */
function getConsecutiveEarlyWorkouts(history, hour) {
  if (!history || history.length === 0) return 0;

  const earlyWorkouts = history.filter(workout => {
    const workoutTime = new Date(workout.date);
    return workoutTime.getHours() < hour;
  });

  if (earlyWorkouts.length === 0) return 0;

  const sortedWorkouts = [...earlyWorkouts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  let consecutiveDays = 1;
  const dateSet = new Set();

  sortedWorkouts.forEach(workout => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    dateSet.add(date.getTime());
  });

  const uniqueDates = Array.from(dateSet).sort((a, b) => b - a);

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const nextDate = new Date(uniqueDates[i + 1]);
    const diff = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return consecutiveDays;
}

/**
 * 获取连续周末训练周数
 * @param {Array} history 训练历史
 * @returns {number} 连续周数
 */
function getConsecutiveWeekendWorkouts(history) {
  if (!history || history.length === 0) return 0;

  const weekendWorkouts = history.filter(workout => {
    const date = new Date(workout.date);
    const day = date.getDay();
    return day === 0 || day === 6;
  });

  if (weekendWorkouts.length === 0) return 0;

  const weekSet = new Set();
  weekendWorkouts.forEach(workout => {
    const date = new Date(workout.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    weekSet.add(weekStart.getTime());
  });

  const sortedWeeks = Array.from(weekSet).sort((a, b) => b - a);

  let consecutiveWeeks = 1;
  for (let i = 0; i < sortedWeeks.length - 1; i++) {
    const currentWeek = new Date(sortedWeeks[i]);
    const nextWeek = new Date(sortedWeeks[i + 1]);
    const diffDays = Math.floor((currentWeek - nextWeek) / (1000 * 60 * 60 * 24));

    if (diffDays === 7) {
      consecutiveWeeks++;
    } else {
      break;
    }
  }

  return consecutiveWeeks;
}

/**
 * 获取特定肌群的训练组数
 * @param {Array} history 训练历史
 * @param {string} muscleGroup 肌群名称
 * @returns {number} 总组数
 */
function getMuscleGroupSets(history, muscleGroup) {
  if (!history || history.length === 0) return 0;

  let totalSets = 0;
  history.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        // 检查 sets 是否是数组
        if (exercise.muscleGroup === muscleGroup && Array.isArray(exercise.sets)) {
          totalSets += exercise.sets.length;
        } else if (exercise.muscleGroup === muscleGroup && typeof exercise.completedSets === 'number') {
          // 兼容旧数据：使用 completedSets 字段
          totalSets += exercise.completedSets;
        }
      });
    }
  });

  return totalSets;
}

/**
 * 获取总力量训练组数
 * @param {Array} history 训练历史
 * @returns {number} 总组数
 */
function getTotalStrengthSets(history) {
  if (!history || history.length === 0) return 0;

  let totalSets = 0;
  history.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        // 检查 sets 是否是数组
        if (Array.isArray(exercise.sets)) {
          totalSets += exercise.sets.length;
        } else if (typeof exercise.completedSets === 'number') {
          // 兼容旧数据：使用 completedSets 字段
          totalSets += exercise.completedSets;
        }
      });
    }
  });

  return totalSets;
}

/**
 * 检查减脂计划是否完成
 * @param {Array} history 训练历史
 * @returns {boolean} 是否完成
 */
function isFatLossPlanCompleted(history) {
  if (!history || history.length < 30) return false;

  const cardioWorkouts = history.filter(workout => {
    return workout.type === 'cardio' || workout.isCardio;
  });

  if (cardioWorkouts.length < 30) return false;

  const sortedWorkouts = [...cardioWorkouts].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const dateSet = new Set();
  sortedWorkouts.forEach(workout => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    dateSet.add(date.getTime());
  });

  const uniqueDates = Array.from(dateSet).sort((a, b) => a - b);

  if (uniqueDates.length < 30) return false;

  for (let i = 0; i <= uniqueDates.length - 30; i++) {
    let isConsecutive = true;
    for (let j = 0; j < 29; j++) {
      const currentDate = new Date(uniqueDates[i + j]);
      const nextDate = new Date(uniqueDates[i + j + 1]);
      const diff = Math.floor((nextDate - currentDate) / (1000 * 60 * 60 * 24));
      if (diff !== 1) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) return true;
  }

  return false;
}

/**
 * 检查是否有完美一周（7天都训练）
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasPerfectWeek(history) {
  if (!history || history.length < 7) return false;

  const dateSet = new Set();
  history.forEach(workout => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    dateSet.add(date.getTime());
  });

  const sortedDates = Array.from(dateSet).sort((a, b) => a - b);

  for (let i = 0; i <= sortedDates.length - 7; i++) {
    let has7Consecutive = true;
    for (let j = 0; j < 6; j++) {
      const current = new Date(sortedDates[i + j]);
      const next = new Date(sortedDates[i + j + 1]);
      const diff = Math.floor((next - current) / (1000 * 60 * 60 * 24));
      if (diff !== 1) {
        has7Consecutive = false;
        break;
      }
    }
    if (has7Consecutive) return true;
  }

  return false;
}

/**
 * 检查是否有完美一月
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasPerfectMonth(history) {
  if (!history || history.length < 30) return false;

  const dateMap = new Map();
  history.forEach(workout => {
    const date = new Date(workout.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!dateMap.has(key)) {
      dateMap.set(key, new Set());
    }
    dateMap.get(key).add(date.getDate());
  });

  for (const [key, days] of dateMap) {
    if (days.size >= 30) {
      const year = parseInt(key.split('-')[0]);
      const month = parseInt(key.split('-')[1]);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      if (days.size >= daysInMonth) return true;
    }
  }

  return false;
}

/**
 * 检查是否有逆袭（从连续7天不训练到连续7天训练）
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasComeback(history) {
  if (!history || history.length < 14) return false;

  const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const dateSet = new Set();
  sortedHistory.forEach(workout => {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);
    dateSet.add(date.getTime());
  });

  const sortedDates = Array.from(dateSet).sort((a, b) => a - b);

  for (let i = 7; i < sortedDates.length; i++) {
    // 检查前7天是否有间隔
    let hadGap = false;
    for (let j = i - 7; j < i - 1; j++) {
      const current = new Date(sortedDates[j]);
      const next = new Date(sortedDates[j + 1]);
      const diff = Math.floor((next - current) / (1000 * 60 * 60 * 24));
      if (diff > 7) {
        hadGap = true;
        break;
      }
    }

    // 检查后7天是否连续
    let isConsecutive = true;
    for (let j = i; j < Math.min(i + 6, sortedDates.length - 1); j++) {
      const current = new Date(sortedDates[j]);
      const next = new Date(sortedDates[j + 1]);
      const diff = Math.floor((next - current) / (1000 * 60 * 60 * 24));
      if (diff !== 1) {
        isConsecutive = false;
        break;
      }
    }

    if (hadGap && isConsecutive) return true;
  }

  return false;
}

/**
 * 检查是否是孤勇者（连续30天独自训练）
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function isLoneWarrior(history) {
  if (!history || history.length < 30) return false;

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  let consecutiveDays = 0;
  let lastDate = null;

  for (const workout of sortedHistory) {
    const date = new Date(workout.date);
    date.setHours(0, 0, 0, 0);

    if (!workout.hasPartner && !workout.isGroup) {
      if (!lastDate) {
        consecutiveDays = 1;
        lastDate = date;
      } else {
        const diff = Math.floor((lastDate - date) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          consecutiveDays++;
          lastDate = date;
          if (consecutiveDays >= 30) return true;
        } else if (diff > 1) {
          break;
        }
      }
    } else {
      break;
    }
  }

  return false;
}

/**
 * 获取不同动作的数量
 * @param {Array} history 训练历史
 * @returns {number}
 */
function getUniqueExerciseCount(history) {
  if (!history || history.length === 0) return 0;

  const exerciseSet = new Set();
  history.forEach(workout => {
    if (workout.exercises) {
      workout.exercises.forEach(exercise => {
        if (exercise.name) {
          exerciseSet.add(exercise.name);
        }
      });
    }
  });

  return exerciseSet.size;
}

/**
 * 检查是否有超级重量（超过体重2倍）
 * @param {Object} workoutData 当前训练数据
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasSuperLift(workoutData, history) {
  // 这里简化处理，实际需要用户体重数据
  const superExercises = ['squat', 'deadlift', 'bench_press'];

  if (!workoutData || !workoutData.exercises) return false;

  return workoutData.exercises.some(exercise => {
    if (!superExercises.includes(exercise.id)) return false;
    // 检查 sets 是否是数组
    if (!Array.isArray(exercise.sets)) return false;

    const maxWeight = Math.max(...exercise.sets.map(set => set.weight || 0));
    // 假设平均体重70kg，2倍就是140kg
    return maxWeight >= 140;
  });
}

/**
 * 检查是否有精准时间（连续3天同一时间训练）
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasPrecisionTiming(history) {
  if (!history || history.length < 3) return false;

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  for (let i = 0; i <= sortedHistory.length - 3; i++) {
    const time1 = new Date(sortedHistory[i].date);
    const time2 = new Date(sortedHistory[i + 1].date);
    const time3 = new Date(sortedHistory[i + 2].date);

    // 检查是否是连续3天
    const day1 = new Date(time1); day1.setHours(0, 0, 0, 0);
    const day2 = new Date(time2); day2.setHours(0, 0, 0, 0);
    const day3 = new Date(time3); day3.setHours(0, 0, 0, 0);

    const diff1 = Math.floor((day1 - day2) / (1000 * 60 * 60 * 24));
    const diff2 = Math.floor((day2 - day3) / (1000 * 60 * 60 * 24));

    if (diff1 === 1 && diff2 === 1) {
      // 检查时间是否相同（小时和分钟）
      if (time1.getHours() === time2.getHours() && time2.getHours() === time3.getHours() &&
          time1.getMinutes() === time2.getMinutes() && time2.getMinutes() === time3.getMinutes()) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 检查是否覆盖所有时间段
 * @param {Array} history 训练历史
 * @returns {boolean}
 */
function hasAllTimeSlots(history) {
  if (!history || history.length < 7) return false;

  // 定义时间段
  const timeSlots = {
    morning: false,    // 6-12点
    afternoon: false,  // 12-18点
    evening: false,    // 18-22点
    night: false       // 22-6点
  };

  // 获取最近7天的训练
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentWorkouts = sortedHistory.slice(0, 7);

  recentWorkouts.forEach(workout => {
    const hour = new Date(workout.date).getHours();
    if (hour >= 6 && hour < 12) timeSlots.morning = true;
    else if (hour >= 12 && hour < 18) timeSlots.afternoon = true;
    else if (hour >= 18 && hour < 22) timeSlots.evening = true;
    else timeSlots.night = true;
  });

  return Object.values(timeSlots).every(slot => slot === true);
}

// ==================== 核心功能函数 ====================

/**
 * 获取训练历史
 * @returns {Array} 训练历史
 */
function getWorkoutHistory() {
  try {
    const history = uni.getStorageSync('workoutHistory');
    return history || [];
  } catch (e) {
    console.error('获取训练历史失败:', e);
    return [];
  }
}

/**
 * 检查并解锁成就
 * @param {Object} workoutData 当前训练数据
 * @returns {Array} 新解锁的成就列表
 */
function checkAchievements(workoutData) {
  const history = getWorkoutHistory();
  const storageData = getStorageData();
  const newlyUnlocked = [];

  // 将当前训练添加到历史中（临时）用于成就检查
  const combinedHistory = [workoutData, ...history];

  Object.keys(ACHIEVEMENTS_CONFIG).forEach(key => {
    const achievement = ACHIEVEMENTS_CONFIG[key];

    if (!storageData.unlockedAchievements.includes(achievement.id)) {
      // 使用包含当前训练的合并历史进行检查
      if (achievement.condition(workoutData, combinedHistory)) {
        unlockAchievement(achievement.id);
        newlyUnlocked.push(achievement);
      }
    }
  });

  return newlyUnlocked;
}

/**
 * 检查成就是否已解锁
 * @param {string} achievementId 成就ID
 * @returns {boolean} 是否已解锁
 */
function isAchievementUnlocked(achievementId) {
  const storageData = getStorageData();
  return storageData.unlockedAchievements.includes(achievementId);
}

/**
 * 解锁成就
 * @param {string} achievementId 成就ID
 * @returns {boolean} 是否成功解锁
 */
function unlockAchievement(achievementId) {
  if (!ACHIEVEMENTS_CONFIG[achievementId]) {
    console.error('成就不存在:', achievementId);
    return false;
  }

  const storageData = getStorageData();

  if (storageData.unlockedAchievements.includes(achievementId)) {
    return false;
  }

  const achievement = ACHIEVEMENTS_CONFIG[achievementId];
  storageData.unlockedAchievements.push(achievementId);
  storageData.unlockDates[achievementId] = new Date().toISOString();
  storageData.totalPoints = (storageData.totalPoints || 0) + (achievement.points || 0);

  setStorageData(storageData);

  return true;
}

/**
 * 获取所有已解锁的成就
 * @returns {Array} 已解锁成就列表
 */
function getUnlockedAchievements() {
  const storageData = getStorageData();
  return storageData.unlockedAchievements.map(id => {
    const config = ACHIEVEMENTS_CONFIG[id];
    return {
      ...config,
      unlockDate: storageData.unlockDates[id]
    };
  });
}

/**
 * 获取所有成就（包括未解锁的）
 * @param {boolean} showHidden 是否显示隐藏成就的详情
 * @returns {Array} 所有成就列表
 */
function getAllAchievements(showHidden = false) {
  const storageData = getStorageData();
  const configKeys = Object.keys(ACHIEVEMENTS_CONFIG);
  console.log('成就配置数量:', configKeys.length);

  if (configKeys.length === 0) {
    console.error('ACHIEVEMENTS_CONFIG 为空');
    return [];
  }

  return configKeys.map(id => {
    const config = ACHIEVEMENTS_CONFIG[id];
    if (!config) {
      console.error('成就配置不存在:', id);
      return null;
    }
    const isUnlocked = storageData.unlockedAchievements.includes(id);

    // 隐藏成就处理
    let displayConfig = { ...config };
    if (config.type === 'hidden' && !isUnlocked && !showHidden) {
      displayConfig = {
        ...config,
        name: '???',
        description: config.hint || '???',
        icon: '/static/achievements/hidden.png'
      };
    }

    return {
      ...displayConfig,
      isUnlocked,
      unlockDate: isUnlocked ? storageData.unlockDates[id] : null
    };
  }).filter(Boolean);
}

/**
 * 获取成就进度
 * @param {string} achievementId 成就ID
 * @returns {Object} 进度信息
 */
function getAchievementProgress(achievementId) {
  const achievement = ACHIEVEMENTS_CONFIG[achievementId];
  if (!achievement) return null;

  const history = getWorkoutHistory();
  const isUnlocked = isAchievementUnlocked(achievementId);

  let progress = 0;
  let target = 0;
  let current = 0;

  switch (achievementId) {
    // 普通成就
    case 'first_workout':
      target = 1;
      current = history.length;
      break;
    case 'centurion':
      target = 100;
      current = history.length;
      break;
    case 'millennium':
      target = 500;
      current = history.length;
      break;
    case 'volume_king':
      target = 10000;
      current = history.length > 0 ? calculateWorkoutVolume(history[history.length - 1]) : 0;
      break;

    // 阶段性成就 - 连续训练
    case 'consistent_3':
      target = 3;
      current = getConsecutiveDays(history);
      break;
    case 'consistent_7':
      target = 7;
      current = getConsecutiveDays(history);
      break;
    case 'consistent_14':
      target = 14;
      current = getConsecutiveDays(history);
      break;
    case 'consistent_30':
      target = 30;
      current = getConsecutiveDays(history);
      break;
    case 'consistent_100':
      target = 100;
      current = getConsecutiveDays(history);
      break;

    // 阶段性成就 - 早起
    case 'early_bird_3':
      target = 3;
      current = getConsecutiveEarlyWorkouts(history, 6);
      break;
    case 'early_bird':
      target = 7;
      current = getConsecutiveEarlyWorkouts(history, 6);
      break;
    case 'early_bird_14':
      target = 14;
      current = getConsecutiveEarlyWorkouts(history, 6);
      break;
    case 'early_bird_30':
      target = 30;
      current = getConsecutiveEarlyWorkouts(history, 6);
      break;

    // 阶段性成就 - 周末
    case 'week_warrior_2':
      target = 2;
      current = getConsecutiveWeekendWorkouts(history);
      break;
    case 'week_warrior':
      target = 4;
      current = getConsecutiveWeekendWorkouts(history);
      break;
    case 'week_warrior_8':
      target = 8;
      current = getConsecutiveWeekendWorkouts(history);
      break;
    case 'week_warrior_12':
      target = 12;
      current = getConsecutiveWeekendWorkouts(history);
      break;

    // 阶段性成就 - 胸部训练
    case 'chest_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'chest');
      break;
    case 'chest_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'chest');
      break;
    case 'chest_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'chest');
      break;
    case 'chest_master':
      target = 200;
      current = getMuscleGroupSets(history, 'chest');
      break;

    // 阶段性成就 - 背部训练
    case 'back_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'back');
      break;
    case 'back_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'back');
      break;
    case 'back_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'back');
      break;
    case 'back_master':
      target = 200;
      current = getMuscleGroupSets(history, 'back');
      break;

    // 阶段性成就 - 腿部训练
    case 'leg_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'legs');
      break;
    case 'leg_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'legs');
      break;
    case 'leg_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'legs');
      break;
    case 'leg_master':
      target = 200;
      current = getMuscleGroupSets(history, 'legs');
      break;

    // 阶段性成就 - 肩部训练
    case 'shoulder_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'shoulders');
      break;
    case 'shoulder_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'shoulders');
      break;
    case 'shoulder_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'shoulders');
      break;
    case 'shoulder_master':
      target = 200;
      current = getMuscleGroupSets(history, 'shoulders');
      break;

    // 阶段性成就 - 手臂训练
    case 'arm_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'arms');
      break;
    case 'arm_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'arms');
      break;
    case 'arm_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'arms');
      break;
    case 'arm_master':
      target = 200;
      current = getMuscleGroupSets(history, 'arms');
      break;

    // 阶段性成就 - 核心训练
    case 'core_beginner':
      target = 20;
      current = getMuscleGroupSets(history, 'core');
      break;
    case 'core_intermediate':
      target = 50;
      current = getMuscleGroupSets(history, 'core');
      break;
    case 'core_advanced':
      target = 100;
      current = getMuscleGroupSets(history, 'core');
      break;
    case 'core_master':
      target = 200;
      current = getMuscleGroupSets(history, 'core');
      break;

    // 阶段性成就 - 总训练量
    case 'total_beginner':
      target = 50;
      current = getTotalStrengthSets(history);
      break;
    case 'total_intermediate':
      target = 100;
      current = getTotalStrengthSets(history);
      break;
    case 'total_advanced':
      target = 300;
      current = getTotalStrengthSets(history);
      break;
    case 'total_master':
      target = 500;
      current = getTotalStrengthSets(history);
      break;

    // 隐藏成就和彩蛋成就
    case 'exercise_collector':
      target = 50;
      current = getUniqueExerciseCount(history);
      break;

    default:
      target = 1;
      current = isUnlocked ? 1 : 0;
  }

  progress = Math.min(100, Math.round((current / target) * 100));

  return {
    id: achievementId,
    name: achievement.name,
    isUnlocked,
    current,
    target,
    progress
  };
}

/**
 * 获取用户总积分
 * @returns {number} 总积分
 */
function getTotalPoints() {
  const storageData = getStorageData();
  return storageData.totalPoints || 0;
}

/**
 * 获取阶段性成就的进度信息
 * @param {string} stageGroup 阶段组名
 * @returns {Object} 阶段进度
 */
function getStageProgress(stageGroup) {
  const stages = Object.values(ACHIEVEMENTS_CONFIG).filter(
    a => a.stageGroup === stageGroup
  ).sort((a, b) => a.stage - b.stage);

  if (stages.length === 0) return null;

  const storageData = getStorageData();
  let currentStage = 0;
  let unlockedCount = 0;

  stages.forEach(stage => {
    if (storageData.unlockedAchievements.includes(stage.id)) {
      currentStage = stage.stage;
      unlockedCount++;
    }
  });

  return {
    stageGroup,
    currentStage,
    maxStage: stages[0].maxStage,
    unlockedCount,
    totalStages: stages.length,
    nextStage: currentStage < stages[0].maxStage ? stages.find(s => s.stage === currentStage + 1) : null,
    isComplete: unlockedCount === stages.length
  };
}

/**
 * 生成成就解锁弹窗配置对象
 * @param {Array} achievements 成就列表
 * @returns {Object} 弹窗配置对象
 */
function showAchievementModal(achievements) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  if (achievements.length === 1) {
    const achievement = achievements[0];
    const isHidden = achievement.type === 'hidden';
    const isEaster = achievement.type === 'easter';

    let title = '成就解锁';
    if (isHidden) title = '隐藏成就解锁！';
    if (isEaster) title = '彩蛋成就解锁！';

    return {
      title,
      content: `恭喜您解锁了「${achievement.name}」成就！\n${achievement.description}\n+${achievement.points} 积分`,
      showCancel: false,
      confirmText: '太棒了',
      success: () => {
        console.log('成就弹窗关闭');
      },
      customStyle: {
        achievement,
        isHidden,
        isEaster
      }
    };
  }

  const achievementNames = achievements.map(a => `「${a.name}」`).join('、');
  const totalPoints = achievements.reduce((sum, a) => sum + (a.points || 0), 0);

  return {
    title: '多重成就解锁',
    content: `恭喜您同时解锁了以下成就！\n${achievementNames}\n共计 +${totalPoints} 积分`,
    showCancel: false,
    confirmText: '太棒了',
    success: () => {
      console.log('成就弹窗关闭');
    },
    customStyle: {
      achievements
    }
  };
}

/**
 * 显示成就解锁弹窗（直接调用uni.showModal）
 * @param {Array} achievements 成就列表
 */
function showAchievementModalSync(achievements) {
  const modalConfig = showAchievementModal(achievements);
  if (modalConfig) {
    uni.showModal({
      title: modalConfig.title,
      content: modalConfig.content,
      showCancel: modalConfig.showCancel,
      confirmText: modalConfig.confirmText,
      success: modalConfig.success
    });
  }
}

/**
 * 重置成就系统（用于测试）
 */
function resetAchievements() {
  setStorageData({ unlockedAchievements: [], unlockDates: {}, totalPoints: 0 });
  console.log('成就系统已重置');
}

/**
 * 获取成就统计信息
 * @returns {Object} 统计信息
 */
function getAchievementStats() {
  const storageData = getStorageData();
  const allAchievements = Object.values(ACHIEVEMENTS_CONFIG);
  const unlockedIds = storageData.unlockedAchievements;

  const stats = {
    total: allAchievements.length,
    unlocked: unlockedIds.length,
    locked: allAchievements.length - unlockedIds.length,
    totalPoints: storageData.totalPoints || 0,
    maxPoints: allAchievements.reduce((sum, a) => sum + (a.points || 0), 0),
    byType: {
      normal: { total: 0, unlocked: 0 },
      stage: { total: 0, unlocked: 0 },
      hidden: { total: 0, unlocked: 0 },
      easter: { total: 0, unlocked: 0 }
    },
    byCategory: {
      training: { total: 0, unlocked: 0 },
      persistence: { total: 0, unlocked: 0 },
      specialist: { total: 0, unlocked: 0 },
      hidden: { total: 0, unlocked: 0 },
      easter: { total: 0, unlocked: 0 }
    }
  };

  allAchievements.forEach(achievement => {
    // 按类型统计
    if (stats.byType[achievement.type]) {
      stats.byType[achievement.type].total++;
      if (unlockedIds.includes(achievement.id)) {
        stats.byType[achievement.type].unlocked++;
      }
    }

    // 按分类统计
    if (stats.byCategory[achievement.category]) {
      stats.byCategory[achievement.category].total++;
      if (unlockedIds.includes(achievement.id)) {
        stats.byCategory[achievement.category].unlocked++;
      }
    }
  });

  return stats;
}

// ==================== 导出模块 ====================

export {
  checkAchievements,
  isAchievementUnlocked,
  unlockAchievement,
  getUnlockedAchievements,
  showAchievementModal,
  showAchievementModalSync,
  getAllAchievements,
  resetAchievements,
  getAchievementProgress,
  getTotalPoints,
  getStageProgress,
  getAchievementStats,
  ACHIEVEMENTS_CONFIG
};

export default {
  checkAchievements,
  isAchievementUnlocked,
  unlockAchievement,
  getUnlockedAchievements,
  showAchievementModal,
  showAchievementModalSync,
  getAllAchievements,
  resetAchievements,
  getAchievementProgress,
  getTotalPoints,
  getStageProgress,
  getAchievementStats,
  ACHIEVEMENTS_CONFIG
};
