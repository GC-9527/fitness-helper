import updateUtil from './update';

export const motivationalQuotes = [
  '放弃可以找到一万个理由，坚持只需一个信念！',
  '今天不健身，明天变脂肪。',
  '汗水是脂肪的眼泪。',
  '每一次坚持，都是对自己的超越。',
  '健身不是为了改变世界，而是为了改变自己。',
  '你的身材，就是你实力的一部分。',
  '没有天生的胖子，只有不够努力的自己。',
  '健身是世界上最公平的事，付出多少，收获多少。',
  '不要等明天，就现在开始！',
  '自律给我自由，坚持成就梦想。',
  '今天的努力，明天的实力。',
  '健身是唯一一件付出就有回报的事。',
  '要么挥汗如雨，要么滚回家去。',
  '你比你想象的更强大。',
  '成功的路上并不拥挤，因为坚持的人不多。'];

export { updateUtil };

export const encouragementMessages = [
  '太棒了！你完成了这次训练！🎉',
  '做得好！继续保持这种势头！💪',
  '完美！你正在变得更强大！🔥',
  '恭喜完成训练！你的坚持令人敬佩！🏆',
  '训练结束！你真棒！给自己一个拥抱！🤗',
  '出色的表现！继续前进！⭐',
  '你做到了！为自己感到骄傲吧！👏',
  '训练完成！休息一下，明天继续！🌟'];

export const bodyParts = ['全部', '胸部', '背部', '肩部', '手臂', '腹部', '腿部', '臀部'];

