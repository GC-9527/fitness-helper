const TIMER_KEY = 'fitness_timer';

const timerStore = {
  state: {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    timerInterval: null
  },

  init() {
    this.loadTimerState();
    if (this.state.isRunning) {
      this.resumeTimer();
    }
  },

  loadTimerState() {
    try {
      const saved = uni.getStorageSync(TIMER_KEY);
      if (saved) {
        this.state.isRunning = saved.isRunning || false;
        this.state.startTime = saved.startTime || 0;
        this.state.elapsedTime = saved.elapsedTime || 0;
      }
    } catch (e) {
      console.error('加载计时器状态失败:', e);
    }
  },

  saveTimerState() {
    try {
      uni.setStorageSync(TIMER_KEY, {
        isRunning: this.state.isRunning,
        startTime: this.state.startTime,
        elapsedTime: this.state.elapsedTime
      });
    } catch (e) {
      console.error('保存计时器状态失败:', e);
    }
  },

  startTimer() {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    // 如果已经有累计时间，基于当前时间和累计时间计算新的开始时间
    // 否则，使用当前时间作为开始时间
    if (this.state.elapsedTime > 0) {
      // 继续之前的计时，startTime = 当前时间 - 已用时间
      this.state.startTime = Date.now() - (this.state.elapsedTime * 1000);
    } else {
      // 全新开始计时
      this.state.startTime = Date.now();
    }
    this.saveTimerState();
    this.resumeTimer();
  },

  resumeTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    this.state.timerInterval = setInterval(() => {
      if (this.state.isRunning) {
        const now = Date.now();
        this.state.elapsedTime = Math.floor((now - this.state.startTime) / 1000);
        this.saveTimerState();
      }
    }, 1000);
  },

  stopTimer() {
    this.state.isRunning = false;
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
    this.saveTimerState();
    return this.state.elapsedTime;
  },

  resetTimer() {
    this.stopTimer();
    this.state.elapsedTime = 0;
    this.state.startTime = 0;
    this.saveTimerState();
  },

  getElapsedTime() {
    return this.state.elapsedTime;
  },

  isTimerRunning() {
    return this.state.isRunning;
  },

  setElapsedTime(seconds) {
    this.state.elapsedTime = seconds;
    this.saveTimerState();
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }
};

export default timerStore;