export const defaultExercises = [
  { id: 1, name: '俯卧撑', part: '胸部', standard: '身体呈一直线，胸部接近地面', advice: '初学者可以做跪姿俯卧撑' },
  { id: 2, name: '平板支撑', part: '腹部', standard: '身体呈一直线，核心收紧', advice: '初学者从30秒开始' },
  { id: 3, name: '深蹲', part: '腿部', standard: '膝盖不超过脚尖，大腿平行地面', advice: '注意保护膝盖' },
  { id: 4, name: '卷腹', part: '腹部', standard: '上半身卷起，下背部贴地', advice: '不要用脖子发力' },
  { id: 5, name: '箭步蹲', part: '腿部', standard: '前后腿呈90度', advice: '保持身体平衡' },
  { id: 6, name: '哑铃弯举', part: '手臂', standard: '大臂贴身体，小臂弯曲', advice: '选择合适重量' },
  { id: 7, name: '引体向上', part: '背部', standard: '下巴超过单杠', advice: '可以用助力带' },
  { id: 8, name: '桥式', part: '臀部', standard: '臀部抬起，身体呈一直线', advice: '夹紧臀部' },
  { id: 9, name: '哑铃飞鸟', part: '肩部', standard: '手臂微曲，向两侧打开', advice: '控制动作速度' },
  { id: 10, name: '硬拉', part: '背部', standard: '腰背挺直，用腿发力', advice: '注意保护腰椎' },
  { id: 11, name: '侧平板', part: '腹部', standard: '身体呈一直线', advice: '初学者可屈膝' },
  { id: 12, name: '保加利亚深蹲', part: '腿部', standard: '前腿呈90度', advice: '扶住固定物' },
  { id: 13, name: '三头下压', part: '手臂', standard: '大臂固定，小臂伸直', advice: '感受三头肌收缩' },
  { id: 14, name: '高位下拉', part: '背部', standard: '拉到胸部位置', advice: '肩胛骨下沉' },
  { id: 15, name: '臀桥', part: '臀部', standard: '顶峰收缩1秒', advice: '可以加负重' },
  { id: 16, name: '登山跑', part: '腹部', standard: '快速交替提膝', advice: '保持核心稳定' },
  { id: 17, name: '站立推举', part: '肩部', standard: '推举到头顶', advice: '身体不要晃动' },
  { id: 18, name: '靠墙静蹲', part: '腿部', standard: '大腿平行地面', advice: '循序渐进增加时间' },
  { id: 19, name: '锤式弯举', part: '手臂', standard: '拳眼向上', advice: '锻炼肱桡肌' },
  { id: 20, name: '山羊挺身', part: '背部', standard: '不要过度后仰', advice: '专注下背收缩' },
  { id: 21, name: '蝴蝶机夹胸', part: '胸部', standard: '坐直挺胸，双手握住手柄，慢慢向两侧打开，然后用力夹胸', advice: '不要过度伸展肩关节' },
  { id: 22, name: '哑铃平板卧推', part: '胸部', standard: '仰卧在平板凳上，双手握住哑铃，缓慢下放至胸部两侧，然后推起', advice: '保持核心收紧，避免腰部悬空' },
  { id: 23, name: '哑铃上斜卧推', part: '胸部', standard: '仰卧在上斜凳上，双手握住哑铃，缓慢下放至胸部两侧，然后推起', advice: '上斜角度建议30-45度' },
  { id: 24, name: '双杠臂屈伸', part: '胸部', standard: '双手握住双杠，身体前倾，缓慢屈肘下放，然后推起', advice: '初学者可以使用辅助带' },
  { id: 25, name: '直臂下压', part: '背部', standard: '大臂贴身体，双手握住绳索，直臂向下拉至大腿两侧', advice: '感受背阔肌收缩' },
  { id: 26, name: '单臂下拉', part: '背部', standard: '单手握柄，从高位缓慢下拉至肩部位置，保持身体稳定', advice: '左右两侧交替进行' },
  { id: 27, name: '固定器械划船', part: '背部', standard: '坐姿，胸部贴紧挡板，双手握住手柄，向后拉至腹部位置', advice: '保持背部挺直，不要借力' },
  { id: 28, name: '哑铃侧平举', part: '肩部', standard: '站立，双手握住哑铃，向两侧平举至与肩同高', advice: '保持手臂微曲，避免耸肩' },
  { id: 29, name: '杠铃肩推', part: '肩部', standard: '站立或坐姿，双手握住杠铃，从肩部位置推举至头顶', advice: '选择合适重量，避免腰伤' },
  { id: 30, name: '哑铃前平举', part: '肩部', standard: '站立，双手握住哑铃，向前平举至与肩同高', advice: '控制动作速度，避免借力' },
  { id: 31, name: '史密斯推肩', part: '肩部', standard: '坐姿或站立，双手握住史密斯机杠铃，从肩部位置推举至头顶', advice: '保持背部挺直，避免腰伤' },
  { id: 32, name: '蝴蝶机飞鸟', part: '肩部', standard: '坐直挺胸，双手握住手柄，慢慢向两侧打开，然后缓慢收回', advice: '感受肩后束肌肉拉伸和收缩' },
  { id: 33, name: '龙门架绳索飞鸟', part: '肩部', standard: '站立，单手手握住龙门架绳索，向最远处打开，然后缓慢收回至胸前', advice: '保持手臂微曲，避免耸肩' }
];

export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function saveCheckIn(date, type = 'workout') {
  try {
    const checkIns = uni.getStorageSync('checkIns') || {};
    
    // 处理旧数据格式
    if (typeof checkIns[date] === 'boolean') {
      checkIns[date] = {
        completed: checkIns[date],
        type: 'workout'
      };
    } else if (!checkIns[date]) {
      checkIns[date] = {
        completed: true,
        type: type
      };
    } else {
      checkIns[date].completed = true;
      checkIns[date].type = type;
    }
    
    uni.setStorageSync('checkIns', checkIns);
    return true;
  } catch (e) {
    console.error('保存打卡失败:', e);
    return false;
  }
}

export function saveWorkoutHistory(workoutData) {
  try {
    const history = uni.getStorageSync('workoutHistory') || [];
    history.unshift({
      id: generateId(),
      date: formatDate(new Date()),
      timestamp: Date.now(),
      exercises: workoutData.exercises || [],
      duration: workoutData.duration || 0,
      durationSeconds: workoutData.durationSeconds || 0,
      totalSets: workoutData.totalSets || 0,
      completedSets: workoutData.completedSets || 0
    });
    uni.setStorageSync('workoutHistory', history);
    return true;
  } catch (e) {
    console.error('保存训练记录失败:', e);
    return false;
  }
}

export function getExercises() {
  try {
    const customExercises = uni.getStorageSync('customExercises') || [];
    return defaultExercises.concat(customExercises);
  } catch (e) {
    console.error('获取动作失败:', e);
    return defaultExercises;
  }
}

export function saveCustomExercise(exercise) {
  try {
    const customExercises = uni.getStorageSync('customExercises') || [];
    customExercises.push({
      id: generateId(),
      name: exercise.name,
      part: exercise.part,
      standard: exercise.standard || '',
      advice: exercise.advice || '',
      isCustom: true
    });
    uni.setStorageSync('customExercises', customExercises);
    return true;
  } catch (e) {
    console.error('保存自定义动作失败:', e);
    return false;
  }
}

export function deleteCustomExercise(id) {
  try {
    const customExercises = uni.getStorageSync('customExercises') || [];
    const filtered = customExercises.filter((e) => e.id !== id);
    uni.setStorageSync('customExercises', filtered);
    return true;
  } catch (e) {
    console.error('删除自定义动作失败:', e);
    return false;
  }
}

// 本地通知工具
export const notificationUtils = {
  /**
   * 检查通知权限
   * @returns {Promise<boolean>} 是否有权限
   */
  async checkNotificationPermission() {
    try {
      // 获取系统通知设置
      const setting = await uni.getSetting();
      // 检查是否授权通知
      const authorized = setting.authSetting['scope.notification'];
      return authorized === true;
    } catch (e) {
      console.log('检查通知权限失败:', e);
      return false;
    }
  },

  /**
   * 请求通知权限
   * @returns {Promise<boolean>} 是否获得权限
   */
  async requestNotificationPermission() {
    try {
      const res = await uni.requestSubscribeMessage({
        tmplIds: [''] // 空模板ID，仅用于请求权限
      });
      return true;
    } catch (e) {
      console.log('请求通知权限失败:', e);
      return false;
    }
  },

  /**
   * 发送本地通知
   * @param {Object} options - 通知选项
   * @param {string} options.title - 通知标题
   * @param {string} options.content - 通知内容
   * @param {number} [options.delay=0] - 延迟发送时间（毫秒）
   * @param {Object} [options.extra] - 额外数据
   */
  async sendNotification(options) {
    try {
      // 检查权限
      const hasPermission = await this.checkNotificationPermission();
      if (!hasPermission) {
        console.log('通知权限未授权，跳过发送通知');
        return;
      }

      const { title, content, delay = 0, extra = {} } = options;

      // 使用uni-app的本地推送API
      uni.createPushMessage({
        title,
        content,
        delay,
        extra,
        success() {
          console.log('通知发送成功');
        },
        fail(err) {
          // 权限被拒绝时不显示错误
          if (err.errMsg && err.errMsg.includes('denied')) {
            console.log('通知权限被拒绝');
          } else {
            console.error('通知发送失败:', err);
          }
        }
      });
    } catch (e) {
      console.error('发送通知时出错:', e);
    }
  },
  
  /**
   * 发送训练开始通知
   * @param {Object} workout - 训练数据
   */
  async sendWorkoutStartNotification(workout) {
    await this.sendNotification({
      title: '训练开始',
      content: `开始训练，共${workout.exercises.length}个动作`,
      extra: { type: 'workout_start' }
    });
  },

  /**
   * 发送完成一组动作通知
   * @param {Object} exercise - 当前动作
   * @param {number} completedSets - 已完成组数
   */
  async sendSetCompletedNotification(exercise, completedSets) {
    await this.sendNotification({
      title: '完成一组',
      content: `已完成${exercise.name}第${completedSets}组，共${exercise.sets}组`,
      extra: { type: 'set_completed', exerciseId: exercise.id, completedSets }
    });
  },

  /**
   * 发送组间歇结束通知
   */
  async sendRestTimerEndNotification() {
    await this.sendNotification({
      title: '休息结束',
      content: '准备下一组训练！',
      extra: { type: 'rest_timer_end' }
    });
  },
  
  /**
   * 发送训练完成通知
   * @param {number} duration - 训练时长（分钟）
   */
  async sendWorkoutCompletedNotification(duration) {
    await this.sendNotification({
      title: '训练完成',
      content: `恭喜完成训练，共${duration}分钟`,
      extra: { type: 'workout_completed', duration }
    });
  }
};
